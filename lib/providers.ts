import type { ChatResult, ChatTurn, Chunk, Source, Track } from "./types";
import { TRACKS } from "./tracks";
import {
  buildContext,
  extractiveAnswer,
  isSmallTalk,
  noContextReply,
  normalizeHistory,
  smallTalkReply,
} from "./kb";

const OFFICE =
  "College Admissions & Aid Office — 9910871 local 2211/2212, +639277705888 / +639082613133, admissions@adzu.edu.ph. Scholarship papers: admissionsandaid@adzu.edu.ph.";

function systemPrompt(track: Track): string {
  const config = TRACKS[track];
  return `You are the AdZU ${config.label} chibi guide: a warm, cartoon assistant for Ateneo de Zamboanga University's College Admissions & Aid Office.

Today is 9 November 2026. You are talking to a prospective student, parent, or scholar.

VOICE
- Warm, encouraging, and direct. A light Filipino touch ("Salamat", "Hala", "po") is fine, but do not overdo it.
- You are a chibi guide, not a real staff member. Never claim to be a person or to speak officially for AdZU.
- Keep answers short: 2-4 short paragraphs or up to 4 bullets, under 180 words.

HARD RULES
1. Answer ONLY from the CONTEXT provided in the user message. Do not use outside knowledge, assumptions, or old memories.
2. If the answer is not in the context, say you do not have it in the notes and give the office contact. Never invent a deadline, fee, requirement, amount, slot, or eligibility rule.
3. Cite the numbered source after each factual claim, like [1] or [2]. Only cite numbers that appear in the context.
4. Never promise admission, a scholarship, a slot, or approval. You may explain the process.
5. If the question is outside admissions/scholarships, gently redirect.
6. Do not mention the words "CONTEXT" or "provided documents"; say "our notes" or "the official AdZU page".
7. If the user sounds anxious, acknowledge it in one short sentence, then help.
8. If a date, fee, or deadline in the notes may be outdated, say it should be confirmed with the office.

OFFICE CONTACT
${OFFICE}`;
}

async function fetchJson(
  url: string,
  init: RequestInit,
  timeoutMs = 30000,
): Promise<unknown> {
  const response = await fetch(url, {
    ...init,
    signal: AbortSignal.timeout(timeoutMs),
  });
  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`${response.status} ${body.slice(0, 180)}`);
  }
  return response.json();
}

function textFromOpenAI(data: unknown): string {
  const choices = (data as { choices?: Array<{ message?: { content?: string } }> })
    ?.choices;
  return choices?.[0]?.message?.content?.trim() ?? "";
}

function cleanReply(reply: string): string {
  return reply
    .replace(/^#+\s*/gm, "")
    .replace(/\*\*Context\*\*:?/gi, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, 2400);
}

function historyForModel(history: ChatTurn[]): ChatTurn[] {
  return normalizeHistory(history).slice(-6);
}

async function askOpenAICompatible(
  system: string,
  history: ChatTurn[],
  question: string,
  context: string,
): Promise<string> {
  const base = process.env.AI_BASE_URL?.replace(/\/$/, "");
  const key = process.env.AI_API_KEY;
  const model = process.env.AI_MODEL;
  if (!base || !key || !model) return "";

  const data = await fetchJson(`${base}/chat/completions`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.35,
      max_tokens: 900,
      messages: [
        { role: "system", content: system },
        ...historyForModel(history),
        { role: "user", content: `QUESTION: ${question}\n\nCONTEXT:\n${context}` },
      ],
    }),
  });
  return textFromOpenAI(data);
}

async function askOpenRouter(
  system: string,
  history: ChatTurn[],
  question: string,
  context: string,
): Promise<string> {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) return "";
  const model = process.env.OPENROUTER_MODEL || "google/gemma-4-31b-it:free";

  const data = await fetchJson("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${key}`,
      "HTTP-Referer": "https://adzu-ask.vercel.app",
      "X-Title": "AdZU Ask",
    },
    body: JSON.stringify({
      models: [model, "openrouter/free"],
      temperature: 0.35,
      max_tokens: 900,
      messages: [
        { role: "system", content: system },
        ...historyForModel(history),
        { role: "user", content: `QUESTION: ${question}\n\nCONTEXT:\n${context}` },
      ],
    }),
  });
  return textFromOpenAI(data);
}

async function askGemini(
  system: string,
  history: ChatTurn[],
  question: string,
  context: string,
): Promise<string> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return "";
  const model = process.env.GEMINI_MODEL || "gemini-3.8-flash";

  const contents = [
    ...historyForModel(history).map((turn) => ({
      role: turn.role === "assistant" ? "model" : "user",
      parts: [{ text: turn.content }],
    })),
    {
      role: "user",
      parts: [{ text: `QUESTION: ${question}\n\nCONTEXT:\n${context}` }],
    },
  ];
  if (contents[0]?.role === "model") {
    contents.unshift({
      role: "user",
      parts: [{ text: "(The student just opened the chat.)" }],
    });
  }

  const data = (await fetchJson(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-goog-api-key": key,
      },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents,
        generationConfig: { temperature: 0.35, maxOutputTokens: 900 },
      }),
    },
  )) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };

  return (
    data.candidates?.[0]?.content?.parts
      ?.map((part) => part.text ?? "")
      .join("")
      .trim() ?? ""
  );
}

async function askGroq(
  system: string,
  history: ChatTurn[],
  question: string,
  context: string,
): Promise<string> {
  const key = process.env.GROQ_API_KEY;
  if (!key) return "";
  const model = process.env.GROQ_MODEL || "openai/gpt-oss-120b";

  const data = await fetchJson("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.35,
      max_tokens: 900,
      messages: [
        { role: "system", content: system },
        ...historyForModel(history),
        { role: "user", content: `QUESTION: ${question}\n\nCONTEXT:\n${context}` },
      ],
    }),
  });
  return textFromOpenAI(data);
}

export async function answerQuestion(input: {
  track: Track;
  question: string;
  history: ChatTurn[];
  chunks: Chunk[];
  sources: Source[];
}): Promise<ChatResult> {
  const { track, question, history, chunks, sources } = input;

  if (isSmallTalk(question)) {
    return {
      reply: smallTalkReply(track),
      sources: [],
      provider: "guide",
      track,
      usedContext: false,
    };
  }

  if (!chunks.length) {
    return {
      reply: noContextReply(track),
      sources: [],
      provider: "guide",
      track,
      usedContext: false,
    };
  }

  const context = buildContext(chunks);
  const system = systemPrompt(track);

  const providers: Array<[string, () => Promise<string>]> = [
    ["custom", () => askOpenAICompatible(system, history, question, context)],
    ["openrouter", () => askOpenRouter(system, history, question, context)],
    ["gemini", () => askGemini(system, history, question, context)],
    ["groq", () => askGroq(system, history, question, context)],
  ];

  for (const [name, ask] of providers) {
    try {
      const raw = await ask();
      const reply = cleanReply(raw);
      if (reply.length >= 12) {
        return {
          reply,
          sources,
          provider: name,
          track,
          usedContext: true,
        };
      }
    } catch (error) {
      console.error(
        `[chat] ${name} failed:`,
        error instanceof Error ? error.message : error,
      );
    }
  }

  return {
    reply:
      extractiveAnswer(chunks, question) ||
      noContextReply(track),
    sources,
    provider: "notes",
    track,
    usedContext: true,
  };
}
