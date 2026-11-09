# AdZU Ask

**AdZU Ask** is an unofficial, student-built chibi guide to college admissions and scholarships at **Ateneo de Zamboanga University (AdZU)**. Prospective students, parents, and scholars ask questions in plain language; answers come only from a curated knowledge base of official AdZU pages, forms, and staff-uploaded notes, with numbered source citations.

Built with Next.js 15 (App Router), React 19, TypeScript, and Tailwind CSS. It is installable as a PWA.

> **Not the university.** AdZU Ask cannot approve an application, reserve a slot, decide scholarship eligibility, or speak officially for AdZU. Always confirm requirements, deadlines, fees, and eligibility with the College Admissions & Aid Office.

---

## Features

- **Landing page** (`/`) with the hand-drawn **director / welcome chibi**, two track cards, popular questions, official source links, and a clear unofficial-project disclaimer.
- **Two chat desks**:
  - `/chat/admissions` - CET, test permits, freshman and transferee requirements, enrollment, office location.
  - `/chat/scholarships` - grant types, application requirements, financial aid, summer coverage, where to submit.
- **Cited answers** - retrieval runs over the knowledge base, the model is instructed to answer only from the retrieved passages, and each factual claim is cited as `[1]`, `[2]`, etc. A collapsible **Sources** panel shows the matching documents. Answers cite up to four sources.
- **Quoted-notes fallback** - if no AI provider is configured or every provider fails, the app returns extractive quotes from the best-matching notes (still cited) instead of guessing.
- **Chat conveniences** - suggested questions, in-tab conversation memory (`sessionStorage`), deep links such as `/chat/admissions?q=...`, copy answer, read-aloud with the browser speech API, new-chat reset, and desk switching.
- **Staff content desk** (`/admin`) - passcode gate, multi-file upload or pasted text, title/category/source URL, duplicate detection, searchable library, JSON export, delete, and storage/AI status badges.
- **Document ingestion** - PDF, DOCX, TXT, MD/Markdown, CSV, JSON, HTML, XML, and images (OCR in the browser with Tesseract.js).
- **PWA** - web app manifest, install button (including iOS "Add to Home Screen" instructions), service worker, offline page, and generated icons.

---

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 15.5 (App Router, route handlers) |
| UI | React 19, Tailwind CSS 3.4, lucide-react |
| PDF parsing | `unpdf` |
| DOCX parsing | `mammoth` |
| Image OCR | `tesseract.js` (browser, English) |
| Storage | local `data/kb.json` or Vercel Blob |
| Icons | custom SVG chibis + `sharp` icon generation |

---

## Local setup

**Requirements:** Node.js 20 LTS or newer (Next.js 15 requires Node 18.18+), and npm.

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

On macOS/Linux use `cp .env.example .env.local` instead. Open <http://localhost:3000>. The staff desk is at <http://localhost:3000/admin>.

The app runs without any environment variables in development: the built-in seed notes are used and the admin passcode falls back to `adzu-admin`. If you copy `.env.example` unchanged, the passcode is `change-me-please` until you edit it.

### Production build (and PWA testing)

The service worker is registered **only in production**, so `npm run dev` will not show install/offline behavior.

```powershell
npm run icons   # only needed if public/icons is missing
npm run build
npm run start
```

`npm run icons` renders the PWA PNGs from the SVG chibi face using `sharp`.

---

## Environment variables

Copy `.env.example` to `.env.local` and fill in what you need. All variables are server-side except `NEXT_PUBLIC_SITE_URL`.

| Variable | Required | Purpose |
| --- | --- | --- |
| `ADMIN_PASSCODE` | Yes in production | Shared passcode for `/admin` and admin API calls. **Change it before deploying.** |
| `AI_BASE_URL` | No | Base URL of any OpenAI-compatible API. The app calls `${AI_BASE_URL}/chat/completions`. |
| `AI_API_KEY` | No | Key for the custom OpenAI-compatible endpoint. |
| `AI_MODEL` | No | Model name for the custom endpoint. |
| `OPENROUTER_API_KEY` | No | OpenRouter key. |
| `OPENROUTER_MODEL` | No | Defaults to `google/gemma-4-31b-it:free`. |
| `GEMINI_API_KEY` | No | Google Gemini API key. |
| `GEMINI_MODEL` | No | Defaults to `gemini-3.8-flash`. |
| `GROQ_API_KEY` | No | Groq API key. |
| `GROQ_MODEL` | No | Defaults to `openai/gpt-oss-120b`. |
| `BLOB_READ_WRITE_TOKEN` | Recommended on Vercel | Enables persistent uploads in Vercel Blob. Without it, a Vercel deployment is read-only for staff changes. |
| `NEXT_PUBLIC_SITE_URL` | No | Canonical site URL used for metadata/Open Graph. Defaults to `https://adzu-ask.vercel.app`. Set it to your real domain. |

`AI_BASE_URL`, `AI_API_KEY`, and `AI_MODEL` must all be set for the custom provider to be considered.

### Admin passcode

- **Local development:** if `ADMIN_PASSCODE` is unset, the passcode is `adzu-admin`. If you copy `.env.example` as-is, it is `change-me-please`.
- **Production:** set a long, random `ADMIN_PASSCODE`. If it is unset in production, all admin requests are rejected (fail closed).
- The browser stores the passcode in `sessionStorage` for the tab and sends it as the `x-admin-key` header. Locking the desk clears it.

---

## How answers are produced

1. The question is matched against the knowledge base with a lightweight lexical (TF-IDF-style) search. Results are weighted toward the selected desk (`admissions` or `scholarships`), with `general` notes also eligible.
2. The best passages are packed into a context block; up to six chunks and four source records are used.
3. Small talk ("hi", "thanks", etc.) is answered locally without an AI call. If nothing relevant is found, the guide says so and gives the Admissions & Aid Office contact details.
4. Otherwise, the app tries the configured AI providers **in this order**, skipping any without credentials:

   **custom OpenAI-compatible -> OpenRouter -> Gemini -> Groq -> quoted-notes mode**

   Each provider gets a 30-second timeout. Errors, empty replies, and replies shorter than 12 characters are ignored and the next provider is tried.
5. If every provider fails, the app falls back to **quoted-notes mode**: it extracts relevant sentences directly from the retrieved notes, adds citations, and labels the answer "quoted notes" in the UI.

Chat requests are rate-limited in memory to **40 requests per IP per 10 minutes**. This is best-effort and resets on cold starts or across multiple serverless instances.

The relevant implementation is in `lib/providers.ts`, `lib/kb.ts`, and `lib/text.ts`.

---

## Admin content desk

Open `/admin`, enter the admin passcode, and use **Feed the notes**.

### Adding content

- **Upload files** - drag and drop or choose files. Each file is sent in its own request.
- **Paste text** - paste a memo, FAQ, announcement, or notes.

Optional fields: title, desk (`admissions`, `scholarships`, or `general` / both), and a source URL (`http://` or `https://`). After ingestion, the document is chunked and available to the chat immediately.

### Supported formats

| Format | How it is handled |
| --- | --- |
| PDF | Text extracted on the server with `unpdf` (selectable text only). Scanned/image-only PDFs are rejected. |
| DOCX | Text extracted on the server with `mammoth`. |
| TXT, MD, Markdown, CSV | Read as UTF-8 text. |
| JSON | Flattened into readable `key: value` text. |
| HTML, HTM | Tags are stripped and text is kept. |
| XML | Read as UTF-8 text (markup is kept). |
| Images (PNG, JPEG, WebP, etc.) | OCR runs in the **browser** with Tesseract.js (English). Review or edit the extracted text before submitting. Images are never parsed on the server. |

### Limits and behavior

- **4 MB per file** (client and server), and **300,000 characters** of extracted text per document.
- Pasted text must be at least 30 characters.
- Identical text in the same category is rejected as a duplicate.
- Scanned PDFs with little selectable text: upload the page images so OCR can run, or paste the text.
- The library supports search, category filtering, full-text preview, source links, JSON export, and deletion.
- Removing a document removes it from future retrieval immediately.

---

## Storage

The app has three storage modes:

| Mode | When | Behavior |
| --- | --- | --- |
| `file` | Local development, no Blob token | Reads/writes `data/kb.json` (created on first save; gitignored). Falls back to `data/seed.ts` if the file is missing or invalid. |
| `blob` | `BLOB_READ_WRITE_TOKEN` is set | Reads/writes `adzu-ask/kb.json` in Vercel Blob. The KB is cached in memory for about 4 seconds. |
| `readonly` | On Vercel with no Blob token | The built-in seed notes are served, but uploads/deletes are rejected with a "read-only deployment" message. |

`data/seed.ts` is the committed starter knowledge base (official AdZU pages and notes). `data/kb.json` is **gitignored**, so notes added locally are not deployed automatically. Add them again through `/admin` on production, or maintain the seed file as code.

The Blob object is written with **public** access. Do not upload confidential, personal, or internal-only material; anyone with the URL can read the knowledge base JSON.

---

## PWA

- Manifest: `/manifest.webmanifest` (`app/manifest.ts`).
- Service worker: `/sw.js`, registered in production by `components/PwaRegister.tsx`.
- Offline fallback: `/offline`.
- Icons: `public/icons/` (generated by `npm run icons`).
- Install UI: `components/InstallButton.tsx` (Chrome/Edge/Android prompt plus iOS Safari instructions).

The service worker caches pages and static assets, but **not** `/api/*` responses. New questions require a connection; the current tab's conversation is kept in `sessionStorage` and survives reloads in that tab.

---

## Deploying to Vercel

The short version: push the repo to GitHub, import it at <https://vercel.com/new>, set `ADMIN_PASSCODE`, optionally add at least one AI key, connect a Vercel Blob store (recommended), and deploy.

Full step-by-step instructions - including CLI commands, Blob setup, verification, and troubleshooting - are in **[DEPLOY.md](./DEPLOY.md)**.

Important production notes:

- Without `BLOB_READ_WRITE_TOKEN`, a Vercel deployment runs in **read-only** mode: the seed notes work, but staff uploads do not persist.
- Vercel Functions have a request body limit of roughly **4.5 MB**; the app's own upload limit is **4 MB per file**.
- Vercel's filesystem is ephemeral, which is why local `data/kb.json` is not used in production.

---

## Project structure

```text
app/
  page.tsx                 landing page
  chat/[track]/page.tsx    admissions and scholarships chat
  admin/page.tsx           staff content desk
  offline/page.tsx         offline fallback
  robots.ts / sitemap.ts   crawler rules and sitemap
  api/chat/route.ts        answer generation
  api/ingest/route.ts      document ingestion
  api/kb/route.ts          knowledge-base list/delete
  api/health/route.ts      status, stats, provider flags
components/
  Chibi.tsx                five hand-built SVG chibi guides
  ChatRoom.tsx             chat UI
  AdminClient.tsx          admin UI, upload, OCR
  ...
lib/
  kb.ts                    retrieval and context building
  providers.ts             provider fallback chain
  parse.ts                 PDF/DOCX/text/image handling
  storage.ts               local vs Vercel Blob persistence
  auth.ts                  admin passcode check
  ...
data/seed.ts               starter knowledge base
public/sw.js               service worker
public/icons/              generated PWA icons
scripts/make-icons.mjs     icon generator
```

### API endpoints

| Endpoint | Method | Auth | Purpose |
| --- | --- | --- | --- |
| `/api/chat` | POST | None (rate-limited) | Ask a question on a track. |
| `/api/ingest` | POST | `x-admin-key` | Add a document by file or pasted text. |
| `/api/kb` | GET | Optional `x-admin-key` (full text) | List documents and stats. |
| `/api/kb?id=...` | DELETE | `x-admin-key` | Remove a document. |
| `/api/health` | GET | None | Health, KB stats, chunk count, configured providers. |

---

## A note on the art

Image generation was unavailable when this project was built, so there are **no raster AI-generated character images**. All five chibis - the director/welcome guide plus two guides for each track - are hand-built SVG in `components/Chibi.tsx`. The PWA icons are rendered from the same face with `scripts/make-icons.mjs`.

---

## License

MIT - see [LICENSE](./LICENSE).

AdZU Ask is an unofficial project and is not affiliated with or endorsed by Ateneo de Zamboanga University.
