import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";
import { isInsuranceSlug } from "./types/insurance";

const handleI18nRouting = createMiddleware(routing);

const productPath = new RegExp(`^/(${routing.locales.join("|")})/insurance/([^/]+)/?$`);

export default function proxy(request: NextRequest) {
  // Unknown product slugs get a real 404 status (instead of a streamed
  // not-found page) by routing them to the localized catch-all.
  const match = request.nextUrl.pathname.match(productPath);
  if (match && !isInsuranceSlug(match[2])) {
    const url = request.nextUrl.clone();
    url.pathname = `/${match[1]}/not-found`;
    return NextResponse.rewrite(url);
  }

  return handleI18nRouting(request);
}

export const config = {
  // Run on everything except API routes, Next.js internals, generated icons
  // and files with an extension (images, robots.txt, sitemap.xml, etc.).
  matcher: "/((?!api|_next|_vercel|apple-icon|.*\\..*).*)",
};
