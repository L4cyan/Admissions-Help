import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { Chibi } from "./Chibi";

export function SiteFooter() {
  return (
    <footer className="relative z-10 mt-20 border-t border-line/80 bg-paper/60">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.3fr_0.8fr_0.9fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-full border border-gold-300 bg-cream">
                <Chibi variant="director" className="h-11 w-11" />
              </span>
              <div>
                <p className="font-display text-xl font-semibold text-navy-950">AdZU Ask</p>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-700">
                  Admissions &amp; Aid chibi guides
                </p>
              </div>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
              A friendly, student-built assistant for Ateneo de Zamboanga
              University college admissions and scholarships. Answers are
              grounded in official notes and cited — not official decisions.
            </p>
            <p className="mt-3 text-xs leading-relaxed text-muted/80">
              Unofficial project. Always confirm requirements, deadlines, fees,
              and eligibility with the College Admissions &amp; Aid Office.
            </p>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gold-700">
              Ask the guides
            </p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/chat/admissions" className="text-ink/80 hover:text-navy-900">
                  Admissions chat
                </Link>
              </li>
              <li>
                <Link href="/chat/scholarships" className="text-ink/80 hover:text-navy-900">
                  Scholarships chat
                </Link>
              </li>
              <li>
                <Link href="/#sources" className="text-ink/80 hover:text-navy-900">
                  Official sources
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-ink/80 hover:text-navy-900">
                  Staff content desk
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gold-700">
              Admissions &amp; Aid Office
            </p>
            <ul className="mt-4 space-y-3 text-sm text-ink/80">
              <li className="flex gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" aria-hidden />
                <span>
                  Ground Floor, Bellarmine–Campion Bldg.
                  <br />
                  Salvador Campus, La Purisima St., Zamboanga City
                </span>
              </li>
              <li className="flex gap-2.5">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" aria-hidden />
                <span>
                  9910871 loc. 2211 / 2212
                  <br />
                  +639277705888 · +639082613133
                </span>
              </li>
              <li className="flex gap-2.5">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" aria-hidden />
                <span>
                  <a className="hover:text-navy-900" href="mailto:admissions@adzu.edu.ph">
                    admissions@adzu.edu.ph
                  </a>
                  <br />
                  <a
                    className="hover:text-navy-900"
                    href="mailto:admissionsandaid@adzu.edu.ph"
                  >
                    admissionsandaid@adzu.edu.ph
                  </a>
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-line/80 pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} AdZU Ask contributors. Built with care for future Atenistas.</p>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            <a
              className="inline-flex items-center gap-1 hover:text-navy-900"
              href="https://adzu.edu.ph/about-us/admissions-aid"
              target="_blank"
              rel="noreferrer"
            >
              Official Admissions &amp; Aid <ArrowUpRight className="h-3 w-3" />
            </a>
            <a
              className="inline-flex items-center gap-1 hover:text-navy-900"
              href="https://admissions.host.adzu.edu.ph/"
              target="_blank"
              rel="noreferrer"
            >
              Application portal <ArrowUpRight className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
