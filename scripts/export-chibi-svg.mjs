/**
 * Exports the director chibi as a standalone SVG for PWA/social icons.
 * Run the dev server first:
 *   node scripts/export-chibi-svg.mjs
 */
import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
await page.goto("http://localhost:3000/chibi-preview", {
  waitUntil: "networkidle",
});
await page.waitForSelector("svg");
const svgs = await page.$$eval("svg", (nodes) =>
  nodes.map((node) => node.outerHTML),
);
await browser.close();

const director = svgs.find((svg) => svg.includes("chibi-director-skin"));
if (!director) throw new Error("Could not find the director chibi SVG.");

const standalone = director
  .replace("<svg ", '<svg xmlns="http://www.w3.org/2000/svg" width="320" height="360" ')
  .replace(/ class="[^"]*"/, "")
  .replace(/ style="[^"]*"/, "");

await mkdir("public/chibis", { recursive: true });
await writeFile("public/chibis/director.svg", standalone, "utf8");
console.log("wrote public/chibis/director.svg");
