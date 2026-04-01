"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { IoChevronBack } from "react-icons/io5";
import { FiBell } from "react-icons/fi";
import { z } from "zod";
import { changepassword } from "../api/api";
import { toast } from "react-toastify";

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain an uppercase letter")
      .regex(/[a-z]/, "Must contain a lowercase letter")
      .regex(/\d/, "Must contain a digit")
      .regex(/[!@#$%^&*]/, "Must contain a special character"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function ChangePasswordPage() {
  const router = useRouter();
  const tc = useTranslations("common");
  const t = useTranslations("settingsPages");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      passwordSchema.parse(formData);
      setErrors({});
      await changepassword(formData.currentPassword, formData.newPassword);
      toast.success(t("passwordChanged"));
      setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.errors.forEach((e) => {
          if (e.path[0]) fieldErrors[e.path[0] as string] = e.message;
        });
        setErrors(fieldErrors);
      } else {
        toast.error(t("passwordChangeFailed"));
      }
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { id: "currentPassword", label: t("currentPassword"), placeholder: t("phCurrentPassword") },
    { id: "newPassword", label: t("newPassword"), placeholder: t("phNewPassword") },
    { id: "confirmPassword", label: t("confirmNewPassword"), placeholder: t("phConfirmNewPassword") },
  ];

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
          {t("changePasswordTitle")}
        </h1>
        <p className="text-[#6B6B6B] text-sm mt-1">
          {t("changePasswordSubtitle")}
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col px-5 lg:px-0 pb-28 lg:pb-6">
        <div className="lg:bg-white lg:border lg:border-border-soft lg:rounded-2xl lg:p-8 lg:max-w-2xl flex-1 flex flex-col shadow-card hover:shadow-card-hover transition-all duration-300">
          {/* Title & Description */}
          <div className="mt-4 mb-8 lg:mt-0 lg:mb-6">
            <h2 className="font-playfair text-[22px] lg:text-2xl font-bold text-[#1A1A1A]">
              {t("changePasswordTitle")}
            </h2>
            <p className="text-[14px] text-[#6B6B6B] mt-2 leading-[1.55] max-w-md">
              {t("changePasswordSubtitle")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
            <div className="space-y-5">
              {fields.map((field) => (
                <div key={field.id}>
                  <label
                    htmlFor={field.id}
                    className="block text-[13px] font-medium text-[#6B6B6B] mb-2"
                  >
                    {field.label}
                  </label>
                  <input
                    id={field.id}
                    type="password"
                    placeholder={field.placeholder}
                    value={formData[field.id as keyof typeof formData]}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                    className={`w-full px-4 py-3.5 bg-[#F5F5F5] border border-border-soft rounded-xl text-[15px] text-[#2C2C2C] placeholder:text-[#B0B0B0] focus:outline-none focus:ring-2 focus:ring-maroon/20 focus:border-maroon/35 transition-all ${
                      errors[field.id]
                        ? "ring-2 ring-red-300 bg-red-50/30"
                        : ""
                    }`}
                  />
                  {errors[field.id] && (
                    <p className="text-[12px] text-red-500 mt-1.5">
                      {errors[field.id]}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Save Button */}
            <div className="mt-auto pt-10">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-maroon text-white text-[16px] font-semibold rounded-xl hover:bg-maroon-light transition-all duration-200 shadow-maroon hover:shadow-maroon-lg hover:-translate-y-px motion-reduce:hover:translate-y-0 disabled:opacity-50"
              >
                {loading ? tc("saving") : tc("save")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
