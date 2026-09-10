import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";

/** Every route a logged-out visitor can read. */
const PUBLIC_ROUTES = ["/", "/timetable", "/requests", "/changelog"];

export default function sitemap(): MetadataRoute.Sitemap {
  return PUBLIC_ROUTES.map((route) => ({
    url: new URL(route, SITE_URL).toString(),
  }));
}
