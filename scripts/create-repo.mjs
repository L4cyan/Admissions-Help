import { execFileSync } from "node:child_process";

const OWNER = "L4cyan";
const REPO = "Admissions-Help";

const credential = execFileSync("git", ["credential", "fill"], {
  input: "protocol=https\nhost=github.com\n\n",
  encoding: "utf8",
  env: { ...process.env, GIT_TERMINAL_PROMPT: "0" },
});
const token = credential.match(/^password=(.*)$/m)?.[1];
if (!token) {
  console.error("No GitHub credential found.");
  process.exit(1);
}

const headers = {
  authorization: `token ${token}`,
  "user-agent": "adzu-ask-deploy",
  accept: "application/vnd.github+json",
  "content-type": "application/json",
};

const existing = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}`, {
  headers,
});
if (existing.ok) {
  const repo = await existing.json();
  console.log(`EXISTS ${repo.html_url}`);
  console.log(`CLONE ${repo.clone_url}`);
  process.exit(0);
}
if (existing.status !== 404) {
  console.error(`GitHub check failed: ${existing.status} ${await existing.text()}`);
  process.exit(1);
}

const response = await fetch("https://api.github.com/user/repos", {
  method: "POST",
  headers,
  body: JSON.stringify({
    name: REPO,
    description:
      "AdZU Ask — a chibi admissions & scholarships guide for Ateneo de Zamboanga University. Next.js PWA with cited answers and a staff content desk.",
    private: false,
    auto_init: false,
    has_issues: true,
  }),
});
const data = await response.json();
if (!response.ok) {
  console.error(`Create failed: ${response.status} ${JSON.stringify(data)}`);
  process.exit(1);
}
console.log(`CREATED ${data.html_url}`);
console.log(`CLONE ${data.clone_url}`);
