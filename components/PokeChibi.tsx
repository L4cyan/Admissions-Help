"use client";

import { useEffect, useRef, useState } from "react";
import { Chibi } from "./Chibi";
import { STAFF } from "@/lib/staff";
import type { StaffId } from "@/lib/types";

const POKE_LINES: Record<StaffId, string> = {
  director: "Hi! Need a hand?",
  rose: "Salamat! Ask me about grants.",
  cris: "Deadline? Let's check it together.",
  sherry: "CET? I've got you.",
  marilou: "Checklist? Let's go.",
};

export function PokeChibi({
  variant,
  className = "msg-chibi-btn",
  onPoke,
  showBubble = true,
}: {
  variant: StaffId;
  className?: string;
  onPoke?: (line: string) => void;
  showBubble?: boolean;
}) {
  const [poked, setPoked] = useState(false);
  const [line, setLine] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const poke = () => {
    if (timer.current) clearTimeout(timer.current);
    setPoked(false);
    setLine(null);
    const nextLine = POKE_LINES[variant];
    if (onPoke) onPoke(nextLine);
    window.requestAnimationFrame(() => {
      setPoked(true);
      if (showBubble) setLine(nextLine);
      timer.current = setTimeout(() => {
        setPoked(false);
        setLine(null);
      }, 2400);
    });
  };

  return (
    <button
      type="button"
      className={`${className} ${poked ? "is-poked" : ""}`}
      onClick={poke}
      aria-label={`Poke ${STAFF[variant].name}`}
      title={`Poke ${STAFF[variant].name}`}
    >
      <Chibi variant={variant} className="h-full w-full" />
      {showBubble && line && (
        <span className="poke-bubble" role="status">
          {line}
        </span>
      )}
    </button>
  );
}
