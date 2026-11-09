import { chromium } from "playwright";
import fs from "node:fs/promises";

const BASE = "http://localhost:3000";
await fs.mkdir("screenshots", { recursive: true });

const errors = [];
const browser = await chromium.launch();

async function watch(page) {
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(`console: ${message.text()}`);
  });
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
}

const desktop = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const page = await desktop.newPage();
await watch(page);
await page.goto(BASE, { waitUntil: "networkidle" });
console.log("title:", await page.title());
console.log("h1:", await page.locator("h1").first().innerText());
console.log("choose cards:", await page.locator('a[href^="/chat/"]').count());
await page.screenshot({ path: "screenshots/home-desktop.png", fullPage: true });

await page.goto(`${BASE}/chat/admissions`, { waitUntil: "networkidle" });
await page.waitForSelector("#chat-input");
await page.fill("#chat-input", "How do I apply for the CET and where do I get the test permit?");
await page.press("#chat-input", "Enter");
await page.waitForFunction(() => document.querySelectorAll(".markdown").length >= 2, null, {
  timeout: 30000,
});
await page.waitForTimeout(500);
console.log("chat answer:", (await page.locator(".markdown").last().innerText()).slice(0, 220));
await page.screenshot({ path: "screenshots/chat-desktop.png", fullPage: false });

const mobile = await browser.newContext({
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
  deviceScaleFactor: 2,
});
const mobilePage = await mobile.newPage();
await watch(mobilePage);
await mobilePage.goto(BASE, { waitUntil: "networkidle" });
await mobilePage.screenshot({ path: "screenshots/home-mobile.png", fullPage: true });
await mobilePage.goto(`${BASE}/chat/scholarships?q=What%20documents%20do%20I%20need%20for%20a%20scholarship%3F`, {
  waitUntil: "networkidle",
});
await mobilePage.waitForFunction(() => document.querySelectorAll(".markdown").length >= 2, null, {
  timeout: 30000,
});
await mobilePage.waitForTimeout(500);
await mobilePage.screenshot({ path: "screenshots/chat-mobile.png", fullPage: false });

const admin = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const adminPage = await admin.newPage();
await watch(adminPage);
await adminPage.goto(`${BASE}/admin`, { waitUntil: "networkidle" });
await adminPage.fill("#passcode", "adzu-admin");
await adminPage.click('button[type="submit"]');
await adminPage.waitForSelector("text=Teach the chibis.", { timeout: 20000 });
console.log("admin docs:", await adminPage.locator("text=Documents").count());
await adminPage.screenshot({ path: "screenshots/admin-desktop.png", fullPage: true });

console.log("errors:", errors.length ? errors : "none");
await browser.close();
