"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IoChevronBack } from "react-icons/io5";
import { FiBell } from "react-icons/fi";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";
import { useAppLocale } from "@/app/_components/i18n/locale-provider";
import { getuserByid } from "@/app/(pages)/profile/api/api";
import { updateUserDetails } from "@/app/(pages)/settings/api/api";
import {
  apiLanguageToLocale,
  localeToApiLanguage,
  type AppLocale,
} from "@/lib/i18n/config";

const LANG_IDS: AppLocale[] = ["en", "ta"];

export default function ChangeLanguagePage() {
  const router = useRouter();
  const t = useTranslations("changeLanguage");
  const tc = useTranslations("common");
  const { setLocale } = useAppLocale();
  const [selected, setSelected] = useState<AppLocale>("en");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const stored =
          typeof window !== "undefined"
            ? localStorage.getItem("preferred-language")
            : null;
        if (stored === "en" || stored === "ta") {
          if (!cancelled) setSelected(stored);
          return;
        }
        const res = await getuserByid();
        const appLang = res?.data?.profile?.appLanguage as string | undefined;
        const fromApi = apiLanguageToLocale(appLang);
        if (fromApi && !cancelled) setSelected(fromApi);
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      setLocale(selected);
      try {
        await updateUserDetails({
          profile: { appLanguage: localeToApiLanguage(selected) },
        });
        toast.success(t("success"));
      } catch {
        toast.warning(t("apiFail"));
      }
      router.push("/settings");
    } catch {
      toast.error(t("fail"));
    } finally {
      setLoading(false);
    }
  };

  const labels: Record<AppLocale, string> = {
    en: t("english"),
    ta: t("tamil"),
  };

  return (
    <main className="flex-1 flex flex-col max-w-[1560px] min-h-screen w-full lg:w-[90%] mx-auto lg:py-6 bg-gradient-to-b from-cream/50 via-white to-soft-rose/20 rounded-2xl">
      {/* Mobile Header */}
      <div className="flex items-center justify-between px-5 py-4 lg:hidden">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/settings")} className="text-[#2C2C2C]">
            <IoChevronBack className="text-2xl" />
          </button>
          <h1 className="font-playfair text-xl font-semibold text-[#2C2C2C]">
            {tc("settings")}
          </h1>
        </div>
        <button className="relative w-10 h-10 rounded-full flex items-center justify-center">
          <FiBell className="text-xl text-maroon" />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#EF4765] rounded-full border-2 border-white" />
        </button>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block mb-6 px-4 lg:px-0">
        <h1 className="font-playfair text-[28px] font-semibold text-maroon">
          {t("title")}
        </h1>
        <p className="text-[#6B6B6B] text-sm mt-1">{t("subtitle")}</p>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col px-5 lg:px-0 pb-28 lg:pb-6">
        <div className="lg:bg-white lg:border lg:border-border-soft lg:rounded-2xl lg:p-8 lg:max-w-2xl flex-1 flex flex-col shadow-card hover:shadow-card-hover transition-all duration-300">
          {/* Title & Description */}
          <div className="mt-4 mb-8 lg:mt-0 lg:mb-6">
            <h2 className="font-playfair text-[22px] lg:text-2xl font-bold text-[#1A1A1A]">
              {t("title")}
            </h2>
            <p className="text-[14px] text-[#6B6B6B] mt-2 leading-[1.55]">
              {t("subtitle")}
            </p>
          </div>

          {/* Language Options */}
          <div className="space-y-3">
            {LANG_IDS.map((langId) => {
                const isSelected = selected === langId;
                return (
                  <button
                    key={langId}
                    onClick={() => setSelected(langId)}
                    className={`w-full flex items-center justify-between px-5 py-4 rounded-xl border transition-all duration-200 ${
                      isSelected
                        ? "border-maroon bg-white shadow-soft"
                        : "border-[#E5E5E5] bg-white hover:border-maroon/20 hover:shadow-soft"
                    }`}
                  >
                    <span className="text-[15px] font-medium text-[#1A1A1A]">
                      {labels[langId]}
                    </span>
                    <span
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        isSelected ? "border-maroon" : "border-[#D1D5DB]"
                      }`}
                    >
                      {isSelected && (
                        <span className="w-3 h-3 rounded-full bg-maroon" />
                      )}
                    </span>
                  </button>
                );
            })}
          </div>

          {/* Save Button */}
          <div className="mt-auto pt-10">
            <button
              onClick={handleSave}
              disabled={loading}
              className="w-full py-4 bg-maroon text-white text-[16px] font-semibold rounded-xl hover:bg-maroon-light transition-all duration-200 shadow-maroon hover:shadow-maroon-lg hover:-translate-y-px motion-reduce:hover:translate-y-0 disabled:opacity-50"
            >
              {loading ? tc("saving") : tc("save")}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
