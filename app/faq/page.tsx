import type { Metadata } from "next";
import Link from "next/link";

import { MarketingPageShell } from "@/app/_components/marketing/marketing-page-shell";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/+$/, "");

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers about MM Tamil Matrimony: profiles, search, privacy, horoscope matching, and safe Tamil matchmaking.",
  alternates: { canonical: "/faq" },
  openGraph: {
    title: "FAQ | MM Tamil Matrimony",
    description:
      "Answers about MM Tamil Matrimony: profiles, search, privacy, horoscope matching, and safe Tamil matchmaking.",
    url: `${siteUrl}/faq`,
    type: "article",
  },
};

export default function FaqPage() {
  return (
    <MarketingPageShell
      title="Frequently asked questions"
      intro="Quick answers for Tamil brides, grooms, and families using MM Tamil Matrimony."
    >
      <section aria-labelledby="faq-account">
        <h2 id="faq-account" className="font-playfair text-xl font-semibold text-maroon">
          Accounts and profiles
        </h2>
        <p className="mt-3">
          You can register, build a detailed biodata, and update your preferences as your search
          evolves. A complete profile—education, profession, family background, and expectations—helps
          serious matches find you faster and reduces repeated questions later.
        </p>
      </section>

      <section aria-labelledby="faq-search">
        <h2 id="faq-search" className="mt-10 font-playfair text-xl font-semibold text-maroon">
          Search and matching
        </h2>
        <p className="mt-3">
          Use filters such as age, religion, and location to narrow Tamil matrimony profiles. If you are
          open to matches in other cities or countries, say so clearly in your profile to avoid
          mismatched expectations.
        </p>
      </section>

      <section aria-labelledby="faq-horoscope">
        <h2 id="faq-horoscope" className="mt-10 font-playfair text-xl font-semibold text-maroon">
          Horoscope and family preferences
        </h2>
        <p className="mt-3">
          Many families value horoscope compatibility. Where supported, you can add horoscope details
          so both sides can evaluate fit alongside modern criteria like education and lifestyle.
        </p>
      </section>

      <section aria-labelledby="faq-safety">
        <h2 id="faq-safety" className="mt-10 font-playfair text-xl font-semibold text-maroon">
          Safety and privacy
        </h2>
        <p className="mt-3">
          Protect personal contact details until you are comfortable. Report suspicious behaviour and
          read our{" "}
          <Link href="/privacy" className="font-semibold text-maroon underline-offset-2 hover:underline">
            privacy overview
          </Link>{" "}
          for how data is handled.
        </p>
      </section>

      <p className="mt-10 text-sm text-[#6B6B6B]">
        For legal terms, see{" "}
        <Link href="/terms" className="font-semibold text-maroon underline-offset-2 hover:underline">
          terms of use
        </Link>
        . More policy detail may appear in{" "}
        <Link href="/privacyinfo" className="font-semibold text-maroon underline-offset-2 hover:underline">
          privacy information
        </Link>{" "}
        on this site.
      </p>
    </MarketingPageShell>
  );
}
