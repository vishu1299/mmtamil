import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/settings",
          "/notifications",
          "/matches",
          "/mails",
          "/chat",
          "/profile",
          "/credits",
          "/payments",
          "/checkout",
          "/loginstep",
          "/login",
          "/logout",
          "/forget_password",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
