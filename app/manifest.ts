import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AdZU Ask — Admissions & Aid",
    short_name: "AdZU Ask",
    description:
      "A friendly chibi guide to Ateneo de Zamboanga University college admissions and scholarships.",
    id: "/",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#fbf6ea",
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
        url: "/chat/admissions",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "Scholarships",
        short_name: "Aid",
        description: "Ask about grants, financial aid, and requirements.",
        url: "/chat/scholarships",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
    ],
  };
}
