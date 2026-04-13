"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

import { POLICY_PAGE_NEW_TAB } from "@/lib/policy-page-links";

export function PrivacyStaticContent() {
  const t = useTranslations("privacyInfo");

  const toc = [
    { id: "other-purposes-sharing", label: t("tocOtherUses") },
    { id: "retention", label: t("tocRetention") },
    { id: "transfer", label: t("tocTransfer") },
    { id: "delete-your-data", label: t("tocDelete") },
    { id: "disclosure", label: t("tocDisclosure") },
    { id: "security", label: t("tocSecurity") },
    { id: "children-privacy", label: t("tocChildren") },
    { id: "links-other-websites", label: t("tocOtherWebsites") },
    { id: "changes", label: t("tocChanges") },
    { id: "contact", label: t("tocContact") },
  ] as const;

  const disclosureListKeys = [
    "sectionDisclosureOtherLi1",
    "sectionDisclosureOtherLi2",
    "sectionDisclosureOtherLi3",
    "sectionDisclosureOtherLi4",
    "sectionDisclosureOtherLi5",
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

          <section id="other-purposes-sharing" className="scroll-mt-28">
            <h2 className="text-xl font-semibold text-[#2C2C2C] md:text-2xl">
              {t("sectionOtherH2")}
            </h2>
            <p className="mt-4 leading-relaxed text-[#4A4A4A]">
              {t("sectionOtherP1")}
            </p>
            <p className="mt-6 font-medium text-[#2C2C2C]">
              {t("sectionOtherP2")}
            </p>
            <ul className="mt-4 list-disc space-y-4 pl-5 leading-relaxed text-[#4A4A4A]">
              {(
                [
                  ["sectionOtherLi1Label", "sectionOtherLi1Body"],
                  ["sectionOtherLi2Label", "sectionOtherLi2Body"],
                  ["sectionOtherLi3Label", "sectionOtherLi3Body"],
                  ["sectionOtherLi4Label", "sectionOtherLi4Body"],
                  ["sectionOtherLi5Label", "sectionOtherLi5Body"],
                  ["sectionOtherLi6Label", "sectionOtherLi6Body"],
                ] as const
              ).map(([labelKey, bodyKey]) => (
                <li key={labelKey}>
                  <span className="font-medium text-[#2C2C2C]">
                    {t(labelKey)}
                  </span>{" "}
                  {t(bodyKey)}
                </li>
              ))}
            </ul>
          </section>

          <section id="retention" className="mt-12 scroll-mt-28">
            <h2 className="text-xl font-semibold text-[#2C2C2C] md:text-2xl">
              {t("sectionRetentionH2")}
            </h2>
            <p className="mt-4 leading-relaxed text-[#4A4A4A]">
              {t("sectionRetentionP1")}
            </p>
            <p className="mt-4 leading-relaxed text-[#4A4A4A]">
              {t("sectionRetentionP2")}
            </p>
          </section>

          <section id="transfer" className="mt-12 scroll-mt-28">
            <h2 className="text-xl font-semibold text-[#2C2C2C] md:text-2xl">
              {t("sectionTransferH2")}
            </h2>
            <p className="mt-4 leading-relaxed text-[#4A4A4A]">
              {t("sectionTransferP1")}
            </p>
            <p className="mt-4 leading-relaxed text-[#4A4A4A]">
              {t("sectionTransferP2")}
            </p>
            <p className="mt-4 leading-relaxed text-[#4A4A4A]">
              {t("sectionTransferP3")}
            </p>
          </section>

          <section id="delete-your-data" className="mt-12 scroll-mt-28">
            <h2 className="text-xl font-semibold text-[#2C2C2C] md:text-2xl">
              {t("sectionDeleteH2")}
            </h2>
            <p className="mt-4 leading-relaxed text-[#4A4A4A]">
              {t("sectionDeleteP1")}
            </p>
            <p className="mt-4 leading-relaxed text-[#4A4A4A]">
              {t("sectionDeleteP2")}
            </p>
            <p className="mt-4 leading-relaxed text-[#4A4A4A]">
              {t("sectionDeleteP3")}
            </p>
            <p className="mt-4 leading-relaxed text-[#4A4A4A]">
              {t("sectionDeleteP4")}
            </p>
          </section>

          <section id="disclosure" className="mt-12 scroll-mt-28">
            <h2 className="text-xl font-semibold text-[#2C2C2C] md:text-2xl">
              {t("sectionDisclosureH2")}
            </h2>

            <h3 className="mt-6 text-lg font-semibold text-[#2C2C2C] md:text-xl">
              {t("sectionDisclosureBizH3")}
            </h3>
            <p className="mt-3 leading-relaxed text-[#4A4A4A]">
              {t("sectionDisclosureBizP")}
            </p>

            <h3 className="mt-8 text-lg font-semibold text-[#2C2C2C] md:text-xl">
              {t("sectionDisclosureLawH3")}
            </h3>
            <p className="mt-3 leading-relaxed text-[#4A4A4A]">
              {t("sectionDisclosureLawP")}
            </p>

            <h3 className="mt-8 text-lg font-semibold text-[#2C2C2C] md:text-xl">
              {t("sectionDisclosureOtherH3")}
            </h3>
            <p className="mt-3 leading-relaxed text-[#4A4A4A]">
              {t("sectionDisclosureOtherP")}
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-5 leading-relaxed text-[#4A4A4A]">
              {disclosureListKeys.map((key) => (
                <li key={key}>{t(key)}</li>
              ))}
            </ul>
          </section>

          <section id="security" className="mt-12 scroll-mt-28">
            <h2 className="text-xl font-semibold text-[#2C2C2C] md:text-2xl">
              {t("sectionSecurityH2")}
            </h2>
            <p className="mt-4 leading-relaxed text-[#4A4A4A]">
              {t("sectionSecurityP1")}
            </p>
          </section>

          <section id="children-privacy" className="mt-12 scroll-mt-28">
            <h2 className="text-xl font-semibold text-[#2C2C2C] md:text-2xl">
              {t("sectionChildrenH2")}
            </h2>
            <p className="mt-4 leading-relaxed text-[#4A4A4A]">
              {t("sectionChildrenP1")}
            </p>
            <p className="mt-4 leading-relaxed text-[#4A4A4A]">
              {t("sectionChildrenP2")}
            </p>
            <p className="mt-4 leading-relaxed text-[#4A4A4A]">
              {t("sectionChildrenP3")}
            </p>
          </section>

          <section id="links-other-websites" className="mt-12 scroll-mt-28">
            <h2 className="text-xl font-semibold text-[#2C2C2C] md:text-2xl">
              {t("sectionLinksH2")}
            </h2>
            <p className="mt-4 leading-relaxed text-[#4A4A4A]">
              {t("sectionLinksP1")}
            </p>
            <p className="mt-4 leading-relaxed text-[#4A4A4A]">
              {t("sectionLinksP2")}
            </p>
          </section>

          <section id="changes" className="mt-12 scroll-mt-28">
            <h2 className="text-xl font-semibold text-[#2C2C2C] md:text-2xl">
              {t("sectionChangesH2")}
            </h2>
            <p className="mt-4 leading-relaxed text-[#4A4A4A]">
              {t("sectionChangesP1")}
            </p>
            <p className="mt-4 leading-relaxed text-[#4A4A4A]">
              {t("sectionChangesP2")}
            </p>
            <p className="mt-4 leading-relaxed text-[#4A4A4A]">
              {t("sectionChangesP3")}
            </p>
          </section>

          <section id="contact" className="mt-12 scroll-mt-28 pb-16">
            <h2 className="text-xl font-semibold text-[#2C2C2C] md:text-2xl">
              {t("sectionContactH2")}
            </h2>
            <p className="mt-4 leading-relaxed text-[#4A4A4A]">
              {t("sectionContactP1")}
            </p>
            <p className="mt-4">
              <span className="font-medium text-[#2C2C2C]">
                {t("sectionContactByEmail")}{" "}
              </span>
              <a
                href="mailto:info@mm-tamil.co.uk"
                className="font-medium text-maroon hover:underline"
              >
                {t("contactEmailDisplay")}
              </a>
            </p>
          </section>

          <p className="mt-8 border-t border-border-soft pt-8 text-sm text-[#6B6B6B]">
            {t("seeAlsoPrefix")}{" "}
            <Link
              href="/legal-terms"
              className="font-medium text-maroon hover:underline"
              {...POLICY_PAGE_NEW_TAB}
            >
              {t("seeAlsoLink")}
            </Link>
            {t("seeAlsoSuffix")}
          </p>
        </article>
      </div>
    </div>
  );
}
