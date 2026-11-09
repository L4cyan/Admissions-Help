import { chromium } from "playwright";
import fs from "node:fs/promises";

const BASE = process.env.BASE_URL || "http://localhost:3000";
const ADMIN = process.env.ADMIN_PASSCODE || "adzu-admin";
await fs.mkdir("screenshots", { recursive: true });

const errors = [];
const browser = await chromium.launch();

async function watch(page) {
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(`console: ${message.text()}`);
  });
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
}

const desktop = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
});
const page = await desktop.newPage();
await watch(page);
await page.goto(BASE, { waitUntil: "networkidle" });
console.log("title:", await page.title());
console.log("h1:", await page.locator("h1").first().innerText());
await page.screenshot({ path: "screenshots/home-desktop.png" });

await page.fill("#chat-input", "What scholarships can I apply for?");
await page.press("#chat-input", "Enter");
await page.waitForSelector(".msg-typing", { state: "detached", timeout: 90000 });
await page.waitForTimeout(500);
console.log(
  "chat answer:",
  (await page.locator(".markdown").last().innerText()).slice(0, 220),
);
await page.screenshot({ path: "screenshots/chat-desktop.png" });

const mobile = await browser.newContext({
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
  deviceScaleFactor: 2,
});
const mobilePage = await mobile.newPage();
await watch(mobilePage);
await mobilePage.goto(BASE, { waitUntil: "networkidle" });
await mobilePage.screenshot({ path: "screenshots/home-mobile.png" });
await mobilePage.fill("#chat-input", "I am a transferee. What do I need?");
await mobilePage.press("#chat-input", "Enter");
await mobilePage.waitForSelector(".msg-typing", { state: "detached", timeout: 90000 });
await mobilePage.waitForTimeout(500);
await mobilePage.screenshot({ path: "screenshots/chat-mobile.png" });

const admin = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
});
const adminPage = await admin.newPage();
await watch(adminPage);
await adminPage.goto(`${BASE}/admin`, { waitUntil: "networkidle" });
await adminPage.fill("#admin-pass", ADMIN);
await adminPage.getByRole("button", { name: /Unlock the desk/i }).click();
await adminPage.waitForSelector("text=Content desk", { timeout: 30000 });
await adminPage.screenshot({ path: "screenshots/admin-desktop.png" });

console.log("errors:", errors.length ? errors : "none");
await browser.close();
