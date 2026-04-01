"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import StepProgress from "./_componets/stepProgress";
import SignupHeader from "./_componets/signupHeader";
import { useRegistration } from "./context/registration-context";
import { signUpWithGoogleCredential } from "./api/api";

const PROFILE_FOR = [
  { value: "Me", labelKey: "profileForMe" },
  { value: "Son", labelKey: "profileForSon" },
  { value: "Daughter", labelKey: "profileForDaughter" },
  { value: "Brother", labelKey: "profileForBrother" },
  { value: "Sister", labelKey: "profileForSister" },
  { value: "Friend", labelKey: "profileForFriend" },
  { value: "Relative", labelKey: "profileForRelative" },
] as const;

const I_AM = [
  { value: "GROOM", labelKey: "groom" },
  { value: "BRIDE", labelKey: "bride" },
] as const;

const LoginStepFirst = () => {
  const t = useTranslations("register");
  const tLogin = useTranslations("login");
  const { data, updateData, clearData } = useRegistration();
  const router = useRouter();
  const [error, setError] = useState("");
  const [googleBusy, setGoogleBusy] = useState(false);
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  const handleGoogleSignUp = async (credentialResponse: CredentialResponse) => {
    const tokenId = credentialResponse.credential;
    if (!tokenId) {
      toast.error(t("googleAuthFailed"));
      return;
    }
    setGoogleBusy(true);
    try {
      await signUpWithGoogleCredential(tokenId);
      toast.success(tLogin("toastSuccess"));
      localStorage.setItem("isNewUser", "true");
      clearData();
      router.push("/settings/edit-profile");
    } catch (e: any) {
      const message =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        t("googleAuthFailed");
      toast.error(message);
    } finally {
      setGoogleBusy(false);
    }
  };

  const handleNext = () => {
    if (!data.profileFor.trim() || !data.iAm.trim()) {
      setError(t("errorProfileSetup"));
      return;
    }
    setError("");
    router.push("/loginstep/step2");
  };

  return (
    <div className="relative isolate flex min-h-screen flex-col overflow-hidden bg-gradient-to-br from-[#FFF8F5] via-[#FDF3F6] to-[#FFFDF8]">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-20 top-24 h-72 w-72 rounded-full bg-maroon/20 blur-3xl" />
        <div className="absolute -right-16 top-40 h-80 w-80 rounded-full bg-rose-300/45 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-amber-200/45 blur-3xl" />
      </div>
      <SignupHeader />

      <div className="flex flex-1 items-start justify-center px-4 py-6 sm:px-6">
        <div className="mx-auto flex w-full max-w-md flex-col rounded-2xl border border-border-soft bg-white px-6 pb-8 pt-7 shadow-card">
          <h1 className="mb-1 font-sfpro text-xl font-semibold text-[#191919]">
            {t("signUp")}
          </h1>
          <p className="mb-5 text-sm text-[#6B6B6B]">{t("setupProfileHint")}</p>

          <StepProgress />

          <div className="mt-8">
            <h2 className="mb-6 font-sfpro text-xl font-semibold text-[#191919]">
              {t("profileSetup")}
            </h2>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div>
                <label className="block text-sm text-[#6B6B6B] mb-2">{t("profileFor")}</label>
                <div className="relative">
                  <select
                    value={data.profileFor}
                    onChange={(e) => updateData({ profileFor: e.target.value })}
                    className="w-full cursor-pointer appearance-none rounded-xl border border-border-soft bg-white px-4 py-3.5 text-sm text-[#2C2C2C] shadow-sm transition-[border-color,box-shadow] duration-200 hover:border-maroon/30 focus:outline-none focus:border-maroon focus:ring-2 focus:ring-maroon/15"
                  >
                    {PROFILE_FOR.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {t(opt.labelKey)}
                      </option>
                    ))}
                  </select>
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B6B6B] pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              <div>
                <label className="block text-sm text-[#6B6B6B] mb-2">{t("iAmA")}</label>
                <div className="relative">
                  <select
                    value={data.iAm}
                    onChange={(e) => updateData({ iAm: e.target.value })}
                    className="w-full cursor-pointer appearance-none rounded-xl border border-border-soft bg-white px-4 py-3.5 text-sm text-[#2C2C2C] shadow-sm transition-[border-color,box-shadow] duration-200 hover:border-maroon/30 focus:outline-none focus:border-maroon focus:ring-2 focus:ring-maroon/15"
                  >
                    {I_AM.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {t(opt.labelKey)}
                      </option>
                    ))}
                  </select>
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B6B6B] pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleNext}
            disabled={googleBusy}
            className="w-full rounded-xl bg-[#8D1B3D] py-4 text-base font-semibold text-white shadow-maroon transition-all duration-200 hover:-translate-y-px hover:bg-[#6B1530] hover:shadow-maroon-lg active:scale-[0.98] motion-reduce:hover:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {t("next")}
          </button>

          {googleClientId ? (
            <>
              <div className="my-5 flex items-center gap-3">
                <div className="h-px flex-1 bg-[#EADDDD]" />
                <span className="text-xs font-medium uppercase tracking-wider text-[#6B6B6B]">
                  {tLogin("orContinue")}
                </span>
                <div className="h-px flex-1 bg-[#EADDDD]" />
              </div>
              <div className="flex justify-center [&>div]:!w-full [&_iframe]:!w-full">
                <GoogleLogin
                  onSuccess={handleGoogleSignUp}
                  onError={() => toast.error(t("googleAuthFailed"))}
                  size="large"
                  width={340}
                  theme="outline"
                  shape="pill"
                  text="signup_with"
                  useOneTap={false}
                />
              </div>
            </>
          ) : null}

          {error && (
            <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <p className="text-center text-sm text-[#6B6B6B] mt-6">
            {t("alreadyMember")}{" "}
            <Link href="/login" className="text-[#8D1B3D] font-semibold hover:underline">
              {t("login")}
            </Link>
          </p>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default LoginStepFirst;
