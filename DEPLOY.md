# Deploying AdZU Ask

This guide covers GitHub, Vercel, environment variables, Vercel Blob, and post-deploy checks. Commands are shown for Windows PowerShell; macOS/Linux equivalents are usually identical apart from shell copy commands.

`gh` (GitHub CLI) and `vercel` (Vercel CLI) are **optional**. The dashboard route works without either. If you prefer CLI, install them first.

---

## 0. Before you start

You need:

- Node.js 20 LTS or newer (Next.js 15 requires Node 18.18+), and npm
- A GitHub account
- A Vercel account
- A strong admin passcode
- Optional but recommended: one free AI key (Gemini/OpenRouter/Groq). With no key, the app uses Pollinations' free tier, then quoted notes.
- A Vercel Blob store, if staff uploads must persist
- Rights to publish every document you upload to the knowledge base

Verify the production build locally:

```powershell
npm ci
npm run icons
npm run build
npm run start
```

If `npm ci` complains about the lockfile, use `npm install`. Open <http://localhost:3000>, ask a scholarship question and an admissions question to see the handoff, then unlock `/admin` before deploying.

Useful checks:

```powershell
Invoke-RestMethod http://localhost:3000/api/health
```

---

## 1. Push the project to GitHub

### Option A - GitHub website (no `gh` needed)

1. Create a new **empty** repository at <https://github.com/new>. Do not add a README, license, or `.gitignore` (the project already has them).
2. In the project folder:

```powershell
git init
git add .
git commit -m "Initial commit: AdZU Ask"
git branch -M main
git remote add origin https://github.com/<your-username>/adzu-ask.git
git push -u origin main
```

If Git asks you to sign in, use a GitHub personal access token or Git Credential Manager.

Before committing, confirm that secrets and local data are excluded:

```powershell
git status --short
```

`.gitignore` already excludes `.env`, `.env*.local`, `.env.production`, `data/kb.json`, `data/*.bak`, `.next/`, and `node_modules/`. Do not force-add them.

### Option B - GitHub CLI

Check whether `gh` is installed:

```powershell
gh --version
```

If it is missing on Windows:

```powershell
winget install --id GitHub.cli
```

Then reopen the terminal and run:

```powershell
git init
git add .
git commit -m "Initial commit: AdZU Ask"
git branch -M main
gh auth login
gh repo create adzu-ask --public --source=. --remote=origin --push
```

If the project is already a Git repository with a commit, skip the first four commands. If the repository already exists on GitHub, add it as a remote and push instead:

```powershell
git remote add origin https://github.com/<your-username>/adzu-ask.git
git push -u origin main
```

---

## 2. Deploy with the Vercel dashboard

1. Go to <https://vercel.com/new> and import the GitHub repository.
2. Keep the detected **Framework Preset: Next.js**. Root directory `./`, build command `npm run build`, install command default (`npm install` / `npm ci`), output default `.next`.
3. Add environment variables (expand **Environment Variables**):

| Name | Value | Environments |
| --- | --- | --- |
| `ADMIN_PASSCODE` | A long random passphrase | Production (and Preview if you use it) |
| `GEMINI_API_KEY` | Free Google AI Studio key (recommended), **or** use one of the alternatives below | Production |
| `BLOB_READ_WRITE_TOKEN` | Do not add this manually; Vercel injects it when you connect a Blob store (step below) | Production, Preview, Development |
| `NEXT_PUBLIC_SITE_URL` | `https://<your-project>.vercel.app` (or your custom domain); leave blank on the first deploy if you do not know the URL yet | Production |

Pick **one** AI option (Gemini is the fastest free default):

- `GEMINI_API_KEY` (optionally `GEMINI_MODEL`) — free tier from <https://aistudio.google.com/apikey>
- `OPENROUTER_API_KEY` (optionally `OPENROUTER_MODEL`)
- `GROQ_API_KEY` (optionally `GROQ_MODEL`)
- `AI_BASE_URL` + `AI_API_KEY` + `AI_MODEL` for any OpenAI-compatible API

No key? Leave them all blank. The app tries Pollinations' keyless free tier, then falls back to quoted notes. Pollinations' anonymous tier is rate-limited, so a free Gemini key is strongly recommended for a public deployment. Do **not** set `OLLAMA_BASE_URL` on Vercel; it is for local/self-hosted use.

You may configure more than one. The fallback order is custom -> OpenRouter -> Gemini -> Groq -> quoted notes.

4. Click **Deploy**.

### Create the Blob store

Do this before staff upload anything.

1. Open the project in Vercel.
2. Go to **Storage** -> **Create** -> **Blob**.
3. Name the store, create it, and **Connect** it to this project.
4. Vercel injects `BLOB_READ_WRITE_TOKEN` into the project's environments. Confirm it appears under **Settings** -> **Environment Variables**.
5. Redeploy if the store was connected after the current deployment was built.

Without this token, the deployment is **read-only**: the built-in seed notes still answer questions, but `/admin` refuses new uploads and deletes.

### Custom domain (optional)

Add the domain under **Settings** -> **Domains**, then update `NEXT_PUBLIC_SITE_URL` to the final URL and redeploy so canonical/Open Graph metadata is correct.

---

## 3. Deploy with the Vercel CLI

Check whether the CLI is installed:

```powershell
vercel --version
```

If it is missing:

```powershell
npm i -g vercel
```

Then:

```powershell
vercel login
vercel
vercel --prod
```

The first `vercel` run links the current folder to a project (or creates one) and makes a preview deployment. `vercel --prod` promotes the build to production.

Set environment variables from the CLI:

```powershell
vercel env add ADMIN_PASSCODE production
vercel env add OPENROUTER_API_KEY production
```

Each command prompts for the value. Add the same variables to `preview` and `development` if needed. To inspect or remove them:

```powershell
vercel env ls
vercel env rm ADMIN_PASSCODE production
```

After changing environment variables, redeploy:

```powershell
vercel --prod
```

To pull the project's environment into a local file:

```powershell
vercel env pull .env.local
```

Blob store creation is easiest in the dashboard (**Storage** -> **Create** -> **Blob** -> **Connect**). Vercel then supplies `BLOB_READ_WRITE_TOKEN`; do not invent or hardcode a token.

---

## 4. Environment variable reference

| Variable | Required | Notes |
| --- | --- | --- |
| `ADMIN_PASSCODE` | **Yes in production** | Long random secret. If unset in production, admin access fails closed. Locally it defaults to `adzu-admin` only when the variable is unset. |
| `AI_BASE_URL` | One AI option | Base URL only; the app appends `/chat/completions`. Usually ends in `/v1`. |
| `AI_API_KEY` | One AI option | Key for the custom endpoint. |
| `AI_MODEL` | One AI option | Model ID for the custom endpoint. |
| `OPENROUTER_API_KEY` | One AI option | Free OpenRouter models are supported. |
| `OPENROUTER_MODEL` | No | Default: a free OpenRouter model. |
| `GEMINI_API_KEY` | One AI option | Google AI Studio / Gemini API key. Recommended free default. |
| `GEMINI_MODEL` | No | Default: `gemini-3.5-flash-lite`. |
| `GROQ_API_KEY` | One AI option | Groq API key. |
| `GROQ_MODEL` | No | Default: `openai/gpt-oss-120b`. |
| `OLLAMA_BASE_URL` | No | Local/self-hosted Ollama only. Leave blank on Vercel. |
| `OLLAMA_MODEL` | No | Default: `gemma3:4b`. |
| `FREE_AI` | No | `on` (default) enables the keyless Pollinations fallback; `off` disables it. |
| `POLLINATIONS_MODEL` | No | Default: `openai-fast`. |
| `BLOB_READ_WRITE_TOKEN` | Strongly recommended | Added automatically when a Blob store is connected. Without it, uploads do not persist on Vercel. |
| `NEXT_PUBLIC_SITE_URL` | No | Defaults to `https://adzu-ask.vercel.app`; set it to your deployment URL or custom domain. |

Never commit `.env.local` or provider keys. Environment variable changes only take effect after a new deployment.

---

## 5. Why there is no `vercel.json`

No `vercel.json` is needed for this project:

- `app/api/chat/route.ts` and `app/api/ingest/route.ts` already declare `runtime = "nodejs"` and `maxDuration = 60` using Next.js route segment config.
- Vercel auto-detects Next.js; no rewrites, redirects, custom headers, or custom output directory are required.
- The `serverExternalPackages` setting for `unpdf`, `mammoth`, and `@vercel/blob` lives in `next.config.ts`.

Adding a `vercel.json` `functions` block would duplicate the route config and could drift out of sync. If one is added later for another reason, keep the duration settings consistent with the route files.

---

## 6. Upload size limits on Vercel

Vercel Functions have a request body limit of approximately **4.5 MB**. This app enforces a stricter **4 MB per file** limit (`MAX_FILE_BYTES` in `lib/parse.ts`) and a **300,000 character** extracted-text limit.

Practical consequences:

- Upload one file per request; the admin UI already submits files sequentially.
- PDFs and DOCX files larger than 4 MB are rejected before parsing.
- Large scanned documents should be split, uploaded as page images for browser OCR, or pasted as text.
- Images are OCR'd **in the browser**, but the original image is still attached to the admin request, so the 4 MB cap still applies.
- A 413 / "payload too large" response usually means the request exceeded Vercel's ~4.5 MB platform limit.

---

## 7. Post-deploy verification

1. **Health check**

```powershell
Invoke-RestMethod https://<your-deployment>/api/health
```

Confirm:

- `ok: true`
- `stats.storage` is `blob` (or `readonly` if you intentionally skipped Blob)
- `providers` shows at least one `true` if you configured AI
- `chunks` is greater than zero

2. **Admin flow**

- Open `/admin` and unlock with `ADMIN_PASSCODE`.
- Upload a small TXT file or paste a note.
- Confirm it appears in the library and that the storage badge reads **Vercel Blob**.
- Delete the test document.

3. **Chat flow**

- Ask a question that exists in the seed notes, e.g. "How do I apply for the CET?"
- Confirm the answer has citations and that **Sources** lists the matching document.
- If AI is not configured, the answer should be labeled **quoted notes** and still include citations.

4. **PWA**

- Open DevTools -> **Application** -> **Manifest** and confirm the manifest and icons load.
- Confirm the service worker is registered (production deployment only).
- Install the app from the browser prompt, or use the iOS "Add to Home Screen" instructions.
- Go offline and confirm the `/offline` page appears. New chat questions require a connection by design.

5. **Blob persistence**

- Add a note in production, then redeploy (or wait for a new deployment) and confirm the note is still present.
- Open the connected Blob store and verify `adzu-ask/kb.json` exists.

---

## 8. Troubleshooting

| Symptom | Likely cause / fix |
| --- | --- |
| `/admin` rejects the passcode | `ADMIN_PASSCODE` is unset, wrong, or the deployment predates the env change. Set it and redeploy. In production there is no fallback. |
| Admin says "read-only deployment" | No `BLOB_READ_WRITE_TOKEN` in the Vercel environment. Connect a Blob store and redeploy. |
| Uploads work locally but not on Vercel | Local writes go to `data/kb.json`, which is not deployed. Connect Blob and re-add the documents through production `/admin`. Alternatively, edit `data/seed.ts` and redeploy. |
| Answers always say "quoted notes" / no AI | No provider key is set, or all providers failed or were rate-limited. Pollinations' anonymous tier allows roughly one reply per 45 seconds per IP. Check `/api/health` provider flags and Vercel function logs for `[chat] <provider> failed`. Add a free Gemini key for a reliable public default. |
| 504 / function timeout | The route caps the whole answer at about 30 seconds and the platform function at 60. If several providers are slow, the notes fallback runs before the cap. Remove unused keys, use a faster provider, or increase `maxDuration` if your plan allows. |
| 413 Payload Too Large | File exceeds the app's 4 MB cap or Vercel's ~4.5 MB body limit. Split the file or paste the relevant text. |
| Scanned PDF rejected | It has no selectable text. Upload page images so browser OCR can extract text, or paste the text. |
| Image OCR does not start / takes long | Tesseract.js runs in the browser and downloads its engine and English language data on first use. Check the user's network and try a clearer image. |
| PWA does not install / service worker absent | Service workers require HTTPS (Vercel provides it) and a production build. `npm run dev` intentionally skips registration. Confirm `/manifest.webmanifest`, `/sw.js`, and `/icons/*` return 200. |
| PWA icons 404 | Run `npm run icons`, commit `public/icons/`, and redeploy. |
| Wrong canonical/Open Graph URL | Set `NEXT_PUBLIC_SITE_URL` to the final domain and redeploy. |
| Blob read/write errors | The token is missing, revoked, or connected to the wrong store. Reconnect the Blob store and redeploy. |
| Production library suddenly shows only the built-in seed notes | A Blob read failed and `getKB()` fell back to the seed KB. Check the Blob store and `/api/health` before uploading - saving while in fallback mode can overwrite the real KB with seed notes plus the new document. |
| Custom notes missing after a new deployment | Confirm `BLOB_READ_WRITE_TOKEN` is present in the current environment and the Blob store is still connected. Local `data/kb.json` is not deployed. |

---

## 9. Security and operations

- **The knowledge base and gap log are public in Blob mode.** Blob objects are written with public access (`adzu-ask/kb.json`, `adzu-ask/gaps.json`). Drafts are included in the KB JSON even though the chat hides them. Do not upload confidential, personal, or internal-only documents.
- **The admin passcode is a shared secret.** Use a long random value, rotate it if it leaks, and remember that locking the desk only clears the browser's `sessionStorage`.
- **Admin endpoints are protected by the passcode only.** There is no separate rate limit or account system for admin attempts. Use a strong passcode.
- **Chat rate limiting is best-effort.** It uses an in-memory map (60 requests per IP per 10 minutes) and is not shared across serverless instances or cold starts.
- **Admin writes are last-write-wins.** Each save replaces the whole `kb.json`; avoid simultaneous edits from multiple staff sessions, or one upload can overwrite another.
- **AI providers receive the user's question and retrieved note snippets.** Do not ingest material that cannot be sent to Pollinations, Google, OpenRouter, Groq, Ollama, or your custom provider.
- **Free AI is best-effort.** Pollinations' anonymous tier is shared and rate-limited. Add a free Gemini key for predictable production behavior.
- **`/api/health` is public.** It exposes document counts, storage mode, chunk count, and which providers are configured - but no keys or document text.
- **This is an unofficial project.** Keep the disclaimers visible and confirm policy wording with the Admissions & Aid Office before a public launch.
