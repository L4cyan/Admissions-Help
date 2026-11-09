import { ChatExperience } from "@/components/ChatExperience";
import type { Track } from "@/lib/types";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; desk?: string }>;
}) {
  const params = await searchParams;
  const desk: Track | undefined =
    params.desk === "admissions"
      ? "admissions"
      : params.desk === "scholarships"
        ? "scholarships"
        : undefined;

  return (
    <ChatExperience
      initialQuery={typeof params.q === "string" ? params.q : undefined}
      initialDesk={desk}
    />
  );
}
