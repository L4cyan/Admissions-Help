"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpenCheck,
  Check,
  Copy,
  ExternalLink,
  GraduationCap,
  HeartHandshake,
  MessageCircle,
  RotateCcw,
  Send,
  Sparkles,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { Chibi } from "./Chibi";
import { MarkdownText } from "./MarkdownText";
import { TRACKS, type TrackConfig } from "@/lib/tracks";
import type { Source, Track } from "@/lib/types";

interface UIMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
  provider?: string;
  createdAt: number;
}

function uid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
}

function greetingMessage(config: TrackConfig): UIMessage {
  return {
    id: `welcome-${config.id}`,
    role: "assistant",
    content: config.greeting,
    createdAt: Date.now(),
  };
}

function isValidMessage(value: unknown): value is UIMessage {
  if (!value || typeof value !== "object") return false;
  const message = value as UIMessage;
  return (
    (message.role === "user" || message.role === "assistant") &&
    typeof message.content === "string" &&
    typeof message.id === "string"
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

export function ChatRoom({ track }: { track: Track }) {
  const config = TRACKS[track];
  const isAdmissions = track === "admissions";
  const storageKey = `adzu-ask-chat-${track}`;

  const [messages, setMessages] = useState<UIMessage[]>([greetingMessage(config)]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [voiceOn, setVoiceOn] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesRef = useRef(messages);
  const endRef = useRef<HTMLDivElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const autoRan = useRef(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length && parsed.every(isValidMessage)) {
          setMessages(parsed);
        }
      }
    } catch {
      // sessionStorage can be unavailable; keep the greeting.
    }
    setHydrated(true);
  }, [storageKey]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      sessionStorage.setItem(storageKey, JSON.stringify(messages.slice(-30)));
    } catch {
      // ignore quota/private mode
    }
  }, [hydrated, messages, storageKey]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading, error]);

  useEffect(() => {
    const element = taRef.current;
    if (!element) return;
    element.style.height = "auto";
    element.style.height = `${Math.min(element.scrollHeight, 140)}px`;
  }, [input]);

  const speak = useCallback((text: string, id: string) => {
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
    utterance.rate = 0.98;
    utterance.pitch = 1.08;
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);
    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  }, [speakingId]);

  const sendMessage = useCallback(
    async (override?: string) => {
      const text = (override ?? input).trim();
      if (!text || loading) return;

      const userMessage: UIMessage = {
        id: uid(),
        role: "user",
        content: text.slice(0, 1200),
        createdAt: Date.now(),
      };
      const next = [...messagesRef.current, userMessage];
      setMessages(next);
      setInput("");
      setError(null);
      setLoading(true);

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            track,
            messages: next.map(({ role, content }) => ({ role, content })),
          }),
        });
        const data = (await response.json()) as {
          reply?: string;
          sources?: Source[];
          provider?: string;
          error?: string;
        };
        if (!response.ok || !data.reply) {
          throw new Error(data.error || "The chibi guide could not answer.");
        }
        const assistantMessage: UIMessage = {
          id: uid(),
          role: "assistant",
          content: data.reply,
          sources: data.sources ?? [],
          provider: data.provider,
          createdAt: Date.now(),
        };
        setMessages((current) => [...current, assistantMessage]);
        if (voiceOn) speak(assistantMessage.content, assistantMessage.id);
      } catch (caught) {
        setError(
          caught instanceof Error
            ? caught.message
            : "Something went wrong. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    },
    [input, loading, speak, track, voiceOn],
  );

  useEffect(() => {
    if (!hydrated || autoRan.current) return;
    const params = new URLSearchParams(window.location.search);
    const query = params.get("q")?.trim();
    if (!query) return;
    const hasUserMessage = messagesRef.current.some((message) => message.role === "user");
    if (hasUserMessage) return;
    autoRan.current = true;
    const timeout = setTimeout(() => {
      void sendMessage(query);
      window.history.replaceState({}, "", `/chat/${track}`);
    }, 500);
    return () => clearTimeout(timeout);
  }, [hydrated, sendMessage, track]);

  const resetChat = () => {
    const fresh = [greetingMessage(config)];
    setMessages(fresh);
    setInput("");
    setError(null);
    setLoading(false);
    try {
      sessionStorage.removeItem(storageKey);
    } catch {
      // ignore
    }
    window.history.replaceState({}, "", `/chat/${track}`);
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

  return (
    <div className="mx-auto flex min-h-0 w-full max-w-6xl flex-1 gap-5 px-2 py-3 sm:px-4 sm:py-5">
      <aside className="hidden w-[290px] shrink-0 flex-col gap-3 lg:flex">
        <div className="paper-card p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gold-700">
            Switch desk
          </p>
          <div className="mt-3 grid gap-2">
            <TrackSwitch
              to="admissions"
              active={isAdmissions}
              icon={<GraduationCap className="h-4 w-4" />}
              title="Admissions"
              subtitle="CET, requirements, enrollment"
            />
            <TrackSwitch
              to="scholarships"
              active={!isAdmissions}
              icon={<HeartHandshake className="h-4 w-4" />}
              title="Scholarships"
              subtitle="Grants, aid, requirements"
            />
          </div>
        </div>

        <div className="paper-card overflow-hidden">
          <div className="relative bg-cream/70 px-4 pb-2 pt-4">
            <div className="flex items-end justify-center -space-x-5">
              <div className="h-24 w-24 overflow-hidden rounded-full border-2 border-paper bg-sky-100 shadow-card">
                <Chibi variant={config.chibis[0]} className="h-full w-full" />
              </div>
              <div className="h-28 w-28 overflow-hidden rounded-full border-2 border-paper bg-gold-100 shadow-card">
                <Chibi variant={config.chibis[1]} className="h-full w-full" />
              </div>
            </div>
          </div>
          <div className="p-4">
            <p className="font-display text-lg font-semibold text-navy-950">
              Your {config.label.toLowerCase()} team
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted">
              {config.description}
            </p>
            <div className="mt-3 flex items-center gap-1.5 text-[11px] font-medium text-gold-800">
              <BookOpenCheck className="h-3.5 w-3.5" aria-hidden />
              Answers only from the notes
            </div>
          </div>
        </div>

        <div className="paper-card p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gold-700">
            Try asking
          </p>
          <div className="mt-3 space-y-1.5">
            {config.suggestions.slice(0, 5).map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => void sendMessage(suggestion)}
                disabled={loading}
                className="flex w-full items-start gap-2 rounded-xl px-2.5 py-2 text-left text-xs leading-snug text-ink/75 transition hover:bg-gold-50 hover:text-ink disabled:opacity-50"
              >
                <MessageCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-600" aria-hidden />
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-gold-200 bg-gold-50/70 p-3.5 text-[11px] leading-relaxed text-gold-900">
          <p className="font-semibold">Unofficial helper</p>
          <p className="mt-1 text-gold-900/80">
            Confirm requirements, fees, and deadlines with the Admissions &amp;
            Aid Office. The chibi guides cannot approve applications.
          </p>
        </div>
      </aside>

      <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[26px] border border-line/80 bg-paper shadow-soft">
        <div className="flex flex-none items-center gap-3 border-b border-line/80 px-3 py-3 sm:px-5">
          <Link
            href="/"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line bg-cream/60 text-ink/70 transition hover:border-gold-300 hover:text-navy-900"
            aria-label="Back to the lane picker"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>

          <div className="flex min-w-0 flex-1 items-center gap-2.5">
            <div className="relative hidden h-10 w-10 shrink-0 sm:block">
              <span className="absolute left-0 top-0 h-8 w-8 overflow-hidden rounded-full border border-paper bg-sky-100">
                <Chibi variant={config.chibis[0]} className="h-full w-full" />
              </span>
              <span className="absolute bottom-0 right-0 h-8 w-8 overflow-hidden rounded-full border border-paper bg-gold-100">
                <Chibi variant={config.chibis[1]} className="h-full w-full" />
              </span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="truncate font-display text-base font-semibold text-navy-950 sm:text-lg">
                  {config.label} desk
                </h1>
                <span className="hidden items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.1em] text-emerald-700 sm:inline-flex">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Online
                </span>
              </div>
              <p className="hidden truncate text-[11px] text-muted sm:block">
                {config.tagline} · chibi guides
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                setVoiceOn((value) => !value);
                if (voiceOn) {
                  window.speechSynthesis?.cancel();
                  setSpeakingId(null);
                }
              }}
              className={`grid h-9 w-9 place-items-center rounded-full border transition ${
                voiceOn
                  ? "border-gold-300 bg-gold-50 text-gold-800"
                  : "border-line bg-cream/50 text-ink/60 hover:border-gold-300"
              }`}
              aria-label={voiceOn ? "Turn voice off" : "Turn voice on"}
              title={voiceOn ? "Voice on" : "Voice off"}
            >
              {voiceOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </button>
            <button
              type="button"
              onClick={resetChat}
              className="grid h-9 w-9 place-items-center rounded-full border border-line bg-cream/50 text-ink/60 transition hover:border-gold-300 hover:text-navy-900"
              aria-label="Start a new chat"
              title="New chat"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="chat-scroll min-h-0 flex-1 overflow-y-auto px-3 py-4 sm:px-6 sm:py-5">
          <div className="mx-auto flex max-w-3xl flex-col gap-4">
            <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted/70">
              <span className="h-px flex-1 bg-line/80" />
              {isAdmissions ? "Admissions notes" : "Scholarship notes"}
              <span className="h-px flex-1 bg-line/80" />
            </div>

            {messages.map((message, index) => (
              <MessageRow
                key={message.id}
                message={message}
                config={config}
                index={index}
                isAdmissions={isAdmissions}
                speaking={speakingId === message.id}
                copied={copiedId === message.id}
                onSpeak={() => speak(message.content, message.id)}
                onCopy={() => void copyMessage(message)}
              />
            ))}

            {!hasUserMessage && (
              <div className="ml-11 flex flex-wrap gap-1.5 sm:ml-12">
                {config.suggestions.slice(0, 4).map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => void sendMessage(suggestion)}
                    className="chip !text-[11px]"
                  >
                    <Sparkles className="h-3 w-3 text-gold-600" aria-hidden />
                    {suggestion.length > 48 ? `${suggestion.slice(0, 46)}…` : suggestion}
                  </button>
                ))}
              </div>
            )}

            {loading && (
              <div className="flex max-w-[86%] items-end gap-2.5">
                <span className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full border border-gold-200 bg-cream">
                  <Chibi
                    variant={config.chibis[(messages.length + 1) % 2]}
                    className="h-full w-full animate-bob"
                  />
                </span>
                <div className="rounded-2xl rounded-tl-md border border-line/80 bg-cream/60 px-4 py-3">
                  <span className="flex items-center gap-1.5" aria-label="Typing">
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                  </span>
                </div>
              </div>
            )}

            {error && (
              <div
                role="alert"
                className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-800"
              >
                <X className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                <div className="flex-1">
                  <p className="font-semibold">The chibi guide hit a snag.</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-red-700/90">{error}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setError(null)}
                  className="rounded-full p-1 hover:bg-red-100"
                  aria-label="Dismiss error"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            <div ref={endRef} />
          </div>
        </div>

        <div className="flex-none border-t border-line/80 bg-paper/95 px-3 pb-[max(0.6rem,env(safe-area-inset-bottom))] pt-2.5 sm:px-5 sm:pb-3">
          <form
            onSubmit={(event: FormEvent) => {
              event.preventDefault();
              void sendMessage();
            }}
            className="mx-auto max-w-3xl"
          >
            <div className="flex items-end gap-2 rounded-[22px] border border-line bg-cream/40 p-1.5 pl-4 transition focus-within:border-gold-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-gold-200/30">
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
                  isAdmissions
                    ? "Ask about the CET, requirements, or enrollment…"
                    : "Ask about grants, requirements, or where to submit…"
                }
                className="max-h-[140px] min-h-[38px] flex-1 resize-none bg-transparent py-2 text-[15px] leading-relaxed text-ink outline-none placeholder:text-muted/60"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className={`grid h-10 w-10 shrink-0 place-items-center rounded-full text-paper shadow-sm transition disabled:opacity-40 ${
                  isAdmissions ? "bg-navy-900 hover:bg-navy-800" : "bg-gold-500 hover:bg-gold-600"
                }`}
                aria-label="Send question"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-1.5 flex items-center justify-between gap-3 px-1 text-[10px] text-muted/70">
              <p>
                Unofficial guide. Confirm with the{" "}
                <a
                  className="underline decoration-gold-300 underline-offset-2 hover:text-navy-900"
                  href="https://adzu.edu.ph/about-us/admissions-aid"
                  target="_blank"
                  rel="noreferrer"
                >
                  Admissions &amp; Aid Office
                </a>
                .
              </p>
              <span className="tabular-nums">{input.length}/1000</span>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}

function MessageRow({
  message,
  config,
  index,
  isAdmissions,
  speaking,
  copied,
  onSpeak,
  onCopy,
}: {
  message: UIMessage;
  config: TrackConfig;
  index: number;
  isAdmissions: boolean;
  speaking: boolean;
  copied: boolean;
  onSpeak: () => void;
  onCopy: () => void;
}) {
  if (message.role === "user") {
    return (
      <div className="ml-auto flex max-w-[88%] animate-pop items-end justify-end gap-2 sm:max-w-[78%]">
        <div
          className={`rounded-2xl rounded-br-md px-4 py-3 text-[15px] leading-relaxed text-paper shadow-sm ${
            isAdmissions ? "bg-navy-900" : "bg-gold-600"
          }`}
        >
          {message.content}
        </div>
      </div>
    );
  }

  const chibi = config.chibis[index % 2];

  return (
    <div className="flex max-w-[92%] animate-pop items-start gap-2.5 sm:max-w-[86%]">
      <span
        className={`grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full border bg-cream ${
          isAdmissions ? "border-sky-200" : "border-gold-200"
        }`}
      >
        <Chibi variant={chibi} className="h-full w-full" />
      </span>
      <div className="min-w-0">
        <div className="mb-1 flex items-center gap-2 pl-1">
          <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
            {config.label} guide
          </span>
          {message.provider === "notes" && (
            <span className="rounded-full bg-gold-50 px-2 py-0.5 text-[9px] font-semibold text-gold-700">
              quoted notes
            </span>
          )}
        </div>
        <div className="rounded-2xl rounded-tl-md border border-line/80 bg-cream/55 px-4 py-3 text-ink shadow-sm">
          <MarkdownText text={message.content} />
        </div>

        {message.sources && message.sources.length > 0 && (
          <details className="group mt-2 rounded-xl border border-line/70 bg-paper/80 px-3 py-2">
            <summary className="flex cursor-pointer list-none items-center gap-1.5 text-[11px] font-semibold text-muted transition hover:text-navy-900">
              <BookOpenCheck className="h-3.5 w-3.5 text-gold-600" aria-hidden />
              Sources · {message.sources.length}
              <span className="ml-auto text-[10px] font-normal text-muted/60 group-open:hidden">
                show
              </span>
            </summary>
            <ol className="mt-2 space-y-2">
              {message.sources.map((source, sourceIndex) => (
                <li key={source.id} className="text-[11px] leading-relaxed">
                  <div className="flex items-start gap-2">
                    <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-gold-100 text-[9px] font-bold text-gold-800">
                      {sourceIndex + 1}
                    </span>
                    <div className="min-w-0">
                      {source.url ? (
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 font-semibold text-navy-900 underline decoration-gold-300 underline-offset-2 hover:text-navy-700"
                        >
                          {source.title}
                          <ExternalLink className="h-3 w-3 shrink-0" aria-hidden />
                        </a>
                      ) : (
                        <span className="font-semibold text-navy-900">{source.title}</span>
                      )}
                      <p className="mt-0.5 line-clamp-2 text-muted/80">{source.snippet}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </details>
        )}

        <div className="mt-1 flex items-center gap-1 pl-1">
          <button
            type="button"
            onClick={onSpeak}
            className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-medium transition hover:bg-cream ${
              speaking ? "text-gold-700" : "text-muted/70 hover:text-navy-900"
            }`}
            aria-label={speaking ? "Stop reading" : "Read this answer aloud"}
          >
            <Volume2 className="h-3 w-3" aria-hidden />
            {speaking ? "Reading…" : "Read"}
          </button>
          <button
            type="button"
            onClick={onCopy}
            className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-medium text-muted/70 transition hover:bg-cream hover:text-navy-900"
            aria-label="Copy this answer"
          >
            {copied ? <Check className="h-3 w-3 text-emerald-600" aria-hidden /> : <Copy className="h-3 w-3" aria-hidden />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>
    </div>
  );
}

function TrackSwitch({
  to,
  active,
  icon,
  title,
  subtitle,
}: {
  to: Track;
  active: boolean;
  icon: ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <Link
      href={`/chat/${to}`}
      className={`flex items-center gap-2.5 rounded-xl border px-3 py-2.5 transition ${
        active
          ? "border-gold-300 bg-gold-50/70 shadow-sm"
          : "border-line/80 bg-paper/60 hover:border-gold-200 hover:bg-cream/50"
      }`}
    >
      <span
        className={`grid h-8 w-8 place-items-center rounded-full ${
          active ? "bg-navy-900 text-paper" : "bg-cream text-ink/60"
        }`}
      >
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-xs font-semibold text-navy-950">{title}</span>
        <span className="block truncate text-[10px] text-muted">{subtitle}</span>
      </span>
      {active && <ArrowRight className="ml-auto h-3.5 w-3.5 text-gold-600" aria-hidden />}
    </Link>
  );
}
