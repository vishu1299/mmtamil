"use client";

import Link from "next/link";
import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { SocialLinks } from "../social-links";

const Footer = () => {
  const t = useTranslations("footer");
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative w-full border-t border-maroon/5 bg-gradient-to-b from-[#FFF5F7] to-white pt-6 pb-4 shadow-sm">
      <div className="mx-auto max-w-[1560px] px-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col items-center gap-4 lg:flex-row lg:gap-12">
            <Link href="/" className="shrink-0 transition-transform hover:scale-105">
              <div className="relative h-20 w-32">
                <Image src="/assets/mmtlogo.png" alt="MM Tamil Logo" fill className="object-contain" priority />
              </div>
            </Link>

            

            <SocialLinks variant="footer" className="justify-center lg:justify-start" />
          </div>

          <div className="flex w-full flex-col items-stretch justify-center gap-4 sm:w-auto sm:items-center">
            <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-end">
              <a
                href="https://play.google.com/store/apps/details?id=com.mmtamil"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex min-h-[3.5rem] items-center justify-center gap-4 rounded-2xl border-2 border-maroon/25 bg-white px-6 py-3.5 text-[#2C2C2C] shadow-[0_4px_20px_-4px_rgba(141,27,61,0.12)] ring-1 ring-maroon/10 transition-all duration-200 hover:-translate-y-0.5 hover:border-maroon/45 hover:bg-soft-rose/40 hover:shadow-[0_8px_28px_-6px_rgba(141,27,61,0.22)] hover:ring-maroon/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon/35 focus-visible:ring-offset-2 active:scale-[0.98] motion-reduce:hover:translate-y-0 sm:min-w-[240px]"
              >
                <div className="relative h-11 w-11 shrink-0 sm:h-12 sm:w-12">
                  <Image src="/assets/google_play_official.png" alt="" fill className="object-contain" aria-hidden />
                </div>
                <span className="text-left text-sm font-bold tracking-tight sm:text-base">
                  Google Play
                </span>
              </a>
              <div
                className="flex min-h-[3.5rem] cursor-default items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-maroon/30 bg-gradient-to-br from-[#FAFAFA] via-white to-soft-rose/30 px-6 py-3.5 text-[#5C5C5C] shadow-inner ring-1 ring-maroon/10 sm:min-w-[240px]"
                title="App Store version coming soon"
              >
                <div className="relative h-11 w-11 shrink-0 opacity-90 sm:h-12 sm:w-12">
                  <Image src="/assets/apple_official.png" alt="" fill className="object-contain" aria-hidden />
                </div>
                <span className="text-left text-sm font-semibold italic leading-snug text-maroon/70 sm:text-base">
                  Coming soon on App Store
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-col items-center justify-between border-t border-maroon/5 pt-3 md:flex-row">
          <p className="text-[10px] text-[#9b9b9b]">
            {t("copyright", { year: currentYear })}
          </p>
          <div className="flex items-center gap-1 text-[10px] text-[#9b9b9b]">
            <span className="text-maroon">❤️</span>
            <span>Made for the Tamil Community</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
