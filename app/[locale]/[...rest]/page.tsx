import { notFound } from "next/navigation";

// Unknown paths inside a valid locale render the localized not-found page.
export default function CatchAllPage() {
  notFound();
}
