import type { Metadata, Viewport } from "next";
import { Caveat, DM_Sans, Fraunces } from "next/font/google";
import "./globals.css";
import { PwaRegister } from "@/components/PwaRegister";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});
const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://adzu-ask.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "AdZU Ask — Admissions & Aid",
    template: "%s · AdZU Ask",
  },
  description:
    "A friendly chibi guide to Ateneo de Zamboanga University college admissions and scholarships. Ask about the CET, requirements, aid, and deadlines — with sources.",
  applicationName: "AdZU Ask",
  keywords: [
    "Ateneo de Zamboanga University",
    "AdZU",
    "admissions",
    "scholarships",
    "financial aid",
    "CET",
    "Zamboanga",
  ],
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "AdZU Ask",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/icons/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    title: "AdZU Ask — Admissions & Aid",
    description:
      "Ask the chibi guides about AdZU college admissions, the CET, scholarships, and financial aid. Answers grounded in official notes.",
    url: siteUrl,
    siteName: "AdZU Ask",
    images: [{ url: "/icons/icon-512.png", width: 512, height: 512 }],
  },
  twitter: {
    card: "summary",
    title: "AdZU Ask — Admissions & Aid",
    description:
      "A friendly chibi guide to AdZU college admissions and scholarships.",
    images: ["/icons/icon-512.png"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0b1f4a",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${dmSans.variable} ${caveat.variable}`}>
      <body>
        {children}
        <PwaRegister />
      </body>
    </html>
  );
}
