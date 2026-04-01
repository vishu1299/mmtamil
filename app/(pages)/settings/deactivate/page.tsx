"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { IoChevronBack } from "react-icons/io5";
import { FiBell, FiClock } from "react-icons/fi";
import { FaChevronRight } from "react-icons/fa";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { toast } from "react-toastify";
import { deactivateAccount } from "../api/api";
import { getuserByid, getStoredUser } from "../../profile/api/api";

export default function DeactivatePage() {
  const router = useRouter();
  const tc = useTranslations("common");
  const t = useTranslations("settingsPages");
  const [userId, setUserId] = useState<number | null>(null);
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const response = await getuserByid();
        const id =
          response?.data?.id ??
          response?.data?.data?.id ??
          getStoredUser()?.id;
        if (id) setUserId(Number(id));
      } catch {
        const storedId = getStoredUser()?.id;
        if (storedId) setUserId(Number(storedId));
      }
    };
    getCurrentUser();
  }, []);

  const handleDeactivate = async () => {
    if (!userId) {
      toast.error("User ID not found");
      return;
    }
    setLoading(true);
    try {
      const result = await deactivateAccount(userId);
      if (result.success) {
        toast.success(t("deleteDeactivateTitle"));
        router.push("/");
      } else {
        toast.error("Failed to deactivate. Please try again.");
      }
    } catch {
      toast.error("Failed to deactivate account. Please try again later.");
    } finally {
      setLoading(false);
    }
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
          {t("deleteDeactivateTitle")}
        </h1>
        <p className="text-[#6B6B6B] text-sm mt-1">
          {t("deleteDeactivateSubtitle")}
        </p>
      </div>

      {/* Content */}
      <div className="px-5 lg:px-0 pb-28 lg:pb-6">
        <div className="lg:bg-white lg:border lg:border-border-soft lg:rounded-2xl lg:p-8 lg:max-w-2xl shadow-card hover:shadow-card-hover transition-all duration-300">
          {/* Page Title (mobile) */}
          <div className="mt-4 mb-8 lg:mt-0 lg:mb-6">
            <h2 className="font-playfair text-[22px] lg:text-2xl font-bold text-[#1A1A1A]">
              {t("deleteDeactivateTitle")}
            </h2>
            <p className="text-[14px] text-[#6B6B6B] mt-2 leading-[1.55] max-w-md">
              {t("deleteDeactivateSubtitle")}
            </p>
          </div>

          {/* Deactivate Section */}
          <section className="mb-2">
            <h3 className="text-[17px] font-bold text-[#1A1A1A]">
              {t("deactivateQuestion")}
            </h3>
            <p className="text-[14px] text-[#6B6B6B] mt-1.5 leading-[1.5]">
              {t("deactivateDesc")}
            </p>
            <button
              onClick={() => setShowDeactivateDialog(true)}
              className="mt-5 w-full flex items-center justify-center gap-2.5 py-4 bg-[#FFF3E0] rounded-xl text-[15px] font-semibold text-[#F59E0B] hover:bg-[#FFECCC] transition-all duration-200 shadow-soft hover:shadow-md"
            >
              {t("deactivateBtn")}
              <FiClock className="text-lg" />
            </button>
          </section>

          <div className="h-px bg-[#F0E8E8] my-8" />

          {/* Delete Section */}
          <section>
            <button
              onClick={() => router.push("/settings/delete-account")}
              className="w-full flex items-center justify-between gap-4 group rounded-xl px-2 py-1 transition-colors duration-200 hover:bg-soft-rose/20"
            >
              <div className="text-left">
                <h3 className="text-[17px] font-bold text-[#1A1A1A]">
                  Delete Account?
                </h3>
                <p className="text-[14px] text-[#6B6B6B] mt-1.5 leading-[1.5]">
                  Your profile, matches, chats, and all data will be permanently
                  removed. This action cannot be undone.
                </p>
              </div>
              <FaChevronRight className="text-sm text-[#B0B0B0] flex-shrink-0 group-hover:text-[#6B6B6B] transition-colors" />
            </button>
          </section>
        </div>
      </div>

      {/* Deactivate Confirmation Dialog */}
      <AlertDialog open={showDeactivateDialog} onOpenChange={setShowDeactivateDialog}>
        <AlertDialogContent className="max-w-md rounded-2xl p-0 overflow-hidden">
          <div className="p-6 pb-0">
            <AlertDialogTitle className="font-playfair text-[22px] font-bold text-[#1A1A1A]">
              Deactivate your Account?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[14px] text-[#6B6B6B] mt-2 leading-[1.5]">
              Your profile will be hidden from other members.
            </AlertDialogDescription>

            <div className="mt-6">
              <h4 className="text-[15px] font-bold text-[#1A1A1A]">It will</h4>
              <ul className="mt-2.5 space-y-2">
                <li className="flex items-start gap-2.5">
                  <span className="text-[#6B6B6B] mt-1.5 text-[6px]">●</span>
                  <span className="text-[14px] text-[#6B6B6B] leading-[1.5]">
                    Hide your profile from searches &amp; suggestions
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#6B6B6B] mt-1.5 text-[6px]">●</span>
                  <span className="text-[14px] text-[#6B6B6B] leading-[1.5]">
                    Stop receiving messages &amp; interests
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#6B6B6B] mt-1.5 text-[6px]">●</span>
                  <span className="text-[14px] text-[#6B6B6B] leading-[1.5]">
                    Pause all notifications &amp; alerts
                  </span>
                </li>
              </ul>
            </div>

            <div className="mt-6">
              <h4 className="text-[15px] font-bold text-[#1A1A1A]">You can</h4>
              <ul className="mt-2.5 space-y-2">
                <li className="flex items-start gap-2.5">
                  <span className="text-[#6B6B6B] mt-1.5 text-[6px]">●</span>
                  <span className="text-[14px] text-[#6B6B6B] leading-[1.5]">
                    Reactivate anytime by logging in again
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="p-6 pt-8 space-y-3">
            <button
              onClick={handleDeactivate}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2.5 py-4 bg-[#F59E0B] rounded-xl text-[16px] font-semibold text-white hover:bg-[#E8930A] transition-colors disabled:opacity-50"
            >
              {loading ? t("deactivating") : t("deactivateBtn")}
              {!loading && <FiClock className="text-lg" />}
            </button>
            <button
              onClick={() => setShowDeactivateDialog(false)}
              className="w-full py-4 bg-[#F0F0F0] rounded-xl text-[16px] font-semibold text-[#1A1A1A] hover:bg-[#E5E5E5] transition-colors"
            >
              {t("cancel")}
            </button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
