import type { Metadata } from "next";
import { AdminDesk } from "@/components/AdminDesk";

export const metadata: Metadata = {
  title: "Staff content desk",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminDesk />;
}
