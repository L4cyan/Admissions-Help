import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import {
  addDocument,
  documentMeta,
  getKB,
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
import type { Category } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

function validCategory(value: string | null): value is Category {
  return value === "admissions" || value === "scholarships" || value === "general";
}

export async function POST(request: Request) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "Admin passcode required." }, { status: 401 });
  }

  try {
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
    const categoryValue = String(form.get("category") ?? "general");
    if (!validCategory(categoryValue)) {
      return NextResponse.json(
        { error: "Choose admissions, scholarships, or general." },
        { status: 400 },
      );
    }

    let text = "";
    let kind = "note";

    if (pasted) {
      text = normalizePastedText(pasted);
      kind = file ? "ocr" : "note";
    } else if (file) {
      if (file.type.startsWith("image/")) {
        return NextResponse.json(
          {
            error:
              "Images need OCR in the browser. Use the admin OCR preview, then submit the extracted text.",
            code: "IMAGE_OCR_REQUIRED",
          },
          { status: 415 },
        );
      }
      const result = await extractTextFromFile(file);
      text = result.text;
      kind = result.kind;
    } else {
      return NextResponse.json(
        { error: "Attach a file or paste some text." },
        { status: 400 },
      );
    }

    const fallbackTitle =
      file?.name?.replace(/\.[a-z0-9]+$/i, "").replace(/[_-]+/g, " ") ??
      "Untitled note";
    const title = (String(form.get("title") ?? "").trim() || fallbackTitle).slice(
      0,
      140,
    );
    const rawSource = String(form.get("sourceUrl") ?? "").trim();
    let sourceUrl: string | undefined;
    if (rawSource) {
      try {
        const url = new URL(rawSource);
        if (url.protocol !== "http:" && url.protocol !== "https:") throw new Error();
        sourceUrl = url.toString();
      } catch {
        return NextResponse.json(
          { error: "The source URL must start with http:// or https://." },
          { status: 400 },
        );
      }
    }

    const now = new Date().toISOString();
    const doc = {
      id: newDocumentId(),
      title,
      category: categoryValue,
      sourceUrl,
      sourceType: file ? ("upload" as const) : ("note" as const),
      addedAt: now,
      updatedAt: now,
      text,
    };

    const kb = await addDocument(doc);
    return NextResponse.json({
      ok: true,
      document: documentMeta(doc, true),
      chunks: chunkText(text).length,
      kind,
      stats: kbStats(kb),
    });
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
