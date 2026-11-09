import sharp from "sharp";
import fs from "node:fs/promises";

/**
 * Builds the PWA icons from the actual director chibi SVG (exported by
 * scripts/export-chibi-svg.mjs). No raster image generation is involved.
 */
const chibi = await fs.readFile("public/chibis/director.svg", "utf8");

const chibiPng = await sharp(Buffer.from(chibi))
  .resize(360, 405, {
    fit: "contain",
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .png()
  .toBuffer();

const iconBackground = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="112" fill="#0b1f4a"/>
  <circle cx="256" cy="256" r="184" fill="#f8f1e2"/>
  <circle cx="256" cy="256" r="184" fill="none" stroke="#d7a62d" stroke-width="12"/>
  <circle cx="256" cy="256" r="166" fill="none" stroke="#e7d3a5" stroke-width="2" opacity=".75"/>
  <ellipse cx="256" cy="428" rx="128" ry="16" fill="#071632" opacity=".16"/>
</svg>`;

const backgroundPng = await sharp(Buffer.from(iconBackground)).png().toBuffer();
const composed = await sharp(backgroundPng)
  .composite([{ input: chibiPng, left: 76, top: 48 }])
  .png()
  .toBuffer();

const maskableBackground = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#0b1f4a"/>
</svg>`;
const maskableBackgroundPng = await sharp(Buffer.from(maskableBackground))
  .png()
  .toBuffer();
const maskableChibi = await sharp(composed)
  .resize(410, 410, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toBuffer();
const maskable = await sharp(maskableBackgroundPng)
  .composite([{ input: maskableChibi, left: 51, top: 51 }])
  .png()
  .toBuffer();

await fs.mkdir("public/icons", { recursive: true });

const jobs = [
  [composed, "public/icons/icon-192.png", 192],
  [composed, "public/icons/icon-512.png", 512],
  [composed, "public/icons/apple-touch-icon.png", 180],
  [maskable, "public/icons/maskable-512.png", 512],
];

for (const [buffer, file, size] of jobs) {
  await sharp(buffer).resize(size, size).png().toFile(file);
  console.log("wrote", file);
}
