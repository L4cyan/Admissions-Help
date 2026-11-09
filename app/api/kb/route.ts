import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import {
  documentMeta,
  getKB,
  getStorageMode,
  kbStats,
  removeDocument,
} from "@/lib/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const kb = await getKB();
  const admin = isAdmin(request);
  const url = new URL(request.url);
  const full = admin && url.searchParams.get("full") === "1";

  return NextResponse.json({
    admin,
    storage: getStorageMode(),
    stats: kbStats(kb),
    documents: kb.documents.map((doc) => documentMeta(doc, full)),
  });
}

export async function DELETE(request: Request) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "Admin passcode required." }, { status: 401 });
  }

  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Document id required." }, { status: 400 });
  }

  const before = await getKB();
  if (!before.documents.some((doc) => doc.id === id)) {
    return NextResponse.json({ error: "Document not found." }, { status: 404 });
  }

  const kb = await removeDocument(id);
  return NextResponse.json({
    ok: true,
    stats: kbStats(kb),
    documents: kb.documents.map((doc) => documentMeta(doc, true)),
  });
}
