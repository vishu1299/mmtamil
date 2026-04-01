"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { IoChevronBack } from "react-icons/io5";
import { FiBell } from "react-icons/fi";
import { FaChevronRight } from "react-icons/fa";
import { FiTrash2 } from "react-icons/fi";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { toast } from "react-toastify";
import { deleteAccount } from "../api/api";
import { getuserByid, getStoredUser } from "../../profile/api/api";

const deleteReasons = [
  "Marry Later / Create profile later",
  "I am unable to make changes in my profile",
  "Not satisfied with Experience",
  "I found a match",
  "Other Reasons",
];

export default function DeleteAccountPage() {
  const router = useRouter();
  const tc = useTranslations("common");
  const t = useTranslations("settingsPages");
  const [userId, setUserId] = useState<number | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
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

  const handleReasonClick = (reason: string) => {
    setSelectedReason(reason);
    setShowDeleteDialog(true);
  };

  const handleDeleteAccount = async () => {
    if (!userId) {
      toast.error("User ID not found");
      return;
    }
    setLoading(true);
    try {
      const result = await deleteAccount(userId);
      if (result.success) {
        toast.success(t("deleteAccountTitle"));
        localStorage.clear();
        router.push("/login");
      } else {
        toast.error("Failed to delete account. Please try again.");
      }
    } catch {
      toast.error("Failed to delete account. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 flex flex-col max-w-[1560px] min-h-screen w-full lg:w-[90%] mx-auto lg:py-6 bg-gradient-to-b from-cream/50 via-white to-soft-rose/20 rounded-2xl">
      {/* Mobile Header */}
      <div className="flex items-center justify-between px-5 py-4 lg:hidden">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/settings/deactivate")} className="text-[#2C2C2C]">
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
          {t("deleteAccountTitle")}
        </h1>
        <p className="text-[#6B6B6B] text-sm mt-1">
          {t("deleteAccountSubtitle")}
        </p>
      </div>

      {/* Content */}
      <div className="px-5 lg:px-0 pb-28 lg:pb-6">
        <div className="lg:bg-white lg:border lg:border-border-soft lg:rounded-2xl lg:p-8 lg:max-w-2xl shadow-card hover:shadow-card-hover transition-all duration-300">
          {/* Title & Description */}
          <div className="mt-4 mb-8 lg:mt-0 lg:mb-6">
            <h2 className="font-playfair text-[22px] lg:text-2xl font-bold text-[#1A1A1A]">
              {t("deleteAccountTitle")}
            </h2>
            <p className="text-[14px] text-[#6B6B6B] mt-2 leading-[1.55] max-w-md">
              {t("deleteAccountSubtitle")}
            </p>
          </div>

          {/* Reasons List */}
          <div className="divide-y divide-[#F0E8E8]">
            {deleteReasons.map((reason) => (
              <button
                key={reason}
                onClick={() => handleReasonClick(reason)}
                className="w-full flex items-center justify-between py-5 px-2 rounded-xl group transition-colors duration-200 hover:bg-soft-rose/20"
              >
                <span className="text-[15px] font-medium text-[#1A1A1A] text-left">
                  {reason}
                </span>
                <FaChevronRight className="text-xs text-[#B0B0B0] flex-shrink-0 ml-4 group-hover:text-[#6B6B6B] transition-colors" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="max-w-md rounded-2xl p-0 overflow-hidden">
          <div className="p-6 pb-0">
            <AlertDialogTitle className="font-playfair text-[22px] font-bold text-[#1A1A1A] leading-[1.3]">
              {t("deleteConfirmTitle")}
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="mt-6">
                <h4 className="text-[15px] font-bold text-[#1A1A1A]">
                  It will
                </h4>
                <ul className="mt-3 space-y-2.5">
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#6B6B6B] mt-1.5 text-[6px]">●</span>
                    <span className="text-[14px] text-[#6B6B6B] leading-[1.5]">
                      Permanently erase your profile, photos, chats, and all data.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#6B6B6B] mt-1.5 text-[6px]">●</span>
                    <span className="text-[14px] text-[#6B6B6B] leading-[1.5]">
                      You won&apos;t be able to log in again with the same account.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#6B6B6B] mt-1.5 text-[6px]">●</span>
                    <span className="text-[14px] text-[#6B6B6B] leading-[1.5]">
                      This action cannot be undone.
                    </span>
                  </li>
                </ul>
              </div>
            </AlertDialogDescription>
          </div>

          <div className="p-6 pt-8 space-y-3">
            <button
              onClick={handleDeleteAccount}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2.5 py-4 bg-[#DC2626] rounded-xl text-[16px] font-semibold text-white hover:bg-[#B91C1C] transition-all duration-200 shadow-[0_8px_20px_-8px_rgba(220,38,38,0.45)] hover:shadow-[0_14px_28px_-10px_rgba(185,28,28,0.55)] disabled:opacity-50"
            >
              {loading ? t("deleting") : t("deleteBtn")}
              {!loading && <FiTrash2 className="text-lg" />}
            </button>
            <button
              onClick={() => setShowDeleteDialog(false)}
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
