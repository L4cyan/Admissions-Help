import sharp from "sharp";
import fs from "node:fs/promises";

const face = `
  <circle cx="256" cy="248" r="106" fill="#efc4a1" stroke="#3a2a22" stroke-width="10"/>
  <path d="M150 248c-8-78 42-132 106-132s114 54 106 132l10 96c-12 22-34 26-52 12l-4-62c-24 22-96 22-120 0l-4 62c-18 14-40 10-52-12Z" fill="#34221a" stroke="#241611" stroke-width="10" stroke-linejoin="round"/>
  <path d="M168 232c12-52 44-78 88-78s76 26 88 78c-22-18-46-26-88-26s-66 8-88 26Z" fill="#34221a"/>
  <ellipse cx="220" cy="266" rx="14" ry="18" fill="#2b1d18"/>
  <ellipse cx="292" cy="266" rx="14" ry="18" fill="#2b1d18"/>
  <circle cx="224" cy="259" r="5" fill="#fff"/>
  <circle cx="296" cy="259" r="5" fill="#fff"/>
  <path d="M214 304c12 20 72 20 84 0-10 24-26 34-42 34s-32-10-42-34Z" fill="#81352f" stroke="#5d241f" stroke-width="5" stroke-linejoin="round"/>
  <path d="M226 310c16 7 44 7 60 0-6 10-16 16-30 16s-24-6-30-16Z" fill="#fff"/>
  <circle cx="190" cy="296" r="13" fill="#f29a91" opacity=".55"/>
  <circle cx="322" cy="296" r="13" fill="#f29a91" opacity=".55"/>
  <path d="M256 316v56" stroke="#1b3a70" stroke-width="16" stroke-linecap="round"/>
  <path d="M212 380c20-18 68-18 88 0l16 52H196Z" fill="#1b3a70" stroke="#3a2a22" stroke-width="8"/>
  <rect x="238" y="388" width="36" height="44" rx="5" fill="#fffdf7" stroke="#3a2a22" stroke-width="5"/>
  <rect x="244" y="394" width="24" height="8" rx="2" fill="#2b5c9c"/>
  <circle cx="256" cy="414" r="6" fill="#efc4a1"/>
`;

const icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="112" fill="#0b1f4a"/>
  <circle cx="256" cy="256" r="184" fill="#f8f1e2"/>
  <circle cx="256" cy="256" r="184" fill="none" stroke="#d7a62d" stroke-width="12"/>
  ${face}
</svg>`;

const maskable = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#0b1f4a"/>
  <g transform="translate(51.2 51.2) scale(.8)">
    <circle cx="256" cy="256" r="184" fill="#f8f1e2"/>
    <circle cx="256" cy="256" r="184" fill="none" stroke="#d7a62d" stroke-width="12"/>
    ${face}
  </g>
</svg>`;

await fs.mkdir("public/icons", { recursive: true });

const jobs = [
  [icon, "public/icons/icon-192.png", 192],
  [icon, "public/icons/icon-512.png", 512],
  [icon, "public/icons/apple-touch-icon.png", 180],
  [maskable, "public/icons/maskable-512.png", 512],
];

for (const [svg, file, size] of jobs) {
  await sharp(Buffer.from(svg)).resize(size, size).png().toFile(file);
  console.log("wrote", file);
}
