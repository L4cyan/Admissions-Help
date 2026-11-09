const STOPWORDS = new Set(
  "a an the and or but if then than that this these those is are was were be been being am do does did doing have has had having i you he she it we they me my your his her its our their mine yours hers ours theirs what which who whom whose when where why how all any both each few more most other some such no nor not only own same so too very can will just don should now of in on at by for with about into through during before after above below to from up down out off over under again further once here there when why how".split(
    " ",
  ),
);

export function cleanText(input: string): string {
  return input
    .replace(/\u0000/g, "")
    .replace(/\r\n?/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

export function stripHtml(input: string): string {
  return cleanText(
    input
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
      .replace(/<\/(p|div|li|tr|h[1-6]|br)>/gi, "\n")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;|&apos;/g, "'")
      .replace(/&#(\d+);/g, (_m, code) => String.fromCharCode(Number(code))),
  );
}

export function truncate(input: string, max: number): string {
  if (input.length <= max) return input;
  return `${input.slice(0, max - 1).trimEnd()}…`;
}

export function tokenize(input: string): string[] {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9ñáéíóúü+%.\s-]/g, " ")
    .split(/\s+/)
    .map((word) => word.replace(/^[.-]+|[.-]+$/g, ""))
    .filter((word) => word.length > 1 && !STOPWORDS.has(word))
    .map(stem);
}

function stem(word: string): string {
  if (word.length <= 4) return word;
  if (word.endsWith("ies")) return `${word.slice(0, -3)}y`;
  if (word.endsWith("ing") && word.length > 6) return word.slice(0, -3);
  if (word.endsWith("ed") && word.length > 5) return word.slice(0, -2);
  if (word.endsWith("es") && word.length > 5) return word.slice(0, -2);
  if (word.endsWith("s") && !word.endsWith("ss")) return word.slice(0, -1);
  return word;
}

export function splitSentences(input: string): string[] {
  return input
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+(?=[A-Z0-9“"'(])/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 20);
}

export function chunkText(text: string, maxChars = 1100, overlap = 120): string[] {
  const paragraphs = cleanText(text)
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  const chunks: string[] = [];
  let current = "";

  const push = () => {
    const trimmed = current.trim();
    if (trimmed) chunks.push(trimmed);
    current = overlap > 0 && trimmed.length > overlap ? trimmed.slice(-overlap) : "";
  };

  for (const paragraph of paragraphs) {
    if (paragraph.length > maxChars) {
      if (current.trim()) push();
      const sentences = splitSentences(paragraph);
      for (const sentence of sentences.length ? sentences : [paragraph]) {
        if ((current + " " + sentence).trim().length > maxChars) push();
        current = `${current} ${sentence}`.trim();
      }
      continue;
    }
    if ((current + "\n\n" + paragraph).trim().length > maxChars) push();
    current = `${current}\n\n${paragraph}`.trim();
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks.filter((chunk) => chunk.length > 40);
}

export function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
