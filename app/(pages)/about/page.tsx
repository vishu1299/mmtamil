"use client";

import React, { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { isPolicyPageHref, POLICY_PAGE_NEW_TAB } from "@/lib/policy-page-links";
import AboutUs from "./aboutus/page";

const NAV_LINK_KEYS = [
  { labelKey: "navHome" as const, href: "/" },
  { labelKey: "navSuccessStories" as const, href: "/success-stories" },
  { labelKey: "navAbout" as const, href: "/about" },
  { labelKey: "navRulesPolicies" as const, href: "/privacyinfo" },
  { labelKey: "navTermsConditions" as const, href: "/legal-terms" },
];

const AboutHeader = () => {
  const t = useTranslations("landing");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="mx-auto flex w-[90%] max-w-[1560px] items-center justify-between py-4">
          <Link href="/" className="flex shrink-0 items-center">
            <Image
              src="/assets/mmtlogo.png"
              alt={t("navLogoMmTamil")}
              width={120}
              height={22}
            />
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
            {NAV_LINK_KEYS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-semibold tracking-wide transition-colors text-[#2C2C2C] hover:text-maroon"
                {...(isPolicyPageHref(link.href) ? POLICY_PAGE_NEW_TAB : {})}
              >
                {t(link.labelKey)}
              </Link>
            ))}
            <Link
              href="/login"
              className="rounded-full border border-maroon px-6 py-2.5 text-sm font-semibold text-maroon transition-colors hover:bg-soft-rose"
            >
              {t("login")}
            </Link>
            <Link
              href="/loginstep"
              className="rounded-full bg-maroon px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-maroon/90"
            >
              {t("register")}
            </Link>
          </nav>

          <button
            type="button"
            className="text-2xl text-[#2C2C2C] md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={t("toggleMenu")}
          >
            {menuOpen ? <HiX /> : <HiMenu />}
          </button>
        </div>

        {menuOpen && (
          <div className="flex flex-col gap-3 border-t border-border-soft bg-white px-6 pb-4 pt-3 md:hidden">
            {NAV_LINK_KEYS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-sm font-semibold text-[#2C2C2C] hover:text-maroon"
                {...(isPolicyPageHref(link.href) ? POLICY_PAGE_NEW_TAB : {})}
              >
                {t(link.labelKey)}
              </Link>
            ))}
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="rounded-full border border-maroon px-6 py-2 text-center text-sm font-semibold text-maroon"
            >
              {t("login")}
            </Link>
            <Link
              href="/loginstep"
              onClick={() => setMenuOpen(false)}
              className="rounded-full bg-maroon px-6 py-2 text-center text-sm font-semibold text-white"
            >
              {t("register")}
            </Link>
          </div>
        )}
      </header>

      <AboutUs />
    </div>
  );
};

export default AboutHeader;
