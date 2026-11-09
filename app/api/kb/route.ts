import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import {
  documentMeta,
  getKB,
  getStorageMode,
  isPublished,
  kbStats,
  removeDocument,
  updateDocument,
} from "@/lib/storage";
import { gapStats } from "@/lib/gaps";
import type { Category, DocumentStatus } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ADMIN_CACHE = { "cache-control": "private, no-store, max-age=0" };

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

export async function GET(request: Request) {
  const url = new URL(request.url);
  const admin = isAdmin(request);
  const wantsFull = url.searchParams.get("full") === "1";

  if (wantsFull && !admin) {
    return NextResponse.json(
      { error: "Admin passcode required." },
      { status: 401, headers: ADMIN_CACHE },
    );
  }

  const kb = await getKB({ fresh: true });
  const full = wantsFull;
  const gaps = admin ? await gapStats() : undefined;

  const docs = admin
    ? kb.documents
    : kb.documents.filter((doc) => isPublished(doc));

  return NextResponse.json(
    {
      admin,
      storage: getStorageMode(),
      stats: kbStats(kb),
      gaps,
      documents: docs.map((doc) => documentMeta(doc, full)),
    },
    { headers: admin ? ADMIN_CACHE : { "cache-control": "no-store" } },
  );
}

export async function PATCH(request: Request) {
  if (!isAdmin(request)) {
    return NextResponse.json(
      { error: "Admin passcode required." },
      { status: 401, headers: ADMIN_CACHE },
    );
  }

  try {
    const body = (await request.json()) as {
      id?: string;
      title?: string;
      category?: string;
      sourceUrl?: string | null;
      text?: string;
      status?: string;
    };

    if (!body.id) {
      return NextResponse.json({ error: "Document id required." }, { status: 400 });
    }

    const patch: {
      title?: string;
      category?: Category;
      sourceUrl?: string;
      text?: string;
      status?: DocumentStatus;
    } = {};

    if (body.title !== undefined) {
      const title = body.title.trim().slice(0, 140);
      if (!title) {
        return NextResponse.json({ error: "Title cannot be empty." }, { status: 400 });
      }
      patch.title = title;
    }

    if (body.category !== undefined) {
      if (!validCategory(body.category)) {
        return NextResponse.json({ error: "Invalid desk." }, { status: 400 });
      }
      patch.category = body.category;
    }

    if (body.sourceUrl !== undefined) {
      const source = cleanSource(body.sourceUrl);
      if (source === null) {
        return NextResponse.json(
          { error: "The source URL must start with http:// or https://." },
          { status: 400 },
        );
      }
      patch.sourceUrl = source;
    }

    if (body.text !== undefined) {
      const text = body.text.trim();
      if (text.length < 30) {
        return NextResponse.json(
          { error: "The note is too short. Add at least a paragraph." },
          { status: 400 },
        );
      }
      patch.text = text.slice(0, 300_000);
    }

    if (body.status !== undefined) {
      if (!validStatus(body.status)) {
        return NextResponse.json({ error: "Invalid status." }, { status: 400 });
      }
      patch.status = body.status;
    }

    const kb = await updateDocument(body.id, patch);
    return NextResponse.json(
      {
        ok: true,
        stats: kbStats(kb),
        documents: kb.documents.map((doc) => documentMeta(doc, true)),
      },
      { headers: ADMIN_CACHE },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not save.";
    const status = message.includes("not found") ? 404 : 500;
    console.error("[api/kb PATCH]", error);
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(request: Request) {
  if (!isAdmin(request)) {
    return NextResponse.json(
      { error: "Admin passcode required." },
      { status: 401, headers: ADMIN_CACHE },
    );
  }

  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Document id required." }, { status: 400 });
  }

  const before = await getKB({ fresh: true });
  if (!before.documents.some((doc) => doc.id === id)) {
    return NextResponse.json({ error: "Document not found." }, { status: 404 });
  }

  const kb = await removeDocument(id);
  return NextResponse.json(
    {
      ok: true,
      stats: kbStats(kb),
      documents: kb.documents.map((doc) => documentMeta(doc, true)),
    },
    { headers: ADMIN_CACHE },
  );
}
