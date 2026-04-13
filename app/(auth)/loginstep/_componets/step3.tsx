"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import StepProgress from "./stepProgress";
import SignupHeader from "./signupHeader";
import { useRegistration } from "../context/registration-context";

const COUNTRY_OPTIONS = [
  { value: "Sri Lanka", key: "countrySL" as const },
  { value: "India", key: "countryIN" as const },
  { value: "Australia", key: "countryAU" as const },
  { value: "Canada", key: "countryCA" as const },
  { value: "UK", key: "countryUK" as const },
  { value: "USA", key: "countryUSA" as const },
  { value: "Germany", key: "countryDE" as const },
  { value: "France", key: "countryFR" as const },
  { value: "Malaysia", key: "countryMY" as const },
  { value: "Singapore", key: "countrySG" as const },
  { value: "UAE", key: "countryUAE" as const },
  { value: "Qatar", key: "countryQA" as const },
  { value: "Saudi Arabia", key: "countrySA" as const },
  { value: "New Zealand", key: "countryNZ" as const },
  { value: "Other", key: "other" as const },
];

const MARITAL_OPTIONS = [
  { value: "UNMARRIED", key: "maritalUnmarried" as const },
  { value: "DIVORCED", key: "maritalDivorced" as const },
  { value: "SEPARATED", key: "maritalSeparated" as const },
];

const heights = [
  "4'6\"", "4'7\"", "4'8\"", "4'9\"", "4'10\"", "4'11\"",
  "5'0\"", "5'1\"", "5'2\"", "5'3\"", "5'4\"", "5'5\"", "5'6\"", "5'7\"", "5'8\"", "5'9\"", "5'10\"", "5'11\"",
  "6'0\"", "6'1\"", "6'2\"", "6'3\"", "6'4\"", "6'5\"", "6'6\"",
];

const RELIGION_OPTIONS = [
  { value: "HINDU", key: "relHindu" as const },
  { value: "CHRISTIAN", key: "relChristian" as const },
  { value: "ROMAN_CATHOLIC", key: "relRomanCatholic" as const },
  { value: "MUSLIM", key: "relMuslim" as const },
  { value: "BUDDHIST", key: "relBuddhist" as const },
  { value: "OTHER", key: "relOther" as const },
];

const CASTE_OPTIONS = [
  { value: "Bramanar", key: "casteBramanar" as const },
  { value: "Vellalar", key: "casteVellalar" as const },
  { value: "Viswakulam", key: "casteViswakulam" as const },
  { value: "Gurukulam", key: "casteGurukulam" as const },
  { value: "Karaiyar", key: "casteKaraiyar" as const },
  { value: "Sandar", key: "casteSandar" as const },
  { value: "Sengunthar", key: "casteSengunthar" as const },
  { value: "Koviyar", key: "casteKoviyar" as const },
  { value: "Vannar", key: "casteVannar" as const },
  { value: "Pallar", key: "castePallar" as const },
  { value: "Paraiyar", key: "casteParaiyar" as const },
  { value: "Nalavar", key: "casteNalavar" as const },
  { value: "Thaddar", key: "casteThaddar" as const },
  { value: "Kollar", key: "casteKollar" as const },
  { value: "Ampaddar", key: "casteAmpaddar" as const },
  { value: "Thevar", key: "casteThevarNew" as const },
  { value: "Nadaar", key: "casteNadaar" as const },
  { value: "Thachchar", key: "casteThachchar" as const },
  { value: "Chettiyar", key: "casteChettiyarNew" as const },
  { value: "Pandaram", key: "castePandaram" as const },
  { value: "Kudiyanavar", key: "casteKudiyanavar" as const },
  { value: "Muthaliyar", key: "casteMuthaliyar" as const },
  { value: "Kallar", key: "casteKallar" as const },
  { value: "Agamadiyar", key: "casteAgamadiyar" as const },
  { value: "Muththuraja", key: "casteMuththuraja" as const },
  { value: "No Caste", key: "casteNoCaste" as const },
  { value: "other", key: "casteOtherLower" as const },
] as const;

const CITIZENSHIP_OPTIONS = [
  { value: "Citizen", key: "citizen" as const },
  { value: "Permanent Resident", key: "permanentResident" as const },
  { value: "Work Permit", key: "workPermit" as const },
  { value: "Student Visa", key: "studentVisa" as const },
  { value: "Other", key: "other" as const },
];

/** Parse `YYYY-MM-DD` as a local calendar date; returns null if invalid (e.g. 2006-02-30). */
function parseStrictLocalYmd(iso: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  const dt = new Date(y, mo - 1, d);
  if (
    dt.getFullYear() !== y ||
    dt.getMonth() !== mo - 1 ||
    dt.getDate() !== d
  ) {
    return null;
  }
  return dt;
}

/** Latest birth date still allowed: same month/day as today, 18 years ago (local). */
function getMaxBirthDateForMinAge18(): Date {
  const t = new Date();
  return new Date(t.getFullYear() - 18, t.getMonth(), t.getDate());
}

function formatLocalYmd(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Allowed: exactly 18 today or older; not allowed: under 18 (any birth date after cutoff). */
function isDobAtLeast18(dobIso: string): boolean {
  const birth = parseStrictLocalYmd(dobIso);
  if (!birth) return false;
  const cutoff = getMaxBirthDateForMinAge18();
  return birth.getTime() <= cutoff.getTime();
}

const Step3 = () => {
  const t = useTranslations("register");
  const { data, updateData } = useRegistration();
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const maxDobIso = useMemo(
    () => formatLocalYmd(getMaxBirthDateForMinAge18()),
    []
  );

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!data.dateOfBirth?.trim()) {
      nextErrors.dateOfBirth = t("errDob");
    } else if (!isDobAtLeast18(data.dateOfBirth)) {
      nextErrors.dateOfBirth = t("errDobMin18");
    }
    if (!data.nativeCountry) nextErrors.nativeCountry = t("errNativeCountry");
    if (!data.citizenship) nextErrors.citizenship = t("errCitizenship");
    if (!data.country) nextErrors.country = t("errCountry");
    if (!data.maritalStatus) nextErrors.maritalStatus = t("errMarital");
    if (!data.height) nextErrors.height = t("errHeight");
    if (!data.religion) nextErrors.religion = t("errReligion");
    if (!data.caste) nextErrors.caste = t("errCaste");
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleNext = () => {
    if (!validate()) return;
    router.push("/loginstep/step4");
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
          <Link href="/loginstep/step2" className="text-[#2C2C2C] hover:text-[#8D1B3D] transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="font-sfpro text-xl font-semibold text-[#191919]">{t("signUp")}</h1>
        </div>

        <StepProgress />
        <p className="mt-3 text-sm text-[#6B6B6B]">{t("step3Subtitle")}</p>

        <div className="mt-10">
          <h2 className="font-sfpro text-xl font-semibold text-[#191919] mb-6">{t("basicDetails")}</h2>

          <div className="grid grid-cols-2 gap-x-4 gap-y-5">
            <div>
              <label className="block text-sm text-[#6B6B6B] mb-2">{t("dateOfBirth")}</label>
              <input
                type="date"
                max={maxDobIso}
                value={data.dateOfBirth}
                onChange={(e) => {
                  updateData({ dateOfBirth: e.target.value });
                  setErrors((prev) => {
                    const { dateOfBirth: _d, ...rest } = prev;
                    return rest;
                  });
                }}
                className="w-full px-4 py-3.5 border border-[#EADDDD] rounded-xl text-sm text-[#2C2C2C] bg-white focus:outline-none focus:border-[#8D1B3D] transition-colors duration-200"
              />
              {errors.dateOfBirth && <p className="mt-1 text-xs text-red-500">{errors.dateOfBirth}</p>}
            </div>

            <div>
              <label className="block text-sm text-[#6B6B6B] mb-2">{t("nativeCountry")}</label>
              <div className="relative">
                <select
                  value={data.nativeCountry}
                  onChange={(e) => updateData({ nativeCountry: e.target.value })}
                  className="w-full appearance-none px-4 py-3.5 border border-[#EADDDD] rounded-xl text-sm text-[#2C2C2C] bg-white focus:outline-none focus:border-[#8D1B3D] transition-colors duration-200 cursor-pointer"
                >
                  <option value="">{t("select")}</option>
                  {COUNTRY_OPTIONS.map((c) => (
                    <option key={c.value} value={c.value}>{t(c.key)}</option>
                  ))}
                </select>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6B6B] pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              {errors.nativeCountry && <p className="mt-1 text-xs text-red-500">{errors.nativeCountry}</p>}
            </div>

            <div>
              <label className="block text-sm text-[#6B6B6B] mb-2">{t("citizenship")}</label>
              <div className="relative">
                <select
                  value={data.citizenship}
                  onChange={(e) => updateData({ citizenship: e.target.value })}
                  className="w-full appearance-none px-4 py-3.5 border border-[#EADDDD] rounded-xl text-sm text-[#2C2C2C] bg-white focus:outline-none focus:border-[#8D1B3D] transition-colors duration-200 cursor-pointer"
                >
                  <option value="">{t("select")}</option>
                  {CITIZENSHIP_OPTIONS.map((c) => (
                    <option key={c.value} value={c.value}>{t(c.key)}</option>
                  ))}
                </select>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6B6B] pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              {errors.citizenship && <p className="mt-1 text-xs text-red-500">{errors.citizenship}</p>}
            </div>

            <div>
              <label className="block text-sm text-[#6B6B6B] mb-2">{t("livingCountry")}</label>
              <div className="relative">
                <select
                  value={data.country}
                  onChange={(e) => updateData({ country: e.target.value })}
                  className="w-full appearance-none px-4 py-3.5 border border-[#EADDDD] rounded-xl text-sm text-[#2C2C2C] bg-white focus:outline-none focus:border-[#8D1B3D] transition-colors duration-200 cursor-pointer"
                >
                  <option value="">{t("select")}</option>
                  {COUNTRY_OPTIONS.map((c) => (
                    <option key={c.value} value={c.value}>{t(c.key)}</option>
                  ))}
                </select>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6B6B] pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              {errors.country && <p className="mt-1 text-xs text-red-500">{errors.country}</p>}
            </div>

            <div>
              <label className="block text-sm text-[#6B6B6B] mb-2">{t("maritalStatus")}</label>
              <div className="relative">
                <select
                  value={data.maritalStatus}
                  onChange={(e) => updateData({ maritalStatus: e.target.value })}
                  className="w-full appearance-none px-4 py-3.5 border border-[#EADDDD] rounded-xl text-sm text-[#2C2C2C] bg-white focus:outline-none focus:border-[#8D1B3D] transition-colors duration-200 cursor-pointer"
                >
                  <option value="">{t("select")}</option>
                  {MARITAL_OPTIONS.map((s) => (
                    <option key={s.value} value={s.value}>{t(s.key)}</option>
                  ))}
                </select>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6B6B] pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              {errors.maritalStatus && <p className="mt-1 text-xs text-red-500">{errors.maritalStatus}</p>}
            </div>

            <div>
              <label className="block text-sm text-[#6B6B6B] mb-2">{t("height")}</label>
              <div className="relative">
                <select
                  value={data.height}
                  onChange={(e) => updateData({ height: e.target.value })}
                  className="w-full appearance-none px-4 py-3.5 border border-[#EADDDD] rounded-xl text-sm text-[#2C2C2C] bg-white focus:outline-none focus:border-[#8D1B3D] transition-colors duration-200 cursor-pointer"
                >
                  <option value="">{t("select")}</option>
                  {heights.map((h) => <option key={h} value={h}>{h}</option>)}
                </select>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6B6B] pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              {errors.height && <p className="mt-1 text-xs text-red-500">{errors.height}</p>}
            </div>

            <div>
              <label className="block text-sm text-[#6B6B6B] mb-2">{t("religion")}</label>
              <div className="relative">
                <select
                  value={data.religion}
                  onChange={(e) => updateData({ religion: e.target.value })}
                  className="w-full appearance-none px-4 py-3.5 border border-[#EADDDD] rounded-xl text-sm text-[#2C2C2C] bg-white focus:outline-none focus:border-[#8D1B3D] transition-colors duration-200 cursor-pointer"
                >
                  <option value="">{t("select")}</option>
                  {RELIGION_OPTIONS.map((r) => (
                    <option key={r.value} value={r.value}>{t(r.key)}</option>
                  ))}
                </select>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6B6B] pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              {errors.religion && <p className="mt-1 text-xs text-red-500">{errors.religion}</p>}
            </div>

            <div>
              <label className="block text-sm text-[#6B6B6B] mb-2">{t("caste")}</label>
              <div className="relative">
                <select
                  value={data.caste}
                  onChange={(e) => updateData({ caste: e.target.value })}
                  className="w-full appearance-none px-4 py-3.5 border border-[#EADDDD] rounded-xl text-sm text-[#2C2C2C] bg-white focus:outline-none focus:border-[#8D1B3D] transition-colors duration-200 cursor-pointer"
                >
                  <option value="">{t("select")}</option>
                  {CASTE_OPTIONS.map((caste) => (
                    <option key={caste.value} value={caste.value}>
                      {t(caste.key)}
                    </option>
                  ))}
                </select>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6B6B] pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              {errors.caste && <p className="mt-1 text-xs text-red-500">{errors.caste}</p>}
            </div>
            <div>
              <label className="block text-sm text-[#6B6B6B] mb-2">{t("subCasteOptional")}</label>
              <input
                type="text"
                value={data.subCaste}
                onChange={(e) => updateData({ subCaste: e.target.value })}
                placeholder={t("subCastePlaceholder")}
                className="w-full px-4 py-3.5 border border-[#EADDDD] rounded-xl text-sm text-[#2C2C2C] placeholder:text-[#6B6B6B]/50 bg-white focus:outline-none focus:border-[#8D1B3D] transition-colors duration-200"
              />
              {data.subCaste.length > 0 && data.subCaste.trim().length < 2 && (
                <p className="text-xs text-red-500 mt-1">
                  {t("errSubCasteMin")}
                </p>
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

export default Step3;
