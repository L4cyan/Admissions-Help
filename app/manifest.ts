import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AdZU Ask — Admissions & Aid",
    short_name: "AdZU Ask",
    description:
      "One chat for Ateneo de Zamboanga University college admissions, the CET, scholarships, and financial aid.",
    id: "/",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#e9dfcc",
    theme_color: "#0b1f4a",
    categories: ["education", "productivity"],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Admissions",
        short_name: "Admissions",
        description: "Ask about the CET, requirements, and enrollment.",
        url: "/?desk=admissions",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "Scholarships",
        short_name: "Aid",
        description: "Ask about grants, financial aid, and requirements.",
        url: "/?desk=scholarships",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
    ],
  };
}
