import type { Metadata } from "next";
import Link from "next/link";

import { MarketingPageShell } from "@/app/_components/marketing/marketing-page-shell";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/+$/, "");

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "How MM Tamil Matrimony handles your data, profile information, and communication for safer Tamil matrimony.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: "Privacy | MM Tamil Matrimony",
    description:
      "How MM Tamil Matrimony handles your data, profile information, and communication for safer Tamil matrimony.",
    url: `${siteUrl}/privacy`,
    type: "article",
  },
};

export default function PrivacyPage() {
  return (
    <MarketingPageShell
      title="Privacy at MM Tamil Matrimony"
      intro="We treat matrimony data with care. This page summarizes our privacy commitments in plain language."
    >
      <h2 className="font-playfair text-xl font-semibold text-maroon">What we collect</h2>
      <p className="mt-3">
        To run a Tamil matrimony service, we may collect profile details you choose to provide—such as
        name, contact information, education, occupation, photos, preferences, and optional horoscope
        information—along with technical data needed to operate the website securely (for example,
        device and log information as described in fuller policy documents).
      </p>

      <h2 className="mt-10 font-playfair text-xl font-semibold text-maroon">How we use information</h2>
      <p className="mt-3">
        We use your information to show your profile to relevant matches, power search, enable
        messaging features, improve safety, and comply with law. We do not sell your matrimony story
        to advertisers; the product is matchmaking, not ad targeting.
      </p>

      <h2 className="mt-10 font-playfair text-xl font-semibold text-maroon">Your controls</h2>
      <p className="mt-3">
        You should control how much you share early in a conversation. Use official platform channels
        where available, and avoid sharing banking information with strangers. If you need account help,
        contact support through the channels provided in the product.
      </p>

      <h2 className="mt-10 font-playfair text-xl font-semibold text-maroon">More detail</h2>
      <p className="mt-3">
        For extended legal wording, visit our{" "}
        <Link
          href="/privacyinfo/privacypolicy"
          className="font-semibold text-maroon underline-offset-2 hover:underline"
        >
          full privacy policy
        </Link>{" "}
        and related pages under{" "}
        <Link href="/privacyinfo" className="font-semibold text-maroon underline-offset-2 hover:underline">
          privacy information
        </Link>
        .
      </p>
    </MarketingPageShell>
  );
}
