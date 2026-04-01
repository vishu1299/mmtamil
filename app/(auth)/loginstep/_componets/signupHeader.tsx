"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { POLICY_PAGE_NEW_TAB } from "@/lib/policy-page-links";

const SignupHeader = () => {
  const t = useTranslations("register");

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border-soft bg-white/92 shadow-header backdrop-blur-md supports-[backdrop-filter]:bg-white/88">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-3">
        <Link href="/">
          <Image
            src="/assets/mmtlogo.png"
            alt={t("logoAlt")}
            width={100}
            height={28}
            className="object-contain"
          />
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/about" className="hidden font-sfpro text-sm font-medium text-[#2C2C2C] transition-colors hover:text-[#8D1B3D] sm:inline">
            {t("headerAbout")}
          </Link>
          <Link href="/support/#faq" className="hidden font-sfpro text-sm font-medium text-[#2C2C2C] transition-colors hover:text-[#8D1B3D] sm:inline">
            {t("headerFaq")}
          </Link>
          <Link
            href="/privacyinfo"
            className="hidden font-sfpro text-sm font-medium text-[#2C2C2C] transition-colors hover:text-[#8D1B3D] md:inline"
            {...POLICY_PAGE_NEW_TAB}
          >
            {t("headerPrivacy")}
          </Link>
          <Link
            href="/login"
            className="rounded-md bg-[#8D1B3D] px-5 py-2.5 font-sfpro text-sm font-semibold text-white shadow-maroon transition-all duration-200 hover:-translate-y-px hover:bg-[#6B1530] hover:shadow-maroon-lg motion-reduce:hover:translate-y-0"
          >
            {t("login")}
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default SignupHeader;
