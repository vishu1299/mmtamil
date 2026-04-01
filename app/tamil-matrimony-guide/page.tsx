import type { Metadata } from "next";
import Link from "next/link";

import { MarketingPageShell } from "@/app/_components/marketing/marketing-page-shell";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/+$/, "");

export const metadata: Metadata = {
  title: "Tamil matrimony guide",
  description:
    "Practical Tamil matrimony tips: profile quality, family conversations, horoscope fit, and safer online matchmaking on MM Tamil.",
  alternates: { canonical: "/tamil-matrimony-guide" },
  openGraph: {
    title: "Tamil matrimony guide | MM Tamil Matrimony",
    description:
      "Practical Tamil matrimony tips: profile quality, family conversations, horoscope fit, and safer online matchmaking on MM Tamil.",
    url: `${siteUrl}/tamil-matrimony-guide`,
    type: "article",
  },
};

export default function TamilMatrimonyGuidePage() {
  return (
    <MarketingPageShell
      title="Tamil matrimony guide"
      intro="Use this guide to approach Tamil matchmaking with clarity—whether you are a bride, groom, or supporting family member."
    >
      <h2 className="font-playfair text-xl font-semibold text-maroon">Write a profile that reflects reality</h2>
      <p className="mt-3">
        The best Tamil matrimony profiles combine culture and specifics: education, job role, city,
        willingness to relocate, and what you value in a partner. Avoid vague statements that could
        mean anything; specificity builds trust.
      </p>

      <h2 className="mt-10 font-playfair text-xl font-semibold text-maroon">Align family expectations early</h2>
      <p className="mt-3">
        Many Tamil alliances involve parents or elders. Agree internally on non-negotiables—religious
        practice, career priorities, joint vs nuclear living, timelines—so your search stays
        consistent when relatives participate.
      </p>

      <h2 className="mt-10 font-playfair text-xl font-semibold text-maroon">Horoscope: tradition plus practicality</h2>
      <p className="mt-3">
        If horoscope compatibility is required, collect accurate birth details and share them in the
        structured way the platform allows. Pair horoscope discussion with practical topics like
        finances, health transparency where appropriate, and mutual respect—because a good match is
        more than charts alone.
      </p>

      <h2 className="mt-10 font-playfair text-xl font-semibold text-maroon">Stay safe online</h2>
      <p className="mt-3">
        Never send money to strangers. Keep early conversations on-platform when possible, and verify
        claims through normal family due diligence. Read our{" "}
        <Link href="/faq" className="font-semibold text-maroon underline-offset-2 hover:underline">
          FAQ
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="font-semibold text-maroon underline-offset-2 hover:underline">
          privacy
        </Link>{" "}
        pages for more.
      </p>

      <p className="mt-10">
        <Link href="/search" className="font-semibold text-maroon underline-offset-2 hover:underline">
          Go to search →
        </Link>
      </p>
    </MarketingPageShell>
  );
}
