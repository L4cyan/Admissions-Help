import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ track: string }>;
}): Promise<Metadata> {
  const { track } = await params;
  if (track !== "admissions" && track !== "scholarships") {
    return { title: "Not found" };
  }
  return {
    title: track === "admissions" ? "Admissions" : "Scholarships",
  };
}

export default async function ChatPage({
  params,
  searchParams,
}: {
  params: Promise<{ track: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { track } = await params;
  const { q } = await searchParams;
  if (track !== "admissions" && track !== "scholarships") notFound();

  const query = q ? `&q=${encodeURIComponent(q)}` : "";
  redirect(`/?desk=${track}${query}`);
}
