import { cleanText, stripHtml } from "./text";

export const MAX_FILE_BYTES = 4 * 1024 * 1024;
export const MAX_TEXT_CHARS = 300_000;

export class ParseError extends Error {
  code: string;
  constructor(message: string, code = "PARSE_ERROR") {
    super(message);
    this.code = code;
  }
}

function extension(name: string): string {
  const match = name.toLowerCase().match(/\.([a-z0-9]+)$/);
  return match?.[1] ?? "";
}

function jsonToText(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) return value.map(jsonToText).filter(Boolean).join("\n");
  if (typeof value === "object") {
    return Object.entries(value as Record<string, unknown>)
      .map(([key, child]) => {
        const text = jsonToText(child);
        return text ? `${key}: ${text}` : "";
      })
      .filter(Boolean)
      .join("\n");
  }
  return "";
}

export async function extractTextFromFile(file: File): Promise<{
  text: string;
  kind: string;
}> {
  if (file.size > MAX_FILE_BYTES) {
    throw new ParseError(
      "That file is larger than 4 MB. Split it or paste the relevant text instead.",
      "TOO_LARGE",
    );
  }

  const name = file.name || "upload";
  const ext = extension(name);
  const type = file.type || "";
  const buffer = await file.arrayBuffer();

  if (type === "application/pdf" || ext === "pdf") {
    const { extractText, getDocumentProxy } = await import("unpdf");
    const pdf = await getDocumentProxy(new Uint8Array(buffer));
    const result = await extractText(pdf, { mergePages: true });
    const text = Array.isArray(result.text)
      ? result.text.join("\n\n")
      : result.text;
    const cleaned = cleanText(text ?? "");
    if (cleaned.length < 30) {
      throw new ParseError(
        "The PDF has very little selectable text. It may be scanned. Upload page images and use the OCR preview, or paste the text.",
        "SCANNED_PDF",
      );
    }
    return { text: cleaned.slice(0, MAX_TEXT_CHARS), kind: "pdf" };
  }

  if (
    type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    ext === "docx"
  ) {
    const mammoth = await import("mammoth");
    const result = await mammoth.extractRawText({
      buffer: Buffer.from(buffer),
    });
    const cleaned = cleanText(result.value ?? "");
    if (!cleaned) {
      throw new ParseError("No readable text was found in that DOCX.", "EMPTY");
    }
    return { text: cleaned.slice(0, MAX_TEXT_CHARS), kind: "docx" };
  }

  if (type.startsWith("image/")) {
    throw new ParseError(
      "Images need OCR. The admin page can read the image in your browser and send the text.",
      "IMAGE_OCR_REQUIRED",
    );
  }

  const textTypes = [
    "text/plain",
    "text/markdown",
    "text/csv",
    "text/html",
    "application/json",
    "application/xml",
    "text/xml",
  ];
  const textExts = ["txt", "md", "markdown", "csv", "json", "html", "htm", "xml"];

  if (textTypes.includes(type) || textExts.includes(ext)) {
    const raw = new TextDecoder("utf-8", { fatal: false }).decode(buffer);
    let text = raw;
    if (ext === "html" || ext === "htm" || type === "text/html") {
      text = stripHtml(raw);
    } else if (ext === "json" || type === "application/json") {
      try {
        text = jsonToText(JSON.parse(raw));
      } catch {
        text = raw;
      }
    }
    const cleaned = cleanText(text);
    if (!cleaned) {
      throw new ParseError("That file appears to be empty.", "EMPTY");
    }
    return { text: cleaned.slice(0, MAX_TEXT_CHARS), kind: ext || "text" };
  }

  throw new ParseError(
    "Unsupported file type. Use PDF, DOCX, TXT, MD, CSV, JSON, HTML, or an image with OCR.",
    "UNSUPPORTED",
  );
}

export function normalizePastedText(input: string): string {
  const cleaned = cleanText(input);
  if (cleaned.length < 30) {
    throw new ParseError(
      "The text is too short to be useful. Add at least a paragraph.",
      "TOO_SHORT",
    );
  }
  if (cleaned.length > MAX_TEXT_CHARS) {
    throw new ParseError(
      "The text is too long. Keep it under 300,000 characters.",
      "TOO_LONG",
    );
  }
  return cleaned;
}
