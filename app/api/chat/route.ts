import { NextResponse } from "next/server";
import { answerQuestion } from "@/lib/providers";
import { isIdentityQuestion, isSmallTalk, retrieve } from "@/lib/kb";
import { getKB } from "@/lib/storage";
import { routeQuestion, staffFor } from "@/lib/staff";
import { recordGap } from "@/lib/gaps";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import type { ChatTurn, StaffId, Track } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

function isTrack(value: unknown): value is Track {
  return value === "admissions" || value === "scholarships";
}

function isStaff(value: unknown): value is StaffId {
  return value === "director" || value === "rose" || value === "cris" || value === "sherry" || value === "marilou";
}

export async function POST(request: Request) {
  try {
    const ip = clientIp(request);
    const limit = rateLimit(`chat:${ip}`, 60);
    if (!limit.ok) {
      const retryAfter = Math.max(
        1,
        Math.ceil((limit.reset - Date.now()) / 1000),
      );
      return NextResponse.json(
        {
          error:
            "You're asking faster than I can keep up. Give me a minute, then try again.",
        },
        {
          status: 429,
          headers: {
            "cache-control": "no-store",
            "retry-after": String(retryAfter),
          },
        },
      );
    }

    let body: {
      messages?: Array<{ role?: string; content?: string }>;
      previousTrack?: string;
      previousStaff?: string;
      preferredStaff?: string;
      hint?: string;
    };
    try {
      const parsed = (await request.json()) as unknown;
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        return NextResponse.json(
          { error: "The request body must be a JSON object." },
          { status: 400 },
        );
      }
      body = parsed as typeof body;
    } catch {
      return NextResponse.json(
        { error: "The request body must be valid JSON." },
        { status: 400 },
      );
    }

    if (!Array.isArray(body.messages)) {
      return NextResponse.json(
        { error: "Messages must be an array." },
        { status: 400 },
      );
    }

    const messages: ChatTurn[] = body.messages
      .filter(
        (message) =>
          message &&
          (message.role === "user" || message.role === "assistant") &&
          typeof message.content === "string",
      )
      .slice(-16)
      .map((message) => ({
        role: message.role as "user" | "assistant",
        content: message.content!.slice(0, 1600),
      }));

    const lastUserIndex = messages.map((m) => m.role).lastIndexOf("user");
    if (lastUserIndex === -1) {
      return NextResponse.json(
        { error: "Ask a question first." },
        { status: 400 },
      );
    }

    const question = messages[lastUserIndex].content.trim();
    if (!question) {
      return NextResponse.json(
        { error: "Ask a question first." },
        { status: 400 },
      );
    }

    const history = messages.slice(0, lastUserIndex);
    const previousTrack = isTrack(body.previousTrack) ? body.previousTrack : undefined;
    const previousStaff = isStaff(body.previousStaff) ? body.previousStaff : undefined;
    const preferredStaff = isStaff(body.preferredStaff)
      ? body.preferredStaff
      : undefined;
    const hint = isTrack(body.hint) ? body.hint : undefined;

    let route = routeQuestion(question, previousTrack);
    if (preferredStaff) {
      const preferred = staffFor(preferredStaff);
      route = {
        track: preferred.desk === "both" ? route.track : preferred.desk,
        staff: preferredStaff,
        confidence: "high",
        reason: "Chosen from the team sheet",
      };
    } else if (hint && route.confidence === "low" && !previousTrack) {
      route = routeQuestion(question, hint);
    }
    const staff = staffFor(route.staff);
    const handoff = previousStaff
      ? previousStaff !== route.staff
      : route.staff !== "director";

    const kb = await getKB();
    const { chunks, sources } = retrieve(kb, question, route.track, 6);
    // Only fall back to conversation mode when nothing in the notes matched.
    // A low-confidence route can still have a strong program or policy match.
    const conversational =
      route.staff === "director" && route.confidence === "low" && chunks.length === 0;
    const result = await answerQuestion({
      track: route.track,
      staff,
      question,
      history,
      chunks,
      sources,
      conversational,
    });

    const replyMiss =
      /\b(i (don't|do not) have|not in the (official )?notes|can't find|cannot find|i'm not sure)\b/i.test(
        result.reply,
      );
    const shouldLogGap =
      !isSmallTalk(question) &&
      !isIdentityQuestion(question) &&
      (result.provider === "guide" || replyMiss);
    if (shouldLogGap) {
      void recordGap({
        question,
        track: route.track,
        staff: route.staff,
      }).catch((error) => console.error("[gaps] write failed", error));
    }

    return NextResponse.json(
      {
        ...result,
        staff: route.staff,
        track: route.track,
        handoff,
        route: { confidence: route.confidence, reason: route.reason },
      },
      {
        headers: {
          "cache-control": "no-store",
          "x-ratelimit-remaining": String(limit.remaining),
        },
      },
    );
  } catch (error) {
    console.error("[api/chat]", error);
    return NextResponse.json(
      {
        error:
          "Something went wrong on my side. Please try again, or contact the Admissions & Aid Office directly.",
      },
      { status: 500 },
    );
  }
}
