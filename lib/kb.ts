import type { Chunk, ChatTurn, KnowledgeBase, Source, Track } from "./types";
import { chunkText, tokenize, truncate } from "./text";

let chunkCache: { key: string; chunks: Chunk[] } | null = null;

export function buildChunks(kb: KnowledgeBase): Chunk[] {
  const key = `${kb.updatedAt}:${kb.documents.length}`;
  if (chunkCache?.key === key) return chunkCache.chunks;

  const chunks: Chunk[] = [];
  for (const doc of kb.documents) {
    const parts = chunkText(doc.text);
    parts.forEach((text, index) => {
      chunks.push({
        id: `${doc.id}__${index}`,
        docId: doc.id,
        title: doc.title,
        category: doc.category,
        sourceUrl: doc.sourceUrl,
        text,
        index,
      });
    });
  }
  chunkCache = { key, chunks };
  return chunks;
}

interface ScoredChunk {
  chunk: Chunk;
  score: number;
}

export function retrieve(
  kb: KnowledgeBase,
  query: string,
  track: Track,
  limit = 6,
): { chunks: Chunk[]; sources: Source[] } {
  const chunks = buildChunks(kb);
  if (!chunks.length || !query.trim()) return { chunks: [], sources: [] };

  const queryTokens = Array.from(new Set(tokenize(query)));
  if (!queryTokens.length) return { chunks: [], sources: [] };

  const tokenized = chunks.map((chunk) => tokenize(chunk.text));
  const docFreq = new Map<string, number>();
  for (const tokens of tokenized) {
    for (const token of new Set(tokens)) {
      docFreq.set(token, (docFreq.get(token) ?? 0) + 1);
    }
  }

  const total = chunks.length;
  const normalizedQuery = query.toLowerCase().replace(/\s+/g, " ").trim();
  const scored: ScoredChunk[] = chunks.map((chunk, index) => {
    const tokens = tokenized[index];
    const counts = new Map<string, number>();
    for (const token of tokens) counts.set(token, (counts.get(token) ?? 0) + 1);

    let score = 0;
    for (const term of queryTokens) {
      const count = counts.get(term) ?? 0;
      if (!count) continue;
      const df = docFreq.get(term) ?? 0;
      const idf = Math.log((total + 1) / (df + 1)) + 1;
      score += (1 + Math.log(count)) * idf;
    }

    const title = chunk.title.toLowerCase();
    for (const term of queryTokens) {
      if (title.includes(term)) score += 2.2;
    }
    if (normalizedQuery.length > 8 && chunk.text.toLowerCase().includes(normalizedQuery)) {
      score += 4;
    }
    if (chunk.category === track) score += 1.1;
    else if (chunk.category === "general") score += 0.25;
    else score -= 2.5;

    return { chunk, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const best = scored[0]?.score ?? 0;
  if (best < 1.6) return { chunks: [], sources: [] };

  const picked: ScoredChunk[] = [];
  const perDoc = new Map<string, number>();
  for (const item of scored) {
    if (item.score < Math.max(1.2, best * 0.16)) break;
    const seen = perDoc.get(item.chunk.docId) ?? 0;
    if (seen >= 2) continue;
    perDoc.set(item.chunk.docId, seen + 1);
    picked.push(item);
    if (picked.length >= limit) break;
  }

  const sources: Source[] = [];
  const seenDocs = new Set<string>();
  for (const item of picked) {
    if (seenDocs.has(item.chunk.docId)) continue;
    seenDocs.add(item.chunk.docId);
    sources.push({
      id: item.chunk.id,
      title: item.chunk.title,
      url: item.chunk.sourceUrl,
      snippet: truncate(item.chunk.text.replace(/\s+/g, " "), 280),
    });
    if (sources.length >= 4) break;
  }

  return { chunks: picked.map((item) => item.chunk), sources };
}

export function buildContext(chunks: Chunk[]): string {
  const docs = new Map<string, { title: string; url?: string; parts: string[] }>();
  for (const chunk of chunks) {
    const existing = docs.get(chunk.docId);
    if (existing) {
      existing.parts.push(chunk.text.replace(/\s+/g, " "));
    } else {
      docs.set(chunk.docId, {
        title: chunk.title,
        url: chunk.sourceUrl,
        parts: [chunk.text.replace(/\s+/g, " ")],
      });
    }
  }

  return Array.from(docs.values())
    .map((doc, index) => {
      const source = doc.url ? ` (${doc.url})` : "";
      return `[${index + 1}] ${doc.title}${source}\n${truncate(
        doc.parts.join(" "),
        1900,
      )}`;
    })
    .join("\n\n");
}

const SMALL_TALK =
  /^(hi|hello|hey|good (morning|afternoon|evening)|kumusta|kamusta|salamat|thank you|thanks|ok|okay|sure|yes|no|bye|goodbye|who are you|what can you do|help)\b/i;

export function isSmallTalk(input: string): boolean {
  const text = input.trim();
  return text.length < 36 && SMALL_TALK.test(text);
}

export function smallTalkReply(track: Track): string {
  if (track === "admissions") {
    return "Hi! I'm the Admissions chibi guide. Ask me about the CET, test permits, enrollment requirements, or where to find the Admissions & Aid Office. What are you working on?";
  }
  return "Hello! I'm the Scholarships chibi guide. Ask me about the application form, requirements, grants, or where to submit your papers. What do you need help with?";
}

export function noContextReply(track: Track): string {
  const office =
    "You can confirm with the College Admissions & Aid Office: 9910871 local 2211 or 2212, +639277705888 / +639082613133, or admissions@adzu.edu.ph.";
  if (track === "admissions") {
    return `I don't have that in the official admissions notes I was given, and I don't want to guess about requirements or deadlines. ${office} You can also try asking about the CET, test permit, freshman or transferee requirements, or the office location.`;
  }
  return `I don't have that in the official scholarship notes I was given, and I don't want to guess about eligibility, amounts, or deadlines. ${office} For scholarship papers, email admissionsandaid@adzu.edu.ph. You can also ask about the application form, requirements, grant types, or summer coverage.`;
}

export function extractiveAnswer(chunks: Chunk[], query: string): string {
  if (!chunks.length) return "";

  const queryTokens = new Set(tokenize(query));
  const points: string[] = [];
  const docOrder: string[] = [];
  for (const chunk of chunks) {
    if (!docOrder.includes(chunk.docId)) docOrder.push(chunk.docId);
  }

  const seen = new Set<string>();
  for (const chunk of chunks.slice(0, 3)) {
    const sentences = chunk.text
      .replace(/\s+/g, " ")
      .split(/(?<=[.!?])\s+/)
      .map((sentence) => sentence.trim())
      .filter(
        (sentence) =>
          sentence.length > 30 &&
          !sentence.endsWith("?") &&
          !/^(how|what|when|where|who|why|can i|do i|is it|are there)\b/i.test(sentence),
      );

    const ranked = sentences
      .map((sentence) => {
        const tokens = tokenize(sentence);
        const hits = tokens.filter((token) => queryTokens.has(token)).length;
        const practical = /(php|₱|\d|must|should|bring|submit|visit|pay|email|call|requirement|office|form|fee|deadline)/i.test(
          sentence,
        )
          ? 1.2
          : 0;
        return { sentence, score: hits * 2 + practical };
      })
      .sort((a, b) => b.score - a.score);

    const perChunk = points.length === 0 ? 2 : 1;
    const best = ranked.filter((item) => item.score >= 2).slice(0, perChunk);
    const chosen = best.length ? best : ranked.slice(0, 1);
    for (const item of chosen) {
      const normalized = item.sentence.toLowerCase();
      if (seen.has(normalized)) continue;
      seen.add(normalized);
      const citation = `[${docOrder.indexOf(chunk.docId) + 1}]`;
      points.push(`- ${truncate(item.sentence, 260)} ${citation}`);
    }
    if (points.length >= 3) break;
  }

  if (!points.length) return "";
  return `Here's what our official AdZU notes say:\n\n${points.join(
    "\n",
  )}\n\nThese are quoted from the notes I was given. For a decision on your specific case, please confirm with the Admissions & Aid Office.`;
}

export function normalizeHistory(history: ChatTurn[]): ChatTurn[] {
  return history
    .filter(
      (turn) =>
        turn &&
        (turn.role === "user" || turn.role === "assistant") &&
        typeof turn.content === "string",
    )
    .slice(-10)
    .map((turn) => ({ role: turn.role, content: turn.content.slice(0, 1200) }));
}
