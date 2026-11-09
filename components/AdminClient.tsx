"use client";

import {
  AlertTriangle,
  BookOpenCheck,
  CheckCircle2,
  ChevronRight,
  ClipboardPaste,
  Cloud,
  Database,
  Download,
  Eye,
  EyeOff,
  File as FileIcon,
  FileText,
  HardDrive,
  Image as ImageIcon,
  Info,
  Loader2,
  LockKeyhole,
  LogOut,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Chibi } from "./Chibi";

type Category = "admissions" | "scholarships" | "general";
type StorageMode = "blob" | "file" | "readonly";

interface AdminDoc {
  id: string;
  title: string;
  category: Category;
  sourceUrl?: string;
  sourceType?: string;
  addedAt?: string;
  updatedAt?: string;
  chars: number;
  text?: string;
}

interface Stats {
  documents: number;
  characters: number;
  byCategory: { admissions: number; scholarships: number; general: number };
  updatedAt: string;
  storage: StorageMode;
  aiConfigured: boolean;
}

interface FileItem {
  id: string;
  file: File;
  status: "ready" | "ocr" | "submitting" | "done" | "error";
  message?: string;
  ocrText?: string;
  progress?: number;
}

const MAX_BYTES = 4 * 1024 * 1024;
const ACCEPT =
  ".pdf,.docx,.txt,.md,.markdown,.csv,.json,.html,.htm,.xml,image/*";

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function uid(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);
}

function isImage(file: File): boolean {
  return file.type.startsWith("image/");
}

export function AdminClient() {
  const [checking, setChecking] = useState(true);
  const [unlocked, setUnlocked] = useState(false);
  const [key, setKey] = useState("");
  const [gateInput, setGateInput] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [gateError, setGateError] = useState<string | null>(null);
  const [gateBusy, setGateBusy] = useState(false);

  const [docs, setDocs] = useState<AdminDoc[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [storage, setStorage] = useState<StorageMode>("file");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [tab, setTab] = useState<"upload" | "paste">("upload");
  const [files, setFiles] = useState<FileItem[]>([]);
  const [pasted, setPasted] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Category>("admissions");
  const [sourceUrl, setSourceUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | Category>("all");
  const [dragging, setDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const keyRef = useRef("");

  useEffect(() => {
    keyRef.current = key;
  }, [key]);

  const lock = useCallback((message?: string) => {
    setUnlocked(false);
    setKey("");
    keyRef.current = "";
    setDocs([]);
    setStats(null);
    setGateError(message ?? null);
    try {
      sessionStorage.removeItem("adzu-admin-key");
    } catch {
      // ignore
    }
  }, []);

  const load = useCallback(
    async (candidate: string, silent = false) => {
      if (!silent) setGateBusy(true);
      setGateError(null);
      try {
        const response = await fetch("/api/kb?full=1", {
          headers: { "x-admin-key": candidate },
          cache: "no-store",
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "That passcode did not work.");
        }
        setKey(candidate);
        keyRef.current = candidate;
        setUnlocked(true);
        setDocs(data.documents ?? []);
        setStats(data.stats ?? null);
        setStorage(data.storage ?? "file");
        try {
          sessionStorage.setItem("adzu-admin-key", candidate);
        } catch {
          // ignore
        }
      } catch (error) {
        if (!silent) {
          setGateError(error instanceof Error ? error.message : "Could not unlock.");
        }
        setUnlocked(false);
      } finally {
        setGateBusy(false);
        setChecking(false);
      }
    },
    [],
  );

  useEffect(() => {
    let saved = "";
    try {
      saved = sessionStorage.getItem("adzu-admin-key") ?? "";
    } catch {
      // ignore
    }
    if (saved) void load(saved, true);
    else setChecking(false);
  }, [load]);

  const refresh = useCallback(async (quiet = false) => {
    if (!keyRef.current) return;
    if (!quiet) setRefreshing(true);
    try {
      const response = await fetch("/api/kb?full=1", {
        headers: { "x-admin-key": keyRef.current },
        cache: "no-store",
      });
      if (response.status === 401) {
        lock("Your admin session expired. Please enter the passcode again.");
        return;
      }
      const data = await response.json();
      setDocs(data.documents ?? []);
      setStats(data.stats ?? null);
      setStorage(data.storage ?? "file");
    } catch {
      // keep existing docs
    } finally {
      setRefreshing(false);
    }
  }, [lock]);

  const runOcr = useCallback(async (item: FileItem) => {
    setFiles((current) =>
      current.map((entry) =>
        entry.id === item.id
          ? { ...entry, status: "ocr", progress: 0, message: "Loading OCR engine…" }
          : entry,
      ),
    );
    try {
      const { createWorker } = await import("tesseract.js");
      const worker = await createWorker("eng", undefined, {
        logger: (message) => {
          if (message.status === "recognizing text") {
            setFiles((current) =>
              current.map((entry) =>
                entry.id === item.id
                  ? {
                      ...entry,
                      progress: Math.round((message.progress ?? 0) * 100),
                      message: "Reading the image…",
                    }
                  : entry,
              ),
            );
          }
        },
      });
      const result = await worker.recognize(item.file);
      await worker.terminate();
      const text = result.data.text.trim();
      setFiles((current) =>
        current.map((entry) =>
          entry.id === item.id
            ? {
                ...entry,
                status: text ? "ready" : "error",
                ocrText: text,
                progress: 100,
                message: text
                  ? "Text extracted. Review it below."
                  : "No readable text found. Try a clearer image.",
              }
            : entry,
        ),
      );
    } catch (error) {
      setFiles((current) =>
        current.map((entry) =>
          entry.id === item.id
            ? {
                ...entry,
                status: "error",
                message:
                  error instanceof Error
                    ? `OCR failed: ${error.message}`
                    : "OCR failed. You can paste the text instead.",
              }
            : entry,
        ),
      );
    }
  }, []);

  const addFiles = useCallback(
    (incoming: FileList | File[]) => {
      const accepted: FileItem[] = [];
      const rejected: string[] = [];
      for (const file of Array.from(incoming)) {
        if (file.size > MAX_BYTES) {
          rejected.push(`${file.name} is over 4 MB`);
          continue;
        }
        const ext = file.name.toLowerCase().split(".").pop() ?? "";
        const supported =
          file.type.startsWith("image/") ||
          ["pdf", "docx", "txt", "md", "markdown", "csv", "json", "html", "htm", "xml"].includes(ext);
        if (!supported) {
          rejected.push(`${file.name} is not a supported type`);
          continue;
        }
        accepted.push({ id: uid(), file, status: "ready" });
      }
      if (rejected.length) setSubmitError(rejected.join(" · "));
      if (!accepted.length) return;
      setSubmitError(null);
      setSubmitMessage(null);
      setFiles((current) => [...current, ...accepted]);
      for (const item of accepted) {
        if (isImage(item.file)) void runOcr(item);
      }
    },
    [runOcr],
  );

  const removeFile = (id: string) => {
    setFiles((current) => current.filter((item) => item.id !== id));
  };

  const submit = async () => {
    if (submitting) return;
    setSubmitError(null);
    setSubmitMessage(null);

    const uploadTargets = files.filter(
      (item) => item.status === "ready" || item.status === "error",
    );
    if (tab === "upload" && !uploadTargets.length) {
      setSubmitError("Add at least one file first.");
      return;
    }
    if (tab === "paste" && pasted.trim().length < 30) {
      setSubmitError("Paste at least a paragraph of text.");
      return;
    }
    if (storage === "readonly") {
      setSubmitError(
        "This deployment is read-only for uploads. Connect Vercel Blob (BLOB_READ_WRITE_TOKEN) or run locally to save new notes.",
      );
      return;
    }

    setSubmitting(true);
    let succeeded = 0;
    let failed = 0;

    const targets: Array<{ item?: FileItem; text?: string; name: string }> =
      tab === "upload"
        ? uploadTargets.map((item) => ({
            item,
            text: item.ocrText,
            name: item.file.name.replace(/\.[^.]+$/, ""),
          }))
        : [
            {
              text: pasted,
              name:
                title.trim() ||
                `Pasted note — ${new Date().toLocaleDateString("en-PH", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}`,
            },
          ];

    for (const target of targets) {
      if (target.item) {
        if (isImage(target.item.file) && !target.item.ocrText) {
          failed += 1;
          setFiles((current) =>
            current.map((entry) =>
              entry.id === target.item?.id
                ? {
                    ...entry,
                    status: "error",
                    message: "Image has no extracted text. Retry OCR or paste the text.",
                  }
                : entry,
            ),
          );
          continue;
        }
        setFiles((current) =>
          current.map((entry) =>
            entry.id === target.item?.id
              ? { ...entry, status: "submitting", message: "Adding to the notes…" }
              : entry,
          ),
        );
      }

      const form = new FormData();
      if (target.item) form.append("file", target.item.file);
      if (target.text) form.append("text", target.text);
      const resolvedTitle =
        titles(targets.length, title, target.name);
      form.append("title", resolvedTitle);
      form.append("category", category);
      if (sourceUrl.trim()) form.append("sourceUrl", sourceUrl.trim());

      try {
        const response = await fetch("/api/ingest", {
          method: "POST",
          headers: { "x-admin-key": keyRef.current },
          body: form,
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Could not add this document.");
        }
        succeeded += 1;
        if (target.item) {
          setFiles((current) =>
            current.map((entry) =>
              entry.id === target.item?.id
                ? { ...entry, status: "done", message: `Added as ${data.document.title}` }
                : entry,
            ),
          );
        }
      } catch (error) {
        failed += 1;
        const message = error instanceof Error ? error.message : "Could not add this document.";
        if (target.item) {
          setFiles((current) =>
            current.map((entry) =>
              entry.id === target.item?.id
                ? { ...entry, status: "error", message }
                : entry,
            ),
          );
        } else {
          setSubmitError(message);
        }
      }
    }

    setSubmitting(false);
    await refresh(true);
    if (succeeded) {
      setSubmitMessage(
        `${succeeded} document${succeeded === 1 ? "" : "s"} added. The chibis can use it right away.`,
      );
      setFiles((current) => current.filter((item) => item.status !== "done"));
      if (tab === "paste") setPasted("");
      setTitle("");
    }
    if (failed && !succeeded) {
      setSubmitError("Nothing was added. Check the file messages below.");
    }
  };

  const deleteDoc = async (doc: AdminDoc) => {
    if (!window.confirm(`Remove “${doc.title}” from the knowledge base?`)) return;
    try {
      const response = await fetch(`/api/kb?id=${encodeURIComponent(doc.id)}`, {
        method: "DELETE",
        headers: { "x-admin-key": keyRef.current },
      });
      const data = await response.json();
      if (response.status === 401) {
        lock("Your admin session expired. Please enter the passcode again.");
        return;
      }
      if (!response.ok) throw new Error(data.error || "Could not delete.");
      setDocs(data.documents ?? []);
      setStats(data.stats ?? null);
      setSubmitMessage(`Removed “${doc.title}”.`);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Could not delete.");
    }
  };

  const exportKb = () => {
    const payload = {
      version: 1,
      updatedAt: stats?.updatedAt ?? new Date().toISOString(),
      documents: docs,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `adzu-kb-export-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const filtered = docs.filter((doc) => {
    const matchesFilter = filter === "all" || doc.category === filter;
    const haystack = `${doc.title} ${doc.text ?? ""}`.toLowerCase();
    return matchesFilter && (!search.trim() || haystack.includes(search.toLowerCase()));
  });

  if (checking) {
    return (
      <main className="grid min-h-[60dvh] place-items-center px-4">
        <div className="flex items-center gap-3 rounded-full border border-line bg-paper px-5 py-3 text-sm text-muted shadow-card">
          <Loader2 className="h-4 w-4 animate-spin text-gold-600" aria-hidden />
          Opening the content desk…
        </div>
      </main>
    );
  }

  if (!unlocked) {
    return (
      <main className="mx-auto grid min-h-[75dvh] max-w-6xl place-items-center px-4 py-10">
        <div className="paper-card w-full max-w-md p-7">
          <div className="flex items-center gap-3">
            <span className="grid h-14 w-14 place-items-center overflow-hidden rounded-full border border-gold-300 bg-cream">
              <Chibi variant="director" className="h-full w-full" />
            </span>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-700">
                Staff only
              </p>
              <h1 className="font-display text-2xl font-semibold text-navy-950">
                Content desk
              </h1>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Add the PDFs, forms, memos, and notes the chibis are allowed to use.
            The public chat will answer only from this knowledge base.
          </p>

          <form
            className="mt-6"
            onSubmit={(event) => {
              event.preventDefault();
              if (gateInput.trim()) void load(gateInput.trim());
            }}
          >
            <label htmlFor="passcode" className="label">
              Admin passcode
            </label>
            <div className="relative">
              <input
                id="passcode"
                type={showPass ? "text" : "password"}
                value={gateInput}
                onChange={(event) => setGateInput(event.target.value)}
                className="field pr-12"
                placeholder="Enter passcode"
                autoComplete="current-password"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPass((value) => !value)}
                className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full text-muted hover:bg-cream"
                aria-label={showPass ? "Hide passcode" : "Show passcode"}
              >
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {gateError && (
              <p className="mt-2 flex items-start gap-1.5 text-xs text-red-700" role="alert">
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                {gateError}
              </p>
            )}

            <button type="submit" className="btn-primary mt-4 w-full" disabled={gateBusy}>
              {gateBusy ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              ) : (
                <LockKeyhole className="h-4 w-4" aria-hidden />
              )}
              Unlock content desk
            </button>
          </form>

          <p className="mt-4 rounded-xl bg-cream/70 p-3 text-[11px] leading-relaxed text-muted">
            <strong className="text-ink/80">Local default:</strong>{" "}
            <code>adzu-admin</code> when <code>ADMIN_PASSCODE</code> is not set.
            Set a real passcode before deploying.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-7 sm:px-6 sm:py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-700">
            Staff content desk
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-navy-950 sm:text-4xl">
            Teach the chibis.
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
            Upload official pages, forms, PDFs, images, or paste notes. The
            public assistant retrieves from this library and cites it.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <StorageBadge storage={storage} />
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold ${
              stats?.aiConfigured
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-gold-200 bg-gold-50 text-gold-800"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            {stats?.aiConfigured ? "AI answers on" : "Notes mode"}
          </span>
          <button type="button" onClick={() => lock()} className="btn-ghost !px-3 !py-2 text-xs">
            <LogOut className="h-3.5 w-3.5" aria-hidden />
            Lock
          </button>
        </div>
      </div>

      {storage === "readonly" && (
        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs leading-relaxed text-amber-900">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          <p>
            <strong>Read-only deployment.</strong> The built-in notes are
            available, but new uploads will not persist. Connect a Vercel Blob
            store and set <code>BLOB_READ_WRITE_TOKEN</code> to save staff
            uploads, or run the app locally.
          </p>
        </div>
      )}

      {!stats?.aiConfigured && (
        <div className="mt-3 flex items-start gap-3 rounded-2xl border border-sky-200 bg-sky-50 p-4 text-xs leading-relaxed text-sky-900">
          <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          <p>
            <strong>Notes mode.</strong> No AI provider key is set, so the chat
            quotes the most relevant notes with citations instead of generating
            prose. Add an OpenRouter, Gemini, Groq, or OpenAI-compatible key in
            the environment to turn on generative answers.
          </p>
        </div>
      )}

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Documents" value={stats?.documents ?? 0} icon={<FileText className="h-4 w-4" />} />
        <StatCard label="Admissions" value={stats?.byCategory.admissions ?? 0} icon={<BookOpenCheck className="h-4 w-4" />} />
        <StatCard label="Scholarships" value={stats?.byCategory.scholarships ?? 0} icon={<Sparkles className="h-4 w-4" />} />
        <StatCard
          label="Characters"
          value={(stats?.characters ?? 0).toLocaleString()}
          icon={<Database className="h-4 w-4" />}
        />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="paper-card overflow-hidden">
          <div className="border-b border-line/80 px-5 py-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gold-700">
                  Add knowledge
                </p>
                <h2 className="mt-1 font-display text-xl font-semibold text-navy-950">
                  Feed the notes
                </h2>
              </div>
              <span className="rounded-full bg-cream px-2.5 py-1 text-[10px] font-medium text-muted">
                Max 4 MB / file
              </span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-1 rounded-xl border border-line bg-cream/40 p-1">
              <button
                type="button"
                onClick={() => setTab("upload")}
                className={`flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                  tab === "upload" ? "bg-paper text-navy-950 shadow-sm" : "text-muted hover:text-ink"
                }`}
              >
                <UploadCloud className="h-3.5 w-3.5" aria-hidden />
                Upload files
              </button>
              <button
                type="button"
                onClick={() => setTab("paste")}
                className={`flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                  tab === "paste" ? "bg-paper text-navy-950 shadow-sm" : "text-muted hover:text-ink"
                }`}
              >
                <ClipboardPaste className="h-3.5 w-3.5" aria-hidden />
                Paste text
              </button>
            </div>
          </div>

          <div className="p-5">
            {tab === "upload" ? (
              <>
                <div
                  onDragOver={(event) => {
                    event.preventDefault();
                    setDragging(true);
                  }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={(event) => {
                    event.preventDefault();
                    setDragging(false);
                    addFiles(event.dataTransfer.files);
                  }}
                  className={`rounded-2xl border-2 border-dashed p-6 text-center transition ${
                    dragging
                      ? "border-gold-400 bg-gold-50"
                      : "border-line bg-cream/30 hover:border-gold-300 hover:bg-gold-50/40"
                  }`}
                >
                  <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-paper text-gold-700 shadow-sm">
                    <UploadCloud className="h-5 w-5" aria-hidden />
                  </span>
                  <p className="mt-3 text-sm font-semibold text-navy-950">
                    Drop PDFs, DOCX, text, or images here
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    Images are read with OCR in your browser. PDFs and DOCX are
                    parsed on the server.
                  </p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="btn-ghost mt-3 !text-xs"
                  >
                    <Plus className="h-3.5 w-3.5" aria-hidden />
                    Choose files
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept={ACCEPT}
                    className="sr-only"
                    onChange={(event) => {
                      if (event.target.files) addFiles(event.target.files);
                      event.target.value = "";
                    }}
                  />
                </div>

                {files.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {files.map((item) => (
                      <FileRow
                        key={item.id}
                        item={item}
                        onRemove={() => removeFile(item.id)}
                        onRetry={() => void runOcr(item)}
                        onTextChange={(text) =>
                          setFiles((current) =>
                            current.map((entry) =>
                              entry.id === item.id ? { ...entry, ocrText: text } : entry,
                            ),
                          )
                        }
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div>
                <label htmlFor="paste-text" className="label">
                  Text to add
                </label>
                <textarea
                  id="paste-text"
                  value={pasted}
                  onChange={(event) => setPasted(event.target.value)}
                  rows={9}
                  placeholder="Paste a memo, an FAQ, a scholarship bulletin, or notes from a briefing…"
                  className="field resize-y"
                />
                <p className="mt-1 text-right text-[10px] text-muted">
                  {pasted.length.toLocaleString()} characters
                </p>
              </div>
            )}

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="doc-title" className="label">
                  Title (optional)
                </label>
                <input
                  id="doc-title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  className="field"
                  placeholder="e.g. CET memo — Nov 2026"
                />
              </div>
              <div>
                <label htmlFor="doc-category" className="label">
                  Desk
                </label>
                <select
                  id="doc-category"
                  value={category}
                  onChange={(event) => setCategory(event.target.value as Category)}
                  className="field"
                >
                  <option value="admissions">Admissions</option>
                  <option value="scholarships">Scholarships</option>
                  <option value="general">General / both</option>
                </select>
              </div>
            </div>

            <div className="mt-3">
              <label htmlFor="doc-source" className="label">
                Source URL (optional)
              </label>
              <input
                id="doc-source"
                value={sourceUrl}
                onChange={(event) => setSourceUrl(event.target.value)}
                className="field"
                placeholder="https://adzu.edu.ph/…"
                inputMode="url"
              />
            </div>

            {submitError && (
              <p className="mt-3 flex items-start gap-1.5 rounded-xl bg-red-50 p-3 text-xs leading-relaxed text-red-700" role="alert">
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
                {submitError}
              </p>
            )}
            {submitMessage && (
              <p className="mt-3 flex items-start gap-1.5 rounded-xl bg-emerald-50 p-3 text-xs leading-relaxed text-emerald-800" role="status">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
                {submitMessage}
              </p>
            )}

            <button
              type="button"
              onClick={() => void submit()}
              disabled={submitting}
              className="btn-primary mt-4 w-full"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              ) : (
                <Sparkles className="h-4 w-4" aria-hidden />
              )}
              {submitting ? "Adding to the notes…" : "Add to knowledge base"}
            </button>
            <p className="mt-2 text-center text-[10px] leading-relaxed text-muted">
              Only add content you are allowed to use. The public chat can quote
              it.
            </p>
          </div>
        </section>

        <section className="paper-card overflow-hidden">
          <div className="border-b border-line/80 px-5 py-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gold-700">
                  Knowledge library
                </p>
                <h2 className="mt-1 font-display text-xl font-semibold text-navy-950">
                  What the chibis know
                </h2>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => void refresh()}
                  className="grid h-9 w-9 place-items-center rounded-full border border-line text-muted transition hover:border-gold-300 hover:text-navy-900"
                  aria-label="Refresh library"
                  title="Refresh"
                >
                  <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                </button>
                <button
                  type="button"
                  onClick={exportKb}
                  className="grid h-9 w-9 place-items-center rounded-full border border-line text-muted transition hover:border-gold-300 hover:text-navy-900"
                  aria-label="Export knowledge base as JSON"
                  title="Export JSON"
                >
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted/60" aria-hidden />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="field !py-2.5 !pl-8 !text-xs"
                  placeholder="Search titles and text…"
                  aria-label="Search knowledge base"
                />
              </div>
              <select
                value={filter}
                onChange={(event) => setFilter(event.target.value as typeof filter)}
                className="field !w-auto !py-2.5 !text-xs"
                aria-label="Filter by desk"
              >
                <option value="all">All desks</option>
                <option value="admissions">Admissions</option>
                <option value="scholarships">Scholarships</option>
                <option value="general">General</option>
              </select>
            </div>
          </div>

          <div className="max-h-[740px] overflow-y-auto chat-scroll p-3">
            {loading ? (
              <div className="grid place-items-center py-16 text-sm text-muted">
                <Loader2 className="mb-2 h-5 w-5 animate-spin text-gold-600" />
                Loading notes…
              </div>
            ) : filtered.length === 0 ? (
              <div className="px-4 py-14 text-center">
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-cream text-gold-700">
                  <FileText className="h-5 w-5" aria-hidden />
                </span>
                <p className="mt-3 text-sm font-semibold text-navy-950">No documents found</p>
                <p className="mt-1 text-xs text-muted">
                  Try a different search, or add the first note on the left.
                </p>
              </div>
            ) : (
              <ul className="space-y-2">
                {filtered.map((doc) => (
                  <li key={doc.id}>
                    <details className="group rounded-2xl border border-line/80 bg-paper/75 transition hover:border-gold-200 open:border-gold-300 open:bg-paper">
                      <summary className="flex cursor-pointer list-none items-start gap-3 p-3.5">
                        <span className={`mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full ${categoryStyle(doc.category)}`}>
                          {doc.sourceType === "upload" ? (
                            <FileIcon className="h-4 w-4" aria-hidden />
                          ) : (
                            <FileText className="h-4 w-4" aria-hidden />
                          )}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex flex-wrap items-center gap-1.5">
                            <span className="text-[13px] font-semibold leading-snug text-navy-950">
                              {doc.title}
                            </span>
                            <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.08em] ${categoryBadge(doc.category)}`}>
                              {doc.category}
                            </span>
                          </span>
                          <span className="mt-1 block text-[10px] text-muted">
                            {doc.chars.toLocaleString()} chars
                            {doc.addedAt
                              ? ` · ${new Date(doc.addedAt).toLocaleDateString("en-PH", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}`
                              : ""}
                          </span>
                        </span>
                        <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-muted/50 transition group-open:rotate-90" aria-hidden />
                      </summary>
                      <div className="border-t border-line/70 px-3.5 pb-3.5 pt-3">
                        <div className="max-h-56 overflow-y-auto rounded-xl bg-cream/50 p-3 text-[11px] leading-relaxed text-ink/75 whitespace-pre-wrap">
                          {doc.text || "No text preview available."}
                        </div>
                        <div className="mt-2.5 flex flex-wrap items-center gap-2">
                          {doc.sourceUrl && (
                            <a
                              href={doc.sourceUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 rounded-full border border-line px-2.5 py-1 text-[10px] font-medium text-ink/70 hover:border-gold-300 hover:text-navy-900"
                            >
                              Open source
                              <ChevronRight className="h-3 w-3" aria-hidden />
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={() => void deleteDoc(doc)}
                            className="ml-auto inline-flex items-center gap-1 rounded-full border border-red-200 px-2.5 py-1 text-[10px] font-medium text-red-700 transition hover:bg-red-50"
                          >
                            <Trash2 className="h-3 w-3" aria-hidden />
                            Remove
                          </button>
                        </div>
                      </div>
                    </details>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>

      <section className="mt-5 grid gap-3 sm:grid-cols-3">
        <HelpCard
          icon={<FileText className="h-4 w-4" />}
          title="What gets parsed"
          body="PDF and DOCX text is extracted on the server. Images are OCR'd in your browser before upload. TXT, MD, CSV, JSON, HTML, and XML are read as text."
        />
        <HelpCard
          icon={<BookOpenCheck className="h-4 w-4" />}
          title="How answers use it"
          body="The chat retrieves the closest passages for the chosen desk and asks the model to answer only from them, with numbered source citations."
        />
        <HelpCard
          icon={<ShieldCheck className="h-4 w-4" />}
          title="Keep it safe"
          body="Scanned PDFs with no selectable text need page images or pasted text. Remove outdated notes so the chibis don't quote them. Set a real ADMIN_PASSCODE before deploying."
        />
      </section>
    </main>
  );
}

function titles(count: number, baseTitle: string, fallback: string): string {
  const clean = baseTitle.trim();
  if (!clean) return fallback;
  if (count === 1) return clean;
  return `${clean} — ${fallback}`;
}

function categoryStyle(category: Category): string {
  if (category === "admissions") return "bg-sky-100 text-navy-800";
  if (category === "scholarships") return "bg-gold-100 text-gold-800";
  return "bg-cream text-ink/60";
}

function categoryBadge(category: Category): string {
  if (category === "admissions") return "bg-sky-50 text-navy-700";
  if (category === "scholarships") return "bg-gold-50 text-gold-700";
  return "bg-cream text-muted";
}

function StorageBadge({ storage }: { storage: StorageMode }) {
  const config = {
    blob: { label: "Vercel Blob", icon: Cloud, cls: "border-emerald-200 bg-emerald-50 text-emerald-800" },
    file: { label: "Local file", icon: HardDrive, cls: "border-sky-200 bg-sky-50 text-sky-800" },
    readonly: { label: "Read-only", icon: AlertTriangle, cls: "border-amber-200 bg-amber-50 text-amber-800" },
  }[storage];
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold ${config.cls}`}>
      <Icon className="h-3.5 w-3.5" aria-hidden />
      {config.label}
    </span>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number | string;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-line/80 bg-paper/80 p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
          {label}
        </span>
        <span className="grid h-8 w-8 place-items-center rounded-full bg-cream text-gold-700">
          {icon}
        </span>
      </div>
      <p className="mt-2 font-display text-2xl font-semibold text-navy-950">{value}</p>
    </div>
  );
}

function HelpCard({
  icon,
  title,
  body,
}: {
  icon: ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-line/80 bg-paper/70 p-4">
      <span className="grid h-8 w-8 place-items-center rounded-full bg-cream text-gold-700">
        {icon}
      </span>
      <p className="mt-2.5 text-sm font-semibold text-navy-950">{title}</p>
      <p className="mt-1 text-[11px] leading-relaxed text-muted">{body}</p>
    </div>
  );
}

function FileRow({
  item,
  onRemove,
  onRetry,
  onTextChange,
}: {
  item: FileItem;
  onRemove: () => void;
  onRetry: () => void;
  onTextChange: (text: string) => void;
}) {
  const image = isImage(item.file);
  return (
    <div className="rounded-2xl border border-line/80 bg-paper/70 p-3">
      <div className="flex items-start gap-2.5">
        <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-cream text-navy-800">
          {image ? <ImageIcon className="h-4 w-4" aria-hidden /> : <FileText className="h-4 w-4" aria-hidden />}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold text-navy-950">{item.file.name}</p>
          <p className="text-[10px] text-muted">
            {formatSize(item.file.size)} · {item.file.type || "unknown type"}
          </p>
          {item.status === "ocr" && (
            <div className="mt-2">
              <div className="h-1.5 overflow-hidden rounded-full bg-line">
                <div
                  className="h-full rounded-full bg-gold-400 transition-all"
                  style={{ width: `${item.progress ?? 5}%` }}
                />
              </div>
              <p className="mt-1 text-[10px] text-gold-700">
                OCR {item.progress ? `${item.progress}%` : "starting"}…
              </p>
            </div>
          )}
          {item.message && item.status !== "ocr" && (
            <p
              className={`mt-1 text-[10px] ${
                item.status === "error"
                  ? "text-red-700"
                  : item.status === "done"
                    ? "text-emerald-700"
                    : "text-muted"
              }`}
            >
              {item.message}
            </p>
          )}
          {image && item.ocrText && (
            <details className="mt-2">
              <summary className="cursor-pointer text-[10px] font-semibold text-gold-800">
                Review extracted text
              </summary>
              <textarea
                value={item.ocrText}
                onChange={(event) => onTextChange(event.target.value)}
                rows={5}
                className="field mt-2 !text-[11px]"
              />
            </details>
          )}
          {image && item.status === "error" && (
            <button type="button" onClick={onRetry} className="mt-2 text-[10px] font-semibold text-gold-800 underline">
              Retry OCR
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="rounded-full p-1.5 text-muted transition hover:bg-red-50 hover:text-red-700"
          aria-label={`Remove ${item.file.name}`}
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
