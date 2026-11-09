import Link from "next/link";
import { Chibi } from "@/components/Chibi";

export const metadata = {
  title: "Offline",
};

export default function OfflinePage() {
  return (
    <main className="relative z-10 grid min-h-dvh place-items-center px-5 py-16">
      <div className="paper-card w-full max-w-md p-8 text-center">
        <div className="mx-auto h-28 w-28">
          <Chibi variant="director" className="h-full w-full" />
        </div>
        <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-700">
          No connection
        </p>
        <h1 className="mt-2 font-display text-3xl text-navy-900">
          The chibi guides are offline
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Reconnect to ask a new question. Your last conversation is still on
          this device.
        </p>
        <Link href="/" className="btn-primary mt-6 w-full">
          Try again
        </Link>
      </div>
    </main>
  );
}
