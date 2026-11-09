import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  BookOpenCheck,
  Clock3,
  GraduationCap,
  HeartHandshake,
  MessageCircle,
  Search,
  ShieldCheck,
  Sparkles,
  WifiOff,
} from "lucide-react";
import { Chibi } from "@/components/Chibi";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { TRACKS } from "@/lib/tracks";

const POPULAR = [
  {
    track: "admissions",
    label: "How do I apply for the CET?",
    query: "How do I apply for the AdZU College Entrance Test?",
  },
  {
    track: "admissions",
    label: "Freshman enrollment requirements",
    query: "What are the requirements for freshman enrollment?",
  },
  {
    track: "scholarships",
    label: "Scholarship requirements",
    query: "What documents do I need for a scholarship application?",
  },
  {
    track: "scholarships",
    label: "Does aid cover summer?",
    query: "Does the scholarship cover summer classes?",
  },
  {
    track: "admissions",
    label: "Where is the office?",
    query: "Where is the Admissions and Aid Office?",
  },
  {
    track: "scholarships",
    label: "Types of grants",
    query: "What scholarships does AdZU offer?",
  },
];

const SOURCES = [
  {
    title: "College Admissions & Aid Office",
    description: "CET steps, enrollment requirements, scholarship requirements, contact details.",
    href: "https://adzu.edu.ph/about-us/admissions-aid",
    tag: "Official page",
  },
  {
    title: "Scholarship and Financial Grants",
    description: "University, government, and private grant categories; summer coverage rule.",
    href: "https://adzu.edu.ph/scholarship-and-financial-grants",
    tag: "Official page",
  },
  {
    title: "University Scholarships",
    description: "Centennial, merit, and Student Assistantship grants listed by AdZU.",
    href: "https://adzu.edu.ph/university-scholarships",
    tag: "Official page",
  },
  {
    title: "Scholarship Application Form",
    description: "The downloadable College Scholarship Grant Application Form (PDF).",
    href: "https://adzu.edu.ph/wp-content/uploads/2024/03/AdZU-Scholarship-Application-Form.pdf",
    tag: "Official PDF",
  },
  {
    title: "Online Application Portal",
    description: "Start the AdZU college application and CET process online.",
    href: "https://admissions.host.adzu.edu.ph/",
    tag: "Official portal",
  },
  {
    title: "AdZU on Facebook",
    description: "CET schedules, Blue Eagle updates, and office announcements.",
    href: "https://www.facebook.com/ateneodezamboangauniversity/",
    tag: "Official social",
  },
];

export default function HomePage() {
  return (
    <div className="relative z-10">
      <SiteHeader />

      <main>
        <section className="relative overflow-hidden">
          <div className="hero-grid pointer-events-none absolute inset-0 opacity-70" aria-hidden />
          <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-gold-200/30 blur-3xl" aria-hidden />
          <div className="pointer-events-none absolute -right-20 top-40 h-80 w-80 rounded-full bg-sky-200/40 blur-3xl" aria-hidden />

          <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6 sm:pt-14 lg:pb-24 lg:pt-20">
            <div className="grid items-center gap-12 lg:grid-cols-[1.02fr_0.98fr]">
              <div>
                <span className="eyebrow">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden />
                  Ateneo de Zamboanga University
                </span>
                <h1 className="mt-5 max-w-2xl font-display text-[2.7rem] font-semibold leading-[1.02] tracking-tight text-navy-950 sm:text-6xl lg:text-[4.2rem]">
                  Ask AdZU.
                  <span className="relative ml-2 inline-block text-gold-600">
                    Get answers,
                    <svg
                      className="absolute -bottom-2 left-0 h-3 w-full text-gold-300"
                      viewBox="0 0 200 12"
                      preserveAspectRatio="none"
                      aria-hidden
                    >
                      <path d="M2 8c40-6 92-7 196-2" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                    </svg>
                  </span>
                  <br />
                  not runaround.
                </h1>
                <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
                  Meet your chibi guides for college admissions and scholarships.
                  Ask in plain language — every answer points back to official
                  AdZU notes, so you know where it came from.
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  <Link href="/chat/admissions" className="btn-primary">
                    <GraduationCap className="h-4 w-4" aria-hidden />
                    Start with Admissions
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                  <Link href="/chat/scholarships" className="btn-gold">
                    <HeartHandshake className="h-4 w-4" aria-hidden />
                    Explore Scholarships
                  </Link>
                </div>

                <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-muted">
                  <span className="inline-flex items-center gap-1.5">
                    <BadgeCheck className="h-4 w-4 text-gold-600" aria-hidden />
                    Grounded in official pages
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <WifiOff className="h-4 w-4 text-gold-600" aria-hidden />
                    Installable PWA
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-gold-600" aria-hidden />
                    No account needed
                  </span>
                </div>
              </div>

              <div className="relative mx-auto w-full max-w-[460px]">
                <div className="relative aspect-square">
                  <div className="absolute inset-[7%] rounded-full bg-gradient-to-br from-gold-100 via-paper to-sky-100 shadow-soft" />
                  <div className="absolute inset-[7%] rounded-full border border-gold-300/80" />
                  <div className="absolute inset-[13%] rounded-full border border-dashed border-gold-300/50" />
                  <div className="absolute inset-[16%] overflow-hidden rounded-full bg-cream/70">
                    <Chibi
                      variant="director"
                      className="h-full w-full animate-float"
                    />
                  </div>

                  <div className="speech-bubble absolute -left-1 top-2 z-20 max-w-[220px] rounded-2xl border border-line bg-paper p-4 shadow-card sm:-left-6 sm:top-6">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gold-700">
                      Welcome, future Atenista
                    </p>
                    <p className="mt-1.5 text-sm leading-snug text-ink/85">
                      Hi! I&apos;m the welcome chibi. Are you here for{" "}
                      <strong className="text-navy-900">admissions</strong> or{" "}
                      <strong className="text-navy-900">scholarships</strong>?
                    </p>
                  </div>

                  <div className="absolute -right-1 top-[40%] z-20 hidden items-center gap-2 rounded-full border border-line bg-paper px-3 py-2 shadow-card sm:flex">
                    <span className="h-9 w-9 overflow-hidden rounded-full border border-gold-300 bg-sky-100">
                      <Chibi variant="admissions-1" className="h-full w-full" />
                    </span>
                    <span className="pr-1 text-[11px] font-semibold text-navy-900">
                      Admissions
                    </span>
                  </div>

                  <div className="absolute -left-2 bottom-10 z-20 hidden items-center gap-2 rounded-full border border-line bg-paper px-3 py-2 shadow-card sm:flex">
                    <span className="h-9 w-9 overflow-hidden rounded-full border border-gold-300 bg-cream">
                      <Chibi variant="scholarships-1" className="h-full w-full" />
                    </span>
                    <span className="pr-1 text-[11px] font-semibold text-navy-900">
                      Scholarships
                    </span>
                  </div>

                  <div className="absolute -bottom-2 left-1/2 z-10 -translate-x-1/2 rounded-full border border-gold-300 bg-gold-50 px-4 py-2 text-center shadow-card">
                    <p className="font-hand text-lg leading-none text-navy-900">
                      Pick a lane, future Atenista!
                    </p>
                  </div>

                  <Sparkles className="absolute right-7 top-6 h-5 w-5 animate-wiggle text-gold-500" aria-hidden />
                  <Sparkles className="absolute bottom-20 right-2 h-4 w-4 text-gold-400" aria-hidden />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative mx-auto max-w-6xl px-4 pb-8 sm:px-6" aria-labelledby="choose-heading">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-700">
                Choose your lane
              </p>
              <h2 id="choose-heading" className="mt-2 font-display text-3xl font-semibold text-navy-950 sm:text-4xl">
                Two doors. Five chibi guides.
              </h2>
            </div>
            <p className="max-w-sm text-sm text-muted">
              Each door has its own team and its own notes. You can switch anytime.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <TrackCard track="admissions" />
            <TrackCard track="scholarships" />
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6" aria-labelledby="popular-heading">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-700">
                Popular right now
              </p>
              <h2 id="popular-heading" className="mt-2 font-display text-3xl font-semibold text-navy-950">
                Start with a real question
              </h2>
            </div>
            <p className="text-sm text-muted">
              Tap one and the guide will pick it up from there.
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-2.5">
            {POPULAR.map((item) => (
              <Link
                key={item.query}
                href={`/chat/${item.track}?q=${encodeURIComponent(item.query)}`}
                className="chip !px-4 !py-2.5 !text-[13px]"
              >
                <MessageCircle className="h-3.5 w-3.5 text-gold-600" aria-hidden />
                {item.label}
              </Link>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6" aria-labelledby="how-heading">
          <div className="paper-card overflow-hidden p-6 sm:p-9">
            <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-700">
                  How it works
                </p>
                <h2 id="how-heading" className="mt-2 font-display text-3xl font-semibold text-navy-950">
                  Friendly on the surface.
                  <br />
                  Cited underneath.
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  The guides answer only from the notes in their knowledge base.
                  If something is not there, they say so instead of guessing.
                </p>
                <div className="mt-5 flex items-center gap-2 text-xs font-medium text-muted">
                  <Clock3 className="h-4 w-4 text-gold-600" aria-hidden />
                  Answers in seconds · sources included
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  {
                    icon: Search,
                    title: "Pick a lane",
                    text: "Admissions for the CET and enrollment; Scholarships for grants and aid.",
                  },
                  {
                    icon: MessageCircle,
                    title: "Ask naturally",
                    text: "Type like you would text a friend. No special keywords needed.",
                  },
                  {
                    icon: BookOpenCheck,
                    title: "Check the source",
                    text: "Each answer includes the official page or file it came from.",
                  },
                ].map((step, index) => (
                  <div key={step.title} className="rounded-2xl border border-line/80 bg-cream/50 p-4">
                    <div className="flex items-center justify-between">
                      <span className="grid h-9 w-9 place-items-center rounded-full bg-paper text-navy-900 shadow-sm">
                        <step.icon className="h-4 w-4" aria-hidden />
                      </span>
                      <span className="font-display text-2xl text-gold-400">0{index + 1}</span>
                    </div>
                    <p className="mt-3 text-sm font-semibold text-navy-950">{step.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted">{step.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="sources" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-14 sm:px-6" aria-labelledby="sources-heading">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-700">
                The receipts
              </p>
              <h2 id="sources-heading" className="mt-2 font-display text-3xl font-semibold text-navy-950">
                Official sources we start with
              </h2>
            </div>
            <p className="max-w-md text-sm text-muted">
              Staff can add more files in the content desk. The public chat only
              answers from what is in the knowledge base.
            </p>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {SOURCES.map((source) => (
              <a
                key={source.href}
                href={source.href}
                target="_blank"
                rel="noreferrer"
                className="group rounded-2xl border border-line/80 bg-paper/80 p-4 transition hover:-translate-y-0.5 hover:border-gold-300 hover:shadow-card"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="rounded-full bg-gold-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-gold-800">
                    {source.tag}
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-muted transition group-hover:text-gold-600" aria-hidden />
                </div>
                <p className="mt-3 text-sm font-semibold text-navy-950">{source.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted">{source.description}</p>
              </a>
            ))}
          </div>

          <div className="mt-4 flex items-start gap-3 rounded-2xl border border-gold-200 bg-gold-50/70 p-4 text-xs leading-relaxed text-gold-900">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold-700" aria-hidden />
            <p>
              <strong>This is not the university.</strong> AdZU Ask is an
              unofficial helper. It cannot approve applications, promise slots,
              or decide scholarship eligibility. For anything binding, contact
              the College Admissions &amp; Aid Office.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-4 sm:px-6">
          <div className="relative overflow-hidden rounded-[32px] bg-navy-900 px-6 py-10 text-paper shadow-soft sm:px-10 sm:py-12">
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gold-400/20 blur-3xl" aria-hidden />
            <div className="pointer-events-none absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-sky-400/20 blur-3xl" aria-hidden />
            <div className="relative grid gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-center">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-300">
                  Still unsure?
                </p>
                <h2 className="mt-2 max-w-lg font-display text-3xl font-semibold leading-tight sm:text-4xl">
                  Ask the chibi guides. They&apos;ll show you the notes.
                </h2>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-paper/70">
                  Admissions, scholarships, requirements, contact details — start
                  with the lane that feels closest to your question.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href="/chat/admissions" className="btn-gold">
                    Ask Admissions
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                  <Link
                    href="/chat/scholarships"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-paper/25 px-5 py-3 text-sm font-semibold text-paper transition hover:bg-paper/10"
                  >
                    Ask Scholarships
                  </Link>
                </div>
              </div>
              <div className="flex items-end justify-center gap-1 md:justify-end">
                <div className="h-28 w-28 overflow-hidden rounded-full border-2 border-gold-300/70 bg-cream shadow-card sm:h-36 sm:w-36">
                  <Chibi variant="admissions-2" className="h-full w-full" />
                </div>
                <div className="h-36 w-36 overflow-hidden rounded-full border-2 border-gold-300/70 bg-cream shadow-card sm:h-44 sm:w-44">
                  <Chibi variant="director" className="h-full w-full" />
                </div>
                <div className="h-28 w-28 overflow-hidden rounded-full border-2 border-gold-300/70 bg-cream shadow-card sm:h-36 sm:w-36">
                  <Chibi variant="scholarships-2" className="h-full w-full" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "AdZU Ask",
            applicationCategory: "EducationalApplication",
            operatingSystem: "Any",
            description:
              "Unofficial chibi guide for Ateneo de Zamboanga University college admissions and scholarships.",
            offers: { "@type": "Offer", price: "0", priceCurrency: "PHP" },
          }),
        }}
      />
    </div>
  );
}

function TrackCard({ track }: { track: "admissions" | "scholarships" }) {
  const config = TRACKS[track];
  const isAdmissions = track === "admissions";
  return (
    <Link
      href={`/chat/${track}`}
      className={`group relative overflow-hidden rounded-[30px] border p-6 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-soft sm:p-8 ${
        isAdmissions
          ? "border-navy-700 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700 text-paper"
          : "border-gold-300/80 bg-gradient-to-br from-gold-50 via-paper to-cream text-navy-950"
      }`}
    >
      <div
        className={`pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full blur-2xl ${
          isAdmissions ? "bg-sky-400/20" : "bg-gold-300/40"
        }`}
        aria-hidden
      />
      <div
        className={`pointer-events-none absolute inset-0 opacity-[0.07] ${
          isAdmissions ? "text-paper" : "text-navy-900"
        }`}
        style={{
          backgroundImage:
            "radial-gradient(circle, currentColor 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
        aria-hidden
      />

      <div className="relative flex items-start justify-between gap-6">
        <div className="max-w-[62%]">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${
              isAdmissions
                ? "bg-paper/10 text-gold-200"
                : "bg-gold-100 text-gold-800"
            }`}
          >
            {isAdmissions ? (
              <GraduationCap className="h-3 w-3" aria-hidden />
            ) : (
              <HeartHandshake className="h-3 w-3" aria-hidden />
            )}
            {config.label}
          </span>
          <h3 className="mt-3 font-display text-3xl font-semibold leading-tight">
            {isAdmissions ? "Your way in." : "Your way through."}
          </h3>
          <p
            className={`mt-2 text-sm leading-relaxed ${
              isAdmissions ? "text-paper/75" : "text-ink/70"
            }`}
          >
            {config.description}
          </p>
        </div>

        <div className="relative h-28 w-24 shrink-0 sm:h-32 sm:w-28">
          <div className="absolute right-0 top-0 h-20 w-20 overflow-hidden rounded-full border-2 border-gold-300/80 bg-cream shadow-card sm:h-24 sm:w-24">
            <Chibi variant={config.chibis[0]} className="h-full w-full" />
          </div>
          <div className="absolute bottom-0 left-0 h-20 w-20 overflow-hidden rounded-full border-2 border-gold-300/80 bg-cream shadow-card sm:h-24 sm:w-24">
            <Chibi variant={config.chibis[1]} className="h-full w-full" />
          </div>
        </div>
      </div>

      <div className="relative mt-5 grid gap-1.5 text-xs sm:grid-cols-2">
        {(isAdmissions
          ? ["CET steps & permits", "Freshman & transferee requirements", "Office contact & location", "Application portal"]
          : ["Application checklist", "University & government grants", "Summer coverage rule", "Where to submit"]
        ).map((item) => (
          <span
            key={item}
            className={`inline-flex items-center gap-1.5 ${
              isAdmissions ? "text-paper/70" : "text-ink/65"
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${isAdmissions ? "bg-gold-400" : "bg-gold-500"}`} />
            {item}
          </span>
        ))}
      </div>

      <div
        className={`relative mt-6 flex items-center justify-between border-t pt-4 text-sm font-semibold ${
          isAdmissions ? "border-paper/15 text-gold-200" : "border-gold-200 text-gold-800"
        }`}
      >
        <span>Ask the {config.label.toLowerCase()} guides</span>
        <span
          className={`grid h-9 w-9 place-items-center rounded-full transition group-hover:translate-x-1 ${
            isAdmissions ? "bg-paper/10" : "bg-gold-100"
          }`}
        >
          <ArrowRight className="h-4 w-4" aria-hidden />
        </span>
      </div>
    </Link>
  );
}
