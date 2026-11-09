export type Track = "admissions" | "scholarships";
export type Category = Track | "general";

/** The five people behind the desk. These IDs are also the chibi variants. */
export type StaffId = "director" | "rose" | "cris" | "sherry" | "marilou";
export type ChibiVariant = StaffId;

export type DocumentStatus = "draft" | "published";

export interface KBDocument {
  id: string;
  title: string;
  category: Category;
  sourceUrl?: string;
  sourceType?: "official-web" | "official-pdf" | "official-facebook" | "upload" | "note";
  status?: DocumentStatus;
  addedAt: string;
  updatedAt?: string;
  text: string;
}

export interface KnowledgeBase {
  version: number;
  updatedAt: string;
  documents: KBDocument[];
}

export interface Chunk {
  id: string;
  docId: string;
  title: string;
  category: Category;
  sourceUrl?: string;
  text: string;
  index: number;
}

export interface Source {
  id: string;
  title: string;
  url?: string;
  snippet: string;
}

export interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

export interface ChatResult {
  reply: string;
  sources: Source[];
  provider: string;
  track: Track;
  staff: StaffId;
  handoff: boolean;
  usedContext: boolean;
}

export interface Gap {
  id: string;
  question: string;
  track: Track;
  staff: StaffId;
  count: number;
  firstSeen: string;
  lastSeen: string;
  resolved?: boolean;
}
