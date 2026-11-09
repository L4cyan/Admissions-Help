import type { ChatResult, ChatTurn, Chunk, Source, Track } from "./types";
import type { StaffProfile } from "./staff";
import {
  buildContext,
  extractiveAnswer,
  identityReply,
  isIdentityQuestion,
  isSmallTalk,
  noContextReply,
  normalizeHistory,
  smallTalkReply,
} from "./kb";

const OFFICE =
  "College Admissions & Aid Office — 9910871 local 2211/2212, +639277705888 / +639082613133, admissions@adzu.edu.ph. Scholarship papers: admissionsandaid@adzu.edu.ph.";

const VOICE: Record<string, string> = {
  director:
    "Warm, steady, and welcoming — the person who makes sure nobody gets passed around. You see the whole office and hand people to the right teammate.",
  rose:
    "Soft, encouraging, and practical. You explain grants and financial aid like you are sitting beside the family, not reading a memo.",
  cris:
    "Organized, precise, and kind. You care about deadlines, complete documents, and the exact next step. You sound like the person who keeps the scholarship files in order.",
  sherry:
    "Upbeat and clear. You walk students through the CET one step at a time, especially test permits and schedules.",
  marilou:
    "Warm and grounded. You turn requirements into a simple checklist and make enrollment feel less overwhelming.",
};

function systemPrompt(staff: StaffProfile, track: Track): string {
  const today = new Intl.DateTimeFormat("en-PH", {
    dateStyle: "long",
    timeZone: "Asia/Manila",
  }).format(new Date());
  return `You are ${staff.name} (${staff.fullName}), ${staff.role}, speaking through your chibi guide. Speak in first person as ${staff.name} and stay in character. If someone directly asks whether you are the real person, say you are the chibi guide, that you are not a real person, and that the real ${staff.name} works at the Admissions & Aid Office. Otherwise do not add disclaimers about being a guide.

VOICE
${VOICE[staff.id] ?? "Warm, clear, and helpful."}
A light Filipino touch ("Salamat", "po", "Hala") is fine, but do not overdo it.
Keep answers short: 2-4 short paragraphs or up to 4 bullets, under 150 words. The exception is a broad scholarship overview, which may use up to 5 bullets and 180 words.
Do not write stage directions, actions in parentheses, or emotes. No emojis. Answer the question first, then add a short warm line if useful.

HARD RULES
1. Answer ONLY from the CONTEXT below. Do not use outside knowledge, assumptions, or old memories.
2. If the answer is not in the context, say you do not have it in the official notes and give the office contact. Never invent a deadline, fee, requirement, amount, slot, or eligibility rule.
3. Cite the numbered source after each factual claim, like [1] or [2]. Only cite numbers that appear in the context.
4. Never promise admission, a scholarship, a slot, or approval. You may explain the process.
5. If the question is outside admissions/scholarships, gently redirect to the Admissions & Aid Office.
6. Do not mention the words "CONTEXT" or "provided documents"; say "our notes" or "the official AdZU page".
7. If the user sounds anxious, acknowledge it in one short sentence, then help.
8. Copy numbers, fees, dates, and phone numbers exactly as written in the context. Do not round, shorten, or reformat them.
9. If a date, fee, or deadline in the notes may be outdated, say it should be confirmed with the office.
10. Stay in your lane: this conversation is routed to the ${track} desk. If the question clearly belongs to the other desk, say who can help.
11. Answer the specific question asked. Do not add a different process (for example, test-permit steps when the question is about enrollment) unless the user asks for it.
12. Never claim that a staff member is present, busy, or available. Never say you can transfer the chat or connect the student to a person. Give the office contact instead.
13. For a broad "what scholarships" question, cover all three categories — university, government, and private/donor — and state that government grants except PESFA are processed by CHED or the awarding agency.
14. PROGRAM RULE: Never confirm that a degree or program exists unless it is explicitly named in the CONTEXT's official program list. If a student names a program that is not listed, say it is not in AdZU's current official program list, and do not describe its curriculum, licensure, or careers as an AdZU program. For BS Mechanical Engineering, say plainly that AdZU does not offer it, then name the engineering programs that are listed.
15. Use the exact program names in the CONTEXT. Do not rename, merge, or add programs, and do not treat an older program name as a current offering.

Today is ${today}. You are talking to a prospective student, parent, or scholar.

OFFICE CONTACT
${OFFICE}`;
}

function conversationPrompt(staff: StaffProfile, track: Track): string {
  return `You are ${staff.name} (${staff.fullName}), ${staff.role}, speaking through your chibi guide. Speak naturally in first person as ${staff.name}. Do not refer to yourself in third person or say "my chibi guide". No emojis, no stage directions, no actions in asterisks or parentheses. Stay in character.

No official note matched this message. You may greet, react briefly, ask a clarifying question, and explain what you can help with. Do NOT state any AdZU fact, fee, deadline, requirement, eligibility rule, staff location, or policy. If the user asks for a specific fact, say you do not have it in your notes and give the office contact. Keep it to 1-3 short sentences and steer back to ${track === "admissions" ? "admissions or the CET" : "scholarships or financial aid"}. Do not add disclaimers about being a guide.

OFFICE CONTACT
${OFFICE}`;
}

function conversationFallback(staff: StaffProfile, question: string): string {
  const text = question.toLowerCase();
  if (/\b(help|assist|need help|help me)\b/.test(text)) {
    return `${staff.name} here. Of course — what do you need help with: the CET, enrollment, or a scholarship? I can point you to the right person on the team.`;
  }
  if (/\b(love|haha|lol|hello|hi|hey|salamat|thank)\b/.test(text)) {
    return `Haha, salamat! ${staff.name} here. I'm around for AdZU admissions and scholarship questions — what do you need help with?`;
  }
  return `I'm ${staff.name}. Ask me about the CET, enrollment, or scholarships, and I'll point you to the right person on the team.`;
}

function timeoutSignal(ms: number): AbortSignal {
  return AbortSignal.timeout(Math.max(1000, ms));
}

async function fetchJson(
  url: string,
  init: RequestInit,
  timeoutMs: number,
): Promise<unknown> {
  const response = await fetch(url, {
    ...init,
    signal: timeoutSignal(timeoutMs),
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

function cleanReply(reply: string, maxSources: number): string {
  return reply
    .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{200D}]/gu, "")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/\uFFFD/g, "")
    .replace(/^#+\s*/gm, "")
    .replace(/\*\*Context\*\*:?/gi, "")
    .replace(/^\s*(answer|reply)\s*:\s*/i, "")
    .replace(/^\s*\([^)\n]{1,80}\)\s*/gm, "")
    .replace(
      /\*?\([^)\n]*(?:chibi guide|the real (?:ma'am|sir|staff|teacher))[^)\n]*\)\*?/gi,
      "",
    )
    .replace(/^\s*\*[^*\n]{1,120}\*\s*/gm, "")
    .replace(/\*([^*\n]{1,80})\*/g, (match: string, inner: string) =>
      /\b(giggle|smile|sigh|wag|nod|tilt|laugh|chuckle|grin|adjust|blink|shrug)\b/i.test(
        inner,
      )
        ? ""
        : match,
    )
    .replace(/\s+([,.!?;:])/g, "$1")
    .replace(/\[([^\]\n]*\d[^\]\n]*)\](?!\()/g, (_match: string, inner: string) => {
      const indexes = Array.from(
        new Set(
          [...inner.matchAll(/\d+/g)]
            .map((match) => Number(match[0]))
            .filter((number) => number >= 1 && number <= maxSources),
        ),
      );
      return indexes.map((number) => `[${number}]`).join("");
    })
    .replace(/\[(?![0-9]+\])[^\]\n]{1,40}\](?!\()/g, "")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, 1600);
}

function historyForModel(history: ChatTurn[]): ChatTurn[] {
  return normalizeHistory(history).slice(-6);
}

function normalizeNumber(value: string): string {
  return value.replace(/,/g, "").replace(/\.0+$/, "").replace(/^0+(?=\d)/, "");
}

/**
 * Fees and deadlines are the highest-risk hallucinations. If a sentence
 * mentions money/dates and contains a number that is not in the retrieved
 * context, drop that sentence and tell the student to confirm with the office.
 */
function guardNumbers(reply: string, context: string): string {
  const contextNumbers = new Set(
    [...context.matchAll(/\b\d[\d,]*(?:\.\d+)?\b/g)].map((match) =>
      normalizeNumber(match[0]),
    ),
  );
  const sentences = reply.split(/(?<=[.!?])\s+/);
  let removed = false;
  const kept = sentences.filter((sentence) => {
    const risky =
      /\b(fee|fees|tuition|amount|cost|pay|payment|php|₱|deadline|due|schedule|slot)\b/i.test(
        sentence,
      );
    if (!risky) return true;
    const numbers = [...sentence.matchAll(/\b\d[\d,]*(?:\.\d+)?\b/g)].map(
      (match) => normalizeNumber(match[0]),
    );
    const bad = numbers.some((number) => !contextNumbers.has(number));
    if (bad) removed = true;
    return !bad;
  });
  if (!removed) return reply;
  const safe = kept.join(" ").trim();
  return `${safe}${safe ? "\n\n" : ""}Please confirm the current fee or deadline with the Admissions & Aid Office.`;
}

const UNLISTED_PROGRAMS: Array<{ test: RegExp; label: string }> = [
  { test: /\bmechanical engineering\b/i, label: "BS Mechanical Engineering" },
  { test: /\bchemical engineering\b/i, label: "BS Chemical Engineering" },
  { test: /\bindustrial engineering\b/i, label: "BS Industrial Engineering" },
  { test: /\bp(?:etroleum|etrochemical) engineering\b/i, label: "BS Petroleum Engineering" },
  { test: /\bmining engineering\b/i, label: "BS Mining Engineering" },
  { test: /\baeronautical engineering\b/i, label: "BS Aeronautical Engineering" },
];

/**
 * The catalog is explicit about programs AdZU does not offer. If the model
 * still describes one as an AdZU program, replace that claim deterministically.
 */
function guardProgramClaims(reply: string, question: string): string {
  const item = UNLISTED_PROGRAMS.find((entry) => entry.test.test(question));
  if (!item) return reply;

  const text = reply.toLowerCase();
  const name = item.label.replace(/^BS /, "").toLowerCase();
  if (!text.includes(name)) return reply;

  const negated =
    /\b(not|no|never|isn't|doesn't|don't|does not|do not|cannot|can't|unavailable)\b/.test(
      text,
    );
  if (negated) return reply;

  if (item.label === "BS Mechanical Engineering") {
    return `AdZU's current official program list does not include BS Mechanical Engineering. It is not an AdZU program, so I don't want to describe it as one. The engineering programs that are listed are BS Civil Engineering, BS Computer Engineering, BS Electronics Communications Engineering, BS Biomedical Engineering, and the Associate in Electronics Engineering Technology. If Mechanical Engineering is your goal, you would need to check other universities. The Admissions & Aid Office can confirm.`;
  }

  return `AdZU's current official program list does not include ${item.label}, so I don't want to describe it as an AdZU program. Please confirm with the Admissions & Aid Office before you plan around it.`;
}

function badReply(reply: string): boolean {
  return (
    reply.length < 12 ||
    /\b(User|Response) Safety:/i.test(reply) ||
    /^(as an ai|i cannot|i can't assist)/i.test(reply)
  );
}

async function askOpenAICompatible(
  system: string,
  history: ChatTurn[],
  question: string,
  context: string,
  timeoutMs: number,
): Promise<string> {
  const base = process.env.AI_BASE_URL?.replace(/\/$/, "");
  const key = process.env.AI_API_KEY;
  const model = process.env.AI_MODEL;
  if (!base || !key || !model) return "";

  const data = await fetchJson(
    `${base}/chat/completions`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.25,
        max_tokens: 700,
        messages: [
          { role: "system", content: system },
          ...historyForModel(history),
          { role: "user", content: `QUESTION: ${question}\n\nCONTEXT:\n${context}` },
        ],
      }),
    },
    timeoutMs,
  );
  return textFromOpenAI(data);
}

async function askGemini(
  system: string,
  history: ChatTurn[],
  question: string,
  context: string,
  timeoutMs: number,
): Promise<string> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return "";
  const models = [
    process.env.GEMINI_MODEL || "gemini-3.5-flash-lite",
    "gemini-flash-lite-latest",
    "gemini-3.6-flash",
  ];

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

  const started = Date.now();
  for (const model of models) {
    if (Date.now() - started > timeoutMs - 1200) break;
    try {
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
            generationConfig: {
              temperature: 0.25,
              maxOutputTokens: model.includes("lite") ? 500 : 700,
            },
          }),
        },
        Math.min(8000, timeoutMs - (Date.now() - started)),
      )) as {
        candidates?: Array<{ content?: { parts?: Array<{ text?: string; thought?: boolean }> } }>;
      };
      const text =
        data.candidates?.[0]?.content?.parts
          ?.filter((part) => !part.thought)
          .map((part) => part.text ?? "")
          .join("")
          .trim() ?? "";
      if (text) return text;
    } catch (error) {
      console.error(
        `[chat] gemini ${model} failed:`,
        error instanceof Error ? error.message : error,
      );
    }
  }
  return "";
}

async function askOpenRouter(
  system: string,
  history: ChatTurn[],
  question: string,
  context: string,
  timeoutMs: number,
): Promise<string> {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) return "";
  const models = [
    process.env.OPENROUTER_MODEL || "nvidia/nemotron-3-ultra-550b-a55b:free",
    "google/gemma-4-31b-it:free",
    "openrouter/free",
  ];

  for (const model of models) {
    try {
      const data = await fetchJson(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${key}`,
            "HTTP-Referer": "https://adzu-ask.vercel.app",
            "X-Title": "AdZU Ask",
          },
          body: JSON.stringify({
            model,
            temperature: 0.25,
            max_tokens: 700,
            messages: [
              { role: "system", content: system },
              ...historyForModel(history),
              { role: "user", content: `QUESTION: ${question}\n\nCONTEXT:\n${context}` },
            ],
          }),
        },
        timeoutMs,
      );
      const reply = textFromOpenAI(data);
      if (!badReply(reply)) return reply;
    } catch (error) {
      console.error(
        `[chat] openrouter ${model} failed:`,
        error instanceof Error ? error.message : error,
      );
    }
  }
  return "";
}

async function askGroq(
  system: string,
  history: ChatTurn[],
  question: string,
  context: string,
  timeoutMs: number,
): Promise<string> {
  const key = process.env.GROQ_API_KEY;
  if (!key) return "";
  const model = process.env.GROQ_MODEL || "openai/gpt-oss-120b";

  const data = await fetchJson(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.25,
        max_tokens: 700,
        messages: [
          { role: "system", content: system },
          ...historyForModel(history),
          { role: "user", content: `QUESTION: ${question}\n\nCONTEXT:\n${context}` },
        ],
      }),
    },
    timeoutMs,
  );
  return textFromOpenAI(data);
}

/**
 * Local Ollama, for development or a self-hosted desk. It is only tried when
 * OLLAMA_BASE_URL is set, so a Vercel deployment does not wait on localhost.
 */
async function askOllama(
  system: string,
  history: ChatTurn[],
  question: string,
  context: string,
  timeoutMs: number,
): Promise<string> {
  const base = process.env.OLLAMA_BASE_URL?.replace(/\/$/, "");
  if (!base) return "";
  const model = process.env.OLLAMA_MODEL || "gemma3:4b";

  const data = (await fetchJson(
    `${base}/api/chat`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        model,
        stream: false,
        messages: [
          { role: "system", content: system },
          ...historyForModel(history),
          { role: "user", content: `QUESTION: ${question}\n\nCONTEXT:\n${context}` },
        ],
        options: { temperature: 0.25, num_predict: 500 },
      }),
    },
    timeoutMs,
  )) as { message?: { content?: string } };
  return data.message?.content?.trim() ?? "";
}

/**
 * Keyless free text model. Pollinations serves an OpenAI-compatible endpoint
 * and does not need an account, which means the chat still has a brain on a
 * fresh deployment with no env vars.
 */
async function askPollinations(
  system: string,
  history: ChatTurn[],
  question: string,
  context: string,
  timeoutMs: number,
): Promise<string> {
  if (process.env.FREE_AI === "off") return "";
  const models = [process.env.POLLINATIONS_MODEL || "openai-fast"];

  for (const model of models) {
    try {
      const data = await fetchJson(
        "https://text.pollinations.ai/openai",
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            model,
            temperature: 0.25,
            max_tokens: 700,
            referrer: "adzu-ask",
            messages: [
              { role: "system", content: system },
              ...historyForModel(history),
              { role: "user", content: `QUESTION: ${question}\n\nCONTEXT:\n${context}` },
            ],
          }),
        },
        timeoutMs,
      );
      const reply = textFromOpenAI(data);
      if (!badReply(reply)) return reply;
    } catch (error) {
      console.error(
        `[chat] pollinations ${model} failed:`,
        error instanceof Error ? error.message : error,
      );
    }
  }
  return "";
}

export function aiMode(): "configured" | "free" | "off" {
  if (
    (process.env.AI_BASE_URL && process.env.AI_API_KEY && process.env.AI_MODEL) ||
    process.env.GEMINI_API_KEY ||
    process.env.OPENROUTER_API_KEY ||
    process.env.GROQ_API_KEY ||
    process.env.OLLAMA_BASE_URL
  ) {
    return "configured";
  }
  return process.env.FREE_AI === "off" ? "off" : "free";
}

export async function answerQuestion(input: {
  track: Track;
  staff: StaffProfile;
  question: string;
  history: ChatTurn[];
  chunks: Chunk[];
  sources: Source[];
  conversational?: boolean;
}): Promise<ChatResult> {
  const { track, staff, question, history, chunks, sources, conversational } =
    input;

  if (isIdentityQuestion(question)) {
    return {
      reply: identityReply(staff),
      sources: [],
      provider: "guide",
      track,
      staff: staff.id,
      handoff: false,
      usedContext: false,
    };
  }

  if (isSmallTalk(question)) {
    return {
      reply: smallTalkReply(staff),
      sources: [],
      provider: "guide",
      track,
      staff: staff.id,
      handoff: false,
      usedContext: false,
    };
  }

  const hasContext = !conversational && chunks.length > 0;
  const context = hasContext
    ? buildContext(chunks)
    : "No matching official note was retrieved for this message.";
  const system = hasContext
    ? systemPrompt(staff, track)
    : conversationPrompt(staff, track);
  const deadline = Date.now() + 40_000;
  const left = (cap: number) => Math.max(1200, Math.min(cap, deadline - Date.now()));

  const providers: Array<[string, () => Promise<string>]> = [
    ["custom", () => askOpenAICompatible(system, history, question, context, left(9000))],
    ["gemini", () => askGemini(system, history, question, context, left(9000))],
    ["openrouter", () => askOpenRouter(system, history, question, context, left(9000))],
    ["groq", () => askGroq(system, history, question, context, left(9000))],
    ["ollama", () => askOllama(system, history, question, context, left(28_000))],
    ["pollinations", () => askPollinations(system, history, question, context, left(22_000))],
  ];

  for (const [name, ask] of providers) {
    if (Date.now() > deadline - 1000) break;
    try {
      const raw = await ask();
      const reply = guardProgramClaims(
        guardNumbers(cleanReply(raw, sources.length), context),
        question,
      );
      if (!badReply(reply)) {
        return {
          reply,
          sources: hasContext ? sources : [],
          provider: name,
          track,
          staff: staff.id,
          handoff: false,
          usedContext: hasContext,
        };
      }
    } catch (error) {
      console.error(
        `[chat] ${name} failed:`,
        error instanceof Error ? error.message : error,
      );
    }
  }

  if (!hasContext) {
    return {
      reply: conversationFallback(staff, question),
      sources: [],
      provider: "chat",
      track,
      staff: staff.id,
      handoff: false,
      usedContext: false,
    };
  }

  return {
    reply: extractiveAnswer(chunks, question) || noContextReply(staff),
    sources,
    provider: "notes",
    track,
    staff: staff.id,
    handoff: false,
    usedContext: true,
  };
}
