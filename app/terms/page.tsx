import type { Metadata } from "next";
import Link from "next/link";

import { MarketingPageShell } from "@/app/_components/marketing/marketing-page-shell";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/+$/, "");

export const metadata: Metadata = {
  title: "Terms of use",
  description:
    "Terms for using MM Tamil Matrimony: acceptable use, accounts, subscriptions where applicable, and limitations.",
  alternates: { canonical: "/terms" },
  openGraph: {
    title: "Terms of use | MM Tamil Matrimony",
    description:
      "Terms for using MM Tamil Matrimony: acceptable use, accounts, subscriptions where applicable, and limitations.",
    url: `${siteUrl}/terms`,
    type: "article",
  },
};

export default function TermsPage() {
  return (
    <MarketingPageShell
      title="Terms of use"
      intro="By using MM Tamil Matrimony, you agree to use the service responsibly and lawfully. This summary highlights key points; the full legal text may live on linked pages."
    >
      <h2 className="font-playfair text-xl font-semibold text-maroon">Eligibility and conduct</h2>
      <p className="mt-3">
        You must provide accurate information and use the platform for genuine matrimony purposes.
        Harassment, fraud, impersonation, or misuse of other members’ information is prohibited and may
        lead to suspension or termination.
      </p>

      <h2 className="mt-10 font-playfair text-xl font-semibold text-maroon">Accounts</h2>
      <p className="mt-3">
        You are responsible for safeguarding login credentials. Notify support if you suspect
        unauthorized access. Features and availability may change as we improve the product.
      </p>

      <h2 className="mt-10 font-playfair text-xl font-semibold text-maroon">Payments and refunds</h2>
      <p className="mt-3">
        If premium features exist, pricing and billing terms are governed by the payment and refund
        policies applicable at purchase. See our dedicated legal pages for details.
      </p>

      <h2 className="mt-10 font-playfair text-xl font-semibold text-maroon">Full legal documents</h2>
      <p className="mt-3">
        Read the complete{" "}
        <Link
          href="/legal-terms/termsofuse"
          className="font-semibold text-maroon underline-offset-2 hover:underline"
        >
          terms of use
        </Link>
        ,{" "}
        <Link
          href="/legal-terms/paymentandrefund"
          className="font-semibold text-maroon underline-offset-2 hover:underline"
        >
          payment and refund
        </Link>
        , and related sections under{" "}
        <Link href="/legal-terms" className="font-semibold text-maroon underline-offset-2 hover:underline">
          legal terms
        </Link>{" "}
        for binding language.
      </p>
    </MarketingPageShell>
  );
}
