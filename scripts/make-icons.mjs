import sharp from "sharp";
import fs from "node:fs/promises";

/**
 * PWA icons use the generic AdZU Ask speech-bubble mark, not a staff face.
 */
const logo = await fs.readFile("public/brand/adzu-ask-logo.svg");
const icon = await sharp(Buffer.from(logo)).resize(512, 512).png().toBuffer();

const maskableBackground = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#0b1f4a"/>
</svg>`;
const maskableBackgroundPng = await sharp(Buffer.from(maskableBackground))
  .png()
  .toBuffer();
const maskableLogo = await sharp(icon)
  .resize(410, 410, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toBuffer();
const maskable = await sharp(maskableBackgroundPng)
  .composite([{ input: maskableLogo, left: 51, top: 51 }])
  .png()
  .toBuffer();

await fs.mkdir("public/icons", { recursive: true });

const jobs = [
  [icon, "public/icons/icon-192.png", 192],
  [icon, "public/icons/icon-512.png", 512],
  [icon, "public/icons/apple-touch-icon.png", 180],
  [maskable, "public/icons/maskable-512.png", 512],
];

for (const [buffer, file, size] of jobs) {
  await sharp(buffer).resize(size, size).png().toFile(file);
  console.log("wrote", file);
}
