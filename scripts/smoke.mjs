const BASE = process.env.BASE_URL || "http://localhost:3000";
const ADMIN = process.env.ADMIN_PASSCODE || "adzu-admin";

async function json(path, init) {
  const response = await fetch(`${BASE}${path}`, init);
  const data = await response.json().catch(() => ({}));
  return { response, data };
}

const results = [];
function check(name, ok, detail) {
  results.push({ name, ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
}

const home = await fetch(`${BASE}/`);
const homeHtml = await home.text();
check(
  "home page is the chat",
  home.ok && homeHtml.includes("Ask anything about AdZU"),
  String(home.status),
);
check(
  "document title",
  /<title>AdZU Ask/.test(homeHtml),
  homeHtml.match(/<title>(.*?)<\/title>/)?.[1] || "missing",
);

const health = await json("/api/health");
check(
  "health endpoint",
  health.response.ok && health.data.chunks > 10,
  `${health.data.chunks} chunks · ${health.data.stats?.aiLabel}`,
);

const chat = await json("/api/chat", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({
    messages: [{ role: "user", content: "How do I get a test permit?" }],
  }),
});
check(
  "chat endpoint routes and answers",
  chat.response.ok &&
    Boolean(chat.data.reply) &&
    Boolean(chat.data.staff) &&
    Boolean(chat.data.track),
  `${chat.data.track}/${chat.data.staff} · ${chat.data.provider}`,
);

const publicKb = await json("/api/kb");
check(
  "public kb hides full text",
  publicKb.response.ok &&
    !publicKb.data.documents?.some((doc) => typeof doc.text === "string"),
  `${publicKb.data.documents?.length ?? 0} docs`,
);

const adminKb = await json("/api/kb?full=1", {
  headers: { "x-admin-key": ADMIN },
});
check(
  "admin kb unlocks full text",
  adminKb.response.ok &&
    adminKb.data.documents?.every((doc) => typeof doc.text === "string"),
  `${adminKb.data.documents?.length ?? 0} docs`,
);

const draft = await json("/api/ingest", {
  method: "POST",
  headers: {
    "content-type": "application/json",
    "x-admin-key": ADMIN,
  },
  body: JSON.stringify({
    title: "Smoke test draft — delete me",
    category: "general",
    text: "This is a temporary smoke-test note used to verify draft, publish, and delete. It is not an official AdZU note.",
    status: "draft",
    sourceType: "note",
  }),
});
check("save draft", draft.response.ok && Boolean(draft.data.document?.id), draft.data.document?.status);

const id = draft.data.document?.id;
if (id) {
  const hidden = await json("/api/kb");
  check(
    "draft is hidden from the public list",
    !hidden.data.documents?.some((doc) => doc.id === id),
  );

  const published = await json("/api/kb", {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
      "x-admin-key": ADMIN,
    },
    body: JSON.stringify({ id, status: "published" }),
  });
  check("publish draft", published.response.ok, String(published.data.stats?.published));

  const visible = await json("/api/kb");
  check(
    "published note appears publicly",
    visible.data.documents?.some((doc) => doc.id === id),
  );

  const deleted = await fetch(`${BASE}/api/kb?id=${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: { "x-admin-key": ADMIN },
  });
  check("delete note", deleted.ok, String(deleted.status));
}

const failed = results.filter((result) => !result.ok);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
if (failed.length) process.exitCode = 1;
