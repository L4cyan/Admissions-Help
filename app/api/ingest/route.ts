import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import {
  addDocument,
  documentMeta,
  kbStats,
  newDocumentId,
} from "@/lib/storage";
import {
  MAX_FILE_BYTES,
  ParseError,
  extractTextFromFile,
  normalizePastedText,
} from "@/lib/parse";
import { chunkText } from "@/lib/text";
import type { Category, DocumentStatus, KBDocument } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

function validCategory(value: unknown): value is Category {
  return value === "admissions" || value === "scholarships" || value === "general";
}

function validStatus(value: unknown): value is DocumentStatus {
  return value === "draft" || value === "published";
}

function cleanSource(value: unknown): string | undefined | null {
  if (value === undefined || value === null || value === "") return undefined;
  try {
    const url = new URL(String(value));
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.toString();
  } catch {
    return null;
  }
}

function fallbackTitle(name: string): string {
  return (
    name
      .replace(/\.[a-z0-9]+$/i, "")
      .replace(/[_-]+/g, " ")
      .replace(/\s+/g, " ")
      .trim() || "Untitled note"
  );
}

async function saveDocument(input: {
  title: string;
  category: Category;
  sourceUrl?: string;
  text: string;
  status: DocumentStatus;
  sourceType: KBDocument["sourceType"];
}) {
  const text = normalizePastedText(input.text);
  const now = new Date().toISOString();
  const doc: KBDocument = {
    id: newDocumentId(),
    title: input.title.trim().slice(0, 140) || "Untitled note",
    category: input.category,
    sourceUrl: input.sourceUrl,
    sourceType: input.sourceType,
    status: input.status,
    addedAt: now,
    updatedAt: now,
    text,
  };
  const kb = await addDocument(doc);
  return {
    document: documentMeta(doc, true),
    chunks: chunkText(text).length,
    stats: kbStats(kb),
  };
}

export async function POST(request: Request) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "Admin passcode required." }, { status: 401 });
  }

  try {
    const contentType = request.headers.get("content-type") ?? "";

    // The review step posts the edited text back as JSON.
    if (contentType.includes("application/json")) {
      const body = (await request.json()) as {
        title?: string;
        category?: string;
        sourceUrl?: string | null;
        text?: string;
        status?: string;
        sourceType?: string;
      };

      if (!validCategory(body.category)) {
        return NextResponse.json(
          { error: "Choose admissions, scholarships, or general." },
          { status: 400 },
        );
      }
      const status: DocumentStatus = validStatus(body.status)
        ? body.status
        : "draft";
      const source = cleanSource(body.sourceUrl);
      if (source === null) {
        return NextResponse.json(
          { error: "The source URL must start with http:// or https://." },
          { status: 400 },
        );
      }
      const sourceType: KBDocument["sourceType"] =
        body.sourceType === "official-web" ||
        body.sourceType === "official-pdf" ||
        body.sourceType === "official-facebook" ||
        body.sourceType === "upload"
          ? body.sourceType
          : "note";

      const saved = await saveDocument({
        title: String(body.title ?? "").trim() || "Untitled note",
        category: body.category,
        sourceUrl: source,
        text: String(body.text ?? ""),
        status,
        sourceType,
      });
      return NextResponse.json({ ok: true, ...saved });
    }

    const form = await request.formData();
    const fileValue = form.get("file");
    const file =
      fileValue && typeof fileValue === "object" && "arrayBuffer" in fileValue
        ? (fileValue as File)
        : null;

    if (file && file.size > MAX_FILE_BYTES) {
      return NextResponse.json(
        { error: "That file is larger than 4 MB. Split it or paste the text." },
        { status: 413 },
      );
    }

    const pasted = String(form.get("text") ?? "").trim();
    const preview = String(form.get("preview") ?? "") === "1";

    // Preview: extract and hand the text back for editing. Nothing is saved.
    if (preview) {
      if (pasted) {
        const text = normalizePastedText(pasted);
        return NextResponse.json({
          preview: true,
          text,
          title: String(form.get("title") ?? "").trim() || "Untitled note",
          kind: "note",
          chars: text.length,
        });
      }
      if (!file) {
        return NextResponse.json(
          { error: "Attach a file or paste some text." },
          { status: 400 },
        );
      }
      if (file.type.startsWith("image/")) {
        return NextResponse.json(
          {
            error:
              "Images are read in your browser. Open the image, let OCR run, then review the text.",
            code: "IMAGE_OCR_REQUIRED",
          },
          { status: 415 },
        );
      }
      const result = await extractTextFromFile(file);
      return NextResponse.json({
        preview: true,
        text: result.text,
        title: String(form.get("title") ?? "").trim() || fallbackTitle(file.name),
        kind: result.kind,
        pages: result.pages,
        chars: result.text.length,
      });
    }

    const category = String(form.get("category") ?? "general");
    if (!validCategory(category)) {
      return NextResponse.json(
        { error: "Choose admissions, scholarships, or general." },
        { status: 400 },
      );
    }
    const statusValue = String(form.get("status") ?? "draft");
    const status: DocumentStatus = validStatus(statusValue)
      ? statusValue
      : "draft";
    const source = cleanSource(form.get("sourceUrl"));
    if (source === null) {
      return NextResponse.json(
        { error: "The source URL must start with http:// or https://." },
        { status: 400 },
      );
    }

    let text = "";
    if (pasted) {
      text = pasted;
    } else if (file) {
      if (file.type.startsWith("image/")) {
        return NextResponse.json(
          {
            error:
              "Images need OCR in the browser. Use the OCR preview, then submit the extracted text.",
            code: "IMAGE_OCR_REQUIRED",
          },
          { status: 415 },
        );
      }
      const result = await extractTextFromFile(file);
      text = result.text;
    } else {
      return NextResponse.json(
        { error: "Attach a file or paste some text." },
        { status: 400 },
      );
    }

    const saved = await saveDocument({
      title: String(form.get("title") ?? "").trim() || (file ? fallbackTitle(file.name) : "Untitled note"),
      category,
      sourceUrl: source,
      text,
      status,
      sourceType: file ? "upload" : "note",
    });
    return NextResponse.json({ ok: true, ...saved });
  } catch (error) {
    if (error instanceof ParseError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: 400 },
      );
    }
    const message = error instanceof Error ? error.message : "Ingestion failed.";
    const status = message.includes("already in the knowledge base") ? 409 : 500;
    console.error("[api/ingest]", error);
    return NextResponse.json({ error: message }, { status });
  }
}
