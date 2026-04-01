import type { MetadataRoute } from "next";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/+$/, "");

const publicRoutes = [
  "/",
  "/search",
  "/faq",
  "/privacy",
  "/terms",
  "/how-it-works",
  "/tamil-matrimony-guide",
  "/about",
  "/about/aboutus",
  "/about/communityguidelines",
  "/about/onlinedispute",
  "/support",
  "/support/faq",
  "/privacyinfo",
  "/privacyinfo/privacypolicy",
  "/privacyinfo/cookiepolicy",
  "/legal-terms",
  "/legal-terms/termsofuse",
  "/legal-terms/paymentandrefund",
  "/legal-terms/misconductpolicy",
  "/privacypolicy",
  "/success-stories",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return publicRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "/" ? "daily" : "weekly",
    priority: route === "/" ? 1 : 0.7,
  }));
}
