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

  return (
    <div className="bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 md:grid-cols-[minmax(0,220px)_1fr] md:gap-10 lg:py-12">
        <aside className="md:sticky md:top-24 md:self-start">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#6B6B6B]">
            {t("tocTitle")}
          </p>
          <nav aria-label="Privacy policy sections" className="flex flex-col gap-2">
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
          <p className="mb-10 text-sm text-[#6B6B6B]">
            {t("subtitle")}
          </p>

          <section id="other-purposes-sharing" className="scroll-mt-28">
            <h2 className="text-xl font-semibold text-[#2C2C2C] md:text-2xl">
              For other purposes
            </h2>
            <p className="mt-4 leading-relaxed text-[#4A4A4A]">
              We may use Your information for other purposes, such as data
              analysis, identifying usage trends, determining the effectiveness of
              our promotional campaigns and to evaluate and improve our Service,
              products, services, marketing and your experience.
            </p>
            <p className="mt-6 font-medium text-[#2C2C2C]">
              We may share Your personal information in the following situations:
            </p>
            <ul className="mt-4 list-disc space-y-4 pl-5 leading-relaxed text-[#4A4A4A]">
              <li>
                <span className="font-medium text-[#2C2C2C]">
                  With Service Providers:
                </span>{" "}
                We may share Your personal information with Service Providers to
                monitor and analyze the use of our Service, to contact You.
              </li>
              <li>
                <span className="font-medium text-[#2C2C2C]">
                  For business transfers:
                </span>{" "}
                We may share or transfer Your personal information in connection
                with, or during negotiations of, any merger, sale of Company
                assets, financing, or acquisition of all or a portion of Our
                business to another company.
              </li>
              <li>
                <span className="font-medium text-[#2C2C2C]">
                  With Affiliates:
                </span>{" "}
                We may share Your information with Our affiliates, in which case
                we will require those affiliates to honor this Privacy Policy.
                Affiliates include Our parent company and any other subsidiaries,
                joint venture partners or other companies that We control or that
                are under common control with Us.
              </li>
              <li>
                <span className="font-medium text-[#2C2C2C]">
                  With business partners:
                </span>{" "}
                We may share Your information with Our business partners to offer
                You certain products, services or promotions.
              </li>
              <li>
                <span className="font-medium text-[#2C2C2C]">
                  With other users:
                </span>{" "}
                When You share personal information or otherwise interact in the
                public areas with other users, such information may be viewed by
                all users and may be publicly distributed outside.
              </li>
              <li>
                <span className="font-medium text-[#2C2C2C]">
                  With Your consent:
                </span>{" "}
                We may disclose Your personal information for any other purpose
                with Your consent.
              </li>
            </ul>
          </section>

          <section id="retention" className="mt-12 scroll-mt-28">
            <h2 className="text-xl font-semibold text-[#2C2C2C] md:text-2xl">
              Retention of Your Personal Data
            </h2>
            <p className="mt-4 leading-relaxed text-[#4A4A4A]">
              The Company will retain Your Personal Data only for as long as is
              necessary for the purposes set out in this Privacy Policy. We will
              retain and use Your Personal Data to the extent necessary to comply
              with our legal obligations (for example, if we are required to
              retain your data to comply with applicable laws), resolve disputes,
              and enforce our legal agreements and policies.
            </p>
            <p className="mt-4 leading-relaxed text-[#4A4A4A]">
              The Company will also retain Usage Data for internal analysis
              purposes. Usage Data is generally retained for a shorter period of
              time, except when this data is used to strengthen the security or
              to improve the functionality of Our Service, or We are legally
              obligated to retain this data for longer time periods.
            </p>
          </section>

          <section id="transfer" className="mt-12 scroll-mt-28">
            <h2 className="text-xl font-semibold text-[#2C2C2C] md:text-2xl">
              Transfer of Your Personal Data
            </h2>
            <p className="mt-4 leading-relaxed text-[#4A4A4A]">
              Your information, including Personal Data, is processed at the
              Company&apos;s operating offices and in any other places where the
              parties involved in the processing are located. It means that this
              information may be transferred to—and maintained on—computers
              located outside of Your state, province, country or other
              governmental jurisdiction where the data protection laws may differ
              from those from Your jurisdiction.
            </p>
            <p className="mt-4 leading-relaxed text-[#4A4A4A]">
              Your consent to this Privacy Policy followed by Your submission of
              such information represents Your agreement to that transfer.
            </p>
            <p className="mt-4 leading-relaxed text-[#4A4A4A]">
              The Company will take all steps reasonably necessary to ensure that
              Your data is treated securely and in accordance with this Privacy
              Policy and no transfer of Your Personal Data will take place to an
              organization or a country unless there are adequate controls in
              place including the security of Your data and other personal
              information.
            </p>
          </section>

          <section id="delete-your-data" className="mt-12 scroll-mt-28">
            <h2 className="text-xl font-semibold text-[#2C2C2C] md:text-2xl">
              Delete Your Personal Data
            </h2>
            <p className="mt-4 leading-relaxed text-[#4A4A4A]">
              You have the right to delete or request that We assist in deleting
              the Personal Data that We have collected about You.
            </p>
            <p className="mt-4 leading-relaxed text-[#4A4A4A]">
              Our Service may give You the ability to delete certain information
              about You from within the Service.
            </p>
            <p className="mt-4 leading-relaxed text-[#4A4A4A]">
              You may update, amend, or delete Your information at any time by
              signing in to Your Account, if you have one, and visiting the
              account settings section that allows you to manage Your personal
              information. You may also contact Us to request access to, correct,
              or delete any personal information that You have provided to Us.
            </p>
            <p className="mt-4 leading-relaxed text-[#4A4A4A]">
              Please note, however, that We may need to retain certain information
              when we have a legal obligation or lawful basis to do so.
            </p>
          </section>

          <section id="disclosure" className="mt-12 scroll-mt-28">
            <h2 className="text-xl font-semibold text-[#2C2C2C] md:text-2xl">
              Disclosure of Your Personal Data
            </h2>

            <h3 className="mt-6 text-lg font-semibold text-[#2C2C2C] md:text-xl">
              Business Transactions
            </h3>
            <p className="mt-3 leading-relaxed text-[#4A4A4A]">
              If the Company is involved in a merger, acquisition or asset sale,
              Your Personal Data may be transferred. We will provide notice
              before Your Personal Data is transferred and becomes subject to a
              different Privacy Policy.
            </p>

            <h3 className="mt-8 text-lg font-semibold text-[#2C2C2C] md:text-xl">
              Law enforcement
            </h3>
            <p className="mt-3 leading-relaxed text-[#4A4A4A]">
              Under certain circumstances, the Company may be required to
              disclose Your Personal Data if required to do so by law or in
              response to valid requests by public authorities (e.g. a court or
              a government agency).
            </p>

            <h3 className="mt-8 text-lg font-semibold text-[#2C2C2C] md:text-xl">
              Other legal requirements
            </h3>
            <p className="mt-3 leading-relaxed text-[#4A4A4A]">
              The Company may disclose Your Personal Data in the good faith
              belief that such action is necessary to:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-5 leading-relaxed text-[#4A4A4A]">
              <li>Comply with a legal obligation</li>
              <li>Protect and defend the rights or property of the Company</li>
              <li>
                Prevent or investigate possible wrongdoing in connection with
                the Service
              </li>
              <li>
                Protect the personal safety of Users of the Service or the public
              </li>
              <li>Protect against legal liability</li>
            </ul>
          </section>

          <section id="security" className="mt-12 scroll-mt-28">
            <h2 className="text-xl font-semibold text-[#2C2C2C] md:text-2xl">
              Security of Your Personal Data
            </h2>
            <p className="mt-4 leading-relaxed text-[#4A4A4A]">
              The security of Your Personal Data is important to Us, but remember
              that no method of transmission over the Internet, or method of
              electronic storage is 100% secure. While We strive to use
              commercially acceptable means to protect Your Personal Data, We
              cannot guarantee its absolute security.
            </p>
          </section>

          <section id="children-privacy" className="mt-12 scroll-mt-28">
            <h2 className="text-xl font-semibold text-[#2C2C2C] md:text-2xl">
              Children&apos;s Privacy
            </h2>
            <p className="mt-4 leading-relaxed text-[#4A4A4A]">
              Our Service does not address anyone under the age of 18. We do not
              knowingly collect personally identifiable information from anyone
              under the age of 18. If You are a parent or guardian and You are
              aware that Your child has provided Us with Personal Data, please
              contact Us.
            </p>
            <p className="mt-4 leading-relaxed text-[#4A4A4A]">
              If We become aware that We have collected Personal Data from
              anyone under the age of 13 without verification of parental consent,
              we take steps to remove that information from Our servers.
            </p>
            <p className="mt-4 leading-relaxed text-[#4A4A4A]">
              If We need to rely on consent as a legal basis for processing Your
              information and Your country requires consent from a parent, we may
              require Your parent&apos;s consent before We collect and use that
              information.
            </p>
          </section>

          <section id="links-other-websites" className="mt-12 scroll-mt-28">
            <h2 className="text-xl font-semibold text-[#2C2C2C] md:text-2xl">
              Links to Other Websites
            </h2>
            <p className="mt-4 leading-relaxed text-[#4A4A4A]">
              Our Service may contain links to other websites that are not
              operated by Us. If You click on a third party link, You will be
              directed to that third party&apos;s site. We strongly advise You to
              review the Privacy Policy of every site You visit.
            </p>
            <p className="mt-4 leading-relaxed text-[#4A4A4A]">
              We have no control over and assume no responsibility for the
              content, privacy policies or practices of any third party sites or
              services.
            </p>
          </section>

          <section id="changes" className="mt-12 scroll-mt-28">
            <h2 className="text-xl font-semibold text-[#2C2C2C] md:text-2xl">
              Changes to this Privacy Policy
            </h2>
            <p className="mt-4 leading-relaxed text-[#4A4A4A]">
              We may update Our Privacy Policy from time to time. We will notify
              You of any changes by posting the new Privacy Policy on this page.
            </p>
            <p className="mt-4 leading-relaxed text-[#4A4A4A]">
              We will let You know via email and/or a prominent notice on Our
              Service, prior to the change becoming effective and update the
              &quot;Last updated&quot; date at the top of this Privacy Policy.
            </p>
            <p className="mt-4 leading-relaxed text-[#4A4A4A]">
              You are advised to review this Privacy Policy periodically for any
              changes. Changes to this Privacy Policy are effective when they are
              posted on this page.
            </p>
          </section>

          <section id="contact" className="mt-12 scroll-mt-28 pb-16">
            <h2 className="text-xl font-semibold text-[#2C2C2C] md:text-2xl">
              Contact Us
            </h2>
            <p className="mt-4 leading-relaxed text-[#4A4A4A]">
              If you have any questions about this Privacy Policy, You can contact
              us:
            </p>
            <p className="mt-4">
              <span className="font-medium text-[#2C2C2C]">By email: </span>
              <a
                href="mailto:info@mm-tamil.co.uk"
                className="font-medium text-maroon hover:underline"
              >
                Info@mm-tamil.co.uk
              </a>
            </p>
          </section>

          <p className="mt-8 border-t border-border-soft pt-8 text-sm text-[#6B6B6B]">
            See also{" "}
            <Link
              href="/legal-terms"
              className="font-medium text-maroon hover:underline"
              {...POLICY_PAGE_NEW_TAB}
            >
              terms &amp; legal information
            </Link>
            .
          </p>
        </article>
      </div>
    </div>
  );
}
