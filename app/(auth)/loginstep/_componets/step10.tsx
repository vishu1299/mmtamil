"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { FaCheck } from "react-icons/fa";
import SignupHeader from "./signupHeader";

const Step10 = () => {
  const t = useTranslations("register");
  const router = useRouter();

  useEffect(() => {
    localStorage.setItem("isNewUser", "true");
    const timer = setTimeout(() => {
      router.push("/search");
    }, 3000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="relative isolate min-h-screen bg-gradient-to-br from-[#FFF8F5] via-[#FDF3F6] to-[#FFFDF8] flex flex-col overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-20 top-24 h-72 w-72 rounded-full bg-maroon/20 blur-3xl" />
        <div className="absolute -right-16 top-40 h-80 w-80 rounded-full bg-rose-300/45 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-amber-200/45 blur-3xl" />
      </div>
      <SignupHeader />
      <div className="flex-1 flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-md rounded-2xl border border-border-soft bg-white px-6 py-10 text-center shadow-card">
        {/* Glow effect behind icon */}
        <div className="relative mb-10">
          <div className="absolute inset-0 w-40 h-40 bg-[#8D1B3D]/15 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2" />
          <div className="relative w-32 h-32 bg-[#8D1B3D] rounded-full flex items-center justify-center shadow-xl mx-auto">
            <FaCheck className="text-white text-5xl" />
          </div>
        </div>

        <h1 className="font-sfpro text-2xl md:text-3xl font-semibold text-[#191919] text-center leading-snug">
          {t("step10Line1")}
          <br />
          {t("step10Line2")}
        </h1>
        <p className="mt-3 text-sm text-[#6B6B6B]">{t("step10Redirect")}</p>
      </div>
      </div>
    </div>
  );
};

export default Step10;
