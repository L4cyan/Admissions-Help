import { NextResponse } from "next/server";
import { getKB, kbStats } from "@/lib/storage";
import { buildChunks } from "@/lib/kb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const kb = await getKB();
  const chunks = buildChunks(kb);
  return NextResponse.json({
    ok: true,
    stats: kbStats(kb),
    chunks: chunks.length,
    providers: {
      custom: Boolean(
        process.env.AI_BASE_URL && process.env.AI_API_KEY && process.env.AI_MODEL,
      ),
      openrouter: Boolean(process.env.OPENROUTER_API_KEY),
      gemini: Boolean(process.env.GEMINI_API_KEY),
      groq: Boolean(process.env.GROQ_API_KEY),
    },
  });
}
