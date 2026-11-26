const SHIELD =
  "M16 2.6c3.5 1.8 7.2 2.9 10.9 3.2.5 0 .8.4.8.9v7.9c0 7.4-4.5 12.8-11.2 15.1-.3.1-.7.1-1 0C8.8 27.4 4.3 22 4.3 14.6V6.7c0-.5.3-.9.8-.9C8.8 5.5 12.5 4.4 16 2.6Z";
const S_STROKE =
  "M20.2 10.7c-.9-1.2-2.4-1.9-4.2-1.9-2.5 0-4.2 1.3-4.2 3.2 0 4.4 8.6 2.6 8.6 7.2 0 2-1.9 3.4-4.5 3.4-2 0-3.6-.8-4.5-2.1";

export const BRAND_NAVY = "#132342";

/** Logo mark as a standalone SVG string (favicon, generated images). */
export const logoMarkSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="${SHIELD}" fill="${BRAND_NAVY}"/><path d="${S_STROKE}" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/></svg>`;

/** White mark for dark tiles (app icons). */
export const logoMarkInvertedSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="${SHIELD}" fill="#fff"/><path d="${S_STROKE}" fill="none" stroke="${BRAND_NAVY}" stroke-width="2.5" stroke-linecap="round"/></svg>`;

const toDataUri = (svg: string) => `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;

export const logoMarkDataUri = toDataUri(logoMarkSvg);
export const logoMarkInvertedDataUri = toDataUri(logoMarkInvertedSvg);
