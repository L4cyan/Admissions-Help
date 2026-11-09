"use client";

import Link from "next/link";
import {
  BookOpenCheck,
  Check,
  Copy,
  ExternalLink,
  LockKeyhole,
  MessageCircle,
  RotateCcw,
  Send,
  Users,
  Volume2,
  X,
} from "lucide-react";
import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { Chibi } from "./Chibi";
import { MarkdownText } from "./MarkdownText";
import { PokeChibi } from "./PokeChibi";
import { TeamSheet } from "./TeamSheet";
import { STAFF, routeQuestion } from "@/lib/staff";
import type { Source, StaffId, Track } from "@/lib/types";

interface UIMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
  provider?: string;
  staff: StaffId;
  createdAt: number;
  handoffFrom?: StaffId;
}

const STORAGE_KEY = "adzu-ask-chat-v3";

function uid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
}

function greeting(): UIMessage {
  return {
    id: "welcome-director",
    role: "assistant",
    staff: "director",
    createdAt: Date.now(),
    content:
      "Hi, future Atenista! I'm Ma'am Jen. Ask me anything about AdZU college admissions or scholarships — no forms, no lanes. I'll bring in the right person from the office.",
  };
}

function isValidMessage(value: unknown): value is UIMessage {
  if (!value || typeof value !== "object") return false;
  const message = value as UIMessage;
  return (
    (message.role === "user" || message.role === "assistant") &&
    typeof message.content === "string" &&
    typeof message.id === "string" &&
    (message.role === "user" ||
      (typeof message.staff === "string" && Boolean(STAFF[message.staff])))
  );
}

function speechText(markdown: string): string {
  return markdown
    .replace(/\[(\d+)\]/g, "")
    .replace(/\[([^\]]+)\]\((?:https?:\/\/)[^)]+\)/g, "$1")
    .replace(/https?:\/\/\S+/g, "")
    .replace(/[*_#`>]/g, "")
    .replace(/\n{2,}/g, ". ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 1200);
}

function deskLabel(staff: StaffId): string {
  const desk = STAFF[staff].desk;
  if (desk === "both") return "Director";
  return desk === "admissions" ? "Admissions" : "Scholarships";
}

function handoffText(from: StaffId, to: StaffId): string {
  if (to === "director") return "Back to Ma'am Jen";
  if (from === "director") {
    return `Ma'am Jen passed you to ${STAFF[to].name}`;
  }
  return `${STAFF[from].name} passed you to ${STAFF[to].name}`;
}

const VOICE: Record<StaffId, { pitch: number; rate: number }> = {
  director: { pitch: 1.02, rate: 0.97 },
  rose: { pitch: 1.08, rate: 1 },
  cris: { pitch: 0.98, rate: 0.98 },
  sherry: { pitch: 1.1, rate: 1.03 },
  marilou: { pitch: 1.05, rate: 1 },
};

type DirectorTopic =
  | "cet"
  | "score"
  | "permit"
  | "scholarship"
  | "requirements"
  | "enrollment"
  | "programs"
  | "fees"
  | "contact"
  | "professional"
  | "unlisted"
  | "general";

const DIRECTOR_LEADS: Array<(name: string) => string> = [
  (name) => `${name} is right.`,
  (name) => `Keep ${name}'s answer close.`,
  (name) => `${name} knows this side.`,
  () => "Good question.",
  () => "Here's the part to hold on to.",
];

const DIRECTOR_LINES: Record<DirectorTopic, string[]> = {
  cet: [
    "Follow the steps in order, and don't skip the portal screenshot.",
    "The CET is easier when you prepare early; don't wait for the last week.",
    "If the schedule is tight, ask the office about the next available date.",
  ],
  score: [
    "The 30% is the university minimum, not a promise for a specific program.",
    "If your target program is competitive, aim higher than the minimum.",
    "Ask the office for the cutoff of your specific program.",
  ],
  permit: [
    "The permit is the step people forget; do that before the exam date.",
    "Bring the screenshot and your 2x2 photo when you get the permit.",
    "Get the permit early so you're not rushing the day before.",
  ],
  scholarship: [
    "Start with the form, then the documents; don't wait for the deadline.",
    "Submit early so the office can tell you if something is missing.",
    "Keep copies of everything you submit.",
  ],
  requirements: [
    "Start with the originals, then the photocopies.",
    "The checklist looks long, but it's mostly documents you already have.",
    "Check the list twice before you visit the office.",
  ],
  enrollment: [
    "Handle one checklist line at a time; it's manageable.",
    "If you're a transferee, the honorable dismissal is the one to chase.",
    "Do the requirements first, then the enrollment steps.",
  ],
  programs: [
    "Tell me what you enjoy doing and I'll help you compare the fit.",
    "Program fit matters more than the name; ask about the curriculum.",
    "If you're choosing between two programs, ask what the first year looks like.",
  ],
  fees: [
    "Use the Finance Office assessment for the exact amount.",
    "Ask the Finance Office for the current fee sheet for your program.",
    "Keep your payment receipt; you'll need it for enrollment.",
  ],
  contact: [
    "If you're coming to the office, bring your questions and documents.",
    "Call ahead if you're traveling from outside Zamboanga City.",
    "We're at the Ground Floor of Bellarmine–Campion, Salvador Campus.",
  ],
  professional: [
    "Law, Medicine, and Graduate School have separate admissions.",
    "For professional schools, contact the school directly; the process is different.",
    "These programs have their own requirements and timelines.",
  ],
  unlisted: [
    "If a program isn't offered, don't force it; let's find the closest fit or another school.",
    "It's okay to look at other universities for that program.",
    "Tell me what you like about it and I'll suggest a related AdZU program.",
  ],
  general: [
    "If anything above feels unclear, ask me and I'll slow it down.",
    "You can ask a follow-up in plain language; no need to phrase it formally.",
    "Tell me your situation and I'll help you sort the next step.",
    "You don't have to figure it all out at once.",
  ],
};

function pickNote<T>(items: T[], seed: string): T {
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) | 0;
  }
  return items[Math.abs(hash) % items.length];
}

function directorTopic(text: string): DirectorTopic {
  const value = text.toLowerCase();
  if (
    /not offered|not in (?:the|our|adzu).*(?:list|program)|mechanical engineering|architecture|chemical engineering|industrial engineering/.test(
      value,
    )
  ) {
    return "unlisted";
  }
  if (
    /scholarship|scholar|grant|financial aid|stipend|allowance|blue eagle|asaa|renewal/.test(
      value,
    )
  ) {
    return "scholarship";
  }
  if (
    /passing score|percentile|cut-?off|minimum score|cet score|admission score/.test(
      value,
    )
  ) {
    return "score";
  }
  if (/test permit|\bpermit\b|examinee|testing center/.test(value)) {
    return "permit";
  }
  if (/\bcet\b|college entrance test|entrance exam|entrance test/.test(value)) {
    return "cet";
  }
  if (
    /requirement|form 138|good moral|honorable dismissal|transcript|birth certificate|2x2/.test(
      value,
    )
  ) {
    return "requirements";
  }
  if (/enroll|enrollment|shifting|transferee|freshman|freshmen/.test(value)) {
    return "enrollment";
  }
  if (/tuition|fee|fees|payment|gcash|finance office/.test(value)) {
    return "fees";
  }
  if (
    /juris doctor|master of laws|\blaw\b|medicine|md-mph|graduate school|master|doctorate|phd/.test(
      value,
    )
  ) {
    return "professional";
  }
  if (
    /program|course|degree|curriculum|engineering|nursing|accountancy|psychology|biology|mathematics|communication|education/.test(
      value,
    )
  ) {
    return "programs";
  }
  if (/office|address|contact|location|email|phone|campus/.test(value)) {
    return "contact";
  }
  return "general";
}

function detailFromReply(reply: string): string | null {
  const clean = reply.replace(/\[[^\]]*\]/g, " ");
  const date = clean.match(
    /\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}\b/,
  );
  if (date) return `Put ${date[0]} somewhere you'll see it.`;
  const money = clean.match(/\bPHP\s?[\d,]+(?:\.\d{2})?\b/i);
  if (money) return `Keep ${money[0]} handy for the office.`;
  const email = clean.match(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/);
  if (email) return `Save ${email[0]} before you close this chat.`;
  const phone = clean.match(/(?:\+63|0)\d{3}[\s-]?\d{3}[\s-]?\d{4}/);
  if (phone) return `Save ${phone[0]} in case you need to ask a follow-up.`;
  return null;
}

function directorNote(
  message: UIMessage,
  prompt: string,
  index: number,
): string {
  const topic = directorTopic(`${prompt}\n${message.content}`);
  const seed = `${message.id}:${index}`;
  const name = STAFF[message.staff].name;
  const lead = pickNote(DIRECTOR_LEADS, `${seed}:lead`)(name);
  const line =
    detailFromReply(message.content) ??
    pickNote(DIRECTOR_LINES[topic], `${seed}:line`);
  return `${lead} ${line}`;
}

export function ChatExperience({
  initialQuery,
  initialDesk,
}: {
  initialQuery?: string;
  initialDesk?: Track;
}) {
  const [messages, setMessages] = useState<UIMessage[]>([greeting()]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [teamOpen, setTeamOpen] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [pokeToast, setPokeToast] = useState<string | null>(null);
  const [stageStaff, setStageStaff] = useState<StaffId>("director");
  const [track, setTrack] = useState<Track | undefined>(initialDesk);

  const messagesRef = useRef(messages);
  const stageStaffRef = useRef<StaffId>(stageStaff);
  const trackRef = useRef<Track | undefined>(track);
  const loadingRef = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const nearBottomRef = useRef(true);
  const expectAnswerRef = useRef(false);
  const wasLoadingRef = useRef(false);
  const autoRan = useRef(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pokeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const hintRef = useRef<Track | undefined>(initialDesk);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    stageStaffRef.current = stageStaff;
  }, [stageStaff]);

  useEffect(() => {
    trackRef.current = track;
  }, [track]);

  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

  useEffect(() => {
    if (initialQuery?.trim()) {
      setHydrated(true);
      return;
    }
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as {
          messages?: unknown;
          staff?: unknown;
          track?: unknown;
        };
        if (
          Array.isArray(parsed.messages) &&
          parsed.messages.length &&
          parsed.messages.every(isValidMessage)
        ) {
          setMessages(parsed.messages);
          const last = [...parsed.messages]
            .reverse()
            .find((message) => message.role === "assistant");
          if (last?.staff) setStageStaff(last.staff);
        }
        if (parsed.track === "admissions" || parsed.track === "scholarships") {
          setTrack(parsed.track);
          trackRef.current = parsed.track;
        }
      }
    } catch {
      // sessionStorage can be unavailable; keep the greeting.
    }
    setHydrated(true);
  }, [initialQuery]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          messages: messages.slice(-40),
          staff: stageStaff,
          track,
        }),
      );
    } catch {
      // ignore quota/private mode
    }
  }, [hydrated, messages, stageStaff, track]);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    nearBottomRef.current = true;
    endRef.current?.scrollIntoView({ behavior, block: "end" });
  }, []);

  const handleScroll = useCallback(() => {
    const scroller = scrollRef.current;
    if (!scroller) return;
    nearBottomRef.current =
      scroller.scrollHeight - scroller.scrollTop - scroller.clientHeight < 96;
  }, []);

  // Start restored threads at the newest message.
  useEffect(() => {
    if (!hydrated) return;
    const scroller = scrollRef.current;
    if (!scroller) return;
    scroller.scrollTop = scroller.scrollHeight;
    nearBottomRef.current = true;
  }, [hydrated]);

  // Sending always brings the composer's new message into view.
  useEffect(() => {
    if (!loading) return;
    scrollToBottom();
  }, [loading, scrollToBottom]);

  useEffect(() => {
    if (!error) return;
    scrollToBottom();
  }, [error, scrollToBottom]);

  // For a fresh answer, reveal its beginning instead of the very end.
  useEffect(() => {
    if (!expectAnswerRef.current) return;
    const last = messages[messages.length - 1];
    if (last?.role !== "assistant") return;
    expectAnswerRef.current = false;
    if (!nearBottomRef.current) return;
    const scroller = scrollRef.current;
    if (!scroller) return;
    const guides = scroller.querySelectorAll<HTMLElement>(
      ".msg-guide:not(.msg-typing)",
    );
    const target = guides[guides.length - 1];
    if (!target) return;
    const frame = window.requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [messages]);

  // Restore typing focus after a reply, but never pop the keyboard on phones.
  useEffect(() => {
    if (wasLoadingRef.current && !loading) {
      if (window.matchMedia("(min-width: 900px)").matches) {
        taRef.current?.focus({ preventScroll: true });
      }
    }
    wasLoadingRef.current = loading;
  }, [loading]);

  useEffect(() => {
    const element = taRef.current;
    if (!element) return;
    element.style.height = "auto";
    element.style.height = `${Math.min(element.scrollHeight, 160)}px`;
  }, [input]);

  useEffect(() => {
    if (!hydrated) return;
    if (window.matchMedia("(min-width: 900px)").matches) {
      taRef.current?.focus();
    }
  }, [hydrated]);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      window.speechSynthesis?.cancel();
      if (copyTimer.current) clearTimeout(copyTimer.current);
      if (pokeTimer.current) clearTimeout(pokeTimer.current);
    };
  }, []);

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis?.cancel();
    setSpeakingId(null);
  }, []);

  const speak = useCallback(
    (text: string, id: string, staff: StaffId) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
      window.speechSynthesis.cancel();
      if (speakingId === id) {
        setSpeakingId(null);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(speechText(text));
      const voices = window.speechSynthesis.getVoices();
      const preferred =
        voices.find((voice) => /en-PH/i.test(voice.lang)) ||
        voices.find((voice) => /en-US/i.test(voice.lang)) ||
        voices.find((voice) => /^en/i.test(voice.lang));
      if (preferred) utterance.voice = preferred;
      utterance.lang = preferred?.lang || "en-PH";
      utterance.rate = VOICE[staff].rate;
      utterance.pitch = VOICE[staff].pitch;
      utterance.onend = () => setSpeakingId(null);
      utterance.onerror = () => setSpeakingId(null);
      setSpeakingId(id);
      window.speechSynthesis.speak(utterance);
    },
    [speakingId],
  );

  const sendMessage = useCallback(
    async (override?: string, options?: { preferredStaff?: StaffId }) => {
      const text = (override ?? input).trim();
      if (!text || loadingRef.current) return;

      const priorStaff = stageStaffRef.current;
      const routed = routeQuestion(text, trackRef.current);
      const preferred = options?.preferredStaff;
      const optimistic = preferred
        ? {
            staff: preferred,
            track:
              STAFF[preferred].desk === "both"
                ? routed.track
                : (STAFF[preferred].desk as Track),
          }
        : routed;
      if (optimistic.staff !== priorStaff) {
        setStageStaff(optimistic.staff);
      }

      const userMessage: UIMessage = {
        id: uid(),
        role: "user",
        content: text.slice(0, 1200),
        createdAt: Date.now(),
        staff: "director",
      };
      const next = [...messagesRef.current, userMessage];
      setMessages(next);
      setInput("");
      setError(null);
      setLoading(true);
      loadingRef.current = true;
      nearBottomRef.current = true;
      expectAnswerRef.current = true;
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "content-type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            messages: next.map(({ role, content }) => ({ role, content })),
            previousTrack: trackRef.current,
            previousStaff: priorStaff,
            hint: hintRef.current,
            preferredStaff: options?.preferredStaff,
          }),
        });
        const data = (await response.json()) as {
          reply?: string;
          sources?: Source[];
          provider?: string;
          track?: Track;
          staff?: StaffId;
          handoff?: boolean;
          error?: string;
        };
        if (!response.ok || !data.reply) {
          throw new Error(data.error || "The guide could not answer.");
        }

        const staff = data.staff && STAFF[data.staff] ? data.staff : optimistic.staff;
        const nextTrack = data.track ?? optimistic.track;
        const assistantMessage: UIMessage = {
          id: uid(),
          role: "assistant",
          content: data.reply,
          sources: data.sources ?? [],
          provider: data.provider,
          staff,
          createdAt: Date.now(),
          handoffFrom:
            data.handoff && priorStaff !== staff ? priorStaff : undefined,
        };
        setMessages((current) => [...current, assistantMessage]);
        setStageStaff(staff);
        setTrack(nextTrack);
        trackRef.current = nextTrack;
        hintRef.current = undefined;
      } catch (caught) {
        if (caught instanceof DOMException && caught.name === "AbortError") {
          expectAnswerRef.current = false;
          return;
        }
        expectAnswerRef.current = false;
        setError(
          caught instanceof Error
            ? caught.message
            : "Something went wrong. Please try again.",
        );
        setStageStaff(priorStaff);
      } finally {
        setLoading(false);
        loadingRef.current = false;
      }
    },
    [input],
  );

  useEffect(() => {
    if (!hydrated || autoRan.current) return;
    const query = initialQuery?.trim();
    if (!query) return;
    const hasUserMessage = messagesRef.current.some(
      (message) => message.role === "user",
    );
    if (hasUserMessage) return;
    autoRan.current = true;
    const timeout = window.setTimeout(() => {
      void sendMessage(query);
      window.history.replaceState({}, "", "/");
    }, 550);
    return () => window.clearTimeout(timeout);
  }, [hydrated, initialQuery, sendMessage]);

  const resetChat = () => {
    abortRef.current?.abort();
    stopSpeaking();
    const fresh = [greeting()];
    setMessages(fresh);
    setInput("");
    setError(null);
    setLoading(false);
    loadingRef.current = false;
    expectAnswerRef.current = false;
    nearBottomRef.current = true;
    setStageStaff("director");
    setTrack(initialDesk);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    window.history.replaceState({}, "", "/");
    taRef.current?.focus();
  };

  const copyMessage = async (message: UIMessage) => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopiedId(message.id);
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopiedId(null), 1600);
    } catch {
      // clipboard can be blocked
    }
  };

  const handlePoke = useCallback((line: string) => {
    setPokeToast(line);
    if (pokeTimer.current) clearTimeout(pokeTimer.current);
    pokeTimer.current = setTimeout(() => setPokeToast(null), 2600);
  }, []);

  const hasUserMessage = messages.some((message) => message.role === "user");
  const stage = STAFF[stageStaff];
  const lastAssistant = useMemo(
    () => [...messages].reverse().find((message) => message.role === "assistant"),
    [messages],
  );
  const suggestions = STAFF.director.suggestions;
  const firstHandle = stage.handles[0] ?? "this desk";
  const handlePlaceholder = /^[A-Z]{2,}/.test(firstHandle)
    ? firstHandle
    : `${firstHandle.charAt(0).toLowerCase()}${firstHandle.slice(1)}`;

  const handleTeamAsk = (question: string, staff: StaffId) => {
    setTeamOpen(false);
    void sendMessage(question, { preferredStaff: staff });
  };

  return (
    <div className="app">
      <header className="app-header">
        <Link href="/" className="brand" aria-label="AdZU Ask home">
          <span className="brand-mark">
            <img src="/brand/adzu-ask-logo.svg" alt="" />
          </span>
          <span className="brand-text">
            <span className="brand-name">AdZU Ask</span>
            <span className="brand-sub">Admissions &amp; Aid guide</span>
          </span>
        </Link>

        <div className="header-actions">
          <button
            type="button"
            className="text-btn"
            onClick={() => setTeamOpen(true)}
          >
            <Users className="h-4 w-4" aria-hidden />
            <span>The team</span>
          </button>
          <Link
            href="/admin"
            className="text-btn text-btn-muted"
            aria-label="Staff content desk"
          >
            <LockKeyhole className="h-4 w-4" aria-hidden />
            <span className="hidden sm:inline">Staff desk</span>
          </Link>
        </div>
      </header>

      <main className="app-main app-main-chat">


        <section className="chat" aria-label="Chat with the Admissions and Aid guides">
          <header className="chat-head">
            <div>
              <p className="kicker">One chat · no lanes</p>
              <h1>Ask anything about AdZU.</h1>
              <p className="chat-head-sub">
                Admissions, CET, scholarships, aid — ask like you would text a
                friend.
              </p>
            </div>
            <button
              type="button"
              className="icon-btn"
              onClick={resetChat}
              aria-label="Start a new chat"
              title="New chat"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </header>

          <div className="chat-scroll" ref={scrollRef} onScroll={handleScroll}>
            <div className="chat-thread" aria-live="polite" aria-relevant="additions">
              {messages.map((message, index) => (
                <Fragment key={message.id}>
                  {message.handoffFrom && (
                    <div className="handoff">
                      <span className="handoff-line" />
                      <span className="handoff-text">
                        {handoffText(message.handoffFrom, message.staff)}
                        <span className="handoff-desk">
                          {deskLabel(message.staff)}
                        </span>
                      </span>
                      <span className="handoff-line" />
                    </div>
                  )}

                  {message.role === "user" ? (
                    <div className="msg msg-user">
                      <div className="bubble bubble-user">{message.content}</div>
                    </div>
                  ) : (
                    <div className="msg msg-guide">
                      <PokeChibi
                        variant={STAFF[message.staff].chibi}
                        onPoke={handlePoke}
                        showBubble={false}
                      />
                      <div className="msg-main">
                        <div className="msg-meta">
                          <span className="msg-name">
                            {STAFF[message.staff].name}
                          </span>
                          <span className="msg-desk">
                            {deskLabel(message.staff)}
                          </span>
                          {message.provider === "notes" && (
                            <span className="msg-badge">quoted notes</span>
                          )}
                        </div>
                        <div className="bubble bubble-guide">
                          <MarkdownText text={message.content} />
                        </div>

                        {message.sources && message.sources.length > 0 && (
                          <details className="sources">
                            <summary>
                              <BookOpenCheck className="h-3.5 w-3.5" aria-hidden />
                              Sources · {message.sources.length}
                              <span className="sources-hint">show</span>
                            </summary>
                            <ol>
                              {message.sources.map((source, sourceIndex) => (
                                <li key={source.id}>
                                  <span className="source-num">
                                    {sourceIndex + 1}
                                  </span>
                                  <div>
                                    {source.url ? (
                                      <a
                                        href={source.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="source-link"
                                      >
                                        {source.title}
                                        <ExternalLink
                                          className="h-3 w-3"
                                          aria-hidden
                                        />
                                      </a>
                                    ) : (
                                      <span className="source-title">
                                        {source.title}
                                      </span>
                                    )}
                                    <p>{source.snippet}</p>
                                  </div>
                                </li>
                              ))}
                            </ol>
                          </details>
                        )}

                        <div className="msg-actions">
                          <button
                            type="button"
                            onClick={() =>
                              speak(
                                message.content,
                                message.id,
                                message.staff,
                              )
                            }
                          >
                            <Volume2 className="h-3 w-3" aria-hidden />
                            {speakingId === message.id ? "Stop" : "Read"}
                          </button>
                          <button
                            type="button"
                            onClick={() => void copyMessage(message)}
                          >
                            {copiedId === message.id ? (
                              <Check className="h-3 w-3" aria-hidden />
                            ) : (
                              <Copy className="h-3 w-3" aria-hidden />
                            )}
                            {copiedId === message.id ? "Copied" : "Copy"}
                          </button>
                        </div>

                        {message.staff !== "director" &&
                          message.id === lastAssistant?.id && (
                            <div className="director-note">
                              <span className="director-note-chibi" aria-hidden>
                                <Chibi variant="director" className="h-full w-full" />
                              </span>
                              <p>
                                <strong>Ma'am Jen:</strong>{" "}
                                {directorNote(
                                  message,
                                  index > 0 &&
                                    messages[index - 1].role === "user"
                                    ? messages[index - 1].content
                                    : "",
                                  index,
                                )}
                              </p>
                            </div>
                          )}
                      </div>
                    </div>
                  )}

                  {index === 0 && !hasUserMessage && (
                    <div className="suggestions">
                      {suggestions.map((suggestion) => (
                        <button
                          key={suggestion}
                          type="button"
                          className="suggestion"
                          onClick={() => void sendMessage(suggestion)}
                          disabled={loading}
                        >
                          <MessageCircle className="h-3.5 w-3.5" aria-hidden />
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </Fragment>
              ))}

              {loading && (
                <div className="msg msg-guide msg-typing">
                  <div className="msg-chibi" aria-hidden>
                    <Chibi
                      variant={stage.chibi}
                      speaking
                      className="h-full w-full"
                    />
                  </div>
                  <div className="msg-main">
                    <div className="msg-meta">
                      <span className="msg-name">{stage.name}</span>
                      <span className="msg-desk">checking the notes</span>
                    </div>
                    <div className="bubble bubble-guide bubble-typing">
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="chat-error" role="alert">
                  <X className="h-4 w-4 shrink-0" aria-hidden />
                  <div>
                    <p className="chat-error-title">The guide hit a snag.</p>
                    <p>{error}</p>
                  </div>
                  <button type="button" onClick={() => setError(null)}>
                    Dismiss
                  </button>
                </div>
              )}

              <div ref={endRef} />
            </div>
          </div>

          {pokeToast && (
            <div className="poke-toast" role="status">
              {pokeToast}
            </div>
          )}

          <form
            className="composer"
            onSubmit={(event: FormEvent) => {
              event.preventDefault();
              void sendMessage();
            }}
          >
            <div className="composer-box">
              <label htmlFor="chat-input" className="sr-only">
                Ask a question
              </label>
              <textarea
                id="chat-input"
                ref={taRef}
                rows={1}
                value={input}
                onChange={(event) => setInput(event.target.value.slice(0, 1000))}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    void sendMessage();
                  }
                }}
                placeholder={
                  stage.id === "director"
                    ? "Ask about AdZU admissions or aid…"
                    : `Ask ${stage.name} about ${handlePlaceholder}…`
                }
                aria-label="Ask a question"
              />
              <button
                type="submit"
                className="send-btn"
                disabled={!input.trim() || loading}
                aria-label="Send question"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <div className="composer-foot">
              <p>
                Unofficial student-built guide. Not live staff.{" "}
                <a
                  href="https://adzu.edu.ph/about-us/admissions-aid"
                  target="_blank"
                  rel="noreferrer"
                >
                  Confirm with the office
                </a>
                .
              </p>
              <span>{input.length}/1000</span>
            </div>
          </form>
        </section>
      </main>

      <TeamSheet
        open={teamOpen}
        onClose={() => setTeamOpen(false)}
        onAsk={handleTeamAsk}
      />
    </div>
  );
}
