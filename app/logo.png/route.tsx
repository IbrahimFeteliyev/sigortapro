import { ImageResponse } from "next/og";
import { logoMarkDataUri } from "@/lib/brand";

/** 512×512 PNG logo for structured data (Organization.logo) and the web manifest. */
export function GET() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={logoMarkDataUri} width={512} height={512} alt="" />
    </div>,
    { width: 512, height: 512 },
  );
}
