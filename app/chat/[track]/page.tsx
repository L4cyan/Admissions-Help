import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChatRoom } from "@/components/ChatRoom";
import { SiteHeader } from "@/components/SiteHeader";
import { TRACKS, isTrack } from "@/lib/tracks";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ track: string }>;
}): Promise<Metadata> {
  const { track } = await params;
  if (!isTrack(track)) return { title: "Not found" };
  const config = TRACKS[track];
  return {
    title: config.label,
    description: config.description,
  };
}

export default async function ChatPage({
  params,
}: {
  params: Promise<{ track: string }>;
}) {
  const { track } = await params;
  if (!isTrack(track)) notFound();

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <SiteHeader minimal />
      <ChatRoom track={track} />
    </div>
  );
}
