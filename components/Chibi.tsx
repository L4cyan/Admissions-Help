import type { CSSProperties } from "react";
import type { ChibiVariant } from "@/lib/types";

export type { ChibiVariant } from "@/lib/types";

type HairStyle =
  | "longStraight"
  | "longBangs"
  | "hime"
  | "tiedBack"
  | "shortWavy"
  | "longSide";
interface Look {
  skin: string;
  skinShade: string;
  skinLight: string;
  hair: string;
  hairDark: string;
  hairLight: string;
  eye: string;
  eyeLight: string;
  brow: string;
  lip: string;
  outfit: string;
  outfitShade: string;
  outfitLight: string;
  collar: string;
  accent: string;
  style: HairStyle;
  build: "slim" | "regular" | "curvy";
  earrings: "pearl" | "gold" | "none";
  glasses: boolean;
  glassesFrame: string;
  mature: boolean;
  chubby: boolean;
  ponytail: boolean;
}

interface Features {
  head: string;
  earX: number;
  earY: number;
  eyeY: number;
  eyeSpread: number;
  eyeScaleX: number;
  eyeScaleY: number;
  browLift: number;
  browArch: number;
  browWidth: number;
  browWeight: number;
  noseY: number;
  mouthY: number;
  mouthScale: number;
  smileLines: boolean;
  chubby: boolean;
  blush: number;
  cheekY: number;
}

const LOOKS: Record<ChibiVariant, Look> = {
  director: {
    skin: "#f2c7a6",
    skinShade: "#d9a17b",
    skinLight: "#fbe0c9",
    hair: "#6b4936",
    hairDark: "#3f2a1e",
    hairLight: "#9a6c4f",
    eye: "#6b4226",
    eyeLight: "#b07a4a",
    brow: "#4a2e20",
    lip: "#b45b57",
    outfit: "#1d355e",
    outfitShade: "#142643",
    outfitLight: "#2c4b7c",
    collar: "#f8f4ea",
    accent: "#c99a2e",
    style: "longStraight",
    build: "slim",
    earrings: "pearl",
    glasses: true,
    glassesFrame: "#5a4636",
    mature: true,
    chubby: false,
    ponytail: false,
  },
  rose: {
    skin: "#f1c9a9",
    skinShade: "#d8a17f",
    skinLight: "#fbe2cd",
    hair: "#221b1a",
    hairDark: "#120e0d",
    hairLight: "#43312d",
    eye: "#4d2e1e",
    eyeLight: "#8d5b38",
    brow: "#1b1312",
    lip: "#b85f5a",
    outfit: "#1d355e",
    outfitShade: "#142643",
    outfitLight: "#2c4b7c",
    collar: "#f8f4ea",
    accent: "#c99a2e",
    style: "hime",
    build: "regular",
    earrings: "gold",
    glasses: false,
    glassesFrame: "#8a6824",
    mature: false,
    chubby: false,
    ponytail: false,
  },
  cris: {
    skin: "#eec3a2",
    skinShade: "#d59d78",
    skinLight: "#f9ddc6",
    hair: "#241c1a",
    hairDark: "#140f0e",
    hairLight: "#46332f",
    eye: "#43281a",
    eyeLight: "#815233",
    brow: "#1b1312",
    lip: "#a95350",
    outfit: "#1d355e",
    outfitShade: "#142643",
    outfitLight: "#2c4b7c",
    collar: "#f8f4ea",
    accent: "#c99a2e",
    style: "tiedBack",
    build: "regular",
    earrings: "gold",
    glasses: false,
    glassesFrame: "#8a6824",
    mature: true,
    chubby: false,
    ponytail: true,
  },
  sherry: {
    skin: "#efc5a3",
    skinShade: "#d69d78",
    skinLight: "#fadfc8",
    hair: "#2b2220",
    hairDark: "#171110",
    hairLight: "#4d3934",
    eye: "#4a2d1d",
    eyeLight: "#8a5737",
    brow: "#1d1413",
    lip: "#b45b57",
    outfit: "#1d355e",
    outfitShade: "#142643",
    outfitLight: "#2c4b7c",
    collar: "#f8f4ea",
    accent: "#c99a2e",
    style: "shortWavy",
    build: "regular",
    earrings: "none",
    glasses: true,
    glassesFrame: "#8a6824",
    mature: false,
    chubby: false,
    ponytail: false,
  },
  marilou: {
    skin: "#f2c8a7",
    skinShade: "#dba27d",
    skinLight: "#fbe1ca",
    hair: "#241c1a",
    hairDark: "#140f0e",
    hairLight: "#46332f",
    eye: "#42281a",
    eyeLight: "#815233",
    brow: "#1b1312",
    lip: "#b85f5a",
    outfit: "#1d355e",
    outfitShade: "#142643",
    outfitLight: "#2c4b7c",
    collar: "#f8f4ea",
    accent: "#c99a2e",
    style: "longSide",
    build: "curvy",
    earrings: "gold",
    glasses: true,
    glassesFrame: "#6b4a2f",
    mature: true,
    chubby: true,
    ponytail: false,
  },
};

const FEATURES: Record<ChibiVariant, Features> = {
  director: {
    head: "M160 50C207 50 242 86 244 140C246 190 228 227 194 244C179 252 141 252 126 244C92 227 74 190 76 140C78 86 113 50 160 50Z",
    earX: 78,
    earY: 170,
    eyeY: 176,
    eyeSpread: 37,
    eyeScaleX: 1,
    eyeScaleY: 0.92,
    browLift: 34,
    browArch: 8,
    browWidth: 22,
    browWeight: 4.2,
    noseY: 205,
    mouthY: 219,
    mouthScale: 1,
    smileLines: true,
    chubby: false,
    blush: 0.85,
    cheekY: 210,
  },
  rose: {
    head: "M160 52C210 52 246 90 248 146C250 198 230 234 196 248C181 255 139 255 124 248C90 234 70 198 72 146C74 90 110 52 160 52Z",
    earX: 74,
    earY: 174,
    eyeY: 178,
    eyeSpread: 39,
    eyeScaleX: 0.94,
    eyeScaleY: 0.72,
    browLift: 32,
    browArch: 4,
    browWidth: 20,
    browWeight: 3.8,
    noseY: 208,
    mouthY: 222,
    mouthScale: 0.82,
    smileLines: false,
    chubby: false,
    blush: 1,
    cheekY: 212,
  },
  cris: {
    head: "M160 50C205 50 238 86 240 140C242 190 226 226 194 244C180 252 140 252 126 244C94 226 78 190 80 140C82 86 115 50 160 50Z",
    earX: 80,
    earY: 170,
    eyeY: 177,
    eyeSpread: 36,
    eyeScaleX: 0.9,
    eyeScaleY: 0.76,
    browLift: 33,
    browArch: 9,
    browWidth: 20,
    browWeight: 4,
    noseY: 207,
    mouthY: 221,
    mouthScale: 0.9,
    smileLines: true,
    chubby: false,
    blush: 0.65,
    cheekY: 212,
  },
  sherry: {
    head: "M160 50C207 50 242 86 244 138C246 184 230 220 198 240C184 249 176 252 160 252C144 252 136 249 122 240C90 220 74 184 76 138C78 86 113 50 160 50Z",
    earX: 78,
    earY: 168,
    eyeY: 174,
    eyeSpread: 38,
    eyeScaleX: 0.98,
    eyeScaleY: 0.92,
    browLift: 35,
    browArch: 6,
    browWidth: 23,
    browWeight: 4.8,
    noseY: 204,
    mouthY: 218,
    mouthScale: 1.05,
    smileLines: false,
    chubby: false,
    blush: 0.9,
    cheekY: 208,
  },
  marilou: {
    head: "M160 52C216 52 254 92 256 150C258 204 236 240 198 252C180 258 140 258 122 252C84 240 62 204 64 150C66 92 104 52 160 52Z",
    earX: 66,
    earY: 178,
    eyeY: 180,
    eyeSpread: 40,
    eyeScaleX: 0.9,
    eyeScaleY: 0.68,
    browLift: 31,
    browArch: 4,
    browWidth: 19,
    browWeight: 3.6,
    noseY: 210,
    mouthY: 224,
    mouthScale: 0.95,
    smileLines: false,
    chubby: true,
    blush: 1.1,
    cheekY: 218,
  },
};

/**
 * One continuous long-hair mass behind the head and shoulders. The split at
 * the bottom is only for the body; it is not two tails.
 */
const LONG_BACK =
  "M160 24C100 24 58 72 56 138L52 330C52 350 76 360 98 350C130 336 146 306 150 268L170 268C174 306 190 336 222 350C244 360 268 350 268 330L264 138C262 72 220 24 160 24Z";

const HAIR_BACK: Record<HairStyle, string> = {
  longStraight: LONG_BACK,
  longBangs: LONG_BACK,
  hime: LONG_BACK,
  // Ma'am Cris: hair pulled straight back. Asymmetric nape so the single low
  // bun reads on one side instead of a pair of side masses.
  tiedBack:
    "M160 30C104 30 66 72 64 140C62 168 63 188 66 200C69 210 82 214 92 208C100 203 106 192 110 182C116 170 136 160 160 160C184 160 202 172 208 190C212 206 214 224 222 236C230 248 246 246 250 232C256 210 258 176 256 140C254 72 216 30 160 30Z",
  shortWavy:
    "M160 32C108 32 72 70 70 132L68 204C68 230 84 246 102 240C100 230 100 220 104 212C108 224 118 230 128 228C126 218 126 210 128 204C130 194 136 184 146 178C154 172 166 172 174 178C184 184 190 194 192 204C194 210 194 218 192 228C202 230 212 224 216 212C220 220 220 230 218 240C236 246 252 230 252 204L250 132C248 70 212 32 160 32Z",
  longSide: LONG_BACK,
};

const HAIR_FRONT: Record<HairStyle, string> = {
  // Ma'am Jen: soft side-swept fringe, long brown hair. The outer edge runs
  // wider than the head so it covers the face stroke at the crown.
  longStraight:
    "M72 158C74 94 112 42 160 42C208 42 246 94 248 158C244 150 238 136 228 124C214 128 200 132 184 134C164 136 146 130 132 120C120 130 100 144 72 158Z",
  longBangs:
    "M72 158C74 94 112 42 160 42C208 42 246 94 248 158C238 142 230 120 216 98C204 116 188 128 168 130C150 132 132 126 118 114C110 128 94 142 72 158Z",
  // Ma'am Rose: hime cut — blunt fringe, short straight cheek locks.
  hime: "M72 158C74 94 112 42 160 42C208 42 246 94 248 158C238 142 230 126 216 100L216 130Q216 134 212 134L108 134Q104 134 104 130L104 100C96 116 88 136 72 158Z",
  // Ma'am Cris: solid pulled-back cap with a lower, slightly asymmetric
  // hairline. No thin band, no bare skin arc at the crown.
  tiedBack:
    "M70 168C72 96 112 42 160 42C208 42 248 96 250 168C240 150 230 134 216 122C202 112 186 108 170 110C154 112 140 116 126 124C112 134 88 152 70 168Z",
  shortWavy:
    "M72 156C74 94 112 42 160 42C208 42 246 94 248 156C238 148 232 138 228 128C216 132 202 136 184 138C166 140 148 134 134 124C122 134 102 146 72 156Z",
  // Ma'am Marilou: long side-parted hair. Outer edge overlaps the head and
  // back-hair mass at the temples so no skin wedge shows through.
  longSide:
    "M58 188C60 120 80 80 116 58C132 46 148 42 162 44C214 46 254 94 262 188C254 164 250 146 238 128C222 104 198 96 176 102C154 108 130 118 110 128C94 138 74 162 58 188Z",
};

/**
 * The lower edge of each front-hair piece. Stroking only this edge keeps the
 * fringe crisp without painting a second "headband" line across the crown
 * where the front piece overlaps the larger back-hair mass.
 */
const HAIRLINE: Record<HairStyle, string> = {
  longStraight:
    "M248 158C244 150 238 136 228 124C214 128 200 132 184 134C164 136 146 130 132 120C120 130 100 144 72 158",
  longBangs:
    "M248 158C238 142 230 120 216 98C204 116 188 128 168 130C150 132 132 126 118 114C110 128 94 142 72 158",
  hime: "M248 158C238 142 230 126 216 100L216 130Q216 134 212 134L108 134Q104 134 104 130L104 100C96 116 88 136 72 158",
  tiedBack:
    "M250 168C240 150 230 134 216 122C202 112 186 108 170 110C154 112 140 116 126 124C112 134 88 152 70 168",
  shortWavy:
    "M248 156C238 148 232 138 228 128C216 132 202 136 184 138C166 140 148 134 134 124C122 134 102 146 72 156",
  longSide:
    "M262 188C254 164 250 146 238 128C222 104 198 96 176 102C154 108 130 118 110 128C94 138 74 162 58 188",
};

const SIDE_L: Record<HairStyle, string | null> = {
  longStraight: null,
  longBangs: null,
  hime: null,
  tiedBack: null,
  shortWavy: "M102 118C82 140 70 170 76 208C80 219 87 218 90 207C86 186 92 152 112 134Z",
  longSide: null,
};

const SIDE_R: Record<HairStyle, string | null> = {
  longStraight: null,
  longBangs: null,
  hime: null,
  tiedBack: null,
  shortWavy: "M218 118C238 140 250 170 244 208C240 219 233 218 230 207C234 186 228 152 208 134Z",
  longSide: null,
};

function bodyPath(build: Look["build"]): string {
  if (build === "slim") {
    return "M72 360C74 322 98 296 132 282L160 298L188 282C222 296 246 322 248 360Z";
  }
  if (build === "curvy") {
    return "M50 360C52 314 82 286 124 274L160 294L196 274C238 286 268 314 270 360Z";
  }
  return "M60 360C62 318 90 290 128 278L160 296L192 278C230 290 258 318 260 360Z";
}

export function Chibi({
  variant,
  className,
  title,
  style,
  speaking = false,
}: {
  variant: ChibiVariant;
  className?: string;
  title?: string;
  style?: CSSProperties;
  speaking?: boolean;
}) {
  const look = LOOKS[variant];
  const f = FEATURES[variant];
  const body = bodyPath(look.build);
  const uid = `chibi-${variant}`;
  const label = title ?? `${variant} chibi guide`;

  return (
    <svg
      viewBox="0 0 320 360"
      role="img"
      aria-label={label}
      className={className}
      style={style}
    >
      <defs>
        <linearGradient id={`${uid}-skin`} x1="0" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor={look.skinLight} />
          <stop offset="48%" stopColor={look.skin} />
          <stop offset="100%" stopColor={look.skinShade} />
        </linearGradient>
        <linearGradient
          id={`${uid}-hair`}
          gradientUnits="userSpaceOnUse"
          x1="64"
          y1="24"
          x2="256"
          y2="340"
        >
          <stop offset="0%" stopColor={look.hairLight} />
          <stop offset="38%" stopColor={look.hair} />
          <stop offset="100%" stopColor={look.hairDark} />
        </linearGradient>
        <linearGradient
          id={`${uid}-outfit`}
          gradientUnits="userSpaceOnUse"
          x1="64"
          y1="260"
          x2="240"
          y2="360"
        >
          <stop offset="0%" stopColor={look.outfitLight} />
          <stop offset="40%" stopColor={look.outfit} />
          <stop offset="100%" stopColor={look.outfitShade} />
        </linearGradient>
        <radialGradient id={`${uid}-iris`} cx="46%" cy="38%" r="62%">
          <stop offset="0%" stopColor={look.eyeLight} />
          <stop offset="58%" stopColor={look.eye} />
          <stop offset="100%" stopColor="#1b110c" />
        </radialGradient>
        <radialGradient id={`${uid}-blush`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f08f88" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#f08f88" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${uid}-pearl`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fffdf7" />
          <stop offset="55%" stopColor="#efe6d7" />
          <stop offset="100%" stopColor="#cdbfa9" />
        </linearGradient>
        <clipPath id={`${uid}-body-clip`}>
          <path d={body} />
        </clipPath>
      </defs>

      <g className="chibi-breathe">
        <path
          d={HAIR_BACK[look.style]}
          fill={`url(#${uid}-hair)`}
          stroke={look.hairDark}
          strokeWidth="3.2"
          strokeLinejoin="round"
        />

        {look.ponytail && (
          <g className="chibi-bun">
            <ellipse
              cx="234"
              cy="250"
              rx="23"
              ry="19"
              fill={`url(#${uid}-hair)`}
              stroke={look.hairDark}
              strokeWidth="3"
            />
            <path
              d="M218 244c6-8 20-10 28-3M220 256c8-4 18-4 24 0"
              fill="none"
              stroke={look.hairLight}
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.5"
            />
            <rect
              x="220"
              y="233"
              width="16"
              height="8"
              rx="4"
              fill={look.accent}
              stroke="#7a5a1e"
              strokeWidth="1.5"
            />
          </g>
        )}

        {/* solid scalp under the face — no skin gaps between hair pieces */}
        <ellipse
          cx="160"
          cy={f.chubby ? 142 : 136}
          rx={f.chubby ? 102 : 94}
          ry={f.chubby ? 108 : 102}
          fill={look.hair}
        />

        <path
          d={body}
          fill={`url(#${uid}-outfit)`}
          stroke="#2a1d18"
          strokeWidth="3.2"
          strokeLinejoin="round"
        />
        <g clipPath={`url(#${uid}-body-clip)`}>
          {/* Opaque navy chest panel: no background can show through the
              neckline on tinted cards. */}
          <path d="M88 268H232V360H88Z" fill={`url(#${uid}-outfit)`} />
          <path
            d="M176 284C210 296 236 318 246 360L260 360C258 318 230 290 192 278Z"
            fill="#ffffff"
            opacity="0.06"
          />
          <path
            d="M72 330C90 310 112 296 136 288"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.08"
          />
        </g>

        {/* navy plug behind the throat so the neckline gap never exposes the
            page/team-card color */}
        <path
          d="M132 270C142 278 178 278 188 270L202 322H118Z"
          fill={look.outfit}
        />

        <path
          d="M140 236L140 276C146 286 174 286 180 276L180 236Z"
          fill={`url(#${uid}-skin)`}
          stroke="#5a3a2a"
          strokeWidth="2.8"
        />
        <path
          d="M140 240C150 254 170 254 180 240L180 252C170 266 150 266 140 252Z"
          fill={look.skinShade}
          opacity="0.55"
        />

        <Clothing look={look} />

        <ellipse
          cx={f.earX}
          cy={f.earY}
          rx="13"
          ry="19"
          fill={`url(#${uid}-skin)`}
          stroke="#5a3a2a"
          strokeWidth="2.6"
        />
        <ellipse
          cx={320 - f.earX}
          cy={f.earY}
          rx="13"
          ry="19"
          fill={`url(#${uid}-skin)`}
          stroke="#5a3a2a"
          strokeWidth="2.6"
        />
        <path
          d={`M${f.earX - 4} ${f.earY - 2}c4 3 6 8 6 13M${324 - f.earX} ${f.earY - 2}c-4 3-6 8-6 13`}
          fill="none"
          stroke={look.skinShade}
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.8"
        />

        <g className="chibi-head">
          <path
            d={f.head}
            fill={`url(#${uid}-skin)`}
            stroke="#5a3a2a"
            strokeWidth="3.2"
          />
          <path
            d={
              f.chubby
                ? "M222 114C242 154 240 204 208 238C228 214 236 172 224 132Z"
                : "M216 112C232 150 228 198 202 230C220 208 226 172 218 134Z"
            }
            fill={look.skinShade}
            opacity="0.16"
          />
          <ellipse
            cx="142"
            cy="104"
            rx="34"
            ry="16"
            fill={look.skinLight}
            opacity="0.28"
          />
          <path
            d={
              f.chubby
                ? "M124 246C142 255 178 255 196 246"
                : "M128 238C144 245 176 245 192 238"
            }
            fill="none"
            stroke={look.skinShade}
            strokeWidth="2"
            opacity="0.35"
          />

          <Face look={look} f={f} uid={uid} speaking={speaking} variant={variant} />

          {look.earrings !== "none" && <Earrings look={look} uid={uid} f={f} />}

          {look.style === "hime" && (
            <g>
              <path
                d="M66 112C64 140 65 168 69 186C72 199 77 207 83 203C87 200 87 194 85 186C82 170 83 140 82 112Z"
                fill={`url(#${uid}-hair)`}
              />
              <path
                d="M254 112C256 140 255 168 251 186C248 199 243 207 237 203C233 200 233 194 235 186C238 170 237 140 238 112Z"
                fill={`url(#${uid}-hair)`}
              />
              <path
                d="M82 118C81 142 81 168 83 186C85 194 85 200 81 203M238 118C239 142 239 168 237 186C235 194 235 200 239 203"
                fill="none"
                stroke={look.hairDark}
                strokeWidth="2.8"
                strokeLinecap="round"
              />
              <path
                d="M67 140C66 160 66 176 69 186C72 199 77 207 81 203M253 140C254 160 254 176 251 186C248 199 243 207 239 203"
                fill="none"
                stroke={look.hairDark}
                strokeWidth="2.8"
                strokeLinecap="round"
              />
            </g>
          )}

          {SIDE_L[look.style] && (
            <path
              className="chibi-hair-side"
              d={SIDE_L[look.style]!}
              fill={`url(#${uid}-hair)`}
              stroke={look.hairDark}
              strokeWidth="2.8"
              strokeLinejoin="round"
            />
          )}
          {SIDE_R[look.style] && (
            <path
              className="chibi-hair-side"
              d={SIDE_R[look.style]!}
              fill={`url(#${uid}-hair)`}
              stroke={look.hairDark}
              strokeWidth="2.8"
              strokeLinejoin="round"
            />
          )}

          <path
            d={HAIR_FRONT[look.style]}
            fill={`url(#${uid}-hair)`}
          />
          <path
            d={HAIRLINE[look.style]}
            fill="none"
            stroke={look.hairDark}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <HairDetails look={look} variant={variant} />

          {look.glasses && <Glasses look={look} f={f} />}
        </g>
      </g>
    </svg>
  );
}

function Face({
  look,
  f,
  uid,
  speaking,
  variant,
}: {
  look: Look;
  f: Features;
  uid: string;
  speaking: boolean;
  variant: ChibiVariant;
}) {
  const leftX = 160 - f.eyeSpread;
  const rightX = 160 + f.eyeSpread;
  const browY = f.eyeY - f.browLift;

  return (
    <>
      <path
        d={`M${leftX - f.browWidth} ${browY}C${leftX - f.browWidth * 0.5} ${browY - f.browArch} ${leftX + f.browWidth * 0.55} ${browY - f.browArch} ${leftX + f.browWidth} ${browY - 1}`}
        fill="none"
        stroke={look.brow}
        strokeWidth={f.browWeight}
        strokeLinecap="round"
      />
      <path
        d={`M${rightX - f.browWidth} ${browY - 1}C${rightX - f.browWidth * 0.55} ${browY - f.browArch} ${rightX + f.browWidth * 0.5} ${browY - f.browArch} ${rightX + f.browWidth} ${browY}`}
        fill="none"
        stroke={look.brow}
        strokeWidth={f.browWeight}
        strokeLinecap="round"
      />

      <g transform={`translate(${leftX} ${f.eyeY}) scale(${f.eyeScaleX} ${f.eyeScaleY})`}>
        <Eye look={look} uid={uid} variant={variant} />
      </g>
      <g transform={`translate(${rightX} ${f.eyeY}) scale(${-f.eyeScaleX} ${f.eyeScaleY})`}>
        <Eye look={look} uid={uid} variant={variant} />
      </g>

      {f.smileLines && (
        <g
          fill="none"
          stroke={look.skinShade}
          strokeWidth="1.4"
          strokeLinecap="round"
          opacity="0.35"
        >
          <path d={`M${leftX + 10} ${f.noseY + 6}c-2 4 -2 8 0 12`} />
          <path d={`M${rightX - 10} ${f.noseY + 6}c2 4 2 8 0 12`} />
        </g>
      )}

      {f.chubby ? (
        <path
          d={`M160 ${f.noseY - 4}c-5 5-5 9 0 11c5-2 5-6 0-11Z`}
          fill={look.skinShade}
          opacity="0.85"
        />
      ) : variant === "cris" ? (
        <path
          d={`M160 ${f.noseY - 3}v7`}
          fill="none"
          stroke={look.skinShade}
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      ) : (
        <path
          d={`M160 ${f.noseY - 2}c-3 5-3 7 0 9c3-2 3-4 0-9Z`}
          fill={look.skinShade}
          opacity="0.9"
        />
      )}

      <ellipse
        cx={leftX - 12}
        cy={f.cheekY}
        rx="19"
        ry="10"
        fill={`url(#${uid}-blush)`}
        opacity={f.blush}
      />
      <ellipse
        cx={rightX + 12}
        cy={f.cheekY}
        rx="19"
        ry="10"
        fill={`url(#${uid}-blush)`}
        opacity={f.blush}
      />

      <g className={`chibi-mouth ${speaking ? "is-talking" : ""}`}>
        <path
          d={mouthPath(variant, speaking)}
          fill={look.lip}
          stroke="#743b36"
          strokeWidth="1.8"
          strokeLinejoin="round"
          transform={`translate(160 ${f.mouthY}) scale(${f.mouthScale} 1) translate(-160 -${f.mouthY})`}
        />
        <path
          d={`M154 ${f.mouthY + 10}c4 2 8 2 12 0`}
          fill="none"
          stroke="#743b36"
          strokeWidth="1.1"
          strokeLinecap="round"
          opacity="0.25"
        />
      </g>

      {f.chubby && (
        <>
          <ellipse
            cx="98"
            cy="224"
            rx="22"
            ry="13"
            fill={look.skinShade}
            opacity="0.14"
          />
          <ellipse
            cx="222"
            cy="224"
            rx="22"
            ry="13"
            fill={look.skinShade}
            opacity="0.14"
          />
          <path
            d="M136 250c10 6 38 6 48 0"
            fill="none"
            stroke={look.skinShade}
            strokeWidth="2.2"
            strokeLinecap="round"
            opacity="0.4"
          />
          <path
            d="M130 256c12 8 48 8 60 0"
            fill="none"
            stroke={look.skinShade}
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.24"
          />
        </>
      )}
    </>
  );
}

const MOUTHS: Record<ChibiVariant, { smile: string; talk: string }> = {
  director: {
    smile: "M147 219c8 7 18 7 26 0c-3 2-8 3-13 3s-10-1-13-3Z",
    talk: "M148 219c8 12 16 12 24 0c-2 9-7 13-12 13s-10-4-12-13Z",
  },
  rose: {
    smile: "M150 221c6 6 14 6 20 0c-2 2-6 3-10 3s-8-1-10-3Z",
    talk: "M150 220c6 9 14 9 20 0c-2 7-5 10-10 10s-8-3-10-10Z",
  },
  cris: {
    smile: "M150 221c6 4 14 4 20 0c-2 2-6 3-10 3s-8-1-10-3Z",
    talk: "M151 220c6 8 12 8 18 0c-2 6-5 9-9 9s-7-3-9-9Z",
  },
  sherry: {
    smile: "M146 218c9 8 19 8 28 0c-3 2-9 4-14 4s-11-2-14-4Z",
    talk: "M146 218c9 13 19 13 28 0c-2 10-8 14-14 14s-12-4-14-14Z",
  },
  marilou: {
    smile: "M146 220c9 8 19 8 28 0c-3 2-9 4-14 4s-11-2-14-4Z",
    talk: "M146 220c9 13 19 13 28 0c-2 10-8 14-14 14s-12-4-14-14Z",
  },
};

function mouthPath(variant: ChibiVariant, speaking: boolean) {
  return speaking ? MOUTHS[variant].talk : MOUTHS[variant].smile;
}

const EYE_SHAPES: Record<
  ChibiVariant,
  {
    white: string;
    lid: string;
    irisRx: number;
    irisRy: number;
    pupilRx: number;
    pupilRy: number;
    lidWeight: number;
    epicanthic: boolean;
  }
> = {
  director: {
    white: "M-20 0C-14 -14 14 -14 20 0C14 14 -14 14 -20 0Z",
    lid: "M-21 -1C-14 -17 14 -17 21 -1",
    irisRx: 10.5,
    irisRy: 12.5,
    pupilRx: 5.2,
    pupilRy: 8,
    lidWeight: 4.4,
    epicanthic: false,
  },
  rose: {
    white: "M-20 -1C-13 -12 14 -12 20 -2C14 12 -13 12 -20 -1Z",
    lid: "M-21 0C-13 -13 14 -13 21 -2",
    irisRx: 9.6,
    irisRy: 11.2,
    pupilRx: 4.8,
    pupilRy: 7.4,
    lidWeight: 4.8,
    epicanthic: true,
  },
  cris: {
    white: "M-20 -1C-14 -11 14 -11 20 -1C14 12 -14 12 -20 -1Z",
    lid: "M-21 0C-14 -12 14 -12 21 -1",
    irisRx: 8.8,
    irisRy: 10.8,
    pupilRx: 4.4,
    pupilRy: 7.2,
    lidWeight: 4.6,
    epicanthic: false,
  },
  sherry: {
    white: "M-21 0C-15 -16 15 -16 21 0C15 16 -15 16 -21 0Z",
    lid: "M-22 -2C-15 -20 15 -20 22 -2",
    irisRx: 11.4,
    irisRy: 13.4,
    pupilRx: 5.6,
    pupilRy: 8.6,
    lidWeight: 4.4,
    epicanthic: false,
  },
  marilou: {
    white: "M-19 1C-12 -10 14 -10 20 0C14 12 -12 12 -19 1Z",
    lid: "M-20 1C-12 -11 14 -11 21 0",
    irisRx: 8.8,
    irisRy: 10.2,
    pupilRx: 4.6,
    pupilRy: 7,
    lidWeight: 4.2,
    epicanthic: true,
  },
};

function Eye({
  look,
  uid,
  variant,
}: {
  look: Look;
  uid: string;
  variant: ChibiVariant;
}) {
  const e = EYE_SHAPES[variant];
  return (
    <g className="chibi-eyes">
      <path
        d={e.white}
        fill="#fffdf9"
        stroke="#4a2e20"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <ellipse cx="0" cy="1.5" rx={e.irisRx} ry={e.irisRy} fill={`url(#${uid}-iris)`} />
      <ellipse cx="0" cy="2" rx={e.pupilRx} ry={e.pupilRy} fill="#140d0a" />
      <circle cx="-3.4" cy="-3.4" r="3.4" fill="#ffffff" />
      <circle cx="4.2" cy="5.6" r="1.8" fill="#ffffff" opacity="0.8" />
      <circle cx="3.2" cy="-6.2" r="1.2" fill="#ffffff" opacity="0.7" />
      <path
        d={e.lid}
        fill="none"
        stroke="#3a2419"
        strokeWidth={e.lidWeight}
        strokeLinecap="round"
      />
      <path
        d="M-21 -1l-5 -4"
        fill="none"
        stroke="#3a2419"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {e.epicanthic && (
        <path
          d="M-18 2c4-3 8-2 11 0"
          fill="none"
          stroke={look.skinShade}
          strokeWidth="1.3"
          strokeLinecap="round"
          opacity="0.75"
        />
      )}
      <path
        d="M-13 9C-7 13 7 13 13 9"
        fill="none"
        stroke={look.skinShade}
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.5"
      />
    </g>
  );
}

function Earrings({ look, uid, f }: { look: Look; uid: string; f: Features }) {
  const x = f.earX;
  const y = f.earY + 26;
  if (look.earrings === "pearl") {
    return (
      <>
        <circle cx={x} cy={y} r="5.2" fill={`url(#${uid}-pearl)`} stroke="#a8987d" strokeWidth="1.3" />
        <circle cx={x - 1.4} cy={y - 1.6} r="1.5" fill="#ffffff" opacity="0.9" />
        <circle cx={320 - x} cy={y} r="5.2" fill={`url(#${uid}-pearl)`} stroke="#a8987d" strokeWidth="1.3" />
        <circle cx={320 - x - 1.4} cy={y - 1.6} r="1.5" fill="#ffffff" opacity="0.9" />
      </>
    );
  }
  return (
    <>
      <circle cx={x} cy={y} r="3.2" fill={look.accent} stroke="#7a5a1e" strokeWidth="1.2" />
      <circle cx={320 - x} cy={y} r="3.2" fill={look.accent} stroke="#7a5a1e" strokeWidth="1.2" />
    </>
  );
}

function Glasses({ look, f }: { look: Look; f: Features }) {
  const left = 160 - f.eyeSpread;
  const right = 160 + f.eyeSpread;
  const width = f.chubby ? 50 : 46;
  const height = 36;
  const y = f.eyeY - 18;
  const frame = look.glassesFrame;

  return (
    <g className="chibi-glasses">
      <rect
        x={left - width / 2}
        y={y}
        width={width}
        height={height}
        rx="9"
        fill="#dcebf3"
        fillOpacity="0.12"
        stroke={frame}
        strokeWidth="2.5"
      />
      <rect
        x={right - width / 2}
        y={y}
        width={width}
        height={height}
        rx="9"
        fill="#dcebf3"
        fillOpacity="0.12"
        stroke={frame}
        strokeWidth="2.5"
      />
      <path
        d={`M${left + width / 2} ${y + 12}H${right - width / 2}`}
        fill="none"
        stroke={frame}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d={`M${left - width / 2} ${y + 8}l-14 -4M${right + width / 2} ${y + 8}l14 -4`}
        fill="none"
        stroke={frame}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d={`M${left - width / 2 + 7} ${y + 22}l8 -14M${right - width / 2 + 7} ${y + 22}l8 -14`}
        stroke="#ffffff"
        strokeWidth="3.4"
        strokeLinecap="round"
        opacity="0.26"
      />
    </g>
  );
}

function HairDetails({ look, variant }: { look: Look; variant: ChibiVariant }) {
  return (
    <g fill="none" stroke={look.hairLight} strokeLinecap="round">
      <path d="M104 72C122 54 146 46 170 48" strokeWidth="7" opacity="0.18" />
      {variant === "director" && (
        <>
          <path d="M120 56c-7 18 -10 34 -9 48" strokeWidth="2.1" opacity="0.45" />
          <path d="M68 166c-2 24 -1 48 3 70" strokeWidth="2" opacity="0.35" />
          <path d="M252 166c2 24 1 48 -3 70" strokeWidth="2" opacity="0.35" />
        </>
      )}
      {variant === "rose" && (
        <>
          <path d="M126 58c-5 18 -7 36 -6 52" strokeWidth="2.1" opacity="0.4" />
          <path d="M74 130c-1 20 -1 38 1 52" strokeWidth="1.8" opacity="0.35" />
          <path d="M246 130c1 20 1 38 -1 52" strokeWidth="1.8" opacity="0.35" />
        </>
      )}
      {variant === "cris" && (
        <>
          <path d="M124 52c-7 18 -10 34 -9 48" strokeWidth="2" opacity="0.4" />
          <path d="M168 44c-5 18 -10 36 -14 54" strokeWidth="2" opacity="0.38" />
          <path d="M74 132c-3 20 -3 38 0 54" strokeWidth="2" opacity="0.35" />
          <path d="M246 132c3 20 3 38 0 54" strokeWidth="2" opacity="0.35" />
        </>
      )}
      {variant === "sherry" && (
        <>
          <path d="M112 62c-7 20 -8 38 -4 54" strokeWidth="2.2" opacity="0.42" />
          <path d="M208 62c7 20 8 38 4 54" strokeWidth="2.2" opacity="0.42" />
          <path d="M76 146c-4 16 -4 32 1 46" strokeWidth="2" opacity="0.35" />
          <path d="M244 146c4 16 4 32 -1 46" strokeWidth="2" opacity="0.35" />
        </>
      )}
      {variant === "marilou" && (
        <>
          <path d="M196 54C190 70 186 84 179 96" strokeWidth="2" opacity="0.4" />
          <path d="M68 158c-3 22 -2 42 1 58" strokeWidth="1.6" opacity="0.2" />
          <path d="M252 158c3 22 2 42 -1 58" strokeWidth="1.6" opacity="0.2" />
        </>
      )}
    </g>
  );
}

function Clothing({ look }: { look: Look }) {
  return (
    <>
      {/* Navy AdZU polo collar. White piping follows the collar edge only —
          the inner edges stay navy so no big white V is drawn at the throat. */}
      <path
        d="M130 270L154 286L146 300L122 286Z"
        fill={look.outfit}
        stroke={look.outfitShade}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M190 270L166 286L174 300L198 286Z"
        fill={look.outfit}
        stroke={look.outfitShade}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M154 286L130 270L122 286L146 300"
        fill="none"
        stroke={look.collar}
        strokeWidth="2.4"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d="M166 286L190 270L198 286L174 300"
        fill="none"
        stroke={look.collar}
        strokeWidth="2.4"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path d="M160 294v66" stroke={look.outfitShade} strokeWidth="2.4" />
      <circle cx="160" cy="312" r="2.2" fill={look.collar} />
      <circle cx="160" cy="330" r="2.2" fill={look.collar} />
      <path
        d="M118 300c8 6 14 14 18 24M202 300c-8 6 -14 14 -18 24"
        fill="none"
        stroke={look.outfitShade}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.5"
      />
      <g>
        <circle cx="208" cy="322" r="11" fill="#0b1f4a" stroke={look.accent} strokeWidth="2.4" />
        <path
          d="M203.5 328.2L208 316.4L212.5 328.2M205.5 324.2H210.5"
          fill="none"
          stroke={look.accent}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <Lanyard look={look} />
    </>
  );
}

function Lanyard({ look }: { look: Look }) {
  return (
    <g>
      <path
        d="M128 286l18 42M192 286l-18 42"
        fill="none"
        stroke={look.accent}
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <rect x="142" y="322" width="36" height="42" rx="3" fill="#fffdf7" stroke="#2a1d18" strokeWidth="2" />
      <rect x="142" y="322" width="36" height="9" rx="2" fill={look.outfit} />
      <circle cx="152" cy="341" r="5.2" fill={look.skin} stroke="#8a7a64" strokeWidth="1" />
      <path d="M147 350c1.3-3.4 3.2-5 5-5s3.7 1.6 5 5" fill={look.outfit} />
      <path
        d="M162 338h11M162 343h9M162 348h12M162 353h8"
        stroke="#b9ad99"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <circle cx="160" cy="359" r="1.8" fill={look.accent} />
    </g>
  );
}
