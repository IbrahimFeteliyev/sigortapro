import { ImageResponse } from "next/og";
import { BRAND_NAVY, logoMarkInvertedDataUri } from "@/lib/brand";

/** 512×512 PNG logo for structured data (Organization.logo) and the web manifest. */
export function GET() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: BRAND_NAVY,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={logoMarkInvertedDataUri} width={340} height={340} alt="" />
    </div>,
    { width: 512, height: 512 },
  );
}
