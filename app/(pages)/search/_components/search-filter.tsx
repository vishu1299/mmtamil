"use client";

import React, { useState, useEffect, useCallback } from "react";
import { GrPowerReset } from "react-icons/gr";
import { AiOutlineMenuFold } from "react-icons/ai";
import { FaHeart } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DualRangeSlider } from "@/components/ui/expension/dual-range-slider";
import { FilterProps } from "../api/api";
import {
  COUNTRY_OPTIONS,
  SRILANKA,
  SRILANKA_DISTRICTS,
} from "@/lib/landing-country-options";
import {
  countryMessageKey,
  districtMessageKey,
  isCountryOption,
} from "@/lib/landing-country-i18n";
import { useAppLocale } from "@/app/_components/i18n/locale-provider";
import { User } from "../type/type";
import { useSearchParams } from "next/navigation";
import { hasLandingSearchParams } from "../lib/landing-search-params";
import { useRouter } from "next/navigation";

interface SearchFilterProps {
  filters: FilterProps;
  /** FEMALE | MALE — applied to `filters.lookingFor` when applying preferences (opposite of logged-in user). */
  matchLookingForGender?: string | null;
  setFilters: React.Dispatch<React.SetStateAction<FilterProps>>;
  /** Current search API results (same list as the carousel); badge + modal use this so counts always match. */
  searchResultProfiles: User[];
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  modalResults: User[];
  searchLoading: boolean;
  onModalAction: (profileId: number, type: "interest" | "ignored") => void;
  hasActivePackage: boolean | null;
  onPackageRequired: () => void;
}

const maritalOptions = [
  { labelKey: "maritalNotMarried", value: "UNMARRIED" },
  { labelKey: "maritalDivorced", value: "DIVORCED" },
  { labelKey: "maritalWidowed", value: "WIDOWED" },
  { labelKey: "maritalSeparated", value: "SEPARATED" },
] as const;

/** 4'0" … 7'11" (every inch), stored as strings e.g. `4'6"` in filters. */
const HEIGHT_FT_MIN = 4;
const HEIGHT_FT_MAX = 7;
const MIN_HEIGHT_INCHES = HEIGHT_FT_MIN * 12 + 0;
const MAX_HEIGHT_INCHES = HEIGHT_FT_MAX * 12 + 11;

function inchesToHeightString(totalInches: number): string {
  const ft = Math.floor(totalInches / 12);
  const inch = totalInches % 12;
  return `${ft}'${inch}\"`;
}

function parseHeightToInches(raw: string): number | null {
  const s = raw.trim();
  if (!s) return null;
  const m = s.match(/^(\d+)['\u2019′]\s*(\d{1,2})(["\u201d″]|$)/);
  if (!m) return null;
  const ft = parseInt(m[1], 10);
  const inch = parseInt(m[2], 10);
  if (inch < 0 || inch > 11) return null;
  return ft * 12 + inch;
}

function heightInchesFromFilters(f: FilterProps): [number, number] {
  const from = (f.heightFrom ?? "").trim();
  const to = (f.heightTo ?? "").trim();
  if (!from && !to) return [MIN_HEIGHT_INCHES, MAX_HEIGHT_INCHES];
  let lo = parseHeightToInches(from);
  let hi = parseHeightToInches(to);
  if (lo === null || hi === null) return [MIN_HEIGHT_INCHES, MAX_HEIGHT_INCHES];
  lo = Math.max(MIN_HEIGHT_INCHES, Math.min(MAX_HEIGHT_INCHES, lo));
  hi = Math.max(MIN_HEIGHT_INCHES, Math.min(MAX_HEIGHT_INCHES, hi));
  if (lo > hi) [lo, hi] = [hi, lo];
  return [lo, hi];
}

const religionOptions = [
  { labelKey: "religionHindu", value: "HINDU" },
  { labelKey: "religionRomanCatholic", value: "ROMAN_CATHOLIC" },
  { labelKey: "religionNonRc", value: "CHRISTIAN" },
  { labelKey: "religionNoReligion", value: "NO_RELIGION" },
  { labelKey: "religionOther", value: "OTHER" },
] as const;

/** Values are lowercased for client-side matching against `profile.motherTongue`. */
const motherTongueOptions = [
  { labelKey: "motherTongueTamil", value: "TAMIL" },
  { labelKey: "motherTongueEnglish", value: "ENGLISH" },
  { labelKey: "motherTongueSinhala", value: "SINHALA" },
] as const;

const ALLOWED_MOTHER_TONGUE_VALUES: Set<string> = new Set(
  motherTongueOptions.map((o) => o.value)
);

const AGE_MIN = 18;
const AGE_MAX = 80;

const getMultiValues = (raw: string | null | undefined): string[] =>
  (raw ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const casteOptions = [
  { labelKey: "casteBramanar", value: "Bramanar" },
  { labelKey: "casteVellalar", value: "Vellalar" },
  { labelKey: "casteViswakulam", value: "Viswakulam" },
  { labelKey: "casteGurukulam", value: "Gurukulam" },
  { labelKey: "casteKaraiyar", value: "Karaiyar" },
  { labelKey: "casteSandar", value: "Sandar" },
  { labelKey: "casteSengunthar", value: "Sengunthar" },
  { labelKey: "casteKoviyar", value: "Koviyar" },
  { labelKey: "casteVannar", value: "Vannar" },
  { labelKey: "castePallar", value: "Pallar" },
  { labelKey: "casteParaiyar", value: "Paraiyar" },
  { labelKey: "casteNalavar", value: "Nalavar" },
  { labelKey: "casteThaddar", value: "Thaddar" },
  { labelKey: "casteKollar", value: "Kollar" },
  { labelKey: "casteAmpaddar", value: "Ampaddar" },
  { labelKey: "casteThevar", value: "Thevar" },
  { labelKey: "casteNadaar", value: "Nadaar" },
  { labelKey: "casteThachchar", value: "Thachchar" },
  { labelKey: "casteChettiyar", value: "Chettiyar" },
  { labelKey: "castePandaram", value: "Pandaram" },
  { labelKey: "casteKudiyanavar", value: "Kudiyanavar" },
  { labelKey: "casteMuthaliyar", value: "Muthaliyar" },
  { labelKey: "casteKallar", value: "Kallar" },
  { labelKey: "casteAgamadiyar", value: "Agamadiyar" },
  { labelKey: "casteMuththuraja", value: "Muththuraja" },
  { labelKey: "casteNoCaste", value: "No Caste" },
  { labelKey: "casteOther", value: "Other" },
] as const;

const qualificationOptions = [
  { labelKey: "qualificationDoctorate", value: "Doctorate Degree" },
  { labelKey: "qualificationMaster", value: "Master Degree" },
  { labelKey: "qualificationHigherDiploma", value: "Higher Diploma" },
  { labelKey: "qualificationDiploma", value: "Diploma" },
  { labelKey: "qualificationAL", value: "Advanced Level (A/L)" },
  { labelKey: "qualificationOL", value: "Ordinary Level (O/L)" },
  { labelKey: "qualificationOther", value: "Other" },
] as const;

const STORAGE_KEY = "search-filter-preferences";

const getUiGenderPreference = (
  gender: string | null | undefined
): "Male" | "Female" | "" => {
  const g = (gender ?? "").trim().toLowerCase();
  if (g === "female" || g === "f") return "Male";
  if (g === "male" || g === "m") return "Female";
  return "";
};

const SearchFilter: React.FC<SearchFilterProps> = ({
  filters,
  matchLookingForGender,
  setFilters,
  searchResultProfiles,
  searchQuery,
  setSearchQuery,
  modalResults,
  searchLoading,
  onModalAction,
  hasActivePackage,
  onPackageRequired,
}) => {
  const t = useTranslations("searchFilter");
  /** Country & district display keys live under `landing` (shared with hero). */
  const tLand = useTranslations("landing");
  const tc = useTranslations("common");
  const { locale } = useAppLocale();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [allProfilesOpen, setAllProfilesOpen] = useState(false);
  const [uiLookingFor, setUiLookingFor] = useState<"Male" | "Female" | "">("");
  const [religionSearch, setReligionSearch] = useState("");
  const [motherTongueSearch, setMotherTongueSearch] = useState("");
  const [casteSearch, setCasteSearch] = useState("");
  const [qualificationSearch, setQualificationSearch] = useState("");
  const [countrySearch, setCountrySearch] = useState("");
  const urlParams = useSearchParams();

  const tryOpenProfileDetails = (profileId: number) => {
    if (hasActivePackage === null) return;
    if (!hasActivePackage) {
      onPackageRequired();
      return;
    }
    router.push(`/search/${profileId}`);
  };

  useEffect(() => {
    if (hasLandingSearchParams(urlParams)) return;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<FilterProps>;
        const { lookingFor: _ignored, ...rest } = parsed;
        setFilters((prev) => ({ ...prev, ...rest }));
      }
    } catch {
      // ignore
    }
  }, [setFilters, urlParams]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("access-token");
      if (!raw) {
        setUiLookingFor("");
        return;
      }
      const parsed = JSON.parse(raw) as {
        data?: { result?: { profile?: { gender?: string | null } } };
      };
      const gender = parsed?.data?.result?.profile?.gender;
      setUiLookingFor(getUiGenderPreference(gender));
    } catch {
      setUiLookingFor("");
    }
  }, []);

  /** Keep API `lookingFor` aligned with opposite-gender matching when viewer is known. */
  useEffect(() => {
    if (!matchLookingForGender?.trim()) return;
    const v = matchLookingForGender.trim().toUpperCase();
    setFilters((prev) => {
      if (prev.lookingFor === v) return prev;
      return { ...prev, lookingFor: v };
    });
  }, [matchLookingForGender, setFilters]);

  const persistFilters = useCallback(
    (updated: FilterProps) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
    },
    []
  );

  /** Drop mother tongue values no longer offered (e.g. after narrowing the list). */
  useEffect(() => {
    const raw = getMultiValues(filters.motherTongue);
    const pruned = raw.filter((v) => ALLOWED_MOTHER_TONGUE_VALUES.has(v));
    const joined = pruned.join(",");
    if (joined !== (filters.motherTongue ?? "").trim()) {
      setFilters((prev) => {
        const updated = { ...prev, motherTongue: joined };
        persistFilters(updated);
        return updated;
      });
    }
  }, [filters.motherTongue, setFilters, persistFilters]);

  /** Clamp age to slider bounds (e.g. old saved filters used 0–100). */
  useEffect(() => {
    let lo = Math.max(AGE_MIN, Math.min(AGE_MAX, filters.ageFrom));
    let hi = Math.max(AGE_MIN, Math.min(AGE_MAX, filters.ageTo));
    if (lo > hi) [lo, hi] = [hi, lo];
    if (lo !== filters.ageFrom || hi !== filters.ageTo) {
      setFilters((prev) => {
        const updated = { ...prev, ageFrom: lo, ageTo: hi };
        persistFilters(updated);
        return updated;
      });
    }
  }, [filters.ageFrom, filters.ageTo, setFilters, persistFilters]);

  const handleFilterChange = (
    field: keyof FilterProps,
    value: string | number
  ) => {
    setFilters((prev) => {
      const updated = { ...prev, [field]: value };
      persistFilters(updated);
      return updated;
    });
  };

  const resetFilters = () => {
    const lf = matchLookingForGender?.trim().toUpperCase() ?? "";
    const defaults: FilterProps = {
      from: "",
      city: "",
      ageFrom: AGE_MIN,
      ageTo: AGE_MAX,
      lookingFor: lf,
      maritalStatus: "",
      heightFrom: "",
      heightTo: "",
      religion: "",
      motherTongue: "",
      caste: "",
      qualification: "",
    };
    setFilters(defaults);
    persistFilters(defaults);
  };

  const showPeople = () => {
    if (matchLookingForGender?.trim()) {
      const v = matchLookingForGender.trim().toUpperCase();
      setFilters((prev) => {
        const updated = { ...prev, lookingFor: v };
        persistFilters(updated);
        return updated;
      });
    }
    setOpen(false);
  };

  const toggleMarital = (value: string) => {
    setFilters((prev) => {
      const updated = { ...prev, maritalStatus: prev.maritalStatus === value ? "" : value };
      persistFilters(updated);
      return updated;
    });
  };

  const handleAgeRangeChange = (values: number[]) => {
    if (!Array.isArray(values) || values.length < 2) return;
    const [from, to] = values;
    setFilters((prev) => {
      const updated = { ...prev, ageFrom: from, ageTo: to };
      persistFilters(updated);
      return updated;
    });
  };

  const handleHeightRangeChange = (values: number[]) => {
    if (!Array.isArray(values) || values.length < 2) return;
    const [a, b] = values;
    let lo = Math.min(Math.round(a), Math.round(b));
    let hi = Math.max(Math.round(a), Math.round(b));
    lo = Math.max(MIN_HEIGHT_INCHES, Math.min(MAX_HEIGHT_INCHES, lo));
    hi = Math.max(MIN_HEIGHT_INCHES, Math.min(MAX_HEIGHT_INCHES, hi));
    setFilters((prev) => {
      const updated =
        lo === MIN_HEIGHT_INCHES && hi === MAX_HEIGHT_INCHES
          ? { ...prev, heightFrom: "", heightTo: "" }
          : {
              ...prev,
              heightFrom: inchesToHeightString(lo),
              heightTo: inchesToHeightString(hi),
            };
      persistFilters(updated);
      return updated;
    });
  };

  const toggleReligion = (value: string) => {
    setFilters((prev) => {
      const selected = new Set(getMultiValues(prev.religion));
      if (selected.has(value)) {
        selected.delete(value);
      } else {
        selected.add(value);
      }
      const ordered = religionOptions
        .map((opt) => opt.value)
        .filter((optValue) => selected.has(optValue));
      const updated = { ...prev, religion: ordered.join(",") };
      persistFilters(updated);
      return updated;
    });
  };

  const toggleMotherTongue = (value: string) => {
    setFilters((prev) => {
      const selected = new Set(getMultiValues(prev.motherTongue));
      if (selected.has(value)) {
        selected.delete(value);
      } else {
        selected.add(value);
      }
      const ordered = motherTongueOptions
        .map((opt) => opt.value)
        .filter((optValue) => selected.has(optValue));
      const updated = { ...prev, motherTongue: ordered.join(",") };
      persistFilters(updated);
      return updated;
    });
  };

  const toggleCaste = (value: string) => {
    setFilters((prev) => {
      const selected = new Set(getMultiValues(prev.caste));
      if (selected.has(value)) {
        selected.delete(value);
      } else {
        selected.add(value);
      }
      const ordered = casteOptions
        .filter((o) => selected.has(o.value))
        .map((o) => o.value);
      const updated = { ...prev, caste: ordered.join(",") };
      persistFilters(updated);
      return updated;
    });
  };

  const toggleQualification = (value: string) => {
    setFilters((prev) => {
      const selected = new Set(getMultiValues(prev.qualification));
      if (selected.has(value)) {
        selected.delete(value);
      } else {
        selected.add(value);
      }
      const ordered = qualificationOptions
        .filter((opt) => selected.has(opt.value as string))
        .map((opt) => opt.value);
      const updated = {
        ...prev,
        qualification: ordered.join(","),
      };
      persistFilters(updated);
      return updated;
    });
  };

  const toggleCountry = (value: string) => {
    setFilters((prev) => {
      const selected = new Set(getMultiValues(prev.from));
      if (selected.has(value)) {
        selected.delete(value);
      } else {
        selected.add(value);
      }
      const ordered = COUNTRY_OPTIONS.filter((optValue) => selected.has(optValue));
      const hasSriLanka = ordered.includes(SRILANKA);
      const updated = {
        ...prev,
        from: ordered.join(","),
        city: hasSriLanka ? prev.city : "",
      };
      persistFilters(updated);
      return updated;
    });
  };

  const activeMaritalLabelKey = maritalOptions.find(
    (o) => o.value === filters.maritalStatus
  )?.labelKey;
  const heightSliderValue = heightInchesFromFilters(filters);
  const hasHeightFilter = (() => {
    const [lo, hi] = heightInchesFromFilters(filters);
    const hasStrings = Boolean(
      (filters.heightFrom ?? "").trim() && (filters.heightTo ?? "").trim()
    );
    return (
      hasStrings &&
      !(lo === MIN_HEIGHT_INCHES && hi === MAX_HEIGHT_INCHES)
    );
  })();
  const selectedReligions = getMultiValues(filters.religion);
  const activeReligionLabelKeys = religionOptions
    .filter((o) => selectedReligions.includes(o.value))
    .map((o) => o.labelKey);
  const filteredReligionOptions = religionOptions.filter((opt) =>
    t(opt.labelKey).toLowerCase().includes(religionSearch.trim().toLowerCase())
  );
  const selectedMotherTongues = getMultiValues(filters.motherTongue);
  const activeMotherTongueLabelKeys = motherTongueOptions
    .filter((o) => selectedMotherTongues.includes(o.value))
    .map((o) => o.labelKey);
  const filteredMotherTongueOptions = motherTongueOptions.filter((opt) =>
    t(opt.labelKey)
      .toLowerCase()
      .includes(motherTongueSearch.trim().toLowerCase())
  );
  const selectedCastes = getMultiValues(filters.caste);
  const filteredCasteOptions = casteOptions.filter((opt) =>
    t(opt.labelKey)
      .toLowerCase()
      .includes(casteSearch.trim().toLowerCase())
  );
  const selectedQualifications = getMultiValues(filters.qualification);
  const activeQualificationLabels = selectedQualifications.map((value) => {
    const match = qualificationOptions.find((opt) => opt.value === value);
    return match ? t(match.labelKey) : value;
  });
  const filteredQualificationOptions = qualificationOptions.filter((opt) =>
    t(opt.labelKey)
      .toLowerCase()
      .includes(qualificationSearch.trim().toLowerCase())
  );
  const selectedCountries = getMultiValues(filters.from);
  const filteredCountryOptions = COUNTRY_OPTIONS.filter((opt) =>
    opt.toLowerCase().includes(countrySearch.trim().toLowerCase())
  );

  const chips: { label: string; onClear: () => void }[] = [];
  if (activeMaritalLabelKey)
    chips.push({
      label: t(activeMaritalLabelKey),
      onClear: () => toggleMarital(filters.maritalStatus),
    });
  if (filters.ageFrom !== AGE_MIN || filters.ageTo !== AGE_MAX) {
    const ageLabel = t("ageChip", { from: filters.ageFrom, to: filters.ageTo });
    chips.push({
      label: ageLabel,
      onClear: () => {
        setFilters((prev) => {
          const updated = { ...prev, ageFrom: AGE_MIN, ageTo: AGE_MAX };
          persistFilters(updated);
          return updated;
        });
      },
    });
  }
  if (hasHeightFilter)
    chips.push({
      label: `${filters.heightFrom} – ${filters.heightTo}`,
      onClear: () => {
        setFilters((prev) => {
          const updated = { ...prev, heightFrom: "", heightTo: "" };
          persistFilters(updated);
          return updated;
        });
      },
    });
  activeReligionLabelKeys.forEach((labelKey) => {
    const value = religionOptions.find((opt) => opt.labelKey === labelKey)?.value;
    if (!value) return;
    chips.push({ label: t(labelKey), onClear: () => toggleReligion(value) });
  });
  activeMotherTongueLabelKeys.forEach((labelKey) => {
    const value = motherTongueOptions.find(
      (opt) => opt.labelKey === labelKey
    )?.value;
    if (!value) return;
    chips.push({ label: t(labelKey), onClear: () => toggleMotherTongue(value) });
  });
  selectedCastes.forEach((value) => {
    const opt = casteOptions.find((o) => o.value === value);
    chips.push({
      label: opt ? t(opt.labelKey) : value,
      onClear: () => toggleCaste(value),
    });
  });
  activeQualificationLabels.forEach((label) => {
    const rawValue =
      qualificationOptions.find((opt) => t(opt.labelKey) === label)?.value ?? label;
    chips.push({
      label,
      onClear: () => toggleQualification(rawValue),
    });
  });
  selectedCountries.forEach((country) => {
    chips.push({
      label: country,
      onClear: () => toggleCountry(country),
    });
  });
  if (filters.city?.trim())
    chips.push({
      label: filters.city.trim(),
      onClear: () => handleFilterChange("city", ""),
    });

  const getAge = (dateOfBirth?: string | null) => {
    if (!dateOfBirth) return "-";
    const dob = new Date(dateOfBirth);
    if (Number.isNaN(dob.getTime())) return "-";
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age > 0 ? age : "-";
  };

  const profileListCount = searchResultProfiles.length;

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => {
          setAllProfilesOpen(true);
        }}
        className="inline-flex shrink-0 items-center rounded-full border border-border-soft bg-white px-3 py-1 text-xs font-semibold text-maroon shadow-sm transition-all duration-200 hover:bg-soft-rose/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon/30 focus-visible:ring-offset-2"
        aria-label={t("ariaShowFilteredProfiles")}
      >
        {t("profilesCount", { count: profileListCount })}
      </button>
      <Dialog open={allProfilesOpen} onOpenChange={setAllProfilesOpen}>
        <DialogContent className="flex h-[min(620px,86vh)] max-h-[min(620px,86vh)] w-[calc(100vw-2rem)] flex-col gap-0 overflow-hidden rounded-2xl border-border-soft p-0 sm:max-w-3xl">
          <div className="flex-shrink-0 border-b border-border-soft/80 bg-cream/30 px-6 pb-4 pt-6">
            <DialogHeader>
              <DialogTitle className="text-lg font-playfair font-semibold text-maroon">
                {t("filteredProfilesTitle", {
                  count: profileListCount,
                })}
              </DialogTitle>
            </DialogHeader>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-5 py-5">
            {profileListCount === 0 ? (
              <p className="text-[#6B6B6B] text-sm py-4">{t("noProfilesFound")}</p>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {searchResultProfiles.map((profile, gridIdx) => {
                  const fullName =
                    [profile.profile?.firstName, profile.profile?.lastName]
                      .filter(Boolean)
                      .join(" ")
                      .trim() || profile.userName || "-";
                  const age = getAge(profile.profile?.dateOfBirth);
                  const profession = profile.profile?.profession || "-";
                  const imageSrc = profile.profile?.profilePicture
                    ? profile.profile.profilePicture.startsWith("http")
                      ? profile.profile.profilePicture
                      : `${process.env.NEXT_PUBLIC_IMAGE_URL ?? ""}${profile.profile.profilePicture}`
                    : "/assets/images/default-user.png";
                  return (
                    <button
                      key={`search-grid-${profile.id}-${gridIdx}`}
                      type="button"
                      onClick={() => tryOpenProfileDetails(profile.id)}
                      className="rounded-xl border border-border-soft bg-white p-3 text-left shadow-sm transition-all duration-200 hover:border-maroon/30 hover:shadow-md"
                    >
                      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-gray-100">
                        <img
                          src={imageSrc}
                          alt={fullName}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <h4 className="mt-2 truncate text-sm font-semibold text-[#2C2C2C]">
                        {fullName}, {age}
                      </h4>
                      <p className="truncate text-xs text-[#6B6B6B]">{profession}</p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      {chips.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {chips.map((chip, chipIndex) => (
            <button
              key={`filter-chip-${chipIndex}`}
              type="button"
              onClick={chip.onClear}
              className="flex items-center gap-1.5 whitespace-nowrap rounded-full border border-maroon px-4 py-1.5 text-sm font-medium text-maroon shadow-sm transition-all duration-200 ease-out hover:-translate-y-px hover:bg-maroon/5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon/30 focus-visible:ring-offset-2 active:translate-y-0 active:scale-[0.98] motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100"
            >
              {chip.label}
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          ))}
        </div>
      )}
      <button
        type="button"
        onClick={() => setSearchOpen(true)}
        className="-m-1 cursor-pointer rounded-lg p-2 text-maroon transition-all duration-200 ease-out hover:bg-soft-rose/50 hover:text-maroon-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon/30 focus-visible:ring-offset-2 whitespace-nowrap"
        aria-label={t("ariaSearchProfile")}
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="flex h-[min(560px,80vh)] max-h-[min(560px,80vh)] w-[calc(100vw-2rem)] flex-col gap-0 overflow-hidden rounded-2xl border-border-soft p-0 sm:max-w-xl">
          <div className="flex-shrink-0 border-b border-border-soft/80 bg-cream/30 px-6 pb-4 pt-6">
            <DialogHeader>
              <DialogTitle className="text-lg font-playfair font-semibold text-maroon">
                {t("searchProfileTitle")}
              </DialogTitle>
            </DialogHeader>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("searchProfilePlaceholder")}
              className="mt-4 w-full rounded-xl border border-border-soft bg-white px-4 py-3 text-sm text-[#2C2C2C] shadow-sm transition-[border-color,box-shadow] duration-200 placeholder:text-[#6B6B6B]/70 focus:outline-none focus:border-maroon/40 focus:ring-2 focus:ring-maroon/12 hover:border-maroon/20"
            />
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-6 pt-2 pb-6">
            <div className="space-y-0 divide-y divide-gray-100">
              {searchLoading && (
                <p className="text-[#6B6B6B] text-sm py-4">{tc("loading")}</p>
              )}

              {!searchLoading &&
                modalResults.map((profile, modalIdx) => {
                  const fullName =
                    [profile.profile?.firstName, profile.profile?.lastName]
                      .filter(Boolean)
                      .join(" ")
                      .trim() || profile.userName || "-";
                  const age = getAge(profile.profile?.dateOfBirth);
                  const profession = profile.profile?.profession || "-";

                  return (
                    <div
                      key={`search-modal-${profile.id}-${modalIdx}`}
                      className="-mx-2 flex items-center justify-between rounded-xl px-2 py-4 transition-colors duration-200 first:pt-3 hover:bg-soft-rose/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon/20 focus-visible:ring-inset"
                    >
                      <button
                        type="button"
                        onClick={() => tryOpenProfileDetails(profile.id)}
                        className="flex min-w-0 flex-1 items-center gap-3 rounded-lg text-left outline-none focus-visible:ring-2 focus-visible:ring-maroon/20"
                      >
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-border-soft bg-gray-50 shadow-sm ring-2 ring-white">
                          <img
                            src={
                              profile.profile?.profilePicture
                                ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${profile.profile.profilePicture}`
                                : "/assets/images/default-user.png"
                            }
                            alt={fullName}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-semibold text-[#2C2C2C] text-[15px] truncate">
                            {fullName}, {age}
                          </h3>
                          <p className="text-[#6B6B6B] text-sm truncate">{profession}</p>
                        </div>
                      </button>
                      <div className="flex items-center gap-3 pl-3 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => onModalAction(profile.id, "interest")}
                          className="flex h-11 w-11 items-center justify-center rounded-full bg-maroon shadow-sm transition-all duration-200 ease-out hover:bg-maroon/90 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon/40 focus-visible:ring-offset-2 active:scale-95 motion-reduce:active:scale-100"
                        >
                          <FaHeart className="text-[15px] text-white" aria-hidden />
                        </button>
                        <button
                          type="button"
                          onClick={() => onModalAction(profile.id, "ignored")}
                          className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-border-soft bg-white transition-all duration-200 ease-out hover:border-maroon/35 hover:bg-cream/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon/25 focus-visible:ring-offset-2 active:scale-95 motion-reduce:active:scale-100"
                        >
                          <RxCross2 className="text-[#6B6B6B] text-lg" />
                        </button>
                      </div>
                    </div>
                  );
                })}

              {!searchLoading && modalResults.length === 0 && (
                <p className="text-[#6B6B6B] text-sm py-4">{t("noProfilesFound")}</p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div
            role="button"
            tabIndex={0}
            className="flex cursor-pointer items-center gap-x-2 whitespace-nowrap rounded-lg px-2 py-1.5 text-sm font-semibold text-maroon transition-all duration-200 ease-out hover:bg-soft-rose/45 hover:text-maroon-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon/30 focus-visible:ring-offset-2"
            onClick={() => setOpen(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setOpen(true);
              }
            }}
          >
            {t("filterButton")}
            <AiOutlineMenuFold className="text-xl" aria-hidden />
          </div>
        </DialogTrigger>
        <DialogContent className="max-h-[85vh] overflow-y-auto rounded-2xl border-border-soft p-6 sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="font-playfair text-xl font-semibold tracking-tight text-maroon">
              {t("searchPreferencesTitle")}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-3 space-y-6">
            {/* Marital Status */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#2C2C2C]">
                {t("maritalStatusLabel")}
              </label>
              <div className="flex flex-wrap gap-2">
                {maritalOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => toggleMarital(opt.value)}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon/25 focus-visible:ring-offset-2 motion-reduce:transition-colors ${
                      filters.maritalStatus === opt.value
                        ? "border-maroon bg-maroon/10 text-maroon shadow-sm"
                        : "border-border-soft text-[#6B6B6B] hover:border-maroon/35 hover:bg-cream/80 active:scale-[0.98] motion-reduce:active:scale-100"
                    }`}
                  >
                    {t(opt.labelKey)}
                  </button>
                ))}
              </div>
            </div>

            {/* Age Range */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#2C2C2C]">
                {t("ageRangeLabel")}
              </label>
              <div className="rounded-xl border border-border-soft bg-[#FAFAFA] p-4 shadow-sm transition-shadow duration-200 hover:shadow-md">
                <DualRangeSlider
                  value={[filters.ageFrom, filters.ageTo]}
                  min={AGE_MIN}
                  max={AGE_MAX}
                  step={1}
                  minStepsBetweenThumbs={1}
                  onValueChange={handleAgeRangeChange}
                />
                <div className="mt-3 flex items-center justify-between text-xs text-[#6B6B6B]">
                  <span>{AGE_MIN}</span>
                  <span className="font-medium text-[#2C2C2C]">
                    {t("ageRangeValue", { from: filters.ageFrom, to: filters.ageTo })}
                  </span>
                  <span>{AGE_MAX}</span>
                </div>
              </div>
            </div>

            {/* Height Range */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#2C2C2C]">
                {t("heightLabel")}
              </label>
              <div className="rounded-xl border border-border-soft bg-[#FAFAFA] p-4 shadow-sm transition-shadow duration-200 hover:shadow-md">
                <DualRangeSlider
                  value={heightSliderValue}
                  min={MIN_HEIGHT_INCHES}
                  max={MAX_HEIGHT_INCHES}
                  step={1}
                  minStepsBetweenThumbs={0}
                  onValueChange={handleHeightRangeChange}
                />
                <div className="mt-3 flex items-center justify-between text-xs text-[#6B6B6B]">
                  <span>{inchesToHeightString(MIN_HEIGHT_INCHES)}</span>
                  <span className="font-medium text-[#2C2C2C]">
                    {hasHeightFilter
                      ? `${filters.heightFrom} – ${filters.heightTo}`
                      : t("allHeights")}
                  </span>
                  <span>{inchesToHeightString(MAX_HEIGHT_INCHES)}</span>
                </div>
              </div>
            </div>

            {/* Religion */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#2C2C2C]">
                {t("religionLabel")}
              </label>
              <div className="rounded-2xl border border-border-soft bg-[#F8F8F8] p-3 shadow-soft">
                <div className="relative mb-3">
                  <input
                    type="text"
                    value={religionSearch}
                    onChange={(e) => setReligionSearch(e.target.value)}
                    placeholder={t("searchReligionPlaceholder")}
                    className="w-full rounded-xl border border-border-soft bg-white py-2.5 pl-4 pr-10 text-sm text-[#2C2C2C] shadow-sm transition-[border-color,box-shadow] duration-200 placeholder:text-[#6B6B6B]/75 focus:border-maroon/35 focus:outline-none focus:ring-2 focus:ring-maroon/15"
                  />
                  <svg
                    className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B6B6B]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                    />
                  </svg>
                </div>

                <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
                  {filteredReligionOptions.map((opt) => {
                    const selected = selectedReligions.includes(opt.value);
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => toggleReligion(opt.value)}
                        className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon/25 focus-visible:ring-offset-2 ${
                          selected
                            ? "border-maroon/35 bg-soft-rose/55 text-[#2C2C2C] shadow-sm"
                            : "border-border-soft bg-white text-[#2C2C2C] hover:border-maroon/20 hover:bg-cream/70"
                        }`}
                      >
                        <span className="text-sm font-medium">{t(opt.labelKey)}</span>
                        <span
                          className={`flex h-6 w-6 items-center justify-center rounded-md border text-[13px] font-bold transition-colors ${
                            selected
                              ? "border-maroon bg-maroon text-white"
                              : "border-[#8F8F8F] bg-white text-transparent"
                          }`}
                        >
                          ✓
                        </span>
                      </button>
                    );
                  })}
                  {filteredReligionOptions.length === 0 && (
                    <p className="py-3 text-center text-sm text-[#6B6B6B]">
                      {t("noReligionsFound")}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Mother Tongue */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#2C2C2C]">
                {t("motherTongueLabel")}
              </label>
              <div className="rounded-2xl border border-border-soft bg-[#F8F8F8] p-3 shadow-soft">
                <div className="relative mb-3">
                  <input
                    type="text"
                    value={motherTongueSearch}
                    onChange={(e) => setMotherTongueSearch(e.target.value)}
                    placeholder={t("searchMotherTonguePlaceholder")}
                    className="w-full rounded-xl border border-border-soft bg-white py-2.5 pl-4 pr-10 text-sm text-[#2C2C2C] shadow-sm transition-[border-color,box-shadow] duration-200 placeholder:text-[#6B6B6B]/75 focus:border-maroon/35 focus:outline-none focus:ring-2 focus:ring-maroon/15"
                  />
                  <svg
                    className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B6B6B]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                    />
                  </svg>
                </div>

                <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
                  {filteredMotherTongueOptions.map((opt) => {
                    const selected = selectedMotherTongues.includes(opt.value);
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => toggleMotherTongue(opt.value)}
                        className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon/25 focus-visible:ring-offset-2 ${
                          selected
                            ? "border-maroon/35 bg-soft-rose/55 text-[#2C2C2C] shadow-sm"
                            : "border-border-soft bg-white text-[#2C2C2C] hover:border-maroon/20 hover:bg-cream/70"
                        }`}
                      >
                        <span className="text-sm font-medium">{t(opt.labelKey)}</span>
                        <span
                          className={`flex h-6 w-6 items-center justify-center rounded-md border text-[13px] font-bold transition-colors ${
                            selected
                              ? "border-maroon bg-maroon text-white"
                              : "border-[#8F8F8F] bg-white text-transparent"
                          }`}
                        >
                          ✓
                        </span>
                      </button>
                    );
                  })}
                  {filteredMotherTongueOptions.length === 0 && (
                    <p className="py-3 text-center text-sm text-[#6B6B6B]">
                      {t("noMotherTongueFound")}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Caste */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#2C2C2C]">
                {t("casteLabel")}
              </label>
              <div className="rounded-2xl border border-border-soft bg-[#F8F8F8] p-3 shadow-soft">
                <div className="relative mb-3">
                  <input
                    type="text"
                    value={casteSearch}
                    onChange={(e) => setCasteSearch(e.target.value)}
                    placeholder={t("searchCastePlaceholder")}
                    className="w-full rounded-xl border border-border-soft bg-white py-2.5 pl-4 pr-10 text-sm text-[#2C2C2C] shadow-sm transition-[border-color,box-shadow] duration-200 placeholder:text-[#6B6B6B]/75 focus:border-maroon/35 focus:outline-none focus:ring-2 focus:ring-maroon/15"
                  />
                  <svg
                    className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B6B6B]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                    />
                  </svg>
                </div>

                <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
                  {filteredCasteOptions.map((opt) => {
                    const selected = selectedCastes.includes(opt.value);
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => toggleCaste(opt.value)}
                        className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon/25 focus-visible:ring-offset-2 ${
                          selected
                            ? "border-maroon/35 bg-soft-rose/55 text-[#2C2C2C] shadow-sm"
                            : "border-border-soft bg-white text-[#2C2C2C] hover:border-maroon/20 hover:bg-cream/70"
                        }`}
                      >
                        <span className="text-sm font-medium">{t(opt.labelKey)}</span>
                        <span
                          className={`flex h-6 w-6 items-center justify-center rounded-md border text-[13px] font-bold transition-colors ${
                            selected
                              ? "border-maroon bg-maroon text-white"
                              : "border-[#8F8F8F] bg-white text-transparent"
                          }`}
                        >
                          ✓
                        </span>
                      </button>
                    );
                  })}
                  {filteredCasteOptions.length === 0 && (
                    <p className="py-3 text-center text-sm text-[#6B6B6B]">
                      {t("noCasteFound")}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Qualification */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#2C2C2C]">
                {t("qualificationLabel")}
              </label>
              <div className="rounded-2xl border border-border-soft bg-[#F8F8F8] p-3 shadow-soft">
                <div className="relative mb-3">
                  <input
                    type="text"
                    value={qualificationSearch}
                    onChange={(e) => setQualificationSearch(e.target.value)}
                    placeholder={t("searchQualificationPlaceholder")}
                    className="w-full rounded-xl border border-border-soft bg-white py-2.5 pl-4 pr-10 text-sm text-[#2C2C2C] shadow-sm transition-[border-color,box-shadow] duration-200 placeholder:text-[#6B6B6B]/75 focus:border-maroon/35 focus:outline-none focus:ring-2 focus:ring-maroon/15"
                  />
                  <svg
                    className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B6B6B]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                    />
                  </svg>
                </div>

                <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
                  {filteredQualificationOptions.map((opt) => {
                    const selected = selectedQualifications.includes(opt.value);
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => toggleQualification(opt.value)}
                        className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon/25 focus-visible:ring-offset-2 ${
                          selected
                            ? "border-maroon/35 bg-soft-rose/55 text-[#2C2C2C] shadow-sm"
                            : "border-border-soft bg-white text-[#2C2C2C] hover:border-maroon/20 hover:bg-cream/70"
                        }`}
                      >
                        <span className="text-sm font-medium">{t(opt.labelKey)}</span>
                        <span
                          className={`flex h-6 w-6 items-center justify-center rounded-md border text-[13px] font-bold transition-colors ${
                            selected
                              ? "border-maroon bg-maroon text-white"
                              : "border-[#8F8F8F] bg-white text-transparent"
                          }`}
                        >
                          ✓
                        </span>
                      </button>
                    );
                  })}
                  {filteredQualificationOptions.length === 0 && (
                    <p className="py-3 text-center text-sm text-[#6B6B6B]">
                      {t("noQualificationFound")}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Country */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#2C2C2C]">
                {t("countryLabel")}
              </label>
              <div className="rounded-2xl border border-border-soft bg-[#F8F8F8] p-3 shadow-soft">
                <div className="relative mb-3">
                  <input
                    key={`country-search-ph-${locale}`}
                    type="text"
                    value={countrySearch}
                    onChange={(e) => setCountrySearch(e.target.value)}
                    placeholder={t("searchCountryPlaceholder")}
                    className="w-full rounded-xl border border-border-soft bg-white py-2.5 pl-4 pr-10 text-sm text-[#2C2C2C] shadow-sm transition-[border-color,box-shadow] duration-200 placeholder:text-[#6B6B6B]/75 focus:border-maroon/35 focus:outline-none focus:ring-2 focus:ring-maroon/15"
                  />
                  <svg
                    className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B6B6B]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                    />
                  </svg>
                </div>
                <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
                  {filteredCountryOptions.map((opt, countryIdx) => {
                    const countryValue =
                      typeof opt === "string" ? opt : String(opt);
                    const selected = selectedCountries.includes(countryValue);
                    return (
                      <button
                        key={`country-${countryIdx}-${countryValue}`}
                        type="button"
                        onClick={() => toggleCountry(countryValue)}
                        className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon/25 focus-visible:ring-offset-2 ${
                          selected
                            ? "border-maroon/35 bg-soft-rose/55 text-[#2C2C2C] shadow-sm"
                            : "border-border-soft bg-white text-[#2C2C2C] hover:border-maroon/20 hover:bg-cream/70"
                        }`}
                      >
                        <span className="text-sm font-medium">
                          {isCountryOption(countryValue)
                            ? tLand(countryMessageKey[countryValue])
                            : countryValue}
                        </span>
                        <span
                          className={`flex h-6 w-6 items-center justify-center rounded-md border text-[13px] font-bold transition-colors ${
                            selected
                              ? "border-maroon bg-maroon text-white"
                              : "border-[#8F8F8F] bg-white text-transparent"
                          }`}
                        >
                          ✓
                        </span>
                      </button>
                    );
                  })}
                  {filteredCountryOptions.length === 0 && (
                    <p className="py-3 text-center text-sm text-[#6B6B6B]">
                      {t("noCountriesFound")}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* State / district (same list as landing hero when Sri Lanka) */}
            {selectedCountries.length === 1 && selectedCountries[0] === SRILANKA && (
              <div>
                <label className="mb-2 block text-sm font-medium text-[#2C2C2C]">
                  {t("stateDistrictLabel")}
                </label>
                <Select
                  value={filters.city ?? ""}
                  onValueChange={(value) => handleFilterChange("city", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t("selectDistrictPlaceholder")} />
                  </SelectTrigger>
                  <SelectContent className="max-h-[min(320px,70vh)]">
                    <SelectGroup>
                      <SelectLabel>{t("districtLabel")}</SelectLabel>
                      {SRILANKA_DISTRICTS.map((name) => (
                        <SelectItem key={name} value={name}>
                          {tLand(districtMessageKey[name])}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Who you search for: always opposite gender; `lookingFor` is synced for API (getAll / admin filter). */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#2C2C2C]">
                {t("lookingForLabel")}
              </label>
              <p className="w-full rounded-full border border-border-soft bg-[#FAFAFA] px-4 py-2.5 text-sm text-[#2C2C2C] shadow-inner">
                {matchLookingForGender === "FEMALE"
                  ? t("matchShowFemaleProfiles")
                  : matchLookingForGender === "MALE"
                    ? t("matchShowMaleProfiles")
                    : uiLookingFor || tc("dash")}
              </p>
              {matchLookingForGender ? (
                <p className="mt-2 text-xs leading-relaxed text-[#6B6B6B]">
                  {t("matchOppositeGenderNote")}
                </p>
              ) : null}
            </div>

            {/* Reset and Show Buttons */}
            <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border-soft/80 pt-6 sm:flex-row">
              <Button
                onClick={resetFilters}
                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-maroon bg-white py-6 font-semibold text-maroon shadow-sm transition-all duration-200 ease-out hover:-translate-y-px hover:bg-maroon hover:text-white hover:shadow-md focus-visible:ring-2 focus-visible:ring-maroon/35 motion-reduce:hover:translate-y-0"
              >
                {t("resetButton")}
                <GrPowerReset className="text-center" />
              </Button>
              <Button
                onClick={showPeople}
                className="w-full rounded-xl bg-maroon py-6 text-white shadow-md transition-all duration-200 ease-out hover:bg-maroon-light hover:shadow-lg focus-visible:ring-2 focus-visible:ring-maroon/45"
              >
                {t("showProfilesButton")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SearchFilter;
