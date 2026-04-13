"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { FiUpload, FiEdit3 } from "react-icons/fi";
import StepProgress from "./stepProgress";
import SignupHeader from "./signupHeader";
import { useRegistration } from "../context/registration-context";

const EDUCATION_OPTIONS = [
  { value: "Doctorate Degree", key: "eduDoctorate" as const },
  { value: "Master Degree", key: "eduMaster" as const },
  { value: "Higher Diploma", key: "eduHigherDiploma" as const },
  { value: "Diploma", key: "eduDiploma" as const },
  { value: "Advanced Level (A/L)", key: "eduAL" as const },
  { value: "Ordinary Level (O/L)", key: "eduOL" as const },
  { value: "Other", key: "eduOther" as const },
];

const OCCUPATION_OPTIONS = [
  { value: "Private Company", key: "occPrivate" as const },
  { value: "Government Job", key: "occGov" as const },
  { value: "Business / Self Employed", key: "occBusiness" as const },
  { value: "Doctor", key: "occDoctor" as const },
  { value: "Engineer", key: "occEngineer" as const },
  { value: "Teacher / Professor", key: "occTeacher" as const },
  { value: "IT Professional", key: "occIt" as const },
  { value: "Lawyer", key: "occLawyer" as const },
  { value: "Accountant", key: "occAccountant" as const },
  { value: "Farmer", key: "occFarmer" as const },
  { value: "Not Working", key: "occNotWorking" as const },
  { value: "Student", key: "occStudent" as const },
  { value: "Other", key: "occOther" as const },
];

const zodiacs = [
  "மேஷம்", "ரிஷபம்", "மிதுனம்", "கடகம்", "சிம்மம்", "கன்னி",
  "துலாம்", "விருச்சிகம்", "தனுசு", "மகரம்", "கும்பம்", "மீனம்",
];

const stars = [
  "அஸ்வினி", "பரணி", "கார்த்திகை", "ரோகிணி", "மிருகசீரிடம்",
  "திருவாதிரை", "புனர்பூசம்", "பூசம்", "ஆயில்யம்", "மகம்",
  "பூரம்", "உத்திரம்", "அஸ்தம்", "சித்திரை", "சுவாதி",
  "விசாகம்", "அனுஷம்", "கேட்டை", "மூலம்", "பூராடம்",
  "உத்திராடம்", "திருவோணம்", "அவிட்டம்", "சதயம்", "பூரட்டாதி",
  "உத்திரட்டாதி", "ரேவதி",
];

const PLANET_DEFS = [
  { code: "சூரி", labelKey: "planetSun" as const },
  { code: "சந்", labelKey: "planetMoon" as const },
  { code: "செவ்", labelKey: "planetMars" as const },
  { code: "புதன்", labelKey: "planetMercury" as const },
  { code: "குரு", labelKey: "planetJupiter" as const },
  { code: "சுக்", labelKey: "planetVenus" as const },
  { code: "சனி", labelKey: "planetSaturn" as const },
  { code: "ராகு", labelKey: "planetRahu" as const },
  { code: "கேது", labelKey: "planetKetu" as const },
  { code: "லக்", labelKey: "planetLagna" as const },
] as const;

function planetLabelKey(code: string): (typeof PLANET_DEFS)[number]["labelKey"] | null {
  const def = PLANET_DEFS.find((d) => d.code === code);
  return def ? def.labelKey : null;
}
const totalHouses = 24;
/** Rasi chart: houses 0–11; Navamsa: 12–23. Planets may repeat across charts but not within one chart. */
const RASI_HOUSE_INDICES = Array.from({ length: 12 }, (_, i) => i);
const NAVAMSA_HOUSE_INDICES = Array.from({ length: 12 }, (_, i) => i + 12);

function getChartHouseIndices(cellIndex: number): number[] {
  if (cellIndex >= 0 && cellIndex < 12) return RASI_HOUSE_INDICES;
  if (cellIndex >= 12 && cellIndex < totalHouses) return NAVAMSA_HOUSE_INDICES;
  return [];
}

const houseGridOrder = [0, 1, 2, 3, 11, -1, -1, 4, 10, -1, -1, 5, 9, 8, 7, 6];

const parseStoredHoroscope = (stored: Record<number, string>) => {
  const parsed: Record<number, string[]> = {};
  for (let i = 0; i < totalHouses; i++) {
    const raw = stored[i]?.trim();
    if (!raw) {
      parsed[i] = [];
      continue;
    }
    parsed[i] = raw
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);
  }
  return parsed;
};

const serializeHoroscope = (value: Record<number, string[]>) => {
  const serialized: Record<number, string> = {};
  for (let i = 0; i < totalHouses; i++) {
    const unique = Array.from(new Set(value[i] ?? []));
    serialized[i] = unique.join(", ");
  }
  return serialized;
};

const Step4 = () => {
  const t = useTranslations("register");
  const { data, updateData, horoscopeChartData, setHoroscopeChartData, setHoroscopeImageFile } = useRegistration();

  const planetLabelFor = (code: string) => {
    const key = planetLabelKey(code);
    return key ? t(key) : code;
  };
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [horoscopeFile, setHoroscopeFile] = useState<string | null>(null);
  const [horoscopeImageFileLocal, setHoroscopeImageFileLocal] = useState<File | null>(null);
  const [showHoroscopeModal, setShowHoroscopeModal] = useState(false);
  const [horoscopeData, setHoroscopeData] = useState<Record<number, string[]>>(parseStoredHoroscope(horoscopeChartData));
  const [activeCell, setActiveCell] = useState<number | null>(null);
  const [horoscopeModalError, setHoroscopeModalError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (showHoroscopeModal) {
      setHoroscopeData(parseStoredHoroscope(horoscopeChartData));
      setHoroscopeModalError("");
      setActiveCell(null);
    }
  }, [showHoroscopeModal, horoscopeChartData]);

  const wordCount = data.fatherDetails.trim().split(/\s+/).filter(Boolean).length;

  const handleHoroscopeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setHoroscopeFile(file.name);
      setHoroscopeImageFileLocal(file);

    }
  };

  const handleCellClick = (cellIndex: number) => {
    setActiveCell(cellIndex);
    setHoroscopeModalError("");
  };

  const handlePlanetToggle = (cellIndex: number, code: string) => {
    setHoroscopeData((prev) => {
      const existing = prev[cellIndex] ?? [];
      const alreadySelected = existing.includes(code);

      if (!alreadySelected) {
        // Prevent planet duplication within the same chart (Rasi or Navamsa).
        const chartIndices = getChartHouseIndices(cellIndex);
        const usedInAnotherHouseSameChart = chartIndices.some(
          (idx) => idx !== cellIndex && (prev[idx] ?? []).includes(code)
        );

        if (usedInAnotherHouseSameChart) {
          setHoroscopeModalError(
            t("errPlanetDuplicate", { planet: planetLabelFor(code) })
          );
          return prev;
        }
      }

      setHoroscopeModalError("");
      return {
        ...prev,
        [cellIndex]: alreadySelected
          ? existing.filter((item) => item !== code)
          : [...existing, code],
      };
    });
  };

  const handlePlanetRemove = (cellIndex: number, code: string) => {
    setHoroscopeData((prev) => ({
      ...prev,
      [cellIndex]: (prev[cellIndex] ?? []).filter((item) => item !== code),
    }));
    setHoroscopeModalError("");
  };

  const handleSaveHoroscope = () => {
    const housesWithData = Array.from({ length: totalHouses }, (_, index) => horoscopeData[index] ?? [])
      .filter((items) => items.length > 0);
    const hasLagna = housesWithData.some((items) => items.includes("லக்"));

    if (housesWithData.length === 0) {
      setHoroscopeModalError(t("errNoPlanet"));
      return;
    }
    if (!hasLagna) {
      setHoroscopeModalError(t("errLagna"));
      return;
    }

    setHoroscopeChartData(serializeHoroscope(horoscopeData));
    setHoroscopeImageFile(horoscopeImageFileLocal);
    setShowHoroscopeModal(false);
    setActiveCell(null);
    setHoroscopeModalError("");
  };

  const handleNext = () => {
    const nextErrors: Record<string, string> = {};
    if (!data.education) nextErrors.education = t("errEducation");
    if (!data.profession) nextErrors.profession = t("errProfession");
    if (!data.fatherDetails.trim()) nextErrors.fatherDetails = t("errFamily");
    if (!data.birthTime) nextErrors.birthTime = t("errBirthTime");
    if (!data.zodiac) nextErrors.zodiac = t("errZodiac");
    if (!data.star) nextErrors.star = t("errStar");
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setHoroscopeImageFile(horoscopeImageFileLocal);
    router.push("/loginstep/step9");
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
          <Link href="/loginstep/step3" className="text-[#2C2C2C] hover:text-[#8D1B3D] transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="font-sfpro text-xl font-semibold text-[#191919]">{t("signUp")}</h1>
        </div>

        <StepProgress />
        <p className="mt-3 text-sm text-[#6B6B6B]">{t("step4Subtitle")}</p>

        <div className="mt-10">
          <h2 className="font-sfpro text-xl font-semibold text-[#191919] mb-6">{t("basicDetails")}</h2>

          <div className="space-y-5">
            <div>
              <label className="block text-sm text-[#6B6B6B] mb-2">{t("education")}</label>
              <div className="relative">
                <select
                  value={data.education}
                  onChange={(e) => updateData({ education: e.target.value })}
                  className="w-full appearance-none px-4 py-3.5 border border-[#EADDDD] rounded-xl text-sm text-[#2C2C2C] bg-white focus:outline-none focus:border-[#8D1B3D] transition-colors duration-200 cursor-pointer"
                >
                  <option value="">{t("select")}</option>
                  {EDUCATION_OPTIONS.map((e) => (
                    <option key={e.value} value={e.value}>{t(e.key)}</option>
                  ))}
                </select>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6B6B] pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              {errors.education && <p className="mt-1 text-xs text-red-500">{errors.education}</p>}
            </div>

            <div>
              <label className="block text-sm text-[#6B6B6B] mb-2">{t("occupationLabel")}</label>
              <div className="relative">
                <select
                  value={data.profession}
                  onChange={(e) => updateData({ profession: e.target.value })}
                  className="w-full appearance-none px-4 py-3.5 border border-[#EADDDD] rounded-xl text-sm text-[#2C2C2C] bg-white focus:outline-none focus:border-[#8D1B3D] transition-colors duration-200 cursor-pointer"
                >
                  <option value="">{t("select")}</option>
                  {OCCUPATION_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{t(o.key)}</option>
                  ))}
                </select>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6B6B] pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              {errors.profession && <p className="mt-1 text-xs text-red-500">{errors.profession}</p>}
            </div>

            <div>
              <label className="block text-sm text-[#6B6B6B] mb-2">{t("familyDetails")}</label>
              <textarea
                value={data.fatherDetails}
                onChange={(e) => {
                  const words = e.target.value.trim().split(/\s+/).filter(Boolean);
                  if (words.length <= 200) updateData({ fatherDetails: e.target.value });
                }}
                placeholder={t("familyPlaceholder")}
                rows={4}
                className="w-full px-4 py-3.5 border border-[#EADDDD] rounded-xl text-sm text-[#2C2C2C] placeholder:text-[#6B6B6B]/50 bg-white focus:outline-none focus:border-[#8D1B3D] transition-colors duration-200 resize-none"
              />
              <p className="text-right text-xs text-[#6B6B6B] mt-1">
                {t("wordCount", { count: wordCount })}
              </p>
              {errors.fatherDetails && <p className="mt-1 text-xs text-red-500">{errors.fatherDetails}</p>}
            </div>

            <div>
              <label className="block text-sm text-[#6B6B6B] mb-2">
                {t("birthTime")}<span className="text-[#8D1B3D]">*</span>
              </label>
              <input
                type="time"
                value={data.birthTime}
                onChange={(e) => updateData({ birthTime: e.target.value })}
                className="w-full px-4 py-3.5 border border-[#EADDDD] rounded-xl text-sm text-[#2C2C2C] bg-white focus:outline-none focus:border-[#8D1B3D] transition-colors duration-200"
              />
              {errors.birthTime && <p className="mt-1 text-xs text-red-500">{errors.birthTime}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[#6B6B6B] mb-2">
                  {t("zodiac")}<span className="text-[#8D1B3D]">*</span>
                </label>
                <div className="relative">
                  <select
                    value={data.zodiac}
                    onChange={(e) => updateData({ zodiac: e.target.value })}
                    className="w-full appearance-none px-4 py-3.5 border border-[#EADDDD] rounded-xl text-sm text-[#2C2C2C] bg-white focus:outline-none focus:border-[#8D1B3D] transition-colors duration-200 cursor-pointer"
                  >
                    <option value="">{t("select")}</option>
                    {zodiacs.map((z) => <option key={z} value={z}>{z}</option>)}
                  </select>
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6B6B] pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              {errors.zodiac && <p className="mt-1 text-xs text-red-500">{errors.zodiac}</p>}
              </div>

              <div>
                <label className="block text-sm text-[#6B6B6B] mb-2">
                  {t("star")}<span className="text-[#8D1B3D]">*</span>
                </label>
                <div className="relative">
                  <select
                    value={data.star}
                    onChange={(e) => updateData({ star: e.target.value })}
                    className="w-full appearance-none px-4 py-3.5 border border-[#EADDDD] rounded-xl text-sm text-[#2C2C2C] bg-white focus:outline-none focus:border-[#8D1B3D] transition-colors duration-200 cursor-pointer"
                  >
                    <option value="">{t("select")}</option>
                    {stars.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6B6B] pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              {errors.star && <p className="mt-1 text-xs text-red-500">{errors.star}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm text-[#6B6B6B] mb-2">{t("uploadHoroscope")}</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf"
                onChange={handleHoroscopeUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full px-4 py-3.5 border border-[#EADDDD] rounded-xl text-sm text-[#2C2C2C] bg-white flex items-center gap-2 hover:border-[#8D1B3D]/30 transition-colors duration-200"
              >
                {horoscopeFile || t("upload")}
                <FiUpload className="w-4 h-4 text-[#6B6B6B]" />
              </button>
            </div>

            <div className="text-center text-sm text-[#6B6B6B]">{t("or")}</div>

            <div>
              <label className="block text-sm text-[#6B6B6B] mb-2">{t("enterManually")}</label>
              <div className="border border-[#EADDDD] rounded-xl p-4 flex items-center justify-center gap-4">
                <div className="flex gap-3">
                  <div className="w-16 h-20 bg-[#F9F5F5] rounded-lg border border-[#EADDDD] flex items-center justify-center">
                    <span className="text-[#D5CDCD] text-xs text-center">{t("horoscopePlaceholder")}</span>
                  </div>
                  <div className="w-16 h-20 bg-[#F9F5F5] rounded-lg border border-[#EADDDD] flex items-center justify-center">
                    <span className="text-[#D5CDCD] text-xs text-center">{t("horoscopePlaceholder")}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowHoroscopeModal(true)}
                className="w-full mt-2 text-center text-sm text-[#6B6B6B] flex items-center justify-center gap-1 hover:text-[#8D1B3D] transition-colors"
              >
                {t("clickEnterDetails")}
                <FiEdit3 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={handleNext}
          className="w-full py-4 mt-8 bg-[#8D1B3D] hover:bg-[#6B1530] text-white font-semibold text-base rounded-xl transition-all duration-200 active:scale-[0.98] shadow-maroon hover:shadow-maroon-lg hover:-translate-y-px motion-reduce:hover:translate-y-0"
        >
          {t("next")}
        </button>
        </div>
      </div>

      {showHoroscopeModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => { setShowHoroscopeModal(false); setActiveCell(null); }}
          />
          <div className="relative bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-center pt-3 pb-1 sm:hidden">
              <div className="w-10 h-1 bg-[#D5CDCD] rounded-full" />
            </div>

            <div className="px-6 pt-4 pb-4 border-b border-[#8D1B3D]">
              <h3 className="font-sfpro text-xl font-semibold text-[#191919]">{t("enterHoroscopeTitle")}</h3>
            </div>

            <p className="text-center text-sm font-medium text-[#191919] py-4">
              {t("horoscopeModalHint")}
            </p>

            <div className="px-6 pb-4 space-y-4">
              {[
                { titleKey: "rasiChart" as const, start: 0 },
                { titleKey: "navamsaChart" as const, start: 12 },
              ].map((section) => (
                <div key={section.titleKey}>
                  <p className="text-xs font-semibold text-[#6B6B6B] mb-2">{t(section.titleKey)}</p>
                  <div className="grid grid-cols-4 gap-0 rounded-lg border border-[#EADDDD] bg-[#F7F3F3] overflow-visible">
                    {houseGridOrder.map((house, idx) => {
                      if (house === -1) {
                        const isTopLeftCenter = idx === 5;
                        return (
                          <div
                            key={`${section.titleKey}-center-${idx}`}
                            className="min-h-[66px] border border-[#EADDDD] bg-[#F6F1F1]"
                          >
                            {isTopLeftCenter ? (
                              <div className="flex h-full w-full items-center justify-center text-sm text-[#6B6B6B]">
                                {t("grahaNilai")}
                              </div>
                            ) : null}
                          </div>
                        );
                      }

                      const cellIndex = section.start + house;
                      const selected = horoscopeData[cellIndex] ?? [];
                      const houseDisplayIndex = houseGridOrder
                        .slice(0, idx + 1)
                        .filter((h) => h !== -1).length;

                      return (
                        <div key={`${section.titleKey}-${cellIndex}`} className="relative min-h-[66px] border border-[#EADDDD]">
                          <button
                            type="button"
                            onClick={() => handleCellClick(cellIndex)}
                            className={`h-full w-full p-1.5 text-left transition-colors ${
                              activeCell === cellIndex
                                ? "bg-[#F8E8EC]"
                                : "bg-white hover:bg-[#F9F5F5]"
                            }`}
                          >
                            <div className="flex flex-wrap gap-1">
                              {selected.length > 0 ? (
                                selected.map((code) => (
                                  <span
                                    key={code}
                                    className="inline-flex items-center gap-1 rounded-md bg-[#8D1B3D]/10 px-1.5 py-0.5 text-[10px] font-medium text-[#8D1B3D]"
                                  >
                                    {planetLabelFor(code)}
                                    <span
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handlePlanetRemove(cellIndex, code);
                                      }}
                                      className="cursor-pointer"
                                      role="button"
                                      aria-label={t("removePlanetAria")}
                                    >
                                      ×
                                    </span>
                                  </span>
                                ))
                              ) : (
                                <span className="text-[10px] text-[#A59B9B]">
                                  {t("houseNumber", { n: houseDisplayIndex })}
                                </span>
                              )}
                            </div>
                          </button>

                          {activeCell === cellIndex ? (
                            <div className="absolute left-0 top-[calc(100%+4px)] z-20 w-40 overflow-hidden rounded-lg border border-[#EADDDD] bg-white shadow-xl">
                              {PLANET_DEFS.filter((planet) => {
                                if (selected.includes(planet.code)) return true;
                                const chartIdx = getChartHouseIndices(cellIndex);
                                const usedElsewhereSameChart = chartIdx.some(
                                  (idx) =>
                                    idx !== cellIndex &&
                                    (horoscopeData[idx] ?? []).includes(planet.code)
                                );
                                return !usedElsewhereSameChart;
                              }).map((planet) => {
                                const checked = selected.includes(planet.code);
                                return (
                                  <button
                                    type="button"
                                    key={planet.code}
                                    onClick={() => handlePlanetToggle(cellIndex, planet.code)}
                                    className="flex w-full items-center justify-between border-b border-[#F1EAEA] px-3 py-2 text-sm text-[#2C2C2C] last:border-b-0 hover:bg-[#F9F5F5]"
                                  >
                                    <span>{t(planet.labelKey)}</span>
                                    {checked ? <span className="text-[#8D1B3D]">✓</span> : null}
                                  </button>
                                );
                              })}
                            </div>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
              {horoscopeModalError ? (
                <p className="text-xs text-red-500">{horoscopeModalError}</p>
              ) : null}
            </div>

            <div className="px-6 pb-6 pt-2">
              <button
                onClick={handleSaveHoroscope}
                className="w-full py-4 bg-[#8D1B3D] hover:bg-[#6B1530] text-white font-semibold text-base rounded-xl transition-all duration-200 active:scale-[0.98]"
              >
                {t("save")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Step4;
