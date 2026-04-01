"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { FiEye, FiEyeOff } from "react-icons/fi";
import StepProgress from "./stepProgress";
import SignupHeader from "./signupHeader";
import { useRegistration } from "../context/registration-context";

const countryCodes = [
  { code: "+94", label: "🇱🇰 +94" },
  { code: "+91", label: "🇮🇳 +91" },
  { code: "+61", label: "🇦🇺 +61" },
  { code: "+1", label: "🇺🇸 +1" },
  { code: "+44", label: "🇬🇧 +44" },
  { code: "+60", label: "🇲🇾 +60" },
  { code: "+65", label: "🇸🇬 +65" },
  { code: "+971", label: "🇦🇪 +971" },
  { code: "+974", label: "🇶🇦 +974" },
  { code: "+49", label: "🇩🇪 +49" },
  { code: "+33", label: "🇫🇷 +33" },
  { code: "+64", label: "🇳🇿 +64" },
];

const Step2 = () => {
  const t = useTranslations("register");
  const { data, updateData } = useRegistration();
  const [countryCode, setCountryCode] = useState("+94");
  const [mobile, setMobile] = useState(data.phoneNumber.replace(/^\+\d+/, "") || "");
  const [password, setPassword] = useState(data.password || "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!data.firstName.trim()) nextErrors.firstName = t("errFirstName");
    if (!data.lastName.trim()) nextErrors.lastName = t("errLastName");
    if (!mobile.trim()) nextErrors.mobile = t("errMobile");
    if (!data.email.trim()) {
      nextErrors.email = t("errEmail");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
      nextErrors.email = t("errEmailInvalid");
    }
    if (!password) {
      nextErrors.password = t("errPassword");
    } else if (password.length < 8) {
      nextErrors.password = t("errPasswordMin");
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const handleNext = () => {
    if (!validate()) return;
    updateData({
      phoneNumber: `${countryCode}${mobile}`,
      password,
    });
    router.push("/loginstep/step3");
  };

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
          <Link href="/loginstep" className="text-[#2C2C2C] hover:text-[#8D1B3D] transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="font-sfpro text-xl font-semibold text-[#191919]">{t("signUp")}</h1>
        </div>

        <StepProgress />
        <p className="mt-3 text-sm text-[#6B6B6B]">{t("step2Subtitle")}</p>

        <div className="mt-10">
          <h2 className="font-sfpro text-xl font-semibold text-[#191919] mb-6">{t("personalDetails")}</h2>

          <div className="space-y-5">
            <div>
              <label className="block text-sm text-[#6B6B6B] mb-2">{t("firstName")}</label>
              <input
                type="text"
                value={data.firstName}
                onChange={(e) => updateData({ firstName: e.target.value })}
                placeholder={t("phFirstName")}
                className="w-full px-4 py-3.5 border border-[#EADDDD] rounded-xl text-sm text-[#2C2C2C] placeholder:text-[#6B6B6B]/50 bg-white focus:outline-none focus:border-[#8D1B3D] transition-colors duration-200"
              />
              {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>}
            </div>

            <div>
              <label className="block text-sm text-[#6B6B6B] mb-2">{t("lastName")}</label>
              <input
                type="text"
                value={data.lastName}
                onChange={(e) => updateData({ lastName: e.target.value })}
                placeholder={t("phLastName")}
                className="w-full px-4 py-3.5 border border-[#EADDDD] rounded-xl text-sm text-[#2C2C2C] placeholder:text-[#6B6B6B]/50 bg-white focus:outline-none focus:border-[#8D1B3D] transition-colors duration-200"
              />
              {errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>}
            </div>

            <div>
              <label className="block text-sm text-[#6B6B6B] mb-2">{t("mobileNumber")}</label>
              <div className="flex gap-2">
                <div className="relative">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="appearance-none pl-3 pr-8 py-3.5 border border-[#EADDDD] rounded-xl text-sm text-[#2C2C2C] bg-white focus:outline-none focus:border-[#8D1B3D] transition-colors duration-200 cursor-pointer"
                  >
                    {countryCodes.map((c) => (
                      <option key={c.code} value={c.code}>{c.label}</option>
                    ))}
                  </select>
                  <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6B6B] pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                  placeholder={t("phMobile")}
                  className="flex-1 px-4 py-3.5 border border-[#EADDDD] rounded-xl text-sm text-[#2C2C2C] placeholder:text-[#6B6B6B]/50 bg-white focus:outline-none focus:border-[#8D1B3D] transition-colors duration-200"
                />
              </div>
              {errors.mobile && <p className="mt-1 text-xs text-red-500">{errors.mobile}</p>}
            </div>

            <div>
              <label className="block text-sm text-[#6B6B6B] mb-2">{t("emailId")}</label>
              <input
                type="email"
                value={data.email}
                onChange={(e) => updateData({ email: e.target.value })}
                placeholder={t("phEmail")}
                className="w-full px-4 py-3.5 border border-[#EADDDD] rounded-xl text-sm text-[#2C2C2C] placeholder:text-[#6B6B6B]/50 bg-white focus:outline-none focus:border-[#8D1B3D] transition-colors duration-200"
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>

            <div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("phPasswordMin")}
                  className="w-full px-4 pr-12 py-3.5 border border-[#EADDDD] rounded-xl text-sm text-[#2C2C2C] placeholder:text-[#6B6B6B]/50 bg-white focus:outline-none focus:border-[#8D1B3D] transition-colors duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B6B6B] hover:text-[#8D1B3D] transition-colors"
                  aria-label={showPassword ? t("hidePassword") : t("showPassword")}
                >
                  {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                </button>
              </div>
              {password && password.length < 8 && (
                <p className="text-xs text-red-500 mt-1">{t("errPasswordMin")}</p>
              )}
            </div>

            <div>
              <label className="block text-sm text-[#6B6B6B] mb-2">{t("confirmPassword")}</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={t("phPasswordAgain")}
                  className="w-full px-4 pr-12 py-3.5 border border-[#EADDDD] rounded-xl text-sm text-[#2C2C2C] placeholder:text-[#6B6B6B]/50 bg-white focus:outline-none focus:border-[#8D1B3D] transition-colors duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B6B6B] hover:text-[#8D1B3D] transition-colors"
                  aria-label={showConfirmPassword ? t("hideConfirmPassword") : t("showConfirmPassword")}
                >
                  {showConfirmPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                </button>
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-red-500 mt-1">{t("errPasswordsMismatch")}</p>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={handleNext}
          className="w-full py-4 mt-8 font-semibold text-base rounded-xl transition-all duration-200 active:scale-[0.98] bg-[#8D1B3D] hover:bg-[#6B1530] text-white shadow-maroon hover:shadow-maroon-lg hover:-translate-y-px motion-reduce:hover:translate-y-0"
        >
          {t("next")}
        </button>
        </div>
      </div>
    </div>
  );
};

export default Step2;
