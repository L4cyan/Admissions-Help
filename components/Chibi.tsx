import type { CSSProperties } from "react";
import type { ChibiVariant } from "@/lib/types";

export type { ChibiVariant } from "@/lib/types";

interface Look {
  bg1: string;
  bg2: string;
  halo: string;
  skin: string;
  skinShade: string;
  hair: string;
  hairLight: string;
  top: string;
  topShade: string;
  accent: string;
  style: "long" | "bob" | "long2" | "bun" | "short";
  outfit: "black" | "polo" | "striped" | "tee" | "blouse";
  earrings: boolean;
}

const LOOKS: Record<ChibiVariant, Look> = {
  director: {
    bg1: "#fbf1dc",
    bg2: "#f2ddb4",
    halo: "#e7c987",
    skin: "#efc4a1",
    skinShade: "#dfa982",
    hair: "#34221a",
    hairLight: "#51352a",
    top: "#1d1d24",
    topShade: "#111116",
    accent: "#d7a62d",
    style: "long",
    outfit: "black",
    earrings: true,
  },
  "admissions-1": {
    bg1: "#eaf2fb",
    bg2: "#cfe2f6",
    halo: "#a9c8ea",
    skin: "#eec3a1",
    skinShade: "#dda982",
    hair: "#2b1d18",
    hairLight: "#473028",
    top: "#1b3a70",
    topShade: "#122a55",
    accent: "#e6b53a",
    style: "bob",
    outfit: "polo",
    earrings: false,
  },
  "admissions-2": {
    bg1: "#eef4f8",
    bg2: "#d7e5ec",
    halo: "#b8cfda",
    skin: "#e9ba96",
    skinShade: "#d7a17d",
    hair: "#3b251b",
    hairLight: "#57392b",
    top: "#d9d5cc",
    topShade: "#b9b3a8",
    accent: "#2b5c9c",
    style: "long2",
    outfit: "striped",
    earrings: false,
  },
  "scholarships-1": {
    bg1: "#fff5df",
    bg2: "#f6e1b6",
    halo: "#e8c985",
    skin: "#ecc09d",
    skinShade: "#d9a780",
    hair: "#2d1f18",
    hairLight: "#4a3126",
    top: "#bcd9ea",
    topShade: "#9cc0d6",
    accent: "#c98c17",
    style: "bun",
    outfit: "tee",
    earrings: false,
  },
  "scholarships-2": {
    bg1: "#fbf3ee",
    bg2: "#ecd9cf",
    halo: "#dcc1b3",
    skin: "#f0c6a4",
    skinShade: "#dda985",
    hair: "#241a17",
    hairLight: "#3e2b25",
    top: "#f7f4ee",
    topShade: "#ddd7cc",
    accent: "#8b8b8b",
    style: "short",
    outfit: "blouse",
    earrings: true,
  },
};

const HAIR_BACK: Record<Look["style"], string> = {
  long: "M54 114C47 71 77 36 120 36C163 36 193 71 186 114L191 190C185 201 173 205 165 197L163 151C150 168 90 168 77 151L75 197C67 205 55 201 49 190Z",
  long2:
    "M55 112C49 70 78 36 120 36C162 36 191 70 185 112L189 188C183 199 172 203 164 195L162 150C149 167 91 167 78 150L76 195C68 203 57 199 51 188Z",
  bob: "M58 112C52 72 82 38 120 38C158 38 188 72 182 112L184 147C178 161 164 165 156 154L154 131C144 143 96 143 86 131L84 154C76 165 62 161 56 147Z",
  bun: "M61 110C56 72 83 39 120 39C157 39 184 72 179 110L182 148C176 161 164 164 156 154L154 132C145 143 95 143 86 132L84 154C76 164 64 161 58 148Z",
  short:
    "M59 110C54 71 83 38 120 38C157 38 186 71 181 110L183 139C177 151 165 154 157 144L155 128C145 140 95 140 85 128L83 144C75 154 63 151 57 139Z",
};

const HAIR_FRONT: Record<Look["style"], string> = {
  long: "M63 112C58 77 78 49 105 45C97 61 93 78 95 95C82 101 72 110 63 125ZM177 112C182 77 162 49 135 45C143 61 147 78 145 95C158 101 168 110 177 125Z",
  long2:
    "M62 110C59 76 80 49 106 45C99 62 97 80 100 97C86 103 73 112 64 126ZM178 110C181 76 160 49 134 45C141 62 143 80 140 97C154 103 167 112 176 126Z",
  bob: "M61 104C65 68 89 45 121 45C153 45 176 66 180 104C169 94 158 87 145 84C132 98 111 102 94 95C82 97 71 100 61 110Z",
  bun: "M63 105C67 68 91 46 120 46C149 46 173 68 177 105C164 88 147 79 120 79C93 79 76 88 63 105Z",
  short:
    "M61 106C64 69 90 46 121 46C153 46 177 68 180 107C169 96 159 90 147 87C137 104 118 108 100 100C87 98 73 100 61 111Z",
};

export function Chibi({
  variant,
  className,
  title,
  style,
}: {
  variant: ChibiVariant;
  className?: string;
  title?: string;
  style?: CSSProperties;
}) {
  const look = LOOKS[variant];
  const uid = `chibi-${variant}`;
  const label =
    title ??
    (variant === "director"
      ? "Chibi director welcome guide"
      : variant.startsWith("admissions")
        ? "Chibi admissions guide"
        : "Chibi scholarship guide");

  return (
    <svg
      viewBox="0 0 240 240"
      role="img"
      aria-label={label}
      className={className}
      style={style}
    >
      <defs>
        <linearGradient id={`${uid}-bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={look.bg1} />
          <stop offset="100%" stopColor={look.bg2} />
        </linearGradient>
        <radialGradient id={`${uid}-glow`} cx="50%" cy="32%" r="70%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <clipPath id={`${uid}-clip`}>
          <circle cx="120" cy="120" r="111" />
        </clipPath>
      </defs>

      <circle cx="120" cy="120" r="112" fill={`url(#${uid}-bg)`} />
      <g clipPath={`url(#${uid}-clip)`}>
        <circle cx="120" cy="88" r="96" fill={`url(#${uid}-glow)`} />
        <circle cx="42" cy="58" r="3.2" fill={look.halo} opacity="0.8" />
        <circle cx="198" cy="78" r="2.4" fill={look.halo} opacity="0.7" />
        <path
          d="M198 42l1.8 5.2 5.2 1.8-5.2 1.8-1.8 5.2-1.8-5.2-5.2-1.8 5.2-1.8Z"
          fill={look.accent}
          opacity="0.65"
        />
        <path
          d="M38 112l1.4 4.2 4.2 1.4-4.2 1.4-1.4 4.2-1.4-4.2-4.2-1.4 4.2-1.4Z"
          fill={look.accent}
          opacity="0.5"
        />

        {/* shoulders */}
        <path
          d="M40 244C40 203 67 184 96 178L120 196L144 178C173 184 200 203 200 244Z"
          fill={look.top}
          stroke="#3a2a22"
          strokeWidth="3.4"
          strokeLinejoin="round"
        />

        {/* neck */}
        <rect x="105" y="150" width="30" height="38" rx="13" fill={look.skin} />
        <path
          d="M105 160C112 168 128 168 135 160L135 176C125 184 115 184 105 176Z"
          fill={look.skinShade}
          opacity="0.65"
        />

        <Clothing look={look} uid={uid} />

        {/* ears */}
        <ellipse cx="59" cy="114" rx="8" ry="11" fill={look.skin} stroke="#3a2a22" strokeWidth="3" />
        <ellipse cx="181" cy="114" rx="8" ry="11" fill={look.skin} stroke="#3a2a22" strokeWidth="3" />
        <path d="M56 110c3 2 5 5 5 8" fill="none" stroke={look.skinShade} strokeWidth="2" strokeLinecap="round" />
        <path d="M184 110c-3 2-5 5-5 8" fill="none" stroke={look.skinShade} strokeWidth="2" strokeLinecap="round" />

        {/* back hair */}
        <path
          d={HAIR_BACK[look.style]}
          fill={look.hair}
          stroke="#241611"
          strokeWidth="3.2"
          strokeLinejoin="round"
        />

        {/* head */}
        <circle cx="120" cy="108" r="61" fill={look.skin} stroke="#3a2a22" strokeWidth="3.4" />
        <path
          d="M78 154c12 12 72 12 84 0"
          fill="none"
          stroke={look.skinShade}
          strokeWidth="2"
          opacity="0.35"
        />

        {/* face */}
        <path
          d="M84 100c7-5 15-5 22 0M134 100c7-5 15-5 22 0"
          fill="none"
          stroke={look.hair}
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        <g className="chibi-eyes">
          <ellipse cx="95" cy="116" rx="7.4" ry="9.2" fill="#2b1d18" />
          <ellipse cx="145" cy="116" rx="7.4" ry="9.2" fill="#2b1d18" />
          <circle cx="97" cy="112.5" r="2.4" fill="#ffffff" />
          <circle cx="147" cy="112.5" r="2.4" fill="#ffffff" />
          <circle cx="92.6" cy="119" r="1.15" fill="#ffffff" opacity="0.85" />
          <circle cx="142.6" cy="119" r="1.15" fill="#ffffff" opacity="0.85" />
        </g>
        <path
          d="M87 126c2.4 2.4 5.3 3.6 8.3 3.6M153 126c-2.4 2.4-5.3 3.6-8.3 3.6"
          fill="none"
          stroke="#c98c72"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.55"
        />
        <path
          d="M118 127c1.4 1.8 2.6 1.8 4 0"
          fill="none"
          stroke="#b98266"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <ellipse cx="80" cy="132" rx="7.5" ry="4" fill="#f29a91" opacity="0.55" />
        <ellipse cx="160" cy="132" rx="7.5" ry="4" fill="#f29a91" opacity="0.55" />

        <Mouth variant={variant} />

        {/* front hair */}
        <path
          d={HAIR_FRONT[look.style]}
          fill={look.hair}
          stroke="#241611"
          strokeWidth="3.2"
          strokeLinejoin="round"
        />
        <path
          d="M83 54c10-6 23-8 35-6M132 47c10 1 19 5 26 12"
          fill="none"
          stroke={look.hairLight}
          strokeWidth="3.4"
          strokeLinecap="round"
          opacity="0.8"
        />
        <path
          d="M70 92c-2 20 0 38 7 54M170 92c2 20 0 38-7 54"
          fill="none"
          stroke={look.hairLight}
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.45"
        />

        {look.style === "bun" && (
          <>
            <circle cx="174" cy="54" r="20" fill={look.hair} stroke="#241611" strokeWidth="3.2" />
            <path
              d="M160 48c5-8 18-10 26-3"
              fill="none"
              stroke={look.hairLight}
              strokeWidth="3"
              strokeLinecap="round"
              opacity="0.8"
            />
          </>
        )}

        {look.earrings && (
          <>
            <circle cx="59" cy="127" r="3.6" fill="none" stroke={look.accent} strokeWidth="2.2" />
            <circle cx="181" cy="127" r="3.6" fill="none" stroke={look.accent} strokeWidth="2.2" />
          </>
        )}

        <LookProps look={look} variant={variant} />
      </g>
      <circle
        cx="120"
        cy="120"
        r="111"
        fill="none"
        stroke="#3a2a22"
        strokeWidth="3"
        opacity="0.18"
      />
    </svg>
  );
}

function Mouth({ variant }: { variant: ChibiVariant }) {
  if (variant === "director") {
    return (
      <>
        <path
          d="M104 136c5 11 27 11 32 0-4 3-9 4.5-16 4.5S108 139 104 136Z"
          fill="#81352f"
          stroke="#5d241f"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path d="M108 138c7 3 17 3 24 0-3 5-7 7-12 7s-9-2-12-7Z" fill="#ffffff" />
      </>
    );
  }
  return (
    <>
      <path
        d="M108 137c4 8 20 8 24 0-3 2.4-7 3.6-12 3.6s-9-1.2-12-3.6Z"
        fill="#8a3b34"
        stroke="#642923"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M112 139c5 2 11 2 16 0-2 3.4-5 5-8 5s-6-1.6-8-5Z" fill="#ffffff" />
    </>
  );
}

function Clothing({ look, uid }: { look: Look; uid: string }) {
  if (look.outfit === "polo") {
    return (
      <>
        <path
          d="M84 184L120 199L156 184L164 196L148 214L120 205L92 214L76 196Z"
          fill="#f7f5ef"
          stroke="#3a2a22"
          strokeWidth="2.6"
          strokeLinejoin="round"
        />
        <path d="M120 199v14" stroke={look.topShade} strokeWidth="2.2" />
        <path d="M58 206c8-8 18-12 30-14M182 206c-8-8-18-12-30-14" fill="none" stroke="#f7f5ef" strokeWidth="5" strokeLinecap="round" />
        <path d="M64 197c6-5 13-8 21-10M176 197c-6-5-13-8-21-10" fill="none" stroke={look.topShade} strokeWidth="2" strokeLinecap="round" opacity="0.5" />
        <Lanyard look={look} />
      </>
    );
  }

  if (look.outfit === "striped") {
    return (
      <>
        <defs>
          <clipPath id={`${uid}-body`}>
            <path d="M40 244C40 203 67 184 96 178L120 196L144 178C173 184 200 203 200 244Z" />
          </clipPath>
        </defs>
        <g clipPath={`url(#${uid}-body)`}>
          <rect x="35" y="196" width="170" height="18" fill="#f5f0e5" />
          <rect x="35" y="224" width="170" height="18" fill="#f5f0e5" />
          <rect x="35" y="252" width="170" height="18" fill="#f5f0e5" />
        </g>
        <path
          d="M99 184c6 7 36 7 42 0"
          fill="none"
          stroke="#f5f0e5"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <path
          d="M99 184c6 7 36 7 42 0"
          fill="none"
          stroke={look.topShade}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <Lanyard look={look} />
      </>
    );
  }

  if (look.outfit === "tee") {
    return (
      <>
        <path
          d="M92 183c8 10 48 10 56 0"
          fill="none"
          stroke={look.topShade}
          strokeWidth="9"
          strokeLinecap="round"
        />
        <path
          d="M92 183c8 10 48 10 56 0"
          fill="none"
          stroke="#f6f1e6"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path d="M62 208c7-8 16-13 27-16M178 208c-7-8-16-13-27-16" fill="none" stroke={look.topShade} strokeWidth="2" strokeLinecap="round" opacity="0.55" />
        <Lanyard look={look} />
        <g transform="rotate(-7 167 218)">
          <rect x="148" y="204" width="40" height="28" rx="2" fill="#fffdf7" stroke="#3a2a22" strokeWidth="2.2" />
          <path d="M154 212h28M154 218h24M154 224h18" stroke="#b7aa92" strokeWidth="1.6" strokeLinecap="round" />
          <circle cx="184" cy="226" r="4.6" fill="#d7a62d" stroke="#8f6410" strokeWidth="1.4" />
        </g>
      </>
    );
  }

  if (look.outfit === "blouse") {
    return (
      <>
        <path
          d="M88 184L120 198L152 184L160 194L142 204L120 199L98 204L80 194Z"
          fill="#fbf8f1"
          stroke="#3a2a22"
          strokeWidth="2.6"
          strokeLinejoin="round"
        />
        <path d="M120 199v16" stroke="#cfc6b8" strokeWidth="2" />
        <circle cx="120" cy="210" r="1.6" fill="#bdb2a2" />
        <circle cx="120" cy="222" r="1.6" fill="#bdb2a2" />
        <path
          d="M68 200c9 3 15 8 20 15M172 200c-9 3-15 8-20 15"
          fill="none"
          stroke="#c9c1b4"
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity="0.8"
        />
        <g fill="none" stroke="#b9b0a2" strokeWidth="1.5" opacity="0.7">
          <path d="M71 213c5-4 9-4 13 0-4 4-9 4-13 0Z" />
          <path d="M78 220c5-4 9-4 13 0-4 4-9 4-13 0Z" />
          <path d="M158 216c5-4 9-4 13 0-4 4-9 4-13 0Z" />
        </g>
        <Lanyard look={look} />
      </>
    );
  }

  return (
    <>
      <path
        d="M92 185c7 8 49 8 56 0"
        fill="none"
        stroke={look.topShade}
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M96 186c6 5 42 5 48 0"
        fill="none"
        stroke="#d7a62d"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <circle cx="120" cy="199" r="3" fill="#d7a62d" stroke="#8f6410" strokeWidth="1.2" />
      <g transform="rotate(-8 165 214)">
        <rect x="146" y="201" width="42" height="29" rx="2.5" fill="#fffdf7" stroke="#3a2a22" strokeWidth="2.2" />
        <path d="M147 202l20 14 20-14" fill="none" stroke="#c9bfa8" strokeWidth="1.6" />
        <circle cx="167" cy="216" r="4.8" fill="#d7a62d" stroke="#8f6410" strokeWidth="1.4" />
        <path d="M165 216l1.6 1.7 3.4-3.6" fill="none" stroke="#8f6410" strokeWidth="1.1" strokeLinecap="round" />
      </g>
    </>
  );
}

function Lanyard({ look }: { look: Look }) {
  return (
    <>
      <path d="M101 188l10 24M139 188l-10 24" stroke={look.accent} strokeWidth="3.4" strokeLinecap="round" />
      <rect x="107" y="210" width="26" height="33" rx="3" fill="#fffdf7" stroke="#3a2a22" strokeWidth="2.2" />
      <rect x="110" y="213" width="20" height="7" rx="1.4" fill={look.top} />
      <circle cx="120" cy="227" r="4.4" fill={look.skin} />
      <path d="M114 238c1.5-4 4-6 6-6s4.5 2 6 6" fill={look.top} />
    </>
  );
}

function LookProps({ look, variant }: { look: Look; variant: ChibiVariant }) {
  if (variant === "admissions-1") {
    return (
      <path
        d="M60 196c9-8 21-13 33-16"
        fill="none"
        stroke="#f7f5ef"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
    );
  }
  if (variant === "scholarships-2") {
    return (
      <g fill="none" stroke="#a9a093" strokeWidth="1.4" opacity="0.55">
        <path d="M64 214c7-5 12-5 18 0" />
        <path d="M68 222c6-4 11-4 16 0" />
      </g>
    );
  }
  return null;
}
