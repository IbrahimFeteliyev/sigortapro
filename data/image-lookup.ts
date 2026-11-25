import type { Locale } from "@/i18n/routing";
import type { ImageAsset } from "@/types/insurance";
import { photos, type PhotoKey } from "./images";

export function isPhotoKey(key: string): key is PhotoKey {
  return key in photos;
}

/** Resolves a photo key to a localized image asset. */
export function photo(key: string, locale: Locale): ImageAsset {
  if (!isPhotoKey(key)) throw new Error(`Unknown photo key: ${key}`);
  const entry = photos[key];
  return { src: entry.src, alt: entry.alt[locale] };
}
