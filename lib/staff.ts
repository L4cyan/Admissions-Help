import type { StaffId, Track } from "./types";

export interface StaffProfile {
  id: StaffId;
  /** What students call them. */
  name: string;
  fullName: string;
  role: string;
  desk: Track | "both";
  handles: string[];
  /** Shown in the stage when this person is active. */
  line: string;
  accent: string;
  soft: string;
  chibi: StaffId;
  suggestions: string[];
}

export const STAFF: Record<StaffId, StaffProfile> = {
  director: {
    id: "director",
    name: "Ma'am Jen",
    fullName: "Jennifer G. Reyes",
    role: "Director, College Admissions & Aid Office",
    desk: "both",
    handles: ["Where to start", "Office contact", "Anything unclear"],
    line: "Tell me what you need and I'll bring in the right person.",
    accent: "#b8861f",
    soft: "#f4e7c8",
    chibi: "director",
    suggestions: [
      "How do I apply for the CET?",
      "What scholarships can I apply for?",
      "Where is the Admissions & Aid Office?",
      "I'm a transferee. What do I need?",
    ],
  },
  rose: {
    id: "rose",
    name: "Ate Rose",
    fullName: "Rose Jasmine Lumigis",
    role: "Scholarships & financial aid",
    desk: "scholarships",
    handles: ["Grant types", "Financial aid", "Requirements"],
    line: "I'll help you find the grant that fits.",
    accent: "#a8543f",
    soft: "#f6e2d9",
    chibi: "rose",
    suggestions: [
      "What documents do I need for a scholarship?",
      "What scholarships does AdZU offer?",
      "Does the grant cover summer classes?",
      "Can I apply for financial aid?",
    ],
  },
  cris: {
    id: "cris",
    name: "Ate Cris",
    fullName: "Crizel P. Cardenas",
    role: "Scholarships & ASAA",
    desk: "scholarships",
    handles: ["Application status", "Renewals", "Deadlines"],
    line: "Let's check the process and the deadline.",
    accent: "#7d5a8c",
    soft: "#eee2f1",
    chibi: "cris",
    suggestions: [
      "When is the scholarship deadline?",
      "Where do I submit my scholarship papers?",
      "How do I renew my scholarship?",
      "What is the Student Assistantship grant?",
    ],
  },
  sherry: {
    id: "sherry",
    name: "Ate Sherry",
    fullName: "Sherry Gloria A. Lim",
    role: "Admissions · CET Test Coordinator",
    desk: "admissions",
    handles: ["CET schedule", "Test permits", "Application portal"],
    line: "I'll walk you through the CET step by step.",
    accent: "#2f6f8f",
    soft: "#dcebf2",
    chibi: "sherry",
    suggestions: [
      "How do I apply for the AdZU CET?",
      "When is the next CET?",
      "How much is the entrance exam fee?",
      "What do I bring to get a test permit?",
    ],
  },
  marilou: {
    id: "marilou",
    name: "Ate Marilou",
    fullName: "Marilou Pong",
    role: "Admissions & enrollment",
    desk: "admissions",
    handles: ["Freshman requirements", "Transferees", "Enrollment"],
    line: "Let's get your enrollment checklist straight.",
    accent: "#2b5c9c",
    soft: "#dfe8f4",
    chibi: "marilou",
    suggestions: [
      "What are the freshman enrollment requirements?",
      "What does a transferee need to submit?",
      "Where is the Admissions & Aid Office?",
      "How do I shift to another program?",
    ],
  },
};

export const STAFF_LIST = [
  STAFF.director,
  STAFF.rose,
  STAFF.cris,
  STAFF.sherry,
  STAFF.marilou,
];

export const DESK_STAFF: Record<Track, StaffId[]> = {
  admissions: ["sherry", "marilou"],
  scholarships: ["rose", "cris"],
};

export function staffFor(id: StaffId): StaffProfile {
  return STAFF[id];
}

const STRONG: Record<Track, string[]> = {
  admissions: [
    "cet",
    "college entrance test",
    "entrance exam",
    "entrance test",
    "test permit",
    "examinee",
    "testing center",
    "freshman",
    "freshmen",
    "transferee",
    "form 138",
    "good moral",
    "honorable dismissal",
    "rtcu",
    "enrollment",
    "enroll",
    "shifting",
    "nmat",
    "senior high",
    "grade 11",
    "admissions office",
    "application portal",
  ],
  scholarships: [
    "scholarship",
    "scholar",
    "financial aid",
    "financial assistance",
    "grant",
    "stipend",
    "allowance",
    "blue eagle",
    "student assistantship",
    "benefactor",
    "free tuition",
    "tuition discount",
    "income tax",
    "itr",
    "electric bill",
    "recommendation letter",
    "asaa",
    "renewal",
    "summer coverage",
    "dost",
    "ched",
    "pesfa",
    "tes",
  ],
};

const WEAK: Record<Track, string[]> = {
  admissions: [
    "apply",
    "application",
    "requirement",
    "requirements",
    "deadline",
    "fee",
    "exam",
    "test",
    "admission",
    "college",
    "course",
    "program",
    "campus",
    "office",
    "form",
    "document",
  ],
  scholarships: [
    "apply",
    "application",
    "requirement",
    "requirements",
    "deadline",
    "fee",
    "aid",
    "assistance",
    "submit",
    "documents",
    "form",
    "interview",
    "qualify",
    "eligibility",
    "coverage",
  ],
};

const FOLLOW_UP =
  /^(and|also|then|what about|how about|what if|paano|saan|kailan|magkano|sino|pwede|pano)\b/i;

function keywordHits(text: string, words: string[], weight: number): number {
  let score = 0;
  for (const word of words) {
    const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const plural = /[a-z]$/i.test(word) && !word.endsWith("s") ? "(?:s|es)?" : "";
    if (new RegExp(`(^|\\b)${escaped}${plural}(\\b|$)`, "i").test(text)) {
      score += weight;
    }
  }
  return score;
}

export interface RouteResult {
  track: Track;
  staff: StaffId;
  confidence: "high" | "medium" | "low";
  reason: string;
}

/**
 * Fast, deterministic desk routing. No model call, no latency. The AI still
 * writes the answer; this only decides who should answer it.
 */
export function routeQuestion(
  question: string,
  previousTrack?: Track,
): RouteResult {
  const text = question.toLowerCase().replace(/\s+/g, " ").trim();
  const admissions =
    keywordHits(text, STRONG.admissions, 4) +
    keywordHits(text, WEAK.admissions, 1.4);
  const scholarships =
    keywordHits(text, STRONG.scholarships, 4) +
    keywordHits(text, WEAK.scholarships, 1.4);

  const strongScholarship = keywordHits(text, STRONG.scholarships, 1);
  const strongAdmissions = keywordHits(text, STRONG.admissions, 1);
  const isFollowUp =
    Boolean(previousTrack) &&
    (text.length < 70 || FOLLOW_UP.test(text)) &&
    strongScholarship === 0 &&
    strongAdmissions === 0;

  let track: Track;
  let confidence: RouteResult["confidence"];
  let reason: string;

  if (isFollowUp && previousTrack) {
    track = previousTrack;
    confidence = "medium";
    reason = "Continuing the same desk";
  } else if (scholarships >= admissions + 2) {
    track = "scholarships";
    confidence = scholarships >= admissions + 4 ? "high" : "medium";
    reason = "Scholarship or financial-aid words";
  } else if (admissions >= scholarships + 2) {
    track = "admissions";
    confidence = admissions >= scholarships + 4 ? "high" : "medium";
    reason = "Admissions or CET words";
  } else if (scholarships > admissions) {
    track = "scholarships";
    confidence = "low";
    reason = "Slightly scholarship-shaped";
  } else if (admissions > scholarships) {
    track = "admissions";
    confidence = "low";
    reason = "Slightly admissions-shaped";
  } else if (previousTrack) {
    track = previousTrack;
    confidence = "low";
    reason = "No clear desk; keeping the current one";
  } else {
    track = "admissions";
    confidence = "low";
    reason = "No clear desk; starting with admissions";
  }

  // If the question is clearly about the office itself, the director answers.
  const officeish =
    /\b(who are you|who is|staff|team|director|human|person|office hours|contact|email|phone|number|address|where is the office|complaint|follow up|follow-up)\b/i.test(
      text,
    );
  if (officeish && confidence !== "high") {
    return {
      track,
      staff: "director",
      confidence: "medium",
      reason: "Office or people question",
    };
  }

  return {
    track,
    staff: pickStaff(track, text, confidence),
    confidence,
    reason,
  };
}

function pickStaff(
  track: Track,
  text: string,
  confidence: RouteResult["confidence"],
): StaffId {
  if (confidence === "low") return "director";

  if (track === "scholarships") {
    const cris =
      /(deadline|status|renew|asaa|submit|submission|form|document|requirement|interview|follow.?up|release|result)/i.test(
        text,
      );
    return cris ? "cris" : "rose";
  }

  const sherry =
    /(cet|entrance|test|permit|schedule|exam|portal|apply|application|examinee|testing center)/i.test(
      text,
    );
  return sherry ? "sherry" : "marilou";
}
