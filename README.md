# AdZU Ask

**One chat for Ateneo de Zamboanga University college admissions and scholarships.** Ask in plain language; the right staff guide picks it up automatically, and every answer points back to the official notes it came from.

Built with Next.js 15 (App Router), React 19, TypeScript, and Tailwind CSS. Installable as a PWA.

> **Not the university.** AdZU Ask is an unofficial, student-built guide. The chibi guides are illustrations, not live staff. They cannot approve an application, reserve a slot, decide scholarship eligibility, or speak officially for AdZU. Confirm requirements, fees, deadlines, and eligibility with the College Admissions & Aid Office.

---

## The team

The five guides are based on the people listed on the official [College Admissions & Aid Office page](https://adzu.edu.ph/about-us/admissions-aid/). Names, roles, and assignments can change; confirm with the office.

| Guide | Full name | Role | Desk |
| --- | --- | --- | --- |
| **Ma'am Jen** | Jennifer G. Reyes | Director, College Admissions & Aid Office | Both |
| **Ma'am Sherry** | Sherry Gloria A. Lim | Admissions · CET Test Coordinator | Admissions |
| **Ma'am Marilou** | Marilou Pong | Admissions & enrollment | Admissions |
| **Ma'am Rose** | Rose Jasmine Lumigis | Scholarships & financial aid | Scholarships |
| **Ma'am Cris** | Crizel P. Cardenas | Scholarships & ASAA | Scholarships |

The public chat opens with Ma'am Jen. When you ask a question, a fast keyword-and-context router hands you to the right person. The handoff is visible in the transcript, and the chibi avatar beside each reply changes to match.

The staff directory is also in the knowledge base, so questions like "who is the director?" or "who handles scholarships?" can be answered with a citation.

---

## Features

- **Chat first, no lane picker.** `/` is the chat. The composer is focused, and the **director chibi, Ma'am Jen,** greets you immediately.
- **Automatic desk handoff.** Admissions questions go to Ma'am Sherry (CET, permits, schedules) or Ma'am Marilou (freshman, transferee, enrollment). Scholarship questions go to Ma'am Rose (grants, financial aid, requirements, documents) or Ma'am Cris (deadlines, status, renewals, ASAA, interviews, results). Ma'am Jen handles identity and office/location questions, staff questions, and anything unclear.
- **Inline chibi avatars.** The active guide's SVG chibi appears beside each reply in the transcript. The chibis blink, breathe, sway, and move their mouths while answering; there is no separate stage panel.
- **Cited answers.** Retrieval runs over the knowledge base; the model answers only from retrieved passages; citations look like `[1]`, `[2]`. A collapsible **Sources** panel shows the official page or file.
- **Program catalog guard.** The notes include the official college and graduate program lists, plus a negative note for programs AdZU does not offer. The prompt and a deterministic guard prevent the model from confirming an unlisted program; BS Mechanical Engineering is explicitly marked as not offered.
- **Real AI, with a fallback.** The app can use a custom OpenAI-compatible endpoint, Gemini, OpenRouter, Groq, or a local Ollama model, then the keyless Pollinations free tier. If every model is unavailable or rate-limited, it returns **quoted notes** and labels the answer, rather than guessing.
- **Conversation mode.** Off-topic messages, “please help”, and other non-policy chat get a short in-character reply that steers back to admissions or scholarships. It will not invent a fee, deadline, or requirement just to keep talking.
- **Fast chat conveniences.** Enter to send, Shift+Enter for a new line, read-aloud per answer, copy, new chat, session-tab memory, and deep links such as `/?q=How%20do%20I%20apply...`.
- **Team sheet.** See all five people, their full names, roles, and what they handle.
- **Staff content desk.** Passcode gate; guided note builder; PDF/DOCX/text upload with an editable preview; publish or save as draft; searchable library with edit, publish/unpublish, delete, and JSON export; and an **Info gaps** queue of questions the notes could not answer.
- **PWA.** Manifest, service worker, offline page, install prompt, and generated icons.

---

## How a question is answered

1. **Route.** `lib/staff.ts` scores the question against admissions and scholarship language. Follow-ups stay on the current desk. Identity questions ("are you real?", "who are you?") and office/location questions (address, contact, admissions office) always go to Ma'am Jen instead of inheriting the previous desk.
2. **Retrieve.** `lib/kb.ts` tokenizes the knowledge base, scores chunks with a TF-IDF-style lexical search, weights the selected desk, and returns up to six chunks and four source records. Draft notes are excluded.
3. **Answer.** The selected staff persona gets a system prompt with hard rules: use only the retrieved context, cite every factual claim, never promise a slot or award, and defer to the office for a specific case. If no note matched, the model gets **conversation mode** instead: it may greet, react, and ask a clarifying question, but it cannot state an admissions fact, fee, deadline, or requirement.
4. **Validate citations.** The reply is cleaned of emojis, actions in parentheses/asterisks, smart quotes, and citations that point outside the retrieved sources.
5. **Fallback.** If no model answers, the app extracts relevant sentences from the notes, adds citations, and labels the answer **quoted notes**. If the message was conversational and no model answered, it uses a short in-character fallback instead of the office dump. Identity questions get a deterministic "chibi guide" reply before any model call.

Requests are rate-limited in memory to **60 requests per IP per 10 minutes**. This is best-effort and resets on cold starts or across serverless instances.

---

## AI setup (free by default)

The app works without any API key. It tries providers in this order and skips any without credentials:

1. Custom OpenAI-compatible endpoint (`AI_BASE_URL`, `AI_API_KEY`, `AI_MODEL`)
2. Google Gemini (`GEMINI_API_KEY`, `GEMINI_MODEL`)
3. OpenRouter (`OPENROUTER_API_KEY`, `OPENROUTER_MODEL`)
4. Groq (`GROQ_API_KEY`, `GROQ_MODEL`)
5. Local Ollama (`OLLAMA_BASE_URL`, `OLLAMA_MODEL`)
6. **Pollinations free tier** (`FREE_AI=on`, `POLLINATIONS_MODEL=openai-fast`) — no key
7. Quoted notes

### What "free" means in practice

- **Pollinations** is keyless and works on a fresh deployment, but the anonymous tier is shared and rate-limited. When it is throttled, the app falls back to quoted notes. This is the zero-setup path.
- **Ollama** is the best local option. Set `OLLAMA_BASE_URL=http://127.0.0.1:11434` and `OLLAMA_MODEL=gemma3:4b` (or `llama3.1:8b`). The app only tries Ollama when the URL is set, so a Vercel deployment does not wait on localhost.
- **For a public deployment**, add one free key. Google AI Studio's free Gemini tier is the fastest path: <https://aistudio.google.com/apikey>. OpenRouter and Groq free tiers also work.
- The staff desk shows the active AI mode (`AI connected`, `Free AI (no key)`, or `Notes only`).

### Environment variables

Copy `.env.example` to `.env.local`. All AI variables are server-side.

| Variable | Required | Purpose |
| --- | --- | --- |
| `ADMIN_PASSCODE` | Yes in production | Passcode for `/admin` and admin API calls. |
| `GEMINI_API_KEY` | Recommended | Google AI Studio key. Free tier. |
| `GEMINI_MODEL` | No | Defaults to `gemini-3.5-flash-lite`. |
| `OPENROUTER_API_KEY` | No | OpenRouter key (free models supported). |
| `OPENROUTER_MODEL` | No | Defaults to `google/gemma-4-31b-it:free`. |
| `GROQ_API_KEY` | No | Groq key. |
| `GROQ_MODEL` | No | Defaults to `openai/gpt-oss-120b`. |
| `AI_BASE_URL` / `AI_API_KEY` / `AI_MODEL` | No | Any OpenAI-compatible endpoint; all three must be set. |
| `OLLAMA_BASE_URL` | No | Local Ollama base URL. Leave empty on Vercel. |
| `OLLAMA_MODEL` | No | Defaults to `gemma3:4b`. |
| `FREE_AI` | No | Set `off` to disable the Pollinations fallback. |
| `POLLINATIONS_MODEL` | No | Defaults to `openai-fast`. |
| `BLOB_READ_WRITE_TOKEN` | Recommended on Vercel | Persistent KB/gap storage via Vercel Blob. |
| `NEXT_PUBLIC_SITE_URL` | No | Canonical site URL for metadata. |

> **Privacy note:** free hosted models may retain messages. Don't paste confidential documents into the public chat. The staff desk is the place for internal notes. The Info gaps queue redacts emails and phone numbers, but other details in a question may remain.

---

## Staff content desk

Open `/admin` and enter the passcode.

- **Guided note** — answer a real student question with a title, desk, owner, short answer, steps, requirements, fee/deadline, and source URL. The app composes a clean note for retrieval. This is the recommended way to add a new FAQ.
- **Upload a file** — PDF (selectable text), DOCX, TXT, MD, CSV, JSON, HTML, XML, or an image (OCR in the browser). The extracted text is shown in an editable preview before anything is saved. Scanned PDFs with no selectable text are rejected; upload page images instead so OCR can run.
- **Paste text** — for memos, announcements, or copied official text.
- **Publish or draft** — published notes are used by the chat immediately. Drafts are hidden from retrieval and the public API.
- **Library** — search titles and full text, filter by desk or status, edit the full text, publish/unpublish, delete, and export JSON.
- **Info gaps** — questions the chat could not answer, or answered only with a fallback, are logged (emails and phone numbers redacted). Open one and draft a note directly from it.
- **Team** — the five staff profiles and office contact details.

Files are limited to **4 MB** and **300,000 characters** of extracted text. Duplicate text in the same desk is rejected. The Blob object is public; don't upload confidential material.

---

## Storage

| Mode | When | Behavior |
| --- | --- | --- |
| `file` | Local development, no Blob token | Reads/writes `data/kb.json` and `data/gaps.json` (gitignored). Falls back to `data/seed.ts` if missing. |
| `blob` | `BLOB_READ_WRITE_TOKEN` is set | Reads/writes `adzu-ask/kb.json` and `adzu-ask/gaps.json` in Vercel Blob. |
| `readonly` | On Vercel with no Blob token | Serves the seed notes; uploads/deletes are rejected. |

`data/seed.ts` is the committed starter knowledge base (official pages, requirements, staff directory, contacts). `data/kb.json` is gitignored, so notes added locally are not deployed automatically. Add them through `/admin` on production or maintain the seed file as code.

---

## Local setup

**Requirements:** Node.js 20 LTS or newer and npm. Optional: Ollama and a model (for local AI), Tesseract OCR runs in the browser.

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

On macOS/Linux use `cp .env.example .env.local` instead. Open <http://localhost:3000>. The staff desk is at <http://localhost:3000/admin>.

If `ADMIN_PASSCODE` is unset in development, the passcode is `adzu-admin`. If you copy `.env.example` unchanged, the passcode is `change-me-please` until you edit it. In production, an unset passcode fails closed (all admin requests are rejected).

### Production build (and PWA testing)

The service worker is registered only in production, so `npm run dev` will not show install/offline behavior.

```powershell
npm run icons   # only needed if public/icons is missing
npm run build
npm run start
```

---

## PWA

- Manifest: `/manifest.webmanifest` (`app/manifest.ts`)
- Service worker: `/sw.js`, registered in production by `components/PwaRegister.tsx`
- Offline fallback: `/offline`
- Icons: `public/icons/`, generated from the generic speech-bubble logo (`public/brand/adzu-ask-logo.svg`) by `npm run icons`
- Install UI: `components/InstallButton.tsx`

The service worker caches pages and static assets, but not `/api/*`. New questions need a connection. The current tab's conversation is kept in `sessionStorage`.

---

## Deploying to Vercel

1. Push the repo to GitHub.
2. Import it at <https://vercel.com/new>.
3. Set `ADMIN_PASSCODE` and, optionally, one AI key (Gemini is enough for a good free default).
4. Connect a Vercel Blob store and set `BLOB_READ_WRITE_TOKEN` so staff uploads persist.
5. Deploy.

Without a Blob store, a Vercel deployment runs in **read-only** mode: the seed notes work, but staff uploads do not persist. Vercel Functions have a request body limit of about **4.5 MB**; the app's own upload limit is **4 MB per file**.

Full step-by-step instructions are in **[DEPLOY.md](./DEPLOY.md)**.

---

## Project structure

```text
app/
  page.tsx                 the one chat
  chat/[track]/page.tsx    old deep links -> /?desk=...
  admin/page.tsx           staff content desk
  offline/page.tsx         offline fallback
  api/chat/route.ts        route + answer
  api/ingest/route.ts      preview, save, publish notes
  api/kb/route.ts          library list/edit/delete
  api/gaps/route.ts        unanswered-question queue
  api/health/route.ts      status and provider flags
components/
  ChatExperience.tsx       chat shell, handoffs, voice, memory
  Chibi.tsx                five animated SVG chibis
  TeamSheet.tsx            all five staff profiles
  AdminDesk.tsx            staff content desk UI
  MarkdownText.tsx         safe local markdown renderer
lib/
  staff.ts                 staff profiles + fast desk routing
  providers.ts             AI chain + citation checks
  kb.ts                    retrieval + quoted-note fallback
  gaps.ts                  redacted unanswered-question storage
  storage.ts               local/Blob knowledge base
  parse.ts                 PDF/DOCX/text extraction
data/seed.ts               starter knowledge base
public/sw.js               service worker
public/icons/              generated PWA icons
scripts/make-icons.mjs     icon generator
```

### API endpoints

| Endpoint | Method | Auth | Purpose |
| --- | --- | --- | --- |
| `/api/chat` | POST | None (rate-limited) | Route a question and generate an answer. |
| `/api/ingest?preview=1` | POST | `x-admin-key` | Extract text from a file without saving. |
| `/api/ingest` | POST | `x-admin-key` | Save a note (JSON or multipart). |
| `/api/kb` | GET | Optional `x-admin-key` | Public library; `?full=1` requires a valid admin key (401 otherwise) and includes drafts and full text. |
| `/api/kb` | PATCH | `x-admin-key` | Edit a note, change status, or publish/unpublish. |
| `/api/kb?id=...` | DELETE | `x-admin-key` | Remove a note. |
| `/api/gaps` | GET/PATCH/DELETE | `x-admin-key` | Read, resolve, or dismiss unanswered questions. |
| `/api/health` | GET | None | Health, KB stats, chunk count, provider flags. |

---

## Art and animation

The chibis are **hand-authored SVG**, not generated raster images. Image generation was unavailable when this project was built, so every character is drawn directly in SVG. That also keeps the faces crisp at every size, lets the same art work as the inline chat avatar, and makes the animations possible without video or sprite sheets.

Each character has a layered SVG with a distinct face shape, eyes, brows, nose, mouth, hairline, outfit, and accessories. CSS drives the idle breathing, blinking, hair sway, ponytail/bun sway, plant sway, and the talking mouth. `prefers-reduced-motion` turns the animation off.

The PWA icons are rendered from the generic AdZU Ask speech-bubble logo with `sharp` in `scripts/make-icons.mjs`.

---

## Disclaimer

AdZU Ask is an unofficial project and is not affiliated with or endorsed by Ateneo de Zamboanga University. The chibi guides are illustrations of real staff names from the public AdZU directory, not the staff themselves. Always confirm requirements, fees, deadlines, and eligibility with the College Admissions & Aid Office.

## License

MIT — see [LICENSE](./LICENSE).
