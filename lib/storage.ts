import { SEED_KB } from "@/data/seed";
import { aiMode } from "./providers";
import type {
  DocumentStatus,
  KBDocument,
  KnowledgeBase,
} from "./types";

const BLOB_PREFIX = "adzu-ask";
const BLOB_PATH = `${BLOB_PREFIX}/kb.json`;
const LOCAL_FILE = "data/kb.json";

let cache: { kb: KnowledgeBase; at: number } | null = null;

function cloneSeed(): KnowledgeBase {
  return JSON.parse(JSON.stringify(SEED_KB)) as KnowledgeBase;
}

function isValidKB(value: unknown): value is KnowledgeBase {
  if (!value || typeof value !== "object") return false;
  const kb = value as KnowledgeBase;
  return (
    Array.isArray(kb.documents) &&
    kb.documents.every(
      (doc) =>
        doc &&
        typeof doc.id === "string" &&
        typeof doc.title === "string" &&
        typeof doc.text === "string" &&
        ["admissions", "scholarships", "general"].includes(doc.category),
    )
  );
}

async function readLocal(): Promise<KnowledgeBase | null> {
  try {
    const fs = await import("node:fs/promises");
    const path = await import("node:path");
    const raw = await fs.readFile(path.join(process.cwd(), LOCAL_FILE), "utf8");
    const parsed = JSON.parse(raw);
    return isValidKB(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

async function readBlob(): Promise<KnowledgeBase | null> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return null;
  try {
    const { list } = await import("@vercel/blob");
    const { blobs } = await list({ prefix: BLOB_PREFIX, limit: 20 });
    const found = blobs.find((blob) => blob.pathname === BLOB_PATH);
    if (!found) return null;
    // Public Blob URLs are CDN-cached. A cache-busting query string makes
    // admin writes visible immediately instead of up to a minute later.
    const url = new URL(found.url);
    url.searchParams.set("ts", String(Date.now()));
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) return null;
    const parsed = await response.json();
    return isValidKB(parsed) ? parsed : null;
  } catch (error) {
    console.error("[storage] blob read failed", error);
    return null;
  }
}

export async function getKB(): Promise<KnowledgeBase> {
  if (cache && Date.now() - cache.at < 4000) return cache.kb;

  let kb: KnowledgeBase | null = null;
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    kb = await readBlob();
  } else {
    kb = await readLocal();
  }

  if (!kb) {
    kb = cloneSeed();
  }
  cache = { kb, at: Date.now() };
  return kb;
}

export function getStorageMode(): "blob" | "file" | "readonly" {
  if (process.env.BLOB_READ_WRITE_TOKEN) return "blob";
  if (process.env.VERCEL) return "readonly";
  return "file";
}

export async function saveKB(kb: KnowledgeBase): Promise<void> {
  const next: KnowledgeBase = {
    ...kb,
    updatedAt: new Date().toISOString(),
  };

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = await import("@vercel/blob");
    await put(BLOB_PATH, JSON.stringify(next, null, 2), {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
      cacheControlMaxAge: 60,
    });
  } else {
    if (process.env.VERCEL) {
      throw new Error(
        "This deployment is read-only. Connect a Vercel Blob store (BLOB_READ_WRITE_TOKEN) to save documents.",
      );
    }
    const fs = await import("node:fs/promises");
    const path = await import("node:path");
    const dir = path.join(process.cwd(), "data");
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(
      path.join(process.cwd(), LOCAL_FILE),
      JSON.stringify(next, null, 2),
      "utf8",
    );
  }

  cache = { kb: next, at: Date.now() };
}

export function newDocumentId(): string {
  const random =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);
  return `doc_${Date.now().toString(36)}_${random}`;
}

export function isPublished(doc: KBDocument): boolean {
  return doc.status !== "draft";
}

export async function addDocument(doc: KBDocument): Promise<KnowledgeBase> {
  const kb = await getKB();
  const duplicate = kb.documents.find(
    (existing) =>
      existing.text.trim() === doc.text.trim() &&
      existing.category === doc.category,
  );
  if (duplicate) {
    throw new Error(`This content is already in the knowledge base as “${duplicate.title}”.`);
  }
  const next: KnowledgeBase = {
    ...kb,
    documents: [...kb.documents, { ...doc, status: doc.status ?? "published" }],
  };
  await saveKB(next);
  return next;
}

export async function updateDocument(
  id: string,
  patch: Partial<
    Pick<KBDocument, "title" | "category" | "sourceUrl" | "text" | "status">
  >,
): Promise<KnowledgeBase> {
  const kb = await getKB();
  const existing = kb.documents.find((doc) => doc.id === id);
  if (!existing) throw new Error("Document not found.");

  const next: KnowledgeBase = {
    ...kb,
    documents: kb.documents.map((doc) =>
      doc.id === id
        ? {
            ...doc,
            ...patch,
            updatedAt: new Date().toISOString(),
          }
        : doc,
    ),
  };
  await saveKB(next);
  return next;
}

export async function removeDocument(id: string): Promise<KnowledgeBase> {
  const kb = await getKB();
  const next: KnowledgeBase = {
    ...kb,
    documents: kb.documents.filter((doc) => doc.id !== id),
  };
  await saveKB(next);
  return next;
}

export function documentMeta(doc: KBDocument, full = false) {
  return {
    id: doc.id,
    title: doc.title,
    category: doc.category,
    sourceUrl: doc.sourceUrl,
    sourceType: doc.sourceType,
    status: (doc.status ?? "published") as DocumentStatus,
    addedAt: doc.addedAt,
    updatedAt: doc.updatedAt,
    chars: doc.text.length,
    ...(full ? { text: doc.text } : {}),
  };
}

export function kbStats(kb: KnowledgeBase) {
  const byCategory = { admissions: 0, scholarships: 0, general: 0 };
  let published = 0;
  let drafts = 0;
  for (const doc of kb.documents) {
    byCategory[doc.category] += 1;
    if (isPublished(doc)) published += 1;
    else drafts += 1;
  }
  const mode = aiMode();
  return {
    documents: kb.documents.length,
    published,
    drafts,
    characters: kb.documents.reduce((sum, doc) => sum + doc.text.length, 0),
    byCategory,
    updatedAt: kb.updatedAt,
    storage: getStorageMode(),
    aiMode: mode,
    aiLabel:
      mode === "configured"
        ? "AI connected"
        : mode === "free"
          ? "Free AI (no key)"
          : "Notes only",
  };
}
