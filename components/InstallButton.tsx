"use client";

import { Download, Share, X } from "lucide-react";
import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallButton({ compact = false }: { compact?: boolean }) {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [showIos, setShowIos] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
    setInstalled(standalone);

    const onPrompt = (event: Event) => {
      event.preventDefault();
      setDeferred(event as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setDeferred(null);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (installed) return null;

  const isIos =
    typeof navigator !== "undefined" &&
    /iphone|ipad|ipod/i.test(navigator.userAgent) &&
    !/crios|fxios/i.test(navigator.userAgent);

  const handleClick = async () => {
    if (deferred) {
      await deferred.prompt();
      const choice = await deferred.userChoice;
      if (choice.outcome === "accepted") setInstalled(true);
      setDeferred(null);
      return;
    }
    if (isIos) setShowIos(true);
  };

  if (!deferred && !isIos) return null;

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={
          compact
            ? "btn-ghost !px-3 !py-2 text-xs"
            : "btn-ghost"
        }
        aria-label="Install AdZU Ask as an app"
      >
        <Download className="h-4 w-4" aria-hidden />
        {compact ? "Install" : "Install app"}
      </button>

      {showIos && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-navy-950/50 p-5 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Install on iPhone or iPad"
          onClick={() => setShowIos(false)}
        >
          <div
            className="paper-card w-full max-w-sm p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gold-700">
                  Install on iPhone / iPad
                </p>
                <h2 className="mt-1 font-display text-2xl text-navy-900">
                  Add to Home Screen
                </h2>
              </div>
              <button
                type="button"
                className="rounded-full p-2 text-muted hover:bg-cream"
                onClick={() => setShowIos(false)}
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <ol className="space-y-3 text-sm text-ink/80">
              <li className="flex gap-3">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gold-100 font-semibold text-gold-800">
                  1
                </span>
                <span>
                  Open this site in <strong>Safari</strong>.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gold-100 font-semibold text-gold-800">
                  2
                </span>
                <span className="flex flex-wrap items-center gap-1.5">
                  Tap the <Share className="inline h-4 w-4" aria-hidden /> Share
                  button.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gold-100 font-semibold text-gold-800">
                  3
                </span>
                <span>
                  Choose <strong>Add to Home Screen</strong>, then tap{" "}
                  <strong>Add</strong>.
                </span>
              </li>
            </ol>
            <button
              type="button"
              className="btn-primary mt-6 w-full"
              onClick={() => setShowIos(false)}
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}
