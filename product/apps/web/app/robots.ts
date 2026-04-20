import type { MetadataRoute } from "next";

const SITE_URL = "https://omnios.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/(auth)/",
          "/(os)/",
          "/login",
          "/register",
          "/dashboard",
          "/settings",
          "/inbox",
          "/crm",
          "/calendar",
          "/finance",
          "/mind",
          "/code",
          "/docs",
          "/projects",
          "/support",
          "/analytics",
          "/billing",
          "/messages",
          "/mail",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
