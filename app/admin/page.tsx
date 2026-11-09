import type { Metadata } from "next";
import { AdminClient } from "@/components/AdminClient";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Staff content desk",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <div className="min-h-dvh">
      <SiteHeader minimal />
      <AdminClient />
    </div>
  );
}
