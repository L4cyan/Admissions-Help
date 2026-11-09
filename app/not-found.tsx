import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Chibi } from "@/components/Chibi";

export const metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center bg-cream px-5 py-16">
      <div className="paper-card w-full max-w-md p-8 text-center">
        <div className="mx-auto h-40 w-36">
          <Chibi variant="marilou" className="h-full w-full" />
        </div>
        <p className="kicker mt-3">404 · Lost in the hallway</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-navy-950">
          This page isn&apos;t in the notes.
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted">
          Let&apos;s get you back to the one chat for admissions and
          scholarships.
        </p>
        <Link href="/" className="btn-primary mt-6 w-full">
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to the chat
        </Link>
      </div>
    </main>
  );
}
