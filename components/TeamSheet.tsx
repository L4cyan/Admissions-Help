"use client";

import { useEffect, useRef } from "react";
import { ArrowRight, X } from "lucide-react";
import { InstallButton } from "./InstallButton";
import { PokeChibi } from "./PokeChibi";
import { STAFF_LIST } from "@/lib/staff";
import type { StaffId } from "@/lib/types";

export function TeamSheet({
  open,
  onClose,
  onAsk,
}: {
  open: boolean;
  onClose: () => void;
  onAsk: (question: string, staff: StaffId) => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    const trigger =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    triggerRef.current = trigger;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab") return;
      const root = sheetRef.current;
      if (!root) return;
      const focusable = Array.from(
        root.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => element.getClientRects().length > 0);
      if (!focusable.length) {
        event.preventDefault();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      if (event.shiftKey) {
        if (active === first || !root.contains(active)) {
          event.preventDefault();
          last.focus();
        }
      } else if (active === last || !root.contains(active)) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
      triggerRef.current?.focus({ preventScroll: true });
      triggerRef.current = null;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="team-backdrop" onMouseDown={onClose}>
      <section
        ref={sheetRef}
        className="team-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="team-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="team-sheet-head">
          <div>
            <p className="kicker">The people behind the desk</p>
            <h2 id="team-title">Meet the Admissions &amp; Aid team</h2>
            <p className="team-sheet-sub">
              Five chibi guides, one office. Ask normally and the right person
              picks it up.
            </p>
          </div>
          <button
            ref={closeRef}
            type="button"
            className="icon-btn"
            onClick={onClose}
            aria-label="Close the team sheet"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="team-grid">
          {STAFF_LIST.map((person) => (
            <article key={person.id} className={`team-card team-card-${person.id}`}>
              <div className="team-card-art" style={{ background: person.soft }}>
                <PokeChibi variant={person.chibi} className="team-card-poke" />
              </div>
              <div className="team-card-body">
                <p className="team-card-name">{person.name}</p>
                <p className="team-card-full">{person.fullName}</p>
                <p className="team-card-role">{person.role}</p>
                <ul className="team-card-handles">
                  {person.handles.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <button
                  type="button"
                  className="team-card-ask"
                  onClick={() => {
                    onAsk(person.suggestions[0], person.id);
                    onClose();
                  }}
                >
                  Ask {person.name}
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                </button>
              </div>
            </article>
          ))}
        </div>

        <footer className="team-sheet-foot">
          <p>
            <strong>Chibi guides are illustrations, not live staff.</strong> They
            answer only from the official notes in this app and cannot approve an
            application or a scholarship.
          </p>
          <p>
            Ground Floor, Bellarmine–Campion Bldg., Salvador Campus · 9910871
            local 2211/2212 · admissions@adzu.edu.ph
          </p>
          <div className="mt-1">
            <InstallButton compact />
          </div>
        </footer>
      </section>
    </div>
  );
}
