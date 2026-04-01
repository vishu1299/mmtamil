"use client";

import PaidFeatures from "@/app/_components/paid-features/paid-features";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { IoChevronBack } from "react-icons/io5";
import { FiBell, FiSearch } from "react-icons/fi";
import { FaTrash } from "react-icons/fa";
import Mail from "./_componets/mail";

const Page = () => {
  const t = useTranslations("mails");
  const tc = useTranslations("common");
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="mx-auto min-h-screen w-full max-w-[1560px] lg:w-[90%] lg:py-6">
      {/* Mobile Header */}
      <div className="flex items-center justify-between px-4 py-4 lg:hidden">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-lg border border-transparent p-1 text-[#2C2C2C] transition-all duration-200 hover:border-border-soft hover:bg-soft-rose/60 hover:shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon/30"
          >
            <IoChevronBack className="text-2xl" />
          </button>
          <h1 className="font-playfair text-xl font-semibold text-[#2C2C2C]">
            {t("title")}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-transparent transition-all duration-200 hover:border-border-soft hover:bg-soft-rose/50 hover:shadow-soft"
          >
            <FiBell className="text-xl text-maroon" />
          </button>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-transparent transition-all duration-200 hover:border-red-200 hover:bg-red-50 hover:shadow-soft"
          >
            <FaTrash className="text-lg text-red-600" />
          </button>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="mb-5 hidden rounded-2xl border border-border-soft bg-gradient-to-br from-white to-cream/30 px-4 py-5 shadow-card transition-all duration-300 hover:shadow-card-hover lg:block lg:px-6">
        <h1 className="font-playfair text-[28px] font-semibold tracking-tight text-maroon">
          {t("title")}
        </h1>
        <p className="mt-1 text-sm text-[#6B6B6B]">{t("subtitle")}</p>
      </div>

      {/* Search Bar */}
      <div className="mb-4 px-4 lg:px-0">
        <div className="relative">
          <input
            type="text"
            placeholder={tc("search")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-border-soft bg-white px-4 py-3 pr-10 text-sm text-[#2C2C2C] shadow-sm transition-[border-color,box-shadow] duration-200 placeholder:text-[#6B6B6B]/75 focus:outline-none focus:border-maroon/45 focus:ring-2 focus:ring-maroon/12 hover:border-maroon/35 hover:shadow-soft lg:max-w-md"
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row w-full gap-6">
        <div className="w-full">
          <Mail searchQuery={searchQuery} />
        </div>
        <div className="hidden xl:block min-w-[312px] w-[312px] flex-shrink-0">
          <PaidFeatures />
        </div>
      </div>
    </div>
  );
};

export default Page;
