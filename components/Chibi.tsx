import type { CSSProperties } from "react";
import type { ChibiVariant } from "@/lib/types";

export type { ChibiVariant } from "@/lib/types";

type HairStyle =
  | "longStraight"
  | "longBangs"
  | "tiedBack"
  | "shortWavy"
  | "longSide";
type OutfitStyle = "blazer" | "blouse" | "vneck" | "polo";

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
  outfitStyle: OutfitStyle;
  earrings: "pearl" | "gold" | "none";
  glasses: boolean;
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
    outfit: "#202027",
    outfitShade: "#111116",
    outfitLight: "#34343d",
    collar: "#f7f0e4",
    accent: "#c99a2e",
    style: "longStraight",
    outfitStyle: "blazer",
    earrings: "pearl",
    glasses: false,
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
    outfit: "#cfe2ee",
    outfitShade: "#a9c7d9",
    outfitLight: "#eaf4fa",
    collar: "#fbf8f0",
    accent: "#b8861f",
    style: "longBangs",
    outfitStyle: "blouse",
    earrings: "gold",
    glasses: false,
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
    outfit: "#24385f",
    outfitShade: "#182744",
    outfitLight: "#36527f",
    collar: "#f8f3e8",
    accent: "#b8861f",
    style: "tiedBack",
    outfitStyle: "vneck",
    earrings: "gold",
    glasses: false,
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
    outfitStyle: "polo",
    earrings: "none",
    glasses: true,
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
    outfitStyle: "polo",
    earrings: "gold",
    glasses: false,
    mature: false,
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
    eyeScaleX: 1.05,
    eyeScaleY: 1.02,
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

const HAIR_BACK: Record<HairStyle, string> = {
  longStraight:
    "M160 26C101 26 62 70 60 134L56 304C56 326 76 340 96 330L102 238C102 188 120 152 160 152C200 152 218 188 218 238L224 330C244 340 264 326 264 304L260 134C258 70 219 26 160 26Z",
  longBangs:
    "M160 24C98 24 58 72 56 138L52 314C52 336 72 348 92 338L98 240C98 188 118 152 160 152C202 152 222 188 222 240L228 338C248 348 268 336 268 314L264 138C262 72 222 24 160 24Z",
  tiedBack:
    "M160 30C108 30 72 70 70 132L68 214C68 234 84 244 100 236L106 192C106 160 120 140 160 140C200 140 214 160 214 192L220 236C236 244 252 234 252 214L250 132C248 70 212 30 160 30Z",
  shortWavy:
    "M160 32C108 32 72 70 70 132L68 204C68 230 84 246 102 240C100 230 100 220 104 212C108 224 118 230 128 228C126 218 126 210 128 204C130 194 136 184 146 178C154 172 166 172 174 178C184 184 190 194 192 204C194 210 194 218 192 228C202 230 212 224 216 212C220 220 220 230 218 240C236 246 252 230 252 204L250 132C248 70 212 32 160 32Z",
  longSide:
    "M160 26C103 26 64 70 62 134L58 306C58 328 78 342 98 332L104 240C104 188 122 152 160 152C198 152 216 188 216 240L222 332C242 342 262 328 262 306L258 134C256 70 217 26 160 26Z",
};

const HAIR_FRONT: Record<HairStyle, string> = {
  longStraight:
    "M160 46C124 48 98 64 88 96C82 118 84 148 92 172C94 146 100 122 112 106C122 94 136 88 150 94C154 108 156 124 152 140C148 156 140 168 132 178C144 160 154 140 158 122C160 116 160 112 160 110C160 112 160 116 162 122C166 140 176 160 188 178C180 168 172 156 168 140C164 124 166 108 170 94C184 88 198 94 208 106C220 122 226 146 228 172C236 148 238 118 232 96C222 64 196 48 160 46Z",
  longBangs:
    "M78 138C80 84 114 50 160 50C206 50 240 84 242 138C230 126 222 112 216 96C204 114 188 126 168 128C150 130 132 124 118 112C112 124 96 132 78 138Z",
  tiedBack:
    "M80 154C84 100 116 56 160 56C204 56 236 100 240 154C230 140 222 128 212 118C200 108 182 102 160 102C138 102 120 110 108 120C98 128 90 142 80 154Z",
  shortWavy:
    "M78 140C80 86 114 50 160 50C206 50 240 86 242 140C232 126 224 112 218 98C208 114 194 126 176 130C158 134 140 128 126 114C118 126 96 132 78 140Z",
  longSide:
    "M76 146C78 88 112 50 160 50C208 50 242 88 244 146C232 126 216 110 196 104C176 98 154 102 136 112C120 120 106 132 96 146C90 136 84 138 76 146Z",
};

const SIDE_L: Record<HairStyle, string | null> = {
  longStraight: "M88 118C82 160 84 212 92 252C98 230 94 188 100 156Z",
  longBangs: "M80 126C74 166 76 218 86 256C92 232 86 190 94 158Z",
  tiedBack: null,
  shortWavy: "M78 128C70 154 72 186 82 212C88 194 82 164 90 142Z",
  longSide: "M82 124C74 164 76 220 86 258C92 232 86 188 96 154Z",
};

const SIDE_R: Record<HairStyle, string | null> = {
  longStraight: "M232 118C238 160 236 212 228 252C222 230 226 188 220 156Z",
  longBangs: "M240 126C246 166 244 218 234 256C228 232 234 190 226 158Z",
  tiedBack: null,
  shortWavy: "M242 128C250 154 248 186 238 212C232 194 238 164 230 142Z",
  longSide: "M238 124C246 164 244 220 234 258C228 232 234 188 224 154Z",
};

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
        <linearGradient id={`${uid}-hair`} x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor={look.hairLight} />
          <stop offset="38%" stopColor={look.hair} />
          <stop offset="100%" stopColor={look.hairDark} />
        </linearGradient>
        <linearGradient id={`${uid}-outfit`} x1="0" y1="0" x2="0.4" y2="1">
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
          <path d="M60 360C62 318 90 290 128 278L160 296L192 278C230 290 258 318 260 360Z" />
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
              cx="238"
              cy="222"
              rx="28"
              ry="24"
              fill={`url(#${uid}-hair)`}
              stroke={look.hairDark}
              strokeWidth="3"
            />
            <path
              d="M218 216c8-11 26-13 36-3M220 228c10-6 24-6 32 0"
              fill="none"
              stroke={look.hairLight}
              strokeWidth="2.2"
              strokeLinecap="round"
              opacity="0.55"
            />
            <rect
              x="224"
              y="202"
              width="18"
              height="9"
              rx="4"
              fill={look.accent}
              stroke="#7a5a1e"
              strokeWidth="1.6"
            />
          </g>
        )}

        <path
          d="M60 360C62 318 90 290 128 278L160 296L192 278C230 290 258 318 260 360Z"
          fill={`url(#${uid}-outfit)`}
          stroke="#2a1d18"
          strokeWidth="3.2"
          strokeLinejoin="round"
        />
        <g clipPath={`url(#${uid}-body-clip)`}>
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

        <Clothing look={look} uid={uid} />

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

          <path
            d={HAIR_FRONT[look.style]}
            fill={`url(#${uid}-hair)`}
            stroke={look.hairDark}
            strokeWidth="3"
            strokeLinejoin="round"
          />
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

          <HairDetails look={look} variant={variant} />

          {look.earrings !== "none" && <Earrings look={look} uid={uid} f={f} />}
          {look.glasses && <Glasses look={look} />}
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
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.58"
        >
          <path d={`M${leftX - 18} ${f.eyeY + 18}c5 3 11 3 16 0`} />
          <path d={`M${rightX + 18} ${f.eyeY + 18}c-5 3 -11 3 -16 0`} />
          <path d={`M${leftX - 28} ${f.eyeY + 31}c-3 6 -3 11 0 16`} />
          <path d={`M${rightX + 28} ${f.eyeY + 31}c3 6 3 11 0 16`} />
          <path d={`M${leftX - 24} ${f.eyeY - 1}l-6 -4`} />
          <path d={`M${leftX - 25} ${f.eyeY + 4}l-6 1`} />
          <path d={`M${rightX + 24} ${f.eyeY - 1}l6 -4`} />
          <path d={`M${rightX + 25} ${f.eyeY + 4}l6 1`} />
          <path d={`M${leftX + 8} ${f.noseY + 3}c-3 8 -2 14 2 18`} opacity="0.7" />
          <path d={`M${rightX - 8} ${f.noseY + 3}c3 8 2 14 -2 18`} opacity="0.7" />
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

      <g
        className={`chibi-mouth ${speaking ? "is-talking" : ""}`}
        style={{ transformOrigin: `160px ${f.mouthY + 8}px` }}
      >
        <path
          d={mouthPath(variant, speaking)}
          fill={look.lip}
          stroke="#743b36"
          strokeWidth="1.8"
          strokeLinejoin="round"
          transform={`translate(160 ${f.mouthY}) scale(${f.mouthScale} 1) translate(-160 -${f.mouthY})`}
        />
        <path
          d={mouthTeethPath(variant, speaking)}
          fill="#fff8f2"
          opacity="0.92"
          transform={`translate(160 ${f.mouthY}) scale(${f.mouthScale} 1) translate(-160 -${f.mouthY})`}
        />
        {variant !== "cris" && (
          <path
            d={`M156 ${f.mouthY + 12}c3 3 7 3 10 0`}
            fill="none"
            stroke="#743b36"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.4"
          />
        )}
      </g>

      {f.chubby && (
        <>
          <ellipse
            cx="98"
            cy="224"
            rx="22"
            ry="13"
            fill={look.skinShade}
            opacity="0.1"
          />
          <ellipse
            cx="222"
            cy="224"
            rx="22"
            ry="13"
            fill={look.skinShade}
            opacity="0.1"
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

const MOUTHS: Record<ChibiVariant, { smile: string; talk: string; teeth: string }> = {
  director: {
    smile:
      "M146 218c7 14 21 14 28 0c-3 2-8 3-14 3s-11-1-14-3Z",
    talk:
      "M144 216c9 22 23 22 32 0c-2 18-11 25-16 25s-14-7-16-25Z",
    teeth: "M151 220c5 3 13 3 18 0c-2 6-5 9-9 9s-7-3-9-9Z",
  },
  rose: {
    smile:
      "M150 221c5 9 15 9 20 0c-2 2-6 3-10 3s-8-1-10-3Z",
    talk:
      "M148 219c7 16 17 16 24 0c-2 13-8 18-12 18s-10-5-12-18Z",
    teeth: "M153 222c4 2 10 2 14 0c-2 5-4 7-7 7s-5-2-7-7Z",
  },
  cris: {
    smile: "M149 221c6 6 16 6 22 0",
    talk:
      "M147 219c7 14 19 14 26 0c-2 12-8 17-13 17s-11-5-13-17Z",
    teeth: "M154 222c4 2 8 2 12 0c-1 4-3 6-6 6s-5-2-6-6Z",
  },
  sherry: {
    smile:
      "M144 217c9 17 23 17 32 0c-3 2-9 4-16 4s-13-2-16-4Z",
    talk:
      "M142 215c10 24 26 24 36 0c-2 20-12 27-18 27s-16-7-18-27Z",
    teeth: "M150 219c6 3 14 3 20 0c-2 7-6 10-10 10s-8-3-10-10Z",
  },
  marilou: {
    smile:
      "M143 219c10 18 24 18 34 0c-3 2-9 4-17 4s-14-2-17-4Z",
    talk:
      "M141 217c11 25 27 25 38 0c-2 20-12 28-19 28s-17-8-19-28Z",
    teeth: "M150 221c6 3 14 3 20 0c-2 7-6 10-10 10s-8-3-10-10Z",
  },
};

function mouthPath(variant: ChibiVariant, speaking: boolean) {
  return speaking ? MOUTHS[variant].talk : MOUTHS[variant].smile;
}
function mouthTeethPath(variant: ChibiVariant, speaking: boolean) {
  return speaking ? MOUTHS[variant].teeth : "";
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

function Glasses({ look }: { look: Look }) {
  return (
    <g className="chibi-glasses">
      <rect
        x="106"
        y="161"
        width="39"
        height="28"
        rx="9"
        fill="#dcebf3"
        fillOpacity="0.14"
        stroke="#8a6824"
        strokeWidth="2.5"
      />
      <rect
        x="175"
        y="161"
        width="39"
        height="28"
        rx="9"
        fill="#dcebf3"
        fillOpacity="0.14"
        stroke="#8a6824"
        strokeWidth="2.5"
      />
      <path d="M145 172h30" fill="none" stroke="#8a6824" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M106 169l-14 -4M214 169l14 -4" fill="none" stroke="#8a6824" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M113 183l8 -14" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" opacity="0.28" />
      <path d="M182 183l8 -14" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" opacity="0.28" />
    </g>
  );
}

function HairDetails({ look, variant }: { look: Look; variant: ChibiVariant }) {
  return (
    <g fill="none" stroke={look.hairLight} strokeLinecap="round">
      <path d="M104 72C122 54 146 46 170 48" strokeWidth="7" opacity="0.22" />
      {variant === "director" && (
        <>
          <path d="M160 46v18" strokeWidth="2" opacity="0.45" />
          <path d="M112 92c-6 36 -4 82 4 120" strokeWidth="2.2" opacity="0.45" />
          <path d="M208 92c6 36 4 82 -4 120" strokeWidth="2.2" opacity="0.45" />
        </>
      )}
      {variant === "rose" && (
        <>
          <path d="M126 56c-6 20 -8 42 -6 62" strokeWidth="2.2" opacity="0.5" />
          <path d="M194 56c6 20 8 42 6 62" strokeWidth="2.2" opacity="0.5" />
          <path d="M106 92c-4 30 -3 64 3 92" strokeWidth="2.2" opacity="0.4" />
          <path d="M214 92c4 30 3 64 -3 92" strokeWidth="2.2" opacity="0.4" />
          <path d="M148 58c-8 18 -10 38 -8 58" strokeWidth="1.8" opacity="0.4" />
        </>
      )}
      {variant === "cris" && (
        <>
          <path d="M160 56v42" strokeWidth="2" opacity="0.45" />
          <path d="M120 88c-10 18 -14 40 -12 60" strokeWidth="2.2" opacity="0.45" />
          <path d="M200 88c10 18 14 40 12 60" strokeWidth="2.2" opacity="0.45" />
          <path d="M118 116c6-4 12-4 18 0M184 116c6-4 12-4 18 0" strokeWidth="1.8" opacity="0.4" />
        </>
      )}
      {variant === "sherry" && (
        <>
          <path d="M108 64c-8 22 -8 44 -2 64" strokeWidth="2.4" opacity="0.5" />
          <path d="M212 64c8 22 8 44 2 64" strokeWidth="2.4" opacity="0.5" />
          <path d="M84 150c-5 18 -4 36 2 52" strokeWidth="2.2" opacity="0.45" />
          <path d="M236 150c5 18 4 36 -2 52" strokeWidth="2.2" opacity="0.45" />
          <path d="M76 188c6 8 4 18 -2 24M244 188c-6 8 -4 18 2 24" strokeWidth="2" opacity="0.35" />
        </>
      )}
      {variant === "marilou" && (
        <>
          <path d="M142 54v20" strokeWidth="2" opacity="0.45" />
          <path d="M120 92c-8 30 -6 68 2 100" strokeWidth="2.2" opacity="0.45" />
          <path d="M204 92c8 30 6 68 -2 100" strokeWidth="2.2" opacity="0.45" />
          <path d="M94 116c-8 26 -8 54 0 78" strokeWidth="2" opacity="0.35" />
        </>
      )}
    </g>
  );
}

function Clothing({ look, uid }: { look: Look; uid: string }) {
  if (look.outfitStyle === "blazer") {
    return (
      <>
        <path
          d="M128 278L160 298L192 278L184 360L136 360Z"
          fill={look.collar}
          stroke="#2a1d18"
          strokeWidth="2.4"
          strokeLinejoin="round"
        />
        <path
          d="M128 278L160 298L140 360L104 360L116 302Z"
          fill={look.outfit}
          stroke="#2a1d18"
          strokeWidth="2.8"
          strokeLinejoin="round"
        />
        <path
          d="M192 278L160 298L180 360L216 360L204 302Z"
          fill={look.outfit}
          stroke="#2a1d18"
          strokeWidth="2.8"
          strokeLinejoin="round"
        />
        <path
          d="M140 268L160 288L180 268L172 260L160 274L148 260Z"
          fill={look.collar}
          stroke="#2a1d18"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        <path
          d="M150 286c5 8 15 8 20 0"
          fill="none"
          stroke={look.accent}
          strokeWidth="2.6"
          strokeLinecap="round"
        />
        <circle cx="160" cy="300" r="4.2" fill={look.accent} stroke="#7a5a1e" strokeWidth="1.4" />
        <circle cx="206" cy="320" r="12" fill="none" stroke={look.accent} strokeWidth="2.6" />
        <path d="M200 320h12M206 314v12" stroke={look.accent} strokeWidth="1.8" strokeLinecap="round" />
        <Lanyard look={look} />
      </>
    );
  }

  if (look.outfitStyle === "blouse") {
    return (
      <>
        <path
          d="M132 274L160 296L188 274L180 266L160 284L140 266Z"
          fill={look.collar}
          stroke="#2a1d18"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        <path d="M152 286L168 286L172 360L148 360Z" fill={look.outfitLight} opacity="0.5" />
        <path d="M160 292v62" stroke={look.outfitShade} strokeWidth="1.8" opacity="0.7" />
        <circle cx="160" cy="308" r="2" fill={look.collar} />
        <circle cx="160" cy="326" r="2" fill={look.collar} />
        <circle cx="160" cy="344" r="2" fill={look.collar} />
        <path
          d="M118 300c8 6 14 14 18 24M202 300c-8 6 -14 14 -18 24"
          fill="none"
          stroke={look.outfitShade}
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.55"
        />
        <circle cx="206" cy="318" r="11" fill="none" stroke={look.accent} strokeWidth="2.4" />
        <path d="M201 318h10M206 313v10" stroke={look.accent} strokeWidth="1.6" strokeLinecap="round" />
        <Lanyard look={look} />
      </>
    );
  }

  if (look.outfitStyle === "vneck") {
    return (
      <>
        <path
          d="M136 272L160 306L184 272L192 276L168 320L152 320L128 276Z"
          fill={look.skin}
          opacity="0.9"
        />
        <path
          d="M136 272L160 306L184 272"
          fill="none"
          stroke={look.outfitShade}
          strokeWidth="5"
          strokeLinecap="round"
        />
        <path
          d="M148 294c5 5 19 5 24 0"
          fill="none"
          stroke={look.accent}
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <circle cx="160" cy="312" r="3.2" fill={look.accent} stroke="#7a5a1e" strokeWidth="1.2" />
        <path
          d="M118 300c8 6 14 14 18 24M202 300c-8 6 -14 14 -18 24"
          fill="none"
          stroke={look.outfitShade}
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.55"
        />
        <circle cx="208" cy="324" r="11" fill="none" stroke={look.accent} strokeWidth="2.4" />
        <path d="M203 324h10M208 319v10" stroke={look.accent} strokeWidth="1.6" strokeLinecap="round" />
        <Lanyard look={look} />
      </>
    );
  }

  return (
    <>
      <path
        d="M132 272L160 294L188 272"
        fill="none"
        stroke={look.collar}
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M132 272L152 284L144 298L124 286Z"
        fill={look.collar}
        stroke="#2a1d18"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path
        d="M188 272L168 284L176 298L196 286Z"
        fill={look.collar}
        stroke="#2a1d18"
        strokeWidth="2.2"
        strokeLinejoin="round"
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
      <circle cx="208" cy="322" r="11" fill="none" stroke={look.accent} strokeWidth="2.4" />
      <path d="M203 322h10M208 317v10" stroke={look.accent} strokeWidth="1.6" strokeLinecap="round" />
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
