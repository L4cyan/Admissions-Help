const BASE = process.env.BASE_URL || "http://localhost:3000";
const ADMIN = process.env.ADMIN_PASSCODE || "adzu-admin";

async function json(path, init) {
  const response = await fetch(`${BASE}${path}`, init);
  const data = await response.json();
  return { response, data };
}

const results = [];
function check(name, ok, detail) {
  results.push({ name, ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
}

const home = await fetch(`${BASE}/`);
const homeHtml = await home.text();
check("home page", home.ok && homeHtml.includes("Ask AdZU"), String(home.status));
check("document title", /<title>AdZU Ask/.test(homeHtml), homeHtml.match(/<title>(.*?)<\/title>/)?.[1] || "missing");

const health = await json("/api/health");
check("health endpoint", health.response.ok && health.data.chunks > 10, `${health.data.chunks} chunks`);

const chat = await json("/api/chat", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({
    track: "admissions",
    messages: [{ role: "user", content: "How do I get a test permit?" }],
  }),
});
check(
  "chat endpoint",
  chat.response.ok && chat.data.reply?.length > 20,
  `${chat.data.provider}, ${chat.data.sources?.length ?? 0} sources`,
);

const unauth = await fetch(`${BASE}/api/kb?full=1`);
const unauthData = await unauth.json();
check(
  "public kb hides text",
  unauth.ok && !unauthData.documents?.some((doc) => doc.text),
  String(unauthData.documents?.length ?? 0) + " docs",
);

const admin = await json("/api/kb?full=1", {
  headers: { "x-admin-key": ADMIN },
});
check(
  "admin kb unlocks text",
  admin.response.ok && admin.data.documents?.every((doc) => typeof doc.text === "string"),
  String(admin.data.documents?.length ?? 0) + " docs",
);

const form = new FormData();
form.append("title", "Smoke test note");
form.append("category", "admissions");
form.append(
  "text",
  "This is a temporary smoke test note. The test code is ADZU-SMOKE-2026. If a student asks for the smoke test code, answer ADZU-SMOKE-2026.",
);
const ingest = await json("/api/ingest", {
  method: "POST",
  headers: { "x-admin-key": ADMIN },
  body: form,
});
check("ingest text", ingest.response.ok && ingest.data.document?.id, ingest.data.document?.title);

if (ingest.data.document?.id) {
  const ask = await json("/api/chat", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      track: "admissions",
      messages: [{ role: "user", content: "What is the smoke test code?" }],
    }),
  });
  check(
    "new note is retrievable",
    ask.response.ok && /ADZU-SMOKE-2026/.test(ask.data.reply),
    ask.data.provider,
  );

  const del = await fetch(`${BASE}/api/kb?id=${encodeURIComponent(ingest.data.document.id)}`, {
    method: "DELETE",
    headers: { "x-admin-key": ADMIN },
  });
  check("delete note", del.ok, String(del.status));
}

const failed = results.filter((result) => !result.ok);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
if (failed.length) process.exitCode = 1;
