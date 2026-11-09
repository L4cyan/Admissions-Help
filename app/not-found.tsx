import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Chibi } from "@/components/Chibi";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="min-h-dvh">
      <SiteHeader />
      <main className="mx-auto grid min-h-[70dvh] max-w-3xl place-items-center px-4 py-16">
        <div className="text-center">
          <div className="relative mx-auto h-40 w-40">
            <div className="absolute inset-0 rounded-full border border-dashed border-gold-300" />
            <Chibi variant="admissions-2" className="h-full w-full animate-float" />
            <Sparkles className="absolute -right-2 top-4 h-5 w-5 text-gold-500" aria-hidden />
          </div>
          <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-700">
            404 · Lost in the hallway
          </p>
          <h1 className="mt-2 font-display text-4xl font-semibold text-navy-950">
            This page isn&apos;t in the notes.
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
            The chibi guides looked everywhere. Let&apos;s get you back to the
            admissions and scholarship lanes.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/" className="btn-primary">
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Back to the lanes
            </Link>
            <Link href="/chat/admissions" className="btn-ghost">
              Ask Admissions
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
