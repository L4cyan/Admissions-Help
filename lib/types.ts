export type Track = "admissions" | "scholarships";
export type Category = Track | "general";

export type ChibiVariant =
  | "director"
  | "admissions-1"
  | "admissions-2"
  | "scholarships-1"
  | "scholarships-2";

export interface KBDocument {
  id: string;
  title: string;
  category: Category;
  sourceUrl?: string;
  sourceType?: "official-web" | "official-pdf" | "official-facebook" | "upload" | "note";
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
  usedContext: boolean;
}
