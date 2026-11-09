import { NextResponse } from "next/server";
import { answerQuestion } from "@/lib/providers";
import { retrieve } from "@/lib/kb";
import { getKB } from "@/lib/storage";
import { isTrack } from "@/lib/tracks";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import type { ChatTurn } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const ip = clientIp(request);
    const limit = rateLimit(`chat:${ip}`);
    if (!limit.ok) {
      return NextResponse.json(
        {
          error:
            "You're asking faster than my chibi brain can keep up. Please wait a few minutes and try again.",
        },
        { status: 429 },
      );
    }

    const body = (await request.json()) as {
      track?: string;
      messages?: Array<{ role?: string; content?: string }>;
    };

    if (!body.track || !isTrack(body.track)) {
      return NextResponse.json(
        { error: "Pick admissions or scholarships first." },
        { status: 400 },
      );
    }

    const messages: ChatTurn[] = (body.messages ?? [])
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
    const kb = await getKB();
    const { chunks, sources } = retrieve(kb, question, body.track, 6);
    const result = await answerQuestion({
      track: body.track,
      question,
      history,
      chunks,
      sources,
    });

    return NextResponse.json(result, {
      headers: {
        "cache-control": "no-store",
        "x-ratelimit-remaining": String(limit.remaining),
      },
    });
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
