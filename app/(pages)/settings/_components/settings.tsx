"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FiUser, FiBell, FiLock, FiTrash2, FiLogOut } from "react-icons/fi";
import { MdOutlineTranslate, MdOutlineGavel } from "react-icons/md";
import { GoShieldCheck } from "react-icons/go";
import { HiOutlineDocumentText } from "react-icons/hi";
import { isPolicyPageHref } from "@/lib/policy-page-links";

interface SettingsItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
}

const SettingsPage = () => {
  const router = useRouter();
  const t = useTranslations("settings");

  const logout = () => {
    const token = localStorage.getItem("access-token");
    if (token) {
      try {
        window.dispatchEvent(new Event("user-logout"));
        if (window.globalWs && window.globalWs.readyState === WebSocket.OPEN) {
          const userData = JSON.parse(token);
          window.globalWs.send(
            JSON.stringify({ type: "user_disconnected", userId: userData.data.result.id })
          );
        }
      } catch {
        // ignore
      }
    }
    localStorage.clear();
    router.push("/login");
  };

  const accountItems: SettingsItem[] = [
    { id: "edit-profile", label: t("editProfile"), icon: <FiUser />, href: "/settings/edit-profile" },
    { id: "notifications", label: t("notifications"), icon: <FiBell />, href: "/settings/notifications" },
    { id: "change-password", label: t("changePassword"), icon: <FiLock />, href: "/settings/change-password" },
    { id: "deactivate", label: t("deleteDeactivate"), icon: <FiTrash2 />, href: "/settings/deactivate" },
    { id: "language", label: t("changeLanguage"), icon: <MdOutlineTranslate />, href: "/settings/change-language" },
  ];

  const legalItems: SettingsItem[] = [
    // { id: "legal", label: t("legal"), icon: <MdOutlineGavel />, href: "/legal-terms" },
    { id: "privacy", label: t("privacyPolicy"), icon: <GoShieldCheck />, href: "/privacyinfo" },
    { id: "terms", label: t("termsAndConditions"), icon: <HiOutlineDocumentText />, href: "/legal-terms" },
  ];

  const SettingsRow = ({ item }: { item: SettingsItem }) => (
    <button
      key={item.id}
      onClick={() => {
        if (item.onClick) item.onClick();
        else if (item.href) {
          if (isPolicyPageHref(item.href)) {
            window.open(item.href, "_blank", "noopener,noreferrer");
          } else {
            router.push(item.href);
          }
        }
      }}
      className="flex items-center justify-between w-full py-4 lg:py-5 border-b border-[#F0E8E8] last:border-b-0 group hover:bg-soft-rose/35 transition-all duration-200 px-3 lg:px-4 rounded-xl hover:shadow-soft"
    >
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 lg:w-12 lg:h-12 rounded-full bg-[#F5F0F0] flex items-center justify-center text-maroon text-lg group-hover:bg-soft-rose transition-colors shadow-inner">
          {item.icon}
        </div>
        <span className="text-[15px] font-medium text-[#2C2C2C]">
          {item.label}
        </span>
      </div>
      <FaChevronRight className="text-xs text-[#B0B0B0] transition-transform duration-200 group-hover:translate-x-0.5" />
    </button>
  );

  return (
    <div className="rounded-2xl bg-gradient-to-b from-cream/70 to-white px-1 py-2 lg:px-0 lg:py-0">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 lg:px-0 lg:mb-2">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 rounded-full flex items-center justify-center lg:hidden"
          >
            <FaChevronLeft className="text-sm text-[#2C2C2C]" />
          </button>
          <h1 className="font-playfair text-xl lg:text-[28px] font-semibold text-maroon">
            {t("title")}
          </h1>
        </div>
        <button className="w-9 h-9 rounded-full flex items-center justify-center lg:hidden">
          <FiBell className="text-lg text-[#2C2C2C]" />
        </button>
      </div>

      {/* Desktop: two-column grid / Mobile: single column */}
      <div className="lg:grid lg:grid-cols-2 lg:gap-6 px-4 lg:px-0">
        {/* Account Section */}
        <div className="bg-white border border-border-soft rounded-2xl lg:p-2 mb-4 lg:mb-0 shadow-card hover:shadow-card-hover transition-all duration-300">
          <h2 className="hidden lg:block text-sm font-semibold text-[#6B6B6B] uppercase tracking-wide px-4 pt-4 pb-2">
            {t("account")}
          </h2>
          {accountItems.map((item) => (
            <SettingsRow key={item.id} item={item} />
          ))}
        </div>

        {/* Legal & Support Section */}
        <div className="bg-white border border-border-soft rounded-2xl lg:p-2 mb-4 lg:mb-0 shadow-card hover:shadow-card-hover transition-all duration-300">
          <h2 className="hidden lg:block text-sm font-semibold text-[#6B6B6B] uppercase tracking-wide px-4 pt-4 pb-2">
            {t("legalSupport")}
          </h2>
          {legalItems.map((item) => (
            <SettingsRow key={item.id} item={item} />
          ))}

          {/* Logout inside this card on desktop */}
          <div className="hidden lg:block border-t border-[#F0E8E8] mt-2">
            <button
              onClick={logout}
              className="flex items-center gap-4 w-full py-5 px-3 lg:px-4 rounded-xl hover:bg-red-50 transition-colors"
            >
              <div className="w-11 h-11 lg:w-12 lg:h-12 rounded-full bg-[#F5F0F0] flex items-center justify-center text-red-500 text-lg">
                <FiLogOut />
              </div>
              <span className="text-[15px] font-medium text-red-500">{t("logout")}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Logout (separate, outside cards) */}
      <div className="lg:hidden mt-4 px-4 pb-8">
        <button
          onClick={logout}
          className="flex items-center gap-4 w-full py-5 px-3 rounded-xl border border-border-soft bg-white shadow-soft hover:bg-red-50 transition-colors"
        >
          <div className="w-11 h-11 rounded-full bg-[#F5F0F0] flex items-center justify-center text-red-500 text-lg">
            <FiLogOut />
          </div>
          <span className="text-[15px] font-medium text-red-500">{t("logout")}</span>
        </button>
      </div>

    </div>
  );
};

export default SettingsPage;
