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
          <nav aria-label="Terms sections" className="flex flex-col gap-2">
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

          <section id="comments-and-opinions" className="scroll-mt-28">
            <h2 className="text-xl font-semibold text-[#2C2C2C] md:text-2xl">
              Comments and user content
            </h2>
            <p className="mt-4 leading-relaxed">
              Parts of this website offer an opportunity for users to post and
              exchange opinions and information in certain areas of the website.
              Mangalyam Tamil does not filter, edit, publish or review Comments
              prior to their presence on the website. Comments do not reflect the
              views and opinions of Mangalyam Tamil, its agents and/or
              affiliates. Comments reflect the views and opinions of the person
              who posts their views and opinions. To the extent permitted by
              applicable laws, Mangalyam Tamil shall not be liable for the
              Comments or for any liability, damages or expenses caused and/or
              suffered as a result of any use of and/or posting of and/or
              appearance of the Comments on this website.
            </p>
            <p className="mt-4 leading-relaxed">
              Mangalyam Tamil reserves the right to monitor all Comments and to
              remove any Comments which can be considered inappropriate,
              offensive or causes breach of these Terms and Conditions.
            </p>
          </section>

          <section id="warranties" className="mt-12 scroll-mt-28">
            <h2 className="text-xl font-semibold text-[#2C2C2C] md:text-2xl">
              You warrant and represent that
            </h2>
            <ul className="mt-4 list-disc space-y-3 pl-5 leading-relaxed">
              <li>
                You are entitled to post the Comments on our website and have all
                necessary licenses and consents to do so;
              </li>
              <li>
                The Comments do not invade any intellectual property right,
                including without limitation copyright, patent or trademark of
                any third party;
              </li>
              <li>
                The Comments do not contain any defamatory, libelous, offensive,
                indecent or otherwise unlawful material which is an invasion of
                privacy;
              </li>
              <li>
                The Comments will not be used to solicit or promote business or
                custom or present commercial activities or unlawful activity.
              </li>
            </ul>
          </section>

          <section id="comment-license" className="mt-12 scroll-mt-28">
            <h2 className="text-xl font-semibold text-[#2C2C2C] md:text-2xl">
              License to your comments
            </h2>
            <p className="mt-4 leading-relaxed">
              You hereby grant Mangalyam Tamil a non-exclusive license to use,
              reproduce, edit and authorize others to use, reproduce and edit any
              of your Comments in any and all forms, formats or media.
            </p>
          </section>

          <section id="hyperlinking" className="mt-12 scroll-mt-28">
            <h2 className="text-xl font-semibold text-[#2C2C2C] md:text-2xl">
              Hyperlinking to our content
            </h2>
            <p className="mt-4 font-medium text-[#2C2C2C]">
              The following organizations may link to our Website without prior
              written approval:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed">
              <li>Government agencies;</li>
              <li>Search engines;</li>
              <li>News organizations;</li>
              <li>
                Online directory distributors may link to our Website in the same
                manner as they hyperlink to the websites of other listed
                businesses; and
              </li>
              <li>
                System wide Accredited Businesses except soliciting non-profit
                organizations, charity shopping malls, and charity fundraising
                groups which may not hyperlink to our Web site.
              </li>
            </ul>
            <p className="mt-4 leading-relaxed">
              These organizations may link to our home page, to publications or to
              other Website information so long as the link: (a) is not in any
              way deceptive; (b) does not falsely imply sponsorship, endorsement
              or approval of the linking party and its products and/or services;
              and (c) fits within the context of the linking party&apos;s site.
            </p>
            <p className="mt-4 font-medium text-[#2C2C2C]">
              We may consider and approve other link requests from the following
              types of organizations:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed">
              <li>Commonly-known consumer and/or business information sources;</li>
              <li>Dot.com community sites;</li>
              <li>Associations or other groups representing charities;</li>
              <li>Online directory distributors;</li>
              <li>Internet portals;</li>
              <li>Accounting, law and consulting firms; and</li>
              <li>Educational institutions and trade associations.</li>
            </ul>
            <p className="mt-4 leading-relaxed">
              We will approve link requests from these organizations if we
              decide that: (a) the link would not make us look unfavorably to
              ourselves or to our accredited businesses; (b) the organization
              does not have any negative records with us; (c) the benefit to us
              from the visibility of the hyperlink compensates the absence of
              Mangalyam Tamil; and (d) the link is in the context of general
              resource information.
            </p>
            <p className="mt-4 leading-relaxed">
              These organizations may link to our home page so long as the link:
              (a) is not in any way deceptive; (b) does not falsely imply
              sponsorship, endorsement or approval of the linking party and its
              products or services; and (c) fits within the context of the
              linking party&apos;s site.
            </p>
            <p className="mt-4 leading-relaxed">
              If you are one of the organizations listed in paragraph 2 above and
              are interested in linking to our website, you must inform us by
              sending an e-mail to Mangalyam Tamil. Please include your name,
              your organization name, contact information as well as the URL of
              your site, a list of any URLs from which you intend to link to our
              Website, and a list of the URLs on our site to which you would like
              to link. Wait 2–3 weeks for a response.
            </p>
            <p className="mt-4 font-medium text-[#2C2C2C]">
              Approved organizations may hyperlink to our Website as follows:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed">
              <li>By use of our corporate name; or</li>
              <li>By use of the uniform resource locator being linked to; or</li>
              <li>
                By use of any other description of our Website being linked to
                that makes sense within the context and format of content on the
                linking party&apos;s site.
              </li>
            </ul>
            <p className="mt-4 leading-relaxed">
              No use of Mangalyam Tamil&apos;s logo or other artwork will be
              allowed for linking absent a trademark license agreement.
            </p>
          </section>

          <section id="iframes" className="mt-12 scroll-mt-28">
            <h2 className="text-xl font-semibold text-[#2C2C2C] md:text-2xl">
              iFrames
            </h2>
            <p className="mt-4 leading-relaxed">
              Without prior approval and written permission, you may not create
              frames around our Webpages that alter in any way the visual
              presentation or appearance of our Website.
            </p>
          </section>

          <section id="content-liability" className="mt-12 scroll-mt-28">
            <h2 className="text-xl font-semibold text-[#2C2C2C] md:text-2xl">
              Content liability
            </h2>
            <p className="mt-4 leading-relaxed">
              We shall not be held responsible for any content that appears on
              your Website. You agree to protect and defend us against all
              claims that are arising on your Website. No link(s) should appear
              on any Website that may be interpreted as libelous, obscene or
              criminal, or which infringes, otherwise violates, or advocates the
              infringement or other violation of, any third party rights.
            </p>
          </section>

          <section id="reservation-rights" className="mt-12 scroll-mt-28">
            <h2 className="text-xl font-semibold text-[#2C2C2C] md:text-2xl">
              Reservation of rights
            </h2>
            <p className="mt-4 leading-relaxed">
              We reserve the right to request that you remove all links or any
              particular link to our Website. You agree to immediately remove
              all links to our Website upon request. We also reserve the right to
              amend these terms and conditions and its linking policy at any
              time. By continuously linking to our Website, you agree to be bound
              to and follow these linking terms and conditions.
            </p>
          </section>

          <section id="removal-links" className="mt-12 scroll-mt-28">
            <h2 className="text-xl font-semibold text-[#2C2C2C] md:text-2xl">
              Removal of links from our website
            </h2>
            <p className="mt-4 leading-relaxed">
              If you find any link on our Website that is offensive for any
              reason, you are free to contact and inform us at any moment. We will
              consider requests to remove links but we are not obligated to do
              so or to respond to you directly.
            </p>
            <p className="mt-4 leading-relaxed">
              We do not ensure that the information on this website is correct,
              we do not warrant its completeness or accuracy; nor do we promise
              to ensure that the website remains available or that the material
              on the website is kept up to date.
            </p>
          </section>

          <section id="disclaimer" className="mt-12 scroll-mt-28 pb-16">
            <h2 className="text-xl font-semibold text-[#2C2C2C] md:text-2xl">
              Disclaimer
            </h2>
            <p className="mt-4 leading-relaxed">
              To the maximum extent permitted by applicable law, we exclude all
              representations, warranties and conditions relating to our website
              and the use of this website. Nothing in this disclaimer will:
            </p>
            <ul className="mt-4 list-disc space-y-3 pl-5 leading-relaxed">
              <li>
                Limit or exclude our or your liability for death or personal
                injury;
              </li>
              <li>
                Limit or exclude our or your liability for fraud or fraudulent
                misrepresentation;
              </li>
              <li>
                Limit any of our or your liabilities in any way that is not
                permitted under applicable law; or
              </li>
              <li>
                Exclude any of our or your liabilities that may not be excluded
                under applicable law.
              </li>
            </ul>
            <p className="mt-4 leading-relaxed">
              The limitations and prohibitions of liability set in this Section
              and elsewhere in this disclaimer: (a) are subject to the preceding
              paragraph; and (b) govern all liabilities arising under the
              disclaimer, including liabilities arising in contract, in tort and
              for breach of statutory duty.
            </p>
            <p className="mt-4 leading-relaxed">
              As long as the website and the information and services on the
              website are provided free of charge, we will not be liable for
              any loss or damage of any nature.
            </p>
          </section>

          <p className="mt-8 border-t border-border-soft pt-8 text-sm text-[#6B6B6B]">
            Questions? Visit our{" "}
            <Link href="/support" className="font-medium text-maroon hover:underline">
              support
            </Link>{" "}
            or{" "}
            <Link
              href="/privacyinfo"
              className="font-medium text-maroon hover:underline"
              {...POLICY_PAGE_NEW_TAB}
            >
              privacy &amp; policies
            </Link>
            .
          </p>
        </article>
      </div>
    </div>
  );
}
