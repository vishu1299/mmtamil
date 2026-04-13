"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { IoChevronBack } from "react-icons/io5";
import { FiBell, FiSettings } from "react-icons/fi";
import Credits from "./_components/credits";

const Page = () => {
  const router = useRouter();
  const t = useTranslations("creditsPage");

  return (
    <main className="flex-1 flex flex-col max-w-[1560px] min-h-screen w-full lg:w-[90%] mx-auto lg:py-6">
      <div className="flex items-center justify-between px-4 py-4 lg:hidden">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="text-[#2C2C2C]"
            aria-label={t("backAria")}
          >
            <IoChevronBack className="text-2xl" />
          </button>
          <h1 className="font-playfair text-xl font-semibold text-[#2C2C2C]">
            {t("mobileTitle")}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="w-10 h-10 rounded-full flex items-center justify-center"
            aria-label={t("bellAria")}
          >
            <FiBell className="text-xl text-[#2C2C2C]" />
          </button>
          <button
            type="button"
            className="w-10 h-10 rounded-full flex items-center justify-center"
            aria-label={t("settingsAria")}
          >
            <FiSettings className="text-lg text-[#2C2C2C]" />
          </button>
        </div>
      </div>

      <div className="hidden lg:block mb-4 px-4 lg:px-0">
        <h1 className="font-playfair text-[28px] font-semibold text-maroon">
          {t("desktopTitle")}
        </h1>
        <p className="text-[#6B6B6B] text-sm mt-1">{t("desktopSubtitle")}</p>
      </div>

      <div className="text-center mb-6 px-4">
        <h2 className="font-playfair text-2xl font-bold text-[#2C2C2C]">
          {t("browsePlansTitle")}
        </h2>
      </div>

      <Credits />
    </main>
  );
};

export default Page;
