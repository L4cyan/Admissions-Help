import type { Gap, StaffId, Track } from "./types";

const LOCAL_FILE = "data/gaps.json";
const BLOB_PATH = "adzu-ask/gaps.json";
const MAX_GAPS = 250;

interface GapStore {
  version: 1;
  updatedAt: string;
  gaps: Gap[];
}

function valid(value: unknown): value is GapStore {
  if (!value || typeof value !== "object") return false;
  const store = value as GapStore;
  return (
    Array.isArray(store.gaps) &&
    store.gaps.every(
      (gap) =>
        gap &&
        typeof gap.id === "string" &&
        typeof gap.question === "string" &&
        (gap.track === "admissions" || gap.track === "scholarships") &&
        ["director", "rose", "cris", "sherry", "marilou"].includes(gap.staff),
    )
  );
}

function redact(input: string): string {
  return input
    .replace(/\b[\w.+-]+@[\w-]+\.[\w.-]+\b/g, "[email]")
    .replace(/\+?\d[\d\s().-]{7,}\d/g, "[number]")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 400);
}

async function readLocal(): Promise<GapStore | null> {
  try {
    const fs = await import("node:fs/promises");
    const path = await import("node:path");
    const raw = await fs.readFile(path.join(process.cwd(), LOCAL_FILE), "utf8");
    const parsed = JSON.parse(raw);
    return valid(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

async function readBlob(): Promise<GapStore | null> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return null;
  try {
    const { list } = await import("@vercel/blob");
    const { blobs } = await list({ prefix: "adzu-ask", limit: 20 });
    const found = blobs.find((blob) => blob.pathname === BLOB_PATH);
    if (!found) return null;
    const response = await fetch(found.url, { cache: "no-store" });
    if (!response.ok) return null;
    const parsed = await response.json();
    return valid(parsed) ? parsed : null;
  } catch (error) {
    console.error("[gaps] blob read failed", error);
    return null;
  }
}

async function read(): Promise<GapStore> {
  const store = process.env.BLOB_READ_WRITE_TOKEN
    ? await readBlob()
    : await readLocal();
  return store ?? { version: 1, updatedAt: new Date().toISOString(), gaps: [] };
}

async function write(store: GapStore): Promise<void> {
  const next: GapStore = { ...store, updatedAt: new Date().toISOString() };
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = await import("@vercel/blob");
    await put(BLOB_PATH, JSON.stringify(next, null, 2), {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
      cacheControlMaxAge: 30,
    });
    return;
  }
  if (process.env.VERCEL) {
    throw new Error("Gap logging needs a Vercel Blob store in production.");
  }
  const fs = await import("node:fs/promises");
  const path = await import("node:path");
  await fs.mkdir(path.join(process.cwd(), "data"), { recursive: true });
  await fs.writeFile(
    path.join(process.cwd(), LOCAL_FILE),
    JSON.stringify(next, null, 2),
    "utf8",
  );
}

export async function recordGap(input: {
  question: string;
  track: Track;
  staff: StaffId;
}): Promise<void> {
  const question = redact(input.question);
  if (question.length < 8) return;

  const store = await read();
  const key = question.toLowerCase().replace(/[^\w\s]/g, "").replace(/\s+/g, " ");
  const now = new Date().toISOString();
  const existing = store.gaps.find(
    (gap) => !gap.resolved && gap.question.toLowerCase().replace(/[^\w\s]/g, "").replace(/\s+/g, " ") === key,
  );

  if (existing) {
    existing.count += 1;
    existing.lastSeen = now;
    existing.staff = input.staff;
    existing.track = input.track;
  } else {
    store.gaps.push({
      id: `gap_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
      question,
      track: input.track,
      staff: input.staff,
      count: 1,
      firstSeen: now,
      lastSeen: now,
    });
  }

  store.gaps = store.gaps
    .sort((a, b) => b.lastSeen.localeCompare(a.lastSeen))
    .slice(0, MAX_GAPS);
  await write(store);
}

export async function listGaps(): Promise<Gap[]> {
  const store = await read();
  return store.gaps.sort((a, b) => {
    if (a.resolved !== b.resolved) return a.resolved ? 1 : -1;
    if (b.count !== a.count) return b.count - a.count;
    return b.lastSeen.localeCompare(a.lastSeen);
  });
}

export async function gapStats(): Promise<{ open: number; total: number }> {
  const gaps = await listGaps();
  return {
    open: gaps.filter((gap) => !gap.resolved).length,
    total: gaps.length,
  };
}

export async function removeGap(id: string): Promise<void> {
  const store = await read();
  store.gaps = store.gaps.filter((gap) => gap.id !== id);
  await write(store);
}

export async function resolveGap(id: string, resolved = true): Promise<void> {
  const store = await read();
  const gap = store.gaps.find((item) => item.id === id);
  if (gap) {
    gap.resolved = resolved;
    gap.lastSeen = new Date().toISOString();
    await write(store);
  }
}
