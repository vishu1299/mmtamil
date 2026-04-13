"use client";

import React from "react";
import { useTranslations } from "next-intl";
import "./loadingPage.css";

const LoadingPage = () => {
  const t = useTranslations("loadingPage");
  return (
    <div className="loading-page">
      <div className="loading-content">
        <div className="mx-auto mb-6 flex items-center justify-center gap-2">
          <span className="text-3xl font-bold tracking-tight">
            <span className="text-maroon">MM</span>
            <span className="text-[#D4AF37] ml-1">Tamil</span>
          </span>
        </div>

        <div className="loading-message">{t("message")}</div>
        <div className="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;
