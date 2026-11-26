import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { cacheLife } from "next/cache";
import { ImageResponse } from "next/og";
import { BRAND_NAVY, logoMarkInvertedDataUri } from "@/lib/brand";
import { siteConfig } from "@/lib/site";

export const ogSize = { width: 1200, height: 630 };

/** Cached so image routes stay prerenderable under Cache Components. */
async function readFont(file: "Onest-SemiBold.ttf" | "Onest-Regular.ttf") {
  "use cache";
  cacheLife("max");
  const buffer = await readFile(join(process.cwd(), "assets", "fonts", file));
  return new Uint8Array(buffer);
}

// Static Onest instances (OFL) — Satori can't use variable fonts, and the
// Azerbaijani schwa (ə/Ə) and Cyrillic must render correctly.
async function loadFonts() {
  const [semibold, regular] = await Promise.all([
    readFont("Onest-SemiBold.ttf"),
    readFont("Onest-Regular.ttf"),
  ]);
  // `slice()` copies into an exactly-sized ArrayBuffer (a cached/deserialized
  // view may share a larger buffer), which is what Satori expects.
  return [
    { name: "Onest", data: semibold.slice().buffer, weight: 600 as const, style: "normal" as const },
    { name: "Onest", data: regular.slice().buffer, weight: 400 as const, style: "normal" as const },
  ];
}

export async function renderOgImage({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "64px 72px",
        fontFamily: "Onest",
        color: "#ffffff",
        backgroundColor: BRAND_NAVY,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoMarkInvertedDataUri} width={64} height={64} alt="" />
        <div style={{ display: "flex", fontSize: 38, fontWeight: 600, letterSpacing: -1 }}>
          <span>Sığorta</span>
          <span style={{ color: "#a2b6da" }}>Pro</span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", maxWidth: 960 }}>
        <div style={{ display: "flex", fontSize: 26, color: "#cbd7ec", marginBottom: 18 }}>{eyebrow}</div>
        <div style={{ display: "flex", fontSize: 66, fontWeight: 600, lineHeight: 1.08, letterSpacing: -2 }}>
          {title}
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#e6ecf6", marginTop: 24, lineHeight: 1.35 }}>
          {subtitle}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 24 }}>
        <div style={{ display: "flex", color: "#cbd7ec" }}>{siteConfig.url.replace(/^https?:\/\//, "")}</div>
        <div
          style={{
            display: "flex",
            padding: "12px 24px",
            borderRadius: 999,
            backgroundColor: "rgba(255,255,255,0.12)",
            border: "1px solid rgba(255,255,255,0.22)",
            fontWeight: 600,
          }}
        >
          {siteConfig.contact.phoneDisplay}
        </div>
      </div>
    </div>,
    { ...ogSize, fonts: await loadFonts() },
  );
}
