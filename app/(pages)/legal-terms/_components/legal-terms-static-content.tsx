"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

import { POLICY_PAGE_NEW_TAB } from "@/lib/policy-page-links";

export function LegalTermsStaticContent() {
  const t = useTranslations("legalTerms");

  const toc = [
    { id: "comments-and-opinions", label: t("tocComments") },
    { id: "warranties", label: t("tocWarranties") },
    { id: "comment-license", label: t("tocCommentLicense") },
    { id: "hyperlinking", label: t("tocHyperlinking") },
    { id: "iframes", label: t("tocIframes") },
    { id: "content-liability", label: t("tocContentLiability") },
    { id: "reservation-rights", label: t("tocReservationRights") },
    { id: "removal-links", label: t("tocRemovalLinks") },
    { id: "disclaimer", label: t("tocDisclaimer") },
  ] as const;

  return (
    <div className="bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 md:grid-cols-[minmax(0,220px)_1fr] md:gap-10 lg:py-12">
        <aside className="md:sticky md:top-24 md:self-start">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#6B6B6B]">
            {t("tocTitle")}
          </p>
          <nav
            aria-label={t("navTocAria")}
            className="flex flex-col gap-2"
          >
            {toc.map(({ id, label }) => (
              <a
                key={id}
                href={`#${id}`}
                className="rounded-lg px-2 py-1.5 text-sm text-[#2C2C2C] transition-colors hover:bg-soft-rose hover:text-maroon"
              >
                {label}
              </a>
            ))}
          </nav>
        </aside>

        <article className="min-w-0 max-w-none text-[#2C2C2C]">
          <h1 className="mb-2 text-2xl font-semibold text-maroon md:text-3xl">
            {t("title")}
          </h1>
          <p className="mb-10 text-sm text-[#6B6B6B]">{t("subtitle")}</p>

          <section id="comments-and-opinions" className="scroll-mt-28">
            <h2 className="text-xl font-semibold text-[#2C2C2C] md:text-2xl">
              {t("bodyCommentsH2")}
            </h2>
            <p className="mt-4 leading-relaxed">{t("bodyCommentsP1")}</p>
            <p className="mt-4 leading-relaxed">{t("bodyCommentsP2")}</p>
          </section>

          <section id="warranties" className="mt-12 scroll-mt-28">
            <h2 className="text-xl font-semibold text-[#2C2C2C] md:text-2xl">
              {t("bodyWarrantiesH2")}
            </h2>
            <ul className="mt-4 list-disc space-y-3 pl-5 leading-relaxed">
              <li>{t("bodyWarrantiesL1")}</li>
              <li>{t("bodyWarrantiesL2")}</li>
              <li>{t("bodyWarrantiesL3")}</li>
              <li>{t("bodyWarrantiesL4")}</li>
            </ul>
          </section>

          <section id="comment-license" className="mt-12 scroll-mt-28">
            <h2 className="text-xl font-semibold text-[#2C2C2C] md:text-2xl">
              {t("bodyLicenseH2")}
            </h2>
            <p className="mt-4 leading-relaxed">{t("bodyLicenseP1")}</p>
          </section>

          <section id="hyperlinking" className="mt-12 scroll-mt-28">
            <h2 className="text-xl font-semibold text-[#2C2C2C] md:text-2xl">
              {t("bodyHyperH2")}
            </h2>
            <p className="mt-4 font-medium text-[#2C2C2C]">
              {t("bodyHyperApprovedIntro")}
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed">
              <li>{t("bodyHyperApprovedL1")}</li>
              <li>{t("bodyHyperApprovedL2")}</li>
              <li>{t("bodyHyperApprovedL3")}</li>
              <li>{t("bodyHyperApprovedL4")}</li>
              <li>{t("bodyHyperApprovedL5")}</li>
            </ul>
            <p className="mt-4 leading-relaxed">{t("bodyHyperLinkConditions")}</p>
            <p className="mt-4 font-medium text-[#2C2C2C]">
              {t("bodyHyperOtherIntro")}
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed">
              <li>{t("bodyHyperOtherL1")}</li>
              <li>{t("bodyHyperOtherL2")}</li>
              <li>{t("bodyHyperOtherL3")}</li>
              <li>{t("bodyHyperOtherL4")}</li>
              <li>{t("bodyHyperOtherL5")}</li>
              <li>{t("bodyHyperOtherL6")}</li>
              <li>{t("bodyHyperOtherL7")}</li>
            </ul>
            <p className="mt-4 leading-relaxed">{t("bodyHyperApprovalPara")}</p>
            <p className="mt-4 leading-relaxed">{t("bodyHyperHomeLinkPara")}</p>
            <p className="mt-4 leading-relaxed">{t("bodyHyperContactPara")}</p>
            <p className="mt-4 font-medium text-[#2C2C2C]">
              {t("bodyHyperApprovedHowIntro")}
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed">
              <li>{t("bodyHyperApprovedHowL1")}</li>
              <li>{t("bodyHyperApprovedHowL2")}</li>
              <li>{t("bodyHyperApprovedHowL3")}</li>
            </ul>
            <p className="mt-4 leading-relaxed">{t("bodyHyperNoLogo")}</p>
          </section>

          <section id="iframes" className="mt-12 scroll-mt-28">
            <h2 className="text-xl font-semibold text-[#2C2C2C] md:text-2xl">
              {t("bodyIframesH2")}
            </h2>
            <p className="mt-4 leading-relaxed">{t("bodyIframesP1")}</p>
          </section>

          <section id="content-liability" className="mt-12 scroll-mt-28">
            <h2 className="text-xl font-semibold text-[#2C2C2C] md:text-2xl">
              {t("bodyContentLiabilityH2")}
            </h2>
            <p className="mt-4 leading-relaxed">{t("bodyContentLiabilityP1")}</p>
          </section>

          <section id="reservation-rights" className="mt-12 scroll-mt-28">
            <h2 className="text-xl font-semibold text-[#2C2C2C] md:text-2xl">
              {t("bodyReservationH2")}
            </h2>
            <p className="mt-4 leading-relaxed">{t("bodyReservationP1")}</p>
          </section>

          <section id="removal-links" className="mt-12 scroll-mt-28">
            <h2 className="text-xl font-semibold text-[#2C2C2C] md:text-2xl">
              {t("bodyRemovalH2")}
            </h2>
            <p className="mt-4 leading-relaxed">{t("bodyRemovalP1")}</p>
            <p className="mt-4 leading-relaxed">{t("bodyRemovalP2")}</p>
          </section>

          <section id="disclaimer" className="mt-12 scroll-mt-28 pb-16">
            <h2 className="text-xl font-semibold text-[#2C2C2C] md:text-2xl">
              {t("bodyDisclaimerH2")}
            </h2>
            <p className="mt-4 leading-relaxed">{t("bodyDisclaimerP1")}</p>
            <ul className="mt-4 list-disc space-y-3 pl-5 leading-relaxed">
              <li>{t("bodyDisclaimerL1")}</li>
              <li>{t("bodyDisclaimerL2")}</li>
              <li>{t("bodyDisclaimerL3")}</li>
              <li>{t("bodyDisclaimerL4")}</li>
            </ul>
            <p className="mt-4 leading-relaxed">{t("bodyDisclaimerP2")}</p>
            <p className="mt-4 leading-relaxed">{t("bodyDisclaimerP3")}</p>
          </section>

          <p className="mt-8 border-t border-border-soft pt-8 text-sm text-[#6B6B6B]">
            {t("footerIntro")}{" "}

            <Link
              href="/privacyinfo"
              className="font-medium text-maroon hover:underline"
              {...POLICY_PAGE_NEW_TAB}
            >
              {t("footerPrivacyLink")}
            </Link>
            {t("footerEnd")}
          </p>
        </article>
      </div>
    </div>
  );
}
