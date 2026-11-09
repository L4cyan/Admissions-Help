import type { ChibiVariant, Track } from "./types";

export interface TrackConfig {
  id: Track;
  label: string;
  short: string;
  tagline: string;
  description: string;
  chibis: [ChibiVariant, ChibiVariant];
  accent: string;
  soft: string;
  suggestions: string[];
  greeting: string;
}

export const TRACKS: Record<Track, TrackConfig> = {
  admissions: {
    id: "admissions",
    label: "Admissions",
    short: "Admissions",
    tagline: "CET, requirements, enrollment",
    description:
      "Applying to AdZU, taking the College Entrance Test, and completing enrollment.",
    chibis: ["admissions-1", "admissions-2"],
    accent: "navy",
    soft: "sky",
    suggestions: [
      "How do I apply for the AdZU College Entrance Test?",
      "What are the requirements for freshman enrollment?",
      "How much is the entrance exam fee?",
      "When is the next CET?",
      "What are the requirements for transferees?",
      "Where is the Admissions & Aid Office?",
    ],
    greeting:
      "Hi, future Atenista! I'm your Admissions chibi guide. Ask me about the CET, requirements, test permits, or enrollment — I'll answer from the official AdZU notes.",
  },
  scholarships: {
    id: "scholarships",
    label: "Scholarships",
    short: "Aid",
    tagline: "Grants, aid, and requirements",
    description:
      "Scholarship grants, financial aid, documentary requirements, and who to contact.",
    chibis: ["scholarships-1", "scholarships-2"],
    accent: "gold",
    soft: "cream",
    suggestions: [
      "How do I apply for a scholarship?",
      "What documents do I need for financial aid?",
      "What scholarships does AdZU offer?",
      "Does the scholarship cover summer classes?",
      "What is the Student Assistantship grant?",
      "Where do I submit my scholarship application?",
    ],
    greeting:
      "Hello, scholar! I'm your Scholarships chibi guide. I can walk you through the application form, requirements, grants, and where to submit — using only the official AdZU notes.",
  },
};

export const TRACK_LIST = [TRACKS.admissions, TRACKS.scholarships];

export function isTrack(value: string): value is Track {
  return value === "admissions" || value === "scholarships";
}
