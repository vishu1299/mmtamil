"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { FiUpload } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import StepProgress from "./stepProgress";
import SignupHeader from "./signupHeader";
import { useRegistration } from "../context/registration-context";
import { useCreateUser } from "../api/mutation";
import { uploadHoroscopeImage, updateUserHoroscopeId } from "@/app/api/api";

const Step9 = () => {
  const t = useTranslations("register");
  const { data, photoFiles, setPhotoFiles, clearData, horoscopeChartData, horoscopeImageFile } = useRegistration();
  const createUserMutation = useCreateUser();
  const [previews, setPreviews] = useState<(string | null)[]>(Array(6).fill(null));
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newPreviews = [...previews];
    const newFiles = [...photoFiles];
    let slotIndex = newPreviews.findIndex((p) => p === null);

    for (let i = 0; i < files.length && slotIndex !== -1 && slotIndex < 6; i++) {
      const file = files[i];
      newPreviews[slotIndex] = URL.createObjectURL(file);
      newFiles.push(file);
      slotIndex = newPreviews.findIndex((p, idx) => idx > slotIndex && p === null);
      if (slotIndex === -1) slotIndex = newPreviews.indexOf(null);
    }

    setPreviews(newPreviews);
    setPhotoFiles(newFiles);
    e.target.value = "";
  };

  const runHoroscopeApis = async (userId: number) => {
    const hasImage = !!horoscopeImageFile;
    console.log("hasImage", hasImage);
    if (!hasImage) return;

    let imageOk = false;
    let errorMessage = "";
    let horoscopeId: string | null = null;

    try {
      if (hasImage) {
        console.log("uploading image", userId, horoscopeImageFile);
        const response = await uploadHoroscopeImage(userId, horoscopeImageFile!);
        console.log("response of horoscope image", response);
        const id = response?.data?.data?.id ?? response?.data?.id;
        if (id) horoscopeId = String(id);
        imageOk = true;
      }
      if (horoscopeId) {
        await updateUserHoroscopeId(horoscopeId);
      }
    } catch (e: any) {
      console.error("Horoscope save failed", e);
      errorMessage =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        (typeof e?.message === "string" ? e.message : t("horoscopeSaveFailed"));
    }

    if (errorMessage) {
      toast.error(errorMessage);
    } else if (imageOk) {
      toast.success(t("horoscopeImageOk"));
    }
  };

  const buildHoroscopePayload = () => {
    const rasiChart = Array.from({ length: 12 }, (_, i) => horoscopeChartData[i] ?? "");
    const navamsaChart = Array.from({ length: 12 }, (_, i) => horoscopeChartData[12 + i] ?? "");
    const hasAnyValue = [...rasiChart, ...navamsaChart].some((item) => item.trim().length > 0);
    if (!hasAnyValue) return undefined;
    return { rasiChart, navamsaChart };
  };

  const handleSubmit = () => {
    createUserMutation.mutate(
      { data, photos: photoFiles, horoscope: buildHoroscopePayload() },
      {
        onSuccess: async (res) => {
          if (res?.token) {
            localStorage.setItem("access-token", JSON.stringify(res));
          }
          const userId = res?.data?.result?.id ?? res?.data?.id ?? res?.id;
          if (userId) await runHoroscopeApis(userId);
          localStorage.setItem("isNewUser", "true");
          clearData();
          router.push("/loginstep/step10");
        },
        onError: (error: any) => {
          const message =
            error?.response?.data?.message ||
            error?.response?.data?.error ||
            JSON.stringify(error?.response?.data) ||
            t("registrationFailed");
          toast.error(message);
        },
      }
    );
  };

  const handleLater = () => {
    
    createUserMutation.mutate(
      { data, photos: [], horoscope: buildHoroscopePayload() },
      {
        onSuccess: async (res) => {
          console.log("Registration success (no photos):", res);
          if (res?.token) {
            localStorage.setItem("access-token", JSON.stringify(res));
          }
          const userId = res?.data?.result?.id ?? res?.data?.id ?? res?.id;
          if (userId) await runHoroscopeApis(userId);
          localStorage.setItem("isNewUser", "true");
          clearData();
          router.push("/loginstep/step10");
        },
        onError: (error: any) => {
          console.error("Registration error:", error);
          console.error("Server response:", error?.response?.data);
          const message =
            error?.response?.data?.message ||
            error?.response?.data?.error ||
            JSON.stringify(error?.response?.data) ||
            t("registrationFailed");
          toast.error(message);
        },
      }
    );
  };

  const isSubmitting = createUserMutation.isPending;

  return (
    <div className="relative isolate min-h-screen bg-gradient-to-br from-[#FFF8F5] via-[#FDF3F6] to-[#FFFDF8] flex flex-col overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-20 top-24 h-72 w-72 rounded-full bg-maroon/20 blur-3xl" />
        <div className="absolute -right-16 top-40 h-80 w-80 rounded-full bg-rose-300/45 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-amber-200/45 blur-3xl" />
      </div>
      <SignupHeader />
      <div className="max-w-md mx-auto px-4 sm:px-6 py-6 flex flex-col w-full">
        <div className="rounded-2xl border border-border-soft bg-white px-6 pt-8 pb-10 shadow-card">
        <div className="flex items-center gap-3 mb-4">
          <Link href="/loginstep/step4" className="text-[#2C2C2C] hover:text-[#8D1B3D] transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="font-sfpro text-xl font-semibold text-[#191919]">{t("signUp")}</h1>
        </div>

        <StepProgress />
        <p className="mt-3 text-sm text-[#6B6B6B]">{t("step9Subtitle")}</p>

        <div className="mt-10">
          <h2 className="font-sfpro text-xl font-semibold text-[#191919] mb-2">{t("uploadPhotosTitle")}</h2>
          <p className="text-sm text-[#6B6B6B] mb-6 leading-relaxed">
            {t("uploadPhotosHint")}
          </p>

          <div className="grid grid-cols-3 gap-4 mb-8">
            {previews.map((photo, index) => (
              <div
                key={index}
                className="aspect-[3/4] rounded-xl border border-[#EADDDD] bg-[#F9F5F5] flex items-center justify-center overflow-hidden"
              >
                {photo ? (
                  <Image
                    src={photo}
                    alt={t("photoNumber", { n: index + 1 })}
                    width={120}
                    height={160}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg className="w-12 h-12 text-[#D5CDCD]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                )}
              </div>
            ))}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />

          <button
            onClick={handleUploadClick}
            disabled={isSubmitting}
            className="w-full py-3.5 border border-border-soft rounded-xl text-sm font-medium text-[#2C2C2C] flex items-center justify-center gap-2 hover:border-[#8D1B3D]/30 hover:bg-[#F8E8EC]/20 transition-all duration-200 mb-4"
          >
            {t("upload")}
            <FiUpload className="w-4 h-4" />
          </button>

          {photoFiles.length > 0 && (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`w-full py-4 mb-3 font-semibold text-base rounded-xl transition-all duration-200 active:scale-[0.98] ${
                isSubmitting
                  ? "bg-[#E8E0D8] text-[#6B6B6B] cursor-not-allowed"
                  : "bg-[#8D1B3D] hover:bg-[#6B1530] text-white shadow-maroon hover:shadow-maroon-lg hover:-translate-y-px motion-reduce:hover:translate-y-0"
              }`}
            >
              {isSubmitting ? t("registering") : t("submitContinue")}
            </button>
          )}

          {/* <button
            onClick={handleLater}
            disabled={isSubmitting}
            className={`w-full py-4 font-semibold text-base rounded-xl transition-all duration-200 active:scale-[0.98] ${
              isSubmitting
                ? "bg-[#E8E0D8] text-[#6B6B6B] cursor-not-allowed"
                : "bg-[#8D1B3D] hover:bg-[#6B1530] text-white shadow-maroon hover:shadow-maroon-lg hover:-translate-y-px motion-reduce:hover:translate-y-0"
            }`}
          >
            {isSubmitting ? "Registering..." : "Later"}
          </button> */}
        </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Step9;
