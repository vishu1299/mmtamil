import type { Metadata } from "next";

import LandingSeoContent from "./_components/landing-page/landing-seo-content";
import LandingMain from "./_components/landing-page/page";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/+$/, "");

const homeDescription =
  "Join MM Tamil Matrimony – trusted Tamil marriage website for brides and grooms. Verified profiles, horoscope match, secure matchmaking and success stories.";

export const metadata: Metadata = {
  title: {
    absolute: "Tamil Matrimony – Find Tamil Brides & Grooms | MM Tamil",
  },
  description: homeDescription,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Tamil Matrimony – Find Tamil Brides & Grooms | MM Tamil",
    description: homeDescription,
    url: siteUrl,
    type: "website",
  },
  twitter: {
    title: "Tamil Matrimony – Find Tamil Brides & Grooms | MM Tamil",
    description: homeDescription,
  },
};

export default function Home() {
  return (
    <div>
      <LandingMain />
      {/* <LandingSeoContent /> */}
    </div>
  );
}
