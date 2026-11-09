"use client";

import {
  AlertTriangle,
  BookOpenCheck,
  CheckCircle2,
  ClipboardPaste,
  Cloud,
  Database,
  Download,
  Eye,
  EyeOff,
  FilePlus2,
  FileText,
  HardDrive,
  Info,
  Loader2,
  LockKeyhole,
  LogOut,
  Pencil,
  RefreshCw,
  Search,
  Trash2,
  UploadCloud,
  Users,
  X,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react";
import { Chibi } from "./Chibi";
import { STAFF, STAFF_LIST } from "@/lib/staff";
import type { Category, DocumentStatus, Gap, StaffId } from "@/lib/types";

type StorageMode = "blob" | "file" | "readonly";
type Tab = "add" | "library" | "gaps" | "team";
type AddMode = "guided" | "upload" | "paste";

interface AdminDoc {
  id: string;
  title: string;
  category: Category;
  sourceUrl?: string;
  sourceType?: string;
  status: DocumentStatus;
  addedAt?: string;
  updatedAt?: string;
  chars: number;
  text?: string;
}

interface Stats {
  documents: number;
  published: number;
  drafts: number;
  characters: number;
  byCategory: { admissions: number; scholarships: number; general: number };
  updatedAt: string;
  storage: StorageMode;
  aiMode: "configured" | "free" | "off";
  aiLabel: string;
}

interface GapStats {
  open: number;
  total: number;
}

const MAX_BYTES = 4 * 1024 * 1024;
const ACCEPT = ".pdf,.docx,.txt,.md,.markdown,.csv,.json,.html,.htm,.xml,image/*";

function formatDate(value?: string): string {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleDateString("en-PH", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-PH").format(value);
}

function deskLabel(category: Category): string {
  if (category === "admissions") return "Admissions";
  if (category === "scholarships") return "Scholarships";
  return "General";
}

function statusLabel(status: DocumentStatus): string {
  return status === "published" ? "Published" : "Draft";
}

export function AdminDesk() {
  const [checking, setChecking] = useState(true);
  const [unlocked, setUnlocked] = useState(false);
  const [gateInput, setGateInput] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [gateError, setGateError] = useState<string | null>(null);
  const [gateBusy, setGateBusy] = useState(false);

  const [docs, setDocs] = useState<AdminDoc[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [gaps, setGaps] = useState<Gap[]>([]);
  const [gapStats, setGapStats] = useState<GapStats>({ open: 0, total: 0 });
  const [storage, setStorage] = useState<StorageMode>("file");
  const [refreshing, setRefreshing] = useState(false);

  const [tab, setTab] = useState<Tab>("add");
  const [mode, setMode] = useState<AddMode>("guided");
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [draftTitle, setDraftTitle] = useState("");
  const [draftCategory, setDraftCategory] = useState<Category>("admissions");
  const [draftSource, setDraftSource] = useState("");
  const [draftText, setDraftText] = useState("");

  const [gTitle, setGTitle] = useState("");
  const [gCategory, setGCategory] = useState<Category>("admissions");
  const [gAnswer, setGAnswer] = useState("");
  const [gSteps, setGSteps] = useState("");
  const [gRequirements, setGRequirements] = useState("");
  const [gFee, setGFee] = useState("");
  const [gWho, setGWho] = useState<StaffId>("director");
  const [gSource, setGSource] = useState("");

  const [file, setFile] = useState<File | null>(null);
  const [fileKind, setFileKind] = useState("");
  const [filePages, setFilePages] = useState<number | null>(null);
  const [extracting, setExtracting] = useState(false);
  const [extractProgress, setExtractProgress] = useState(0);
  const [extractMessage, setExtractMessage] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const [search, setSearch] = useState("");
  const [deskFilter, setDeskFilter] = useState<"all" | Category>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | DocumentStatus>("all");

  const [editing, setEditing] = useState<AdminDoc | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState<Category>("admissions");
  const [editSource, setEditSource] = useState("");
  const [editText, setEditText] = useState("");
  const [editStatus, setEditStatus] = useState<DocumentStatus>("draft");
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const keyRef = useRef("");

  const lock = useCallback((message?: string) => {
    setUnlocked(false);
    keyRef.current = "";
    setDocs([]);
    setStats(null);
    setGaps([]);
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
        const adminConfirmed = data.admin === true;
        if (!response.ok || !adminConfirmed) {
          throw new Error(data.error || "That passcode did not work.");
        }
        keyRef.current = candidate;
        setUnlocked(true);
        setDocs(data.documents ?? []);
        setStats(data.stats ?? null);
        setStorage(data.storage ?? "file");
        setGapStats(data.gaps ?? { open: 0, total: 0 });
        try {
          sessionStorage.setItem("adzu-admin-key", candidate);
        } catch {
          // ignore
        }
        const gapResponse = await fetch("/api/gaps", {
          headers: { "x-admin-key": candidate },
          cache: "no-store",
        });
        if (gapResponse.ok) {
          const gapData = await gapResponse.json();
          setGaps(gapData.gaps ?? []);
          setGapStats(gapData.stats ?? { open: 0, total: 0 });
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
      const [kbResponse, gapResponse] = await Promise.all([
        fetch("/api/kb?full=1", {
          headers: { "x-admin-key": keyRef.current },
          cache: "no-store",
        }),
        fetch("/api/gaps", {
          headers: { "x-admin-key": keyRef.current },
          cache: "no-store",
        }),
      ]);
      if (kbResponse.status === 401) {
        lock("Your staff session expired. Enter the passcode again.");
        return;
      }
      if (kbResponse.ok) {
        const data = await kbResponse.json();
        setDocs(data.documents ?? []);
        setStats(data.stats ?? null);
        setStorage(data.storage ?? "file");
      }
      if (gapResponse.ok) {
        const data = await gapResponse.json();
        setGaps(data.gaps ?? []);
        setGapStats(data.stats ?? { open: 0, total: 0 });
      }
    } catch {
      // keep existing data
    } finally {
      setRefreshing(false);
    }
  }, [lock]);

  const composedGuided = useMemo(() => {
    if (
      !gTitle.trim() &&
      !gAnswer.trim() &&
      !gSteps.trim() &&
      !gRequirements.trim() &&
      !gFee.trim()
    ) {
      return "";
    }
    const who = STAFF[gWho];
    return [
      gTitle.trim() ? `Question: ${gTitle.trim()}` : "",
      `Desk: ${deskLabel(gCategory)}`,
      `Who handles it: ${who.name} (${who.role})`,
      gAnswer.trim() ? `Short answer:\n${gAnswer.trim()}` : "",
      gSteps.trim() ? `Steps or details:\n${gSteps.trim()}` : "",
      gRequirements.trim()
        ? `Requirements:\n${gRequirements
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean)
            .map((line) => (line.startsWith("-") ? line : `- ${line}`))
            .join("\n")}`
        : "",
      gFee.trim() ? `Fee or deadline:\n${gFee.trim()}` : "",
      gSource.trim() ? `Source: ${gSource.trim()}` : "",
    ]
      .filter(Boolean)
      .join("\n\n");
  }, [gTitle, gCategory, gAnswer, gSteps, gRequirements, gFee, gWho, gSource]);

  const resetAdd = () => {
    setDraftTitle("");
    setDraftCategory("admissions");
    setDraftSource("");
    setDraftText("");
    setGTitle("");
    setGCategory("admissions");
    setGAnswer("");
    setGSteps("");
    setGRequirements("");
    setGFee("");
    setGWho("director");
    setGSource("");
    setFile(null);
    setFileKind("");
    setFilePages(null);
    setExtractMessage(null);
    setExtractProgress(0);
    setSaveError(null);
  };

  const saveNote = async (input: {
    title: string;
    category: Category;
    sourceUrl?: string;
    text: string;
    status: DocumentStatus;
    sourceType: "upload" | "note";
  }) => {
    if (!input.title.trim()) {
      setSaveError("Give the note a title.");
      return;
    }
    if (input.text.trim().length < 30) {
      setSaveError("The note is too short. Add at least a paragraph.");
      return;
    }
    setSaving(true);
    setSaveError(null);
    setSaveMessage(null);
    try {
      const response = await fetch("/api/ingest", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-admin-key": keyRef.current,
        },
        body: JSON.stringify({
          title: input.title.trim(),
          category: input.category,
          sourceUrl: input.sourceUrl?.trim() || undefined,
          text: input.text,
          status: input.status,
          sourceType: input.sourceType,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not save the note.");
      setSaveMessage(
        input.status === "published"
          ? "Published. The chat can use it now."
          : "Saved as a draft. Publish it when you're ready.",
      );
      resetAdd();
      await refresh(true);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Could not save the note.");
    } finally {
      setSaving(false);
    }
  };

  const publishDraft = (status: DocumentStatus) => {
    void saveNote({
      title: draftTitle,
      category: draftCategory,
      sourceUrl: draftSource,
      text: draftText,
      status,
      sourceType: mode === "upload" ? "upload" : "note",
    });
  };

  const publishGuided = (status: DocumentStatus) => {
    void saveNote({
      title: gTitle,
      category: gCategory,
      sourceUrl: gSource,
      text: composedGuided,
      status,
      sourceType: "note",
    });
  };

  const extractFile = async (picked: File) => {
    setSaveError(null);
    setSaveMessage(null);
    setExtractMessage(null);
    setExtractProgress(0);
    if (picked.size > MAX_BYTES) {
      setExtractMessage("That file is larger than 4 MB.");
      return;
    }
    setFile(picked);
    setExtracting(true);
    setDraftTitle(picked.name.replace(/\.[a-z0-9]+$/i, "").replace(/[_-]+/g, " "));

    try {
      if (picked.type.startsWith("image/")) {
        setExtractMessage("Reading the image in your browser…");
        const { createWorker } = await import("tesseract.js");
        const worker = await createWorker("eng", undefined, {
          logger: (message) => {
            if (message.status === "recognizing text") {
              setExtractProgress(Math.round((message.progress ?? 0) * 100));
              setExtractMessage("Reading the image…");
            }
          },
        });
        const result = await worker.recognize(picked);
        await worker.terminate();
        const text = result.data.text.trim();
        if (!text) throw new Error("No readable text found. Try a clearer image.");
        setDraftText(text);
        setFileKind("image ocr");
        setExtractMessage("Text extracted. Review it below before publishing.");
      } else {
        setExtractMessage("Reading the file…");
        const form = new FormData();
        form.append("file", picked);
        form.append("preview", "1");
        const response = await fetch("/api/ingest?preview=1", {
          method: "POST",
          headers: { "x-admin-key": keyRef.current },
          body: form,
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Could not read the file.");
        setDraftText(data.text ?? "");
        setDraftTitle(data.title || picked.name);
        setFileKind(data.kind ?? "");
        setFilePages(typeof data.pages === "number" ? data.pages : null);
        setExtractMessage(
          data.pages
            ? `Read ${data.pages} page${data.pages === 1 ? "" : "s"}. Review it below.`
            : "Text extracted. Review it below before publishing.",
        );
      }
    } catch (error) {
      setExtractMessage(
        error instanceof Error ? error.message : "Could not read that file.",
      );
    } finally {
      setExtracting(false);
    }
  };

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const picked = event.target.files?.[0];
    if (picked) void extractFile(picked);
    event.target.value = "";
  };

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    const picked = event.dataTransfer.files?.[0];
    if (picked) void extractFile(picked);
  };

  const beginEdit = (doc: AdminDoc) => {
    setEditing(doc);
    setEditTitle(doc.title);
    setEditCategory(doc.category);
    setEditSource(doc.sourceUrl ?? "");
    setEditText(doc.text ?? "");
    setEditStatus(doc.status);
    setEditError(null);
  };

  const saveEdit = async () => {
    if (!editing) return;
    setEditSaving(true);
    setEditError(null);
    try {
      const response = await fetch("/api/kb", {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
          "x-admin-key": keyRef.current,
        },
        body: JSON.stringify({
          id: editing.id,
          title: editTitle,
          category: editCategory,
          sourceUrl: editSource || null,
          text: editText,
          status: editStatus,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not save changes.");
      setDocs(data.documents ?? []);
      setStats(data.stats ?? stats);
      setEditing(null);
      await refresh(true);
    } catch (error) {
      setEditError(error instanceof Error ? error.message : "Could not save changes.");
    } finally {
      setEditSaving(false);
    }
  };

  const toggleStatus = async (doc: AdminDoc) => {
    const next = doc.status === "published" ? "draft" : "published";
    try {
      const response = await fetch("/api/kb", {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
          "x-admin-key": keyRef.current,
        },
        body: JSON.stringify({ id: doc.id, status: next }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not change status.");
      setDocs(data.documents ?? []);
      setStats(data.stats ?? stats);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Could not change status.");
    }
  };

  const removeDoc = async (doc: AdminDoc) => {
    if (!window.confirm(`Delete “${doc.title}”? This cannot be undone.`)) return;
    try {
      const response = await fetch(`/api/kb?id=${encodeURIComponent(doc.id)}`, {
        method: "DELETE",
        headers: { "x-admin-key": keyRef.current },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not delete.");
      setDocs(data.documents ?? []);
      setStats(data.stats ?? stats);
      await refresh(true);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Could not delete.");
    }
  };

  const dismissGap = async (gap: Gap) => {
    try {
      const response = await fetch(`/api/gaps?id=${encodeURIComponent(gap.id)}`, {
        method: "DELETE",
        headers: { "x-admin-key": keyRef.current },
      });
      if (response.ok) {
        const data = await response.json();
        setGaps(data.gaps ?? []);
        setGapStats(data.stats ?? { open: 0, total: 0 });
      }
    } catch {
      // ignore
    }
  };

  const draftFromGap = (gap: Gap) => {
    setTab("add");
    setMode("guided");
    setGTitle(gap.question);
    setGCategory(gap.track);
    setGWho(gap.staff);
    setGAnswer("");
    setGSteps("");
    setGRequirements("");
    setGFee("");
    setGSource("");
    window.setTimeout(() => {
      document.getElementById("guided-title")?.focus();
    }, 50);
  };

  const exportKB = async () => {
    const response = await fetch("/api/kb?full=1", {
      headers: { "x-admin-key": keyRef.current },
      cache: "no-store",
    });
    if (!response.ok) return;
    const data = await response.json();
    const blob = new Blob([JSON.stringify(data.documents, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `adzu-ask-kb-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const filteredDocs = useMemo(() => {
    const query = search.trim().toLowerCase();
    return docs.filter((doc) => {
      if (deskFilter !== "all" && doc.category !== deskFilter) return false;
      if (statusFilter !== "all" && doc.status !== statusFilter) return false;
      if (!query) return true;
      return (
        doc.title.toLowerCase().includes(query) ||
        (doc.text ?? "").toLowerCase().includes(query)
      );
    });
  }, [docs, search, deskFilter, statusFilter]);

  if (checking) {
    return (
      <main className="grid min-h-dvh place-items-center bg-cream">
        <div className="flex items-center gap-2 text-sm text-muted">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          Checking the desk…
        </div>
      </main>
    );
  }

  if (!unlocked) {
    return (
      <main className="grid min-h-dvh place-items-center bg-cream px-4 py-10">
        <section className="w-full max-w-sm">
          <img
            src="/brand/adzu-ask-logo.svg"
            alt="AdZU Ask"
            className="mx-auto h-24 w-24"
          />
          <div className="paper-card mt-2 p-6">
            <p className="kicker text-center">Staff only</p>
            <h1 className="mt-1 text-center font-display text-2xl font-semibold text-navy-950">
              Content desk
            </h1>
            <p className="mt-2 text-center text-xs leading-relaxed text-muted">
              Feed the official notes, review what the chat knows, and see the
              questions it could not answer.
            </p>
            <form
              className="mt-5"
              onSubmit={(event) => {
                event.preventDefault();
                if (!gateInput.trim()) return;
                void load(gateInput.trim());
              }}
            >
              <label className="label" htmlFor="admin-pass">
                Staff passcode
              </label>
              <div className="relative">
                <input
                  id="admin-pass"
                  type={showPass ? "text" : "password"}
                  className="field pr-10"
                  value={gateInput}
                  onChange={(event) => setGateInput(event.target.value)}
                  autoComplete="current-password"
                  placeholder="Enter passcode"
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted hover:bg-cream"
                  onClick={() => setShowPass((value) => !value)}
                  aria-label={showPass ? "Hide passcode" : "Show passcode"}
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {gateError && (
                <p className="mt-2 flex items-start gap-1.5 text-[11px] text-red-700">
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
                  {gateError}
                </p>
              )}
              <button
                type="submit"
                disabled={gateBusy || !gateInput.trim()}
                className="btn-primary mt-4 w-full"
              >
                {gateBusy ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                ) : (
                  <LockKeyhole className="h-4 w-4" aria-hidden />
                )}
                Unlock the desk
              </button>
            </form>
            <p className="mt-4 text-center text-[10px] leading-relaxed text-muted">
              The public chat is at <a href="/" className="underline">the chat</a>.
              This page is not indexed.
            </p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <div className="min-h-dvh bg-cream">
      <header className="border-b border-line bg-cream/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center overflow-hidden rounded-xl border border-line bg-paper">
              <img
                src="/brand/adzu-ask-logo.svg"
                alt=""
                className="h-10 w-10"
              />
            </span>
            <div>
              <p className="font-display text-lg font-semibold leading-none text-navy-950">
                Content desk
              </p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-gold-700">
                Admissions &amp; Aid
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <span className="hidden items-center gap-1.5 rounded-lg border border-line bg-paper px-2.5 py-1.5 text-[10px] font-medium text-muted sm:inline-flex">
              {storage === "blob" ? (
                <Cloud className="h-3.5 w-3.5" aria-hidden />
              ) : storage === "file" ? (
                <HardDrive className="h-3.5 w-3.5" aria-hidden />
              ) : (
                <LockKeyhole className="h-3.5 w-3.5" aria-hidden />
              )}
              {storage === "blob" ? "Vercel Blob" : storage === "file" ? "Local file" : "Read-only"}
            </span>
            <span className="hidden items-center gap-1.5 rounded-lg border border-line bg-paper px-2.5 py-1.5 text-[10px] font-medium text-muted sm:inline-flex">
              <Database className="h-3.5 w-3.5" aria-hidden />
              {stats?.aiLabel ?? "Notes only"}
            </span>
            <button
              type="button"
              className="text-btn"
              onClick={() => void refresh()}
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} aria-hidden />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button type="button" className="text-btn text-btn-muted" onClick={() => lock()}>
              <LogOut className="h-4 w-4" aria-hidden />
              <span className="hidden sm:inline">Lock</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-5 sm:px-6">
        <div className="grid gap-3 sm:grid-cols-4">
          {[
            { label: "Published notes", value: stats?.published ?? 0, icon: BookOpenCheck },
            { label: "Drafts", value: stats?.drafts ?? 0, icon: FileText },
            { label: "Open info gaps", value: gapStats.open, icon: AlertTriangle },
            { label: "Characters in KB", value: stats?.characters ?? 0, icon: Database },
          ].map((card) => (
            <div key={card.label} className="rounded-xl border border-line bg-paper px-4 py-3">
              <card.icon className="h-4 w-4 text-gold-600" aria-hidden />
              <p className="mt-2 font-display text-2xl font-semibold leading-none text-navy-950">
                {formatNumber(card.value)}
              </p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
                {card.label}
              </p>
            </div>
          ))}
        </div>

        <nav className="mt-5 flex flex-wrap items-center gap-1.5 border-b border-line pb-2" aria-label="Content desk sections">
          {[
            { id: "add" as const, label: "Add a note", icon: FilePlus2 },
            { id: "library" as const, label: "Library", icon: BookOpenCheck },
            { id: "gaps" as const, label: `Info gaps${gapStats.open ? ` · ${gapStats.open}` : ""}`, icon: AlertTriangle },
            { id: "team" as const, label: "Team", icon: Users },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                tab === item.id
                  ? "bg-navy-900 text-paper"
                  : "text-muted hover:bg-paper hover:text-ink"
              }`}
            >
              <item.icon className="h-3.5 w-3.5" aria-hidden />
              {item.label}
            </button>
          ))}
        </nav>

        {saveMessage && (
          <div className="mt-4 flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-xs text-emerald-800">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            {saveMessage}
          </div>
        )}
        {saveError && (
          <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs text-red-800">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            {saveError}
          </div>
        )}

        {tab === "add" && (
          <section className="mt-5 grid gap-5 lg:grid-cols-[1fr_340px]">
            <div className="rounded-2xl border border-line bg-paper p-4 sm:p-5">
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: "guided" as const, label: "Guided note", icon: FileText },
                  { id: "upload" as const, label: "Upload a file", icon: UploadCloud },
                  { id: "paste" as const, label: "Paste text", icon: ClipboardPaste },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setMode(item.id);
                      setSaveError(null);
                      setSaveMessage(null);
                    }}
                    className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-[11px] font-semibold transition ${
                      mode === item.id
                        ? "border-gold-300 bg-gold-50 text-gold-800"
                        : "border-line bg-paper text-muted hover:border-gold-200"
                    }`}
                  >
                    <item.icon className="h-3.5 w-3.5" aria-hidden />
                    {item.label}
                  </button>
                ))}
              </div>

              {mode === "guided" && (
                <div className="mt-4 grid gap-3">
                  <div>
                    <label className="label" htmlFor="guided-title">
                      What question does this answer?
                    </label>
                    <input
                      id="guided-title"
                      className="field"
                      value={gTitle}
                      onChange={(event) => setGTitle(event.target.value)}
                      placeholder="e.g. What are the freshman enrollment requirements?"
                    />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="label" htmlFor="guided-desk">Desk</label>
                      <select
                        id="guided-desk"
                        className="field"
                        value={gCategory}
                        onChange={(event) => setGCategory(event.target.value as Category)}
                      >
                        <option value="admissions">Admissions</option>
                        <option value="scholarships">Scholarships</option>
                        <option value="general">General / both</option>
                      </select>
                    </div>
                    <div>
                      <label className="label" htmlFor="guided-who">Who handles it</label>
                      <select
                        id="guided-who"
                        className="field"
                        value={gWho}
                        onChange={(event) => setGWho(event.target.value as StaffId)}
                      >
                        {STAFF_LIST.map((person) => (
                          <option key={person.id} value={person.id}>
                            {person.name} — {person.role}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="label" htmlFor="guided-answer">Short answer</label>
                    <textarea
                      id="guided-answer"
                      className="field min-h-[86px] resize-y"
                      value={gAnswer}
                      onChange={(event) => setGAnswer(event.target.value)}
                      placeholder="The one or two sentences the student should hear first."
                    />
                  </div>
                  <div>
                    <label className="label" htmlFor="guided-steps">Steps or details</label>
                    <textarea
                      id="guided-steps"
                      className="field min-h-[92px] resize-y"
                      value={gSteps}
                      onChange={(event) => setGSteps(event.target.value)}
                      placeholder="One step per line. Add the office, portal, or person."
                    />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="label" htmlFor="guided-req">Requirements (one per line)</label>
                      <textarea
                        id="guided-req"
                        className="field min-h-[92px] resize-y"
                        value={gRequirements}
                        onChange={(event) => setGRequirements(event.target.value)}
                        placeholder={"Form 138\nGood moral certificate\nBirth certificate"}
                      />
                    </div>
                    <div>
                      <label className="label" htmlFor="guided-fee">Fee or deadline</label>
                      <textarea
                        id="guided-fee"
                        className="field min-h-[92px] resize-y"
                        value={gFee}
                        onChange={(event) => setGFee(event.target.value)}
                        placeholder="e.g. PHP 350 exam fee. Confirm with the office."
                      />
                    </div>
                  </div>
                  <div>
                    <label className="label" htmlFor="guided-source">Source URL</label>
                    <input
                      id="guided-source"
                      className="field"
                      value={gSource}
                      onChange={(event) => setGSource(event.target.value)}
                      placeholder="https://adzu.edu.ph/…"
                    />
                  </div>
                </div>
              )}

              {mode === "upload" && (
                <div className="mt-4">
                  <div
                    onDragOver={(event) => {
                      event.preventDefault();
                      setDragging(true);
                    }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={onDrop}
                    className={`grid place-items-center rounded-2xl border-2 border-dashed px-4 py-10 text-center transition ${
                      dragging
                        ? "border-gold-400 bg-gold-50"
                        : "border-line bg-cream/40"
                    }`}
                  >
                    <UploadCloud className="h-8 w-8 text-gold-600" aria-hidden />
                    <p className="mt-3 text-sm font-semibold text-navy-950">
                      Drop a PDF, DOCX, or text file
                    </p>
                    <p className="mt-1 max-w-sm text-[11px] leading-relaxed text-muted">
                      Up to 4 MB. PDFs with selectable text are read on the server.
                      Images are OCR&apos;d in your browser. You review the text
                      before anything is published.
                    </p>
                    <button
                      type="button"
                      className="btn-ghost mt-4"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={extracting}
                    >
                      {extracting ? (
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                      ) : (
                        <FilePlus2 className="h-4 w-4" aria-hidden />
                      )}
                      Choose a file
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept={ACCEPT}
                      className="sr-only"
                      onChange={onFileChange}
                    />
                  </div>

                  {file && (
                    <div className="mt-3 rounded-xl border border-line bg-cream/40 px-3.5 py-3 text-xs">
                      <div className="flex items-center justify-between gap-3">
                        <span className="truncate font-semibold text-navy-950">{file.name}</span>
                        <span className="shrink-0 text-[10px] text-muted">
                          {fileKind || file.type || "file"}
                          {filePages ? ` · ${filePages} pages` : ""}
                        </span>
                      </div>
                      {extracting && (
                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line">
                          <div
                            className="h-full rounded-full bg-gold-400 transition-all"
                            style={{ width: `${Math.max(8, extractProgress)}%` }}
                          />
                        </div>
                      )}
                      {extractMessage && (
                        <p className="mt-2 flex items-start gap-1.5 text-[10px] leading-relaxed text-muted">
                          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
                          {extractMessage}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {mode === "paste" && (
                <div className="mt-4">
                  <label className="label" htmlFor="paste-text">Paste a memo, FAQ, or announcement</label>
                  <textarea
                    id="paste-text"
                    className="field min-h-[240px] resize-y font-mono text-[12px]"
                    value={draftText}
                    onChange={(event) => setDraftText(event.target.value)}
                    placeholder="Paste the official text here. Keep the original wording where possible."
                  />
                </div>
              )}
            </div>

            <aside className="space-y-4">
              <div className="rounded-2xl border border-line bg-paper p-4">
                <p className="kicker">Review before publishing</p>
                <div className="mt-3 space-y-3">
                  <div>
                    <label className="label" htmlFor="draft-title">Title</label>
                    <input
                      id="draft-title"
                      className="field"
                      value={mode === "guided" ? gTitle : draftTitle}
                      onChange={(event) =>
                        mode === "guided" ? setGTitle(event.target.value) : setDraftTitle(event.target.value)
                      }
                      placeholder="Short, specific title"
                    />
                  </div>
                  <div>
                    <label className="label" htmlFor="draft-desk">Desk</label>
                    <select
                      id="draft-desk"
                      className="field"
                      value={mode === "guided" ? gCategory : draftCategory}
                      onChange={(event) =>
                        mode === "guided"
                          ? setGCategory(event.target.value as Category)
                          : setDraftCategory(event.target.value as Category)
                      }
                    >
                      <option value="admissions">Admissions</option>
                      <option value="scholarships">Scholarships</option>
                      <option value="general">General / both</option>
                    </select>
                  </div>
                  <div>
                    <label className="label" htmlFor="draft-source">Source URL</label>
                    <input
                      id="draft-source"
                      className="field"
                      value={mode === "guided" ? gSource : draftSource}
                      onChange={(event) =>
                        mode === "guided" ? setGSource(event.target.value) : setDraftSource(event.target.value)
                      }
                      placeholder="https://adzu.edu.ph/…"
                    />
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="btn-primary flex-1"
                    disabled={saving}
                    onClick={() =>
                      mode === "guided" ? publishGuided("published") : publishDraft("published")
                    }
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
                    Publish
                  </button>
                  <button
                    type="button"
                    className="btn-ghost"
                    disabled={saving}
                    onClick={() =>
                      mode === "guided" ? publishGuided("draft") : publishDraft("draft")
                    }
                  >
                    Save draft
                  </button>
                </div>
                <p className="mt-2 text-[10px] leading-relaxed text-muted">
                  Published notes are used by the chat immediately. Drafts are
                  hidden from the chat until you publish them.
                </p>
              </div>

              <div className="rounded-2xl border border-line bg-paper p-4">
                <p className="kicker">What the chat will read</p>
                <pre className="mt-3 max-h-[260px] overflow-y-auto whitespace-pre-wrap rounded-xl bg-cream/50 p-3 text-[10.5px] leading-relaxed text-ink/80">
                  {mode === "guided" ? composedGuided || "Fill the guided note on the left." : draftText || "No text yet."}
                </pre>
                <p className="mt-2 text-[10px] text-muted">
                  {(mode === "guided" ? composedGuided : draftText).length.toLocaleString()} characters
                </p>
              </div>
            </aside>
          </section>
        )}

        {tab === "library" && (
          <section className="mt-5">
            <div className="flex flex-col gap-3 rounded-2xl border border-line bg-paper p-4 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
                <input
                  className="field pl-9"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search titles and full text…"
                  aria-label="Search the library"
                />
              </div>
              <select
                className="field sm:w-40"
                value={deskFilter}
                onChange={(event) => setDeskFilter(event.target.value as "all" | Category)}
                aria-label="Filter by desk"
              >
                <option value="all">All desks</option>
                <option value="admissions">Admissions</option>
                <option value="scholarships">Scholarships</option>
                <option value="general">General</option>
              </select>
              <select
                className="field sm:w-36"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as "all" | DocumentStatus)}
                aria-label="Filter by status"
              >
                <option value="all">All status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
              <button type="button" className="btn-ghost" onClick={() => void exportKB()}>
                <Download className="h-4 w-4" aria-hidden />
                Export
              </button>
            </div>

            <div className="mt-3 overflow-hidden rounded-2xl border border-line bg-paper">
              <div className="hidden grid-cols-[1fr_110px_110px_90px_140px] gap-3 border-b border-line bg-cream/40 px-4 py-2 text-[9px] font-bold uppercase tracking-[0.12em] text-muted md:grid">
                <span>Title</span>
                <span>Desk</span>
                <span>Status</span>
                <span>Size</span>
                <span className="text-right">Actions</span>
              </div>
              {filteredDocs.length === 0 ? (
                <div className="px-4 py-12 text-center text-sm text-muted">
                  No notes match that search.
                </div>
              ) : (
                filteredDocs.map((doc) => (
                  <div
                    key={doc.id}
                    className="grid gap-2 border-b border-line/70 px-4 py-3 last:border-b-0 md:grid-cols-[1fr_110px_110px_90px_140px] md:items-center md:gap-3"
                  >
                    <div className="min-w-0">
                      <button
                        type="button"
                        className="truncate text-left text-sm font-semibold text-navy-950 hover:text-gold-700"
                        onClick={() => beginEdit(doc)}
                      >
                        {doc.title}
                      </button>
                      <p className="mt-0.5 truncate text-[10px] text-muted">
                        {doc.sourceUrl || "No source URL"} · updated {formatDate(doc.updatedAt || doc.addedAt)}
                      </p>
                    </div>
                    <span className="w-fit rounded-md bg-cream px-2 py-1 text-[9px] font-bold uppercase tracking-[0.08em] text-ink/70">
                      {deskLabel(doc.category)}
                    </span>
                    <span
                      className={`w-fit rounded-md px-2 py-1 text-[9px] font-bold uppercase tracking-[0.08em] ${
                        doc.status === "published"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {statusLabel(doc.status)}
                    </span>
                    <span className="text-[10px] text-muted">{formatNumber(doc.chars)} chars</span>
                    <div className="flex items-center gap-1 md:justify-end">
                      <button
                        type="button"
                        className="rounded-md p-1.5 text-muted hover:bg-cream hover:text-navy-950"
                        onClick={() => beginEdit(doc)}
                        aria-label={`Edit ${doc.title}`}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        className="rounded-md px-2 py-1 text-[9px] font-semibold text-muted hover:bg-cream hover:text-navy-950"
                        onClick={() => void toggleStatus(doc)}
                      >
                        {doc.status === "published" ? "Unpublish" : "Publish"}
                      </button>
                      <button
                        type="button"
                        className="rounded-md p-1.5 text-muted hover:bg-red-50 hover:text-red-700"
                        onClick={() => void removeDoc(doc)}
                        aria-label={`Delete ${doc.title}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <p className="mt-2 text-[10px] text-muted">
              {filteredDocs.length} of {docs.length} notes shown.
            </p>
          </section>
        )}

        {tab === "gaps" && (
          <section className="mt-5">
            <div className="rounded-2xl border border-line bg-paper p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="kicker">What students asked that the notes did not cover</p>
                  <h2 className="mt-1 font-display text-xl font-semibold text-navy-950">
                    Info gaps
                  </h2>
                  <p className="mt-1 max-w-2xl text-[11px] leading-relaxed text-muted">
                    These are real questions that fell through. Draft a note from
                    one and it turns into a normal publishable entry. Questions
                    are redacted for emails and phone numbers.
                  </p>
                </div>
                <button type="button" className="btn-ghost" onClick={() => void refresh()}>
                  <RefreshCw className="h-4 w-4" aria-hidden />
                  Refresh
                </button>
              </div>

              {gaps.length === 0 ? (
                <div className="mt-5 rounded-xl border border-dashed border-line bg-cream/30 px-4 py-10 text-center text-sm text-muted">
                  No unanswered questions yet. When the chat cannot find an answer,
                  it lands here.
                </div>
              ) : (
                <div className="mt-4 space-y-2">
                  {gaps.map((gap) => (
                    <div
                      key={gap.id}
                      className={`flex min-w-0 flex-col gap-3 rounded-xl border px-3.5 py-3 sm:flex-row sm:items-center ${
                        gap.resolved
                          ? "border-line/60 bg-cream/20 opacity-70"
                          : "border-line bg-paper"
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="break-words text-sm font-medium leading-snug text-ink [overflow-wrap:anywhere]">
                          {gap.question}
                        </p>
                        <p className="mt-1 flex flex-wrap items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.08em] text-muted">
                          <span className="rounded bg-cream px-1.5 py-0.5">
                            {gap.track === "admissions" ? "Admissions" : "Scholarships"}
                          </span>
                          <span>{STAFF[gap.staff]?.name ?? "Team"}</span>
                          <span>asked {gap.count}×</span>
                          <span>last {formatDate(gap.lastSeen)}</span>
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-1.5">
                        <button
                          type="button"
                          className="btn-ghost !px-3 !py-1.5 !text-[10px]"
                          onClick={() => draftFromGap(gap)}
                        >
                          <FilePlus2 className="h-3.5 w-3.5" aria-hidden />
                          Draft a note
                        </button>
                        <button
                          type="button"
                          className="rounded-md p-1.5 text-muted hover:bg-red-50 hover:text-red-700"
                          onClick={() => void dismissGap(gap)}
                          aria-label="Dismiss gap"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {tab === "team" && (
          <section className="mt-5">
            <div className="rounded-2xl border border-line bg-paper p-4">
              <p className="kicker">The five guides in the public chat</p>
              <h2 className="mt-1 font-display text-xl font-semibold text-navy-950">
                Admissions &amp; Aid team
              </h2>
              <p className="mt-1 max-w-2xl text-[11px] leading-relaxed text-muted">
                Names and roles from the official AdZU College Admissions &amp;
                Aid Office page. The chibis are illustrations, not photos.
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                {STAFF_LIST.map((person) => (
                  <div key={person.id} className="overflow-hidden rounded-xl border border-line">
                    <div className="h-36 overflow-hidden" style={{ background: person.soft }}>
                      <Chibi variant={person.chibi} className="mx-auto h-auto w-32 translate-y-2" />
                    </div>
                    <div className="p-3">
                      <p className="font-display text-lg font-semibold leading-none text-navy-950">
                        {person.name}
                      </p>
                      <p className="mt-1 text-[10px] font-semibold text-muted">{person.fullName}</p>
                      <p className="mt-2 text-[10px] leading-relaxed text-muted">{person.role}</p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {person.handles.map((handle) => (
                          <span key={handle} className="rounded-full bg-cream px-1.5 py-0.5 text-[8px] font-semibold text-ink/70">
                            {handle}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-xl border border-gold-200 bg-gold-50/70 px-3.5 py-3 text-[10px] leading-relaxed text-gold-900">
                <strong>Office:</strong> Ground Floor, Bellarmine–Campion Bldg.,
                Salvador Campus, La Purisima St., Zamboanga City · 9910871 local
                2211/2212 · admissions@adzu.edu.ph · scholarship papers:
                admissionsandaid@adzu.edu.ph
              </div>
            </div>
          </section>
        )}
      </main>

      {editing && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-navy-950/50 p-3 backdrop-blur-sm">
          <div className="max-h-[92dvh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-line bg-paper p-4 shadow-2xl sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="kicker">Edit note</p>
                <h2 className="mt-1 font-display text-xl font-semibold text-navy-950">
                  {editTitle || "Untitled note"}
                </h2>
              </div>
              <button
                type="button"
                className="icon-btn"
                onClick={() => setEditing(null)}
                aria-label="Close editor"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="label" htmlFor="edit-title">Title</label>
                <input id="edit-title" className="field" value={editTitle} onChange={(event) => setEditTitle(event.target.value)} />
              </div>
              <div>
                <label className="label" htmlFor="edit-desk">Desk</label>
                <select id="edit-desk" className="field" value={editCategory} onChange={(event) => setEditCategory(event.target.value as Category)}>
                  <option value="admissions">Admissions</option>
                  <option value="scholarships">Scholarships</option>
                  <option value="general">General / both</option>
                </select>
              </div>
              <div>
                <label className="label" htmlFor="edit-status">Status</label>
                <select id="edit-status" className="field" value={editStatus} onChange={(event) => setEditStatus(event.target.value as DocumentStatus)}>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="label" htmlFor="edit-source">Source URL</label>
                <input id="edit-source" className="field" value={editSource} onChange={(event) => setEditSource(event.target.value)} />
              </div>
              <div className="sm:col-span-2">
                <label className="label" htmlFor="edit-text">Full text</label>
                <textarea
                  id="edit-text"
                  className="field min-h-[300px] resize-y font-mono text-[11px]"
                  value={editText}
                  onChange={(event) => setEditText(event.target.value)}
                />
                <p className="mt-1 text-[10px] text-muted">{editText.length.toLocaleString()} characters</p>
              </div>
            </div>

            {editError && (
              <p className="mt-3 flex items-start gap-1.5 text-[11px] text-red-700">
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
                {editError}
              </p>
            )}

            <div className="mt-4 flex items-center justify-end gap-2">
              <button type="button" className="btn-ghost" onClick={() => setEditing(null)}>
                Cancel
              </button>
              <button type="button" className="btn-primary" onClick={() => void saveEdit()} disabled={editSaving}>
                {editSaving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
                Save changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
