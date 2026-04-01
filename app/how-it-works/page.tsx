import type { Metadata } from "next";
import Link from "next/link";

import { MarketingPageShell } from "@/app/_components/marketing/marketing-page-shell";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/+$/, "");

export const metadata: Metadata = {
  title: "How it works",
  description:
    "Step-by-step: create your MM Tamil Matrimony profile, search Tamil brides and grooms, connect safely, and move toward an alliance.",
  alternates: { canonical: "/how-it-works" },
  openGraph: {
    title: "How it works | MM Tamil Matrimony",
    description:
      "Step-by-step: create your MM Tamil Matrimony profile, search Tamil brides and grooms, connect safely, and move toward an alliance.",
    url: `${siteUrl}/how-it-works`,
    type: "article",
  },
};

export default function HowItWorksPage() {
  return (
    <MarketingPageShell
      title="How MM Tamil Matrimony works"
      intro="A simple path from profile creation to meaningful conversations—built for Tamil matrimony, not casual browsing."
    >
      <h2 className="font-playfair text-xl font-semibold text-maroon">1. Create a strong profile</h2>
      <p className="mt-3">
        Add accurate education, profession, family background, and preferences. Upload clear photos if
        you are comfortable, and include horoscope details if your family expects them. Strong
        profiles get better matches and fewer mismatched introductions.
      </p>

      <h2 className="mt-10 font-playfair text-xl font-semibold text-maroon">2. Search with intent</h2>
      <p className="mt-3">
        Use filters for age, religion, and location to find Tamil brides or grooms who fit your
        criteria. Be honest about must-haves and nice-to-haves so you do not waste your time—or
        someone else’s.
      </p>

      <h2 className="mt-10 font-playfair text-xl font-semibold text-maroon">3. Connect respectfully</h2>
      <p className="mt-3">
        Express interest and move conversations forward with respect. Share contact details only when
        both sides are comfortable, and involve families when that is part of your process.
      </p>

      <h2 className="mt-10 font-playfair text-xl font-semibold text-maroon">4. Evaluate seriously</h2>
      <p className="mt-3">
        Discuss lifestyle, relocation, career plans, and family expectations early. If horoscope
        matching matters, align on that alongside practical compatibility.
      </p>

      <p className="mt-10">
        <Link
          href="/loginstep"
          className="inline-flex rounded-xl bg-maroon px-6 py-3 font-semibold text-white shadow-maroon transition hover:bg-maroon/90"
        >
          Register to get started
        </Link>
      </p>
    </MarketingPageShell>
  );
}
