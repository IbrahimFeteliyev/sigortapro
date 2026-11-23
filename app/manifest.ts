import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import messages from "@/messages/az.json";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: messages.Metadata.home.title,
    short_name: messages.Metadata.siteName,
    description: messages.Metadata.home.description,
    lang: routing.defaultLocale,
    start_url: `/${routing.defaultLocale}`,
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [
      { src: "/logo.png", sizes: "512x512", type: "image/png" },
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
    ],
  };
}
