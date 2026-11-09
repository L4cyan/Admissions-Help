import Link from "next/link";
import { ShieldCheck, Sparkles } from "lucide-react";
import { Chibi } from "./Chibi";
import { InstallButton } from "./InstallButton";

export function SiteHeader({ minimal = false }: { minimal?: boolean }) {
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-cream/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link href="/" className="group flex items-center gap-3" aria-label="AdZU Ask home">
          <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-full border border-gold-300 bg-paper shadow-sm">
            <Chibi variant="director" className="h-10 w-10" />
            <Sparkles className="absolute -right-1 -top-1 h-3.5 w-3.5 text-gold-500" aria-hidden />
          </span>
          <span className="leading-tight">
            <span className="block font-display text-lg font-semibold tracking-tight text-navy-950">
              AdZU Ask
            </span>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-700">
              Admissions &amp; Aid
            </span>
          </span>
        </Link>

        {!minimal && (
          <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
            <Link href="/chat/admissions" className="btn-ghost !border-transparent !bg-transparent">
              Admissions
            </Link>
            <Link href="/chat/scholarships" className="btn-ghost !border-transparent !bg-transparent">
              Scholarships
            </Link>
            <Link href="/#sources" className="btn-ghost !border-transparent !bg-transparent">
              Sources
            </Link>
          </nav>
        )}

        <div className="flex items-center gap-2">
          <InstallButton compact />
          <Link
            href="/admin"
            className="hidden items-center gap-1.5 rounded-full border border-line bg-paper/70 px-3 py-2 text-xs font-medium text-ink/70 transition hover:border-gold-300 hover:text-ink sm:inline-flex"
          >
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
            Staff
          </Link>
        </div>
      </div>
    </header>
  );
}
