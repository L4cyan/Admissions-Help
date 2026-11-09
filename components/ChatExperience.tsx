"use client";

import Link from "next/link";
import {
  ArrowRight,
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
import { DeskScene } from "./DeskScene";
import { MarkdownText } from "./MarkdownText";
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
      "Hi, future Atenista! I'm the chibi guide for Ma'am Jen and the College Admissions & Aid team. Ask me anything about AdZU college admissions or scholarships — no forms, no lanes. I'll bring in the right person from the office.",
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

function previewText(markdown: string): string {
  const clean = markdown
    .replace(/\[(\d+)\]/g, "")
    .replace(/\[([^\]]+)\]\((?:https?:\/\/)[^)]+\)/g, "$1")
    .replace(/https?:\/\/\S+/g, "")
    .replace(/[*_#`>]/g, "")
    .replace(/\n{2,}/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const sentences = clean.split(/(?<=[.!?])\s+/);
  const useful =
    sentences.find(
      (sentence) =>
        sentence.length >= 40 &&
        !/^(okay|sure|hello|hi|great|of course|absolutely|salamat|thank|yes|no)\b/i.test(
          sentence,
        ),
    ) ||
    sentences[0] ||
    clean;
  return useful.length > 118 ? `${useful.slice(0, 115).trimEnd()}…` : useful;
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
  const [stageStaff, setStageStaff] = useState<StaffId>("director");
  const [track, setTrack] = useState<Track | undefined>(initialDesk);

  const messagesRef = useRef(messages);
  const stageStaffRef = useRef<StaffId>(stageStaff);
  const trackRef = useRef<Track | undefined>(track);
  const loadingRef = useRef(false);
  const endRef = useRef<HTMLDivElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const autoRan = useRef(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
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
  }, []);

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

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading, error]);

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
          return;
        }
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
  const stageLine = loading
    ? "Let me check the official notes…"
    : lastAssistant && lastAssistant.id !== "welcome-director"
      ? previewText(lastAssistant.content)
      : stage.line;

  const handleTeamAsk = (question: string, staff: StaffId) => {
    setTeamOpen(false);
    void sendMessage(question, { preferredStaff: staff });
  };

  return (
    <div className="app">
      <header className="app-header">
        <Link href="/" className="brand" aria-label="AdZU Ask home">
          <span className="brand-mark">
            <Chibi variant="director" className="h-full w-full" />
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

      <main className="app-main">
        <aside className="stage" aria-label="The Admissions and Aid desk">
          <div className="stage-head">
            <span className="stage-live" aria-hidden />
            College Admissions &amp; Aid
          </div>

          <div className="stage-body">
            <div className="stage-frame">
              <DeskScene className="stage-scene" />
              <div className="stage-chibi-wrap">
                <Chibi
                  variant={stage.chibi}
                  speaking={loading}
                  className="stage-chibi"
                  title={`${stage.name} chibi guide`}
                />
              </div>
              <div className="stage-desk-lip" aria-hidden />
            </div>

            <div className="stage-bubble" key={`${stage.id}-${messages.length}-${loading}`}>
              <p className="stage-bubble-name">
                {stage.name}
                <span>·</span>
                {deskLabel(stage.id)}
              </p>
              <p className="stage-bubble-text">{stageLine}</p>
              {loading && (
                <span className="stage-typing" aria-label="Checking the notes">
                  <span />
                  <span />
                  <span />
                </span>
              )}
            </div>
          </div>

          <div className="stage-info">
            <p className="stage-name">{stage.name}</p>
            <p className="stage-role">{stage.role}</p>
            <p className="stage-handles">{stage.handles.join(" · ")}</p>
          </div>

          <button
            type="button"
            className="stage-team-btn"
            onClick={() => setTeamOpen(true)}
          >
            <Users className="h-4 w-4" aria-hidden />
            Meet the whole team
            <ArrowRight className="ml-auto h-4 w-4" aria-hidden />
          </button>

          <p className="stage-disclaimer">
            Chibi guides are illustrations, not live staff. They answer only from
            the official notes in this app.
          </p>
        </aside>

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

          <div className="chat-scroll">
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
                      <div className="msg-chibi" aria-hidden>
                        <Chibi
                          variant={STAFF[message.staff].chibi}
                          className="h-full w-full"
                        />
                      </div>
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
                disabled={loading}
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
