import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { gapStats, listGaps, removeGap, resolveGap } from "@/lib/gaps";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "Admin passcode required." }, { status: 401 });
  }
  const gaps = await listGaps();
  return NextResponse.json({ gaps, stats: await gapStats() });
}

export async function PATCH(request: Request) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "Admin passcode required." }, { status: 401 });
  }
  const body = (await request.json().catch(() => ({}))) as {
    id?: string;
    resolved?: boolean;
  };
  if (!body.id) {
    return NextResponse.json({ error: "Gap id required." }, { status: 400 });
  }
  await resolveGap(body.id, body.resolved !== false);
  return NextResponse.json({ ok: true, gaps: await listGaps(), stats: await gapStats() });
}

export async function DELETE(request: Request) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "Admin passcode required." }, { status: 401 });
  }
  const id = new URL(request.url).searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Gap id required." }, { status: 400 });
  }
  await removeGap(id);
  return NextResponse.json({ ok: true, gaps: await listGaps(), stats: await gapStats() });
}
