"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { FiCalendar, FiMapPin } from "react-icons/fi";
import { FaPrayingHands } from "react-icons/fa";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DualRangeSlider } from "@/components/ui/expension/dual-range-slider";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useAppLocale } from "@/app/_components/i18n/locale-provider";
import { getSessionUserDisplayName, hasAccessToken } from "@/lib/auth/access-token";
import { performLogout } from "@/lib/auth/logout";
import { localeToApiLanguage, type AppLocale } from "@/lib/i18n/config";
import { updateUserDetails } from "@/app/(pages)/settings/api/api";
import { cn } from "@/lib/utils";
import {
  COUNTRY_OPTIONS,
  SRILANKA,
  SRILANKA_DISTRICTS,
} from "@/lib/landing-country-options";
import {
  countryMessageKey,
  districtMessageKey,
} from "@/lib/landing-country-i18n";
import { SocialLinks } from "@/app/_components/social-links";

const RELIGION_VALUES = [
  "Hindu",
  "Roman Catholic (RC)",
  "Non RC",
  "No Religion",
  "Other",
] as const;

const religionMessageKey: Record<(typeof RELIGION_VALUES)[number], string> = {
  Hindu: "relHindu",
  "Roman Catholic (RC)": "relRomanCatholicRC",
  "Non RC": "relNonRC",
  "No Religion": "relNoReligion",
  Other: "relOther",
};

const HEADER_LANG_CODES: AppLocale[] = ["en", "ta"];

function LandingHeaderLanguageSwitch({
  locale,
  onLocaleChange,
  groupAriaLabel,
  labelEn,
  labelTa,
  className,
}: {
  locale: AppLocale;
  onLocaleChange: (next: AppLocale) => void;
  groupAriaLabel: string;
  labelEn: string;
  labelTa: string;
  className?: string;
}) {
  const labels: Record<AppLocale, string> = { en: labelEn, ta: labelTa };
  return (
    <div
      role="group"
      aria-label={groupAriaLabel}
      className={cn(
        "flex items-center gap-0.5 rounded-full border border-border-soft bg-white/95 p-0.5 shadow-soft transition-all duration-200 ease-out hover:border-maroon/30 hover:shadow-soft-lg hover:ring-1 hover:ring-maroon/10",
        className
      )}
    >
      {HEADER_LANG_CODES.map((code) => {
        const active = locale === code;
        const shortLabel = code === "en" ? "EN" : "தமிழ்";
        return (
          <button
            key={code}
            type="button"
            onClick={() => onLocaleChange(code)}
            aria-pressed={active}
            aria-label={labels[code]}
            className={cn(
              "rounded-full px-2 py-1.5 text-[11px] font-bold transition-all duration-200 ease-out outline-none focus-visible:ring-2 focus-visible:ring-maroon/35 focus-visible:ring-offset-1 active:scale-[0.97] motion-reduce:active:scale-100 sm:px-2.5 sm:text-xs",
              code === "en"
                ? "min-w-[2.25rem] uppercase tracking-wide sm:min-w-[2.5rem]"
                : "min-w-[2.85rem] font-semibold tracking-normal sm:min-w-[3rem]",
              active
                ? "bg-maroon text-white shadow-maroon"
                : "text-[#2C2C2C] hover:bg-soft-rose/70 hover:shadow-sm"
            )}
          >
            {shortLabel}
          </button>
        );
      })}
    </div>
  );
}

const LandingPage: React.FC = () => {
  const t = useTranslations("landing");
  const tNav = useTranslations("navMenu");
  const tLang = useTranslations("changeLanguage");
  const { locale, setLocale } = useAppLocale();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [session, setSession] = useState<{
    loggedIn: boolean;
    displayName: string | null;
  }>({ loggedIn: false, displayName: null });
  const [ageFrom, setAgeFrom] = useState(18);
  const [ageTo, setAgeTo] = useState(80);
  const [religion, setReligion] = useState("");
  const [location, setLocation] = useState("");
  const [sriLankaDistrict, setSriLankaDistrict] = useState("");
  const [districtError, setDistrictError] = useState(false);
  const router = useRouter();
  const isSriLanka = location === SRILANKA;

  useEffect(() => {
    setSession({
      loggedIn: hasAccessToken(),
      displayName: getSessionUserDisplayName(),
    });
  }, []);

  const navLinks = useMemo(
    () => [
      { label: t("navHome"), href: "/" },
      { label: t("navSearch"), href: "/search" },
      { label: t("navSuccessStories"), href: "/success-stories" },
    ],
    [t]
  );

  const handleSearch = () => {
    if (location === SRILANKA && !sriLankaDistrict.trim()) {
      setDistrictError(true);
      return;
    }
    setDistrictError(false);

    const locationParam =
      location === SRILANKA && sriLankaDistrict.trim()
        ? sriLankaDistrict.trim()
        : location.trim();

    const params = new URLSearchParams();
    if (ageFrom !== 18 || ageTo !== 80) {
      params.set("ageFrom", String(ageFrom));
      params.set("ageTo", String(ageTo));
    }
    if (religion) params.set("religion", religion);
    if (locationParam) params.set("location", locationParam);
    const qs = params.toString();
    const searchPath = qs ? `/search?${qs}` : "/search";

    if (!hasAccessToken()) {
      router.push(`/login?redirect=${encodeURIComponent(searchPath)}`);
      return;
    }
    router.push(searchPath);
  };

  const handleAgeRangeChange = (values: number[]) => {
    if (!Array.isArray(values) || values.length < 2) return;
    const [from, to] = values;
    setAgeFrom(from);
    setAgeTo(to);
  };

  const handleLocaleChange = useCallback(
    (next: AppLocale) => {
      setLocale(next);
      if (!hasAccessToken()) return;
      void updateUserDetails({
        profile: { appLanguage: localeToApiLanguage(next) },
      }).catch(() => { });
    },
    [setLocale]
  );

  return (
    <div className="flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border-soft bg-white/92 shadow-header backdrop-blur-md supports-[backdrop-filter]:bg-white/88">
        <div className="mx-auto flex w-[90%] max-w-[1560px] items-center justify-between gap-2 py-3.5 sm:gap-3 md:py-4">
          <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
            <Link
              href="/"
              className="flex shrink-0 items-center rounded-lg outline-none transition-all duration-200 hover:opacity-95 hover:shadow-soft focus-visible:ring-2 focus-visible:ring-maroon/30 focus-visible:ring-offset-2"
            >
              <Image
                src="/assets/mmtlogo.png"
                alt="MM Tamil"
                width={90}
                height={10}
              />
            </Link>

          </div>

          <div className="flex shrink-0 items-center justify-end gap-2 sm:gap-3 md:gap-4">
            <LandingHeaderLanguageSwitch
              locale={locale}
              onLocaleChange={handleLocaleChange}
              groupAriaLabel={tLang("title")}
              labelEn={tLang("english")}
              labelTa={tLang("tamil")}
              className="hidden shrink-0 md:flex"
            />

            <nav className="hidden items-center gap-5 lg:gap-7 md:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-lg px-2 py-1.5 text-sm font-semibold tracking-wide outline-none transition-all duration-200 ease-out focus-visible:ring-2 focus-visible:ring-maroon/25 focus-visible:ring-offset-2 ${link.href === "/"
                      ? "text-maroon ring-1 ring-maroon/15 shadow-sm"
                      : "text-[#2C2C2C] hover:border hover:border-border-soft hover:bg-soft-rose/50 hover:text-maroon hover:shadow-soft"
                    }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="hidden items-center gap-3 md:flex lg:gap-4">
              {session.loggedIn ? (
                <>
                  <Link
                    href="/profile"
                    className="max-w-[200px] truncate rounded-lg border border-transparent px-2 py-1 text-sm font-semibold tracking-wide text-[#2C2C2C] outline-none transition-all duration-200 hover:border-border-soft hover:bg-cream/80 hover:text-maroon hover:shadow-soft focus-visible:ring-2 focus-visible:ring-maroon/25 focus-visible:ring-offset-2"
                    title={session.displayName ?? tNav("myProfile")}
                  >
                    {session.displayName ?? tNav("myProfile")}
                  </Link>
                  <button
                    type="button"
                    onClick={() => performLogout(router)}
                    className="rounded-full border-2 border-maroon px-6 py-2.5 text-sm font-semibold text-maroon outline-none transition-all duration-200 ease-out hover:bg-soft-rose hover:shadow-maroon hover:-translate-y-px focus-visible:ring-2 focus-visible:ring-maroon/35 focus-visible:ring-offset-2 active:scale-[0.98] motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100"
                  >
                    {tNav("logOut")}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="rounded-full border-2 border-maroon px-6 py-2.5 text-sm font-semibold text-maroon outline-none transition-all duration-200 ease-out hover:bg-soft-rose hover:shadow-maroon hover:-translate-y-px focus-visible:ring-2 focus-visible:ring-maroon/35 focus-visible:ring-offset-2 active:scale-[0.98] motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100"
                  >
                    {t("login")}
                  </Link>
                  <Link
                    href="/loginstep"
                    className="rounded-full border-2 border-maroon/20 bg-maroon px-6 py-2.5 text-sm font-semibold text-white shadow-maroon outline-none transition-all duration-200 ease-out hover:bg-maroon/92 hover:shadow-maroon-lg hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-maroon/50 focus-visible:ring-offset-2 active:translate-y-0 active:scale-[0.98] motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100"
                  >
                    {t("register")}
                  </Link>
                </>
              )}
            </div>

            <button
              type="button"
              className="rounded-lg border border-transparent p-1.5 text-2xl text-[#2C2C2C] outline-none transition-all duration-200 hover:border-border-soft hover:bg-soft-rose/70 hover:text-maroon hover:shadow-soft focus-visible:ring-2 focus-visible:ring-maroon/30 focus-visible:ring-offset-2 md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-label={t("toggleMenu")}
            >
              {mobileMenuOpen ? <HiX /> : <HiMenu />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden flex animate-in flex-col gap-1 border-t border-border-soft bg-white px-6 pb-4 pt-3 shadow-soft-lg duration-200 fade-in slide-in-from-top-1 motion-reduce:animate-none">
            <div className="mb-3 flex justify-center border-b border-border-soft/80 pb-3">
              <SocialLinks variant="header" />
            </div>
            <div className="mb-2 border-b border-border-soft/80 pb-2">
              <LandingHeaderLanguageSwitch
                locale={locale}
                onLocaleChange={handleLocaleChange}
                groupAriaLabel={tLang("title")}
                labelEn={tLang("english")}
                labelTa={tLang("tamil")}
                className="w-fit"
              />
            </div>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg border border-transparent px-2 py-2.5 text-sm font-semibold text-[#2C2C2C] outline-none transition-all duration-200 hover:border-border-soft hover:bg-cream hover:text-maroon hover:shadow-soft focus-visible:ring-2 focus-visible:ring-maroon/25 focus-visible:ring-inset"
              >
                {link.label}
              </Link>
            ))}
            {session.loggedIn ? (
              <>
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="truncate rounded-lg border border-transparent px-2 py-2.5 text-sm font-semibold text-[#2C2C2C] outline-none transition-all duration-200 hover:border-border-soft hover:bg-cream hover:text-maroon hover:shadow-soft focus-visible:ring-2 focus-visible:ring-maroon/25"
                >
                  {session.displayName ?? tNav("myProfile")}
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    performLogout(router);
                  }}
                  className="rounded-full border-2 border-maroon px-6 py-2.5 text-center text-sm font-semibold text-maroon transition-all duration-200 hover:bg-soft-rose hover:shadow-maroon active:scale-[0.98] motion-reduce:active:scale-100"
                >
                  {tNav("logOut")}
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-full border-2 border-maroon px-6 py-2.5 text-center text-sm font-semibold text-maroon transition-all duration-200 hover:bg-soft-rose hover:shadow-maroon"
                >
                  {t("login")}
                </Link>
                <Link
                  href="/loginstep"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-full border-2 border-maroon/30 bg-maroon px-6 py-2.5 text-center text-sm font-semibold text-white shadow-maroon transition-all duration-200 hover:bg-maroon/92 hover:shadow-maroon-lg"
                >
                  {t("register")}
                </Link>
              </>
            )}
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[500px] lg:min-h-[600px] flex flex-col">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80"
            alt=""
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-maroon/30" />
        </div>

        <div className="relative z-10 flex flex-col flex-1 max-w-[1560px] w-[90%] mx-auto pt-12 lg:pt-20 pb-10">
          <h1 className="font-playfair text-3xl md:text-4xl lg:text-[2.75rem] lg:leading-[1.15] font-bold max-w-xl tracking-tight animate-fade-in motion-reduce:animate-none">
            <span className="bg-gradient-to-r from-white via-cream to-gold-light bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
              {t("heroLine1")}{" "}
            </span>
            <span className="bg-gradient-to-r from-white via-gold-light to-gold bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(0,0,0,0.2)]">
              {t("heroLine2")}
            </span>
          </h1>
          <p className="text-white/95 text-base md:text-lg mt-3 max-w-md leading-relaxed [text-shadow:0_1px_12px_rgba(0,0,0,0.2)] animate-fade-in motion-reduce:animate-none [animation-delay:80ms]">
            {t("heroSub")}
          </p>

          {/* Search Bar */}
          <div className="mt-8 w-full max-w-6xl rounded-3xl border-2 border-white/80 bg-white/95 p-5 shadow-card backdrop-blur-md transition-all duration-300 ease-out hover:border-maroon/15 hover:shadow-card-hover hover:ring-2 hover:ring-maroon/10 lg:mt-12 lg:p-7 motion-reduce:hover:ring-0">
            <div
              className={cn(
                "grid grid-cols-1 gap-4 lg:items-stretch lg:gap-x-3 lg:gap-y-4",
                isSriLanka
                  ? "sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto]"
                  : "sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.2fr)_auto]"
              )}
            >
              <div className="flex min-h-0 min-w-0 flex-col">
                <label className="mb-2 text-maroon text-sm font-semibold tracking-wide flex items-center gap-2">
                  <FiCalendar className="text-maroon text-[15px] shrink-0 opacity-90" aria-hidden />
                  {t("labelAge")}
                </label>
                <div className="rounded-xl border border-border-soft bg-white px-3 py-3 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] transition-[border-color,box-shadow] duration-200 hover:border-maroon/25 hover:shadow-soft focus-within:border-maroon/35 focus-within:shadow-soft focus-within:ring-2 focus-within:ring-maroon/10">
                  <DualRangeSlider
                    value={[ageFrom, ageTo]}
                    min={18}
                    max={80}
                    step={1}
                    minStepsBetweenThumbs={1}
                    onValueChange={handleAgeRangeChange}
                  />
                  <div className="mt-2 flex items-center justify-between text-[10px] text-[#6B6B6B]">
                    <span>18</span>
                    <span className="font-medium text-[#2C2C2C] text-xs">
                      {ageFrom} - {ageTo} yrs
                    </span>
                    <span>80</span>
                  </div>
                </div>
              </div>
              <div className="flex min-h-0 min-w-0 flex-col">
                <label className="mb-2 text-maroon text-sm font-semibold tracking-wide flex items-center gap-2">
                  <FaPrayingHands className="text-maroon text-[15px] shrink-0 opacity-90" aria-hidden />
                  {t("labelReligion")}
                </label>
                <Select value={religion} onValueChange={setReligion}>
                  <SelectTrigger className="h-12 w-full rounded-xl border-border-soft bg-white text-[#2C2C2C] shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] transition-[border-color,box-shadow] duration-200 hover:border-maroon/35 hover:shadow-soft focus-visible:ring-2 focus-visible:ring-maroon/15">
                    <SelectValue placeholder={t("phReligion")} />
                  </SelectTrigger>
                  <SelectContent>
                    {RELIGION_VALUES.map((r) => (
                      <SelectItem key={r} value={r}>
                        {t(religionMessageKey[r])}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div
                className={cn(
                  "flex min-h-0 min-w-0 flex-col",
                  !isSriLanka && "sm:col-span-2 lg:col-span-1"
                )}
              >
                <label className="mb-2 text-maroon text-sm font-semibold tracking-wide flex items-center gap-2">
                  <FiMapPin className="text-maroon text-[15px] shrink-0 opacity-90" aria-hidden />
                  {t("labelLocation")}
                </label>
                <Select
                  value={location}
                  onValueChange={(v) => {
                    setLocation(v);
                    setSriLankaDistrict("");
                    setDistrictError(false);
                  }}
                >
                  <SelectTrigger className="h-12 w-full rounded-xl border-border-soft bg-white text-[#2C2C2C] shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] transition-[border-color,box-shadow] duration-200 hover:border-maroon/35 hover:shadow-soft focus-visible:ring-2 focus-visible:ring-maroon/15">
                    <SelectValue placeholder={t("phLocation")} />
                  </SelectTrigger>
                  <SelectContent className="max-h-[min(320px,70vh)]">
                    {COUNTRY_OPTIONS.map((c) => (
                      <SelectItem key={c} value={c}>
                        {t(countryMessageKey[c])}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {isSriLanka && (
                <div className="flex min-h-0 min-w-0 flex-col">
                  <label className="mb-2 text-maroon text-sm font-semibold tracking-wide flex items-center gap-2">
                    <FiMapPin className="text-maroon text-[15px] shrink-0 opacity-80" aria-hidden />
                    {t("labelDistrict")}
                  </label>
                  <Select
                    value={sriLankaDistrict}
                    onValueChange={(v) => {
                      setSriLankaDistrict(v);
                      setDistrictError(false);
                    }}
                  >
                    <SelectTrigger
                      className={cn(
                        "h-12 w-full rounded-xl border-border-soft bg-white text-[#2C2C2C] shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] transition-[border-color,box-shadow] duration-200 hover:border-maroon/35 hover:shadow-soft focus-visible:ring-2 focus-visible:ring-maroon/15",
                        districtError ? "border-red-400 ring-red-200/50" : ""
                      )}
                    >
                      <SelectValue placeholder={t("phDistrict")} />
                    </SelectTrigger>
                    <SelectContent className="max-h-[min(320px,70vh)]">
                      {SRILANKA_DISTRICTS.map((d) => (
                        <SelectItem key={d} value={d}>
                          {t(districtMessageKey[d])}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {districtError && (
                    <p className="mt-1 text-xs font-medium text-red-600">
                      {t("districtRequired")}
                    </p>
                  )}
                </div>
              )}
              <div className="flex min-h-0 flex-col sm:col-span-2 lg:col-span-1">
                <span
                  aria-hidden
                  className="mb-2 hidden select-none text-sm font-semibold tracking-wide text-transparent lg:block"
                >
                  {t("searchNow")}
                </span>
                <button
                  type="button"
                  onClick={handleSearch}
                  className="h-12 w-full min-w-[120px] rounded-xl border-2 border-maroon/30 bg-maroon px-6 font-semibold text-white shadow-maroon outline-none transition-all duration-200 ease-out hover:bg-maroon/92 hover:shadow-maroon-lg hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-maroon/45 focus-visible:ring-offset-2 active:translate-y-0 motion-reduce:hover:translate-y-0 lg:min-w-[140px]"
                >
                  {t("searchNow")}
                </button>
              </div>
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="mt-8 lg:mt-11 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 md:gap-5 text-white">
            <div className="group flex items-center gap-4 rounded-2xl border border-white/20 bg-white/[0.08] px-4 py-3 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.2)] backdrop-blur-[8px] transition-all duration-300 ease-out hover:-translate-y-1 hover:border-white/40 hover:bg-white/[0.14] hover:shadow-[0_16px_40px_-10px_rgba(0,0,0,0.28)] motion-reduce:transition-colors motion-reduce:hover:translate-y-0">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/25 shadow-inner ring-2 ring-white/30 transition-transform duration-300 group-hover:scale-105">
                <span className="text-lg font-bold tracking-tight sm:text-xl">10K+</span>
              </div>
              <div className="min-w-0">
                <p className="font-semibold leading-snug [text-shadow:0_1px_8px_rgba(0,0,0,0.15)]">
                  {t("statVerified")}
                </p>
              </div>
            </div>
            <div className="group flex items-center gap-4 rounded-2xl border border-white/20 bg-white/[0.08] px-4 py-3 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.2)] backdrop-blur-[8px] transition-all duration-300 ease-out hover:-translate-y-1 hover:border-white/40 hover:bg-white/[0.14] hover:shadow-[0_16px_40px_-10px_rgba(0,0,0,0.28)] motion-reduce:transition-colors motion-reduce:hover:translate-y-0">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/25 shadow-inner ring-2 ring-white/30 transition-transform duration-300 group-hover:scale-105">
                <span className="text-lg font-bold tracking-tight sm:text-xl">98%</span>
              </div>
              <div className="min-w-0">
                <p className="font-semibold leading-snug [text-shadow:0_1px_8px_rgba(0,0,0,0.15)]">
                  {t("statSuccess")}
                </p>
                <p className="mt-0.5 text-sm leading-snug text-white/85">{t("statSuccessTa")}</p>
              </div>
            </div>
            <div className="group flex items-center gap-4 rounded-2xl border border-white/20 bg-white/[0.08] px-4 py-3 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.2)] backdrop-blur-[8px] transition-all duration-300 ease-out hover:-translate-y-1 hover:border-white/40 hover:bg-white/[0.14] hover:shadow-[0_16px_40px_-10px_rgba(0,0,0,0.28)] motion-reduce:transition-colors motion-reduce:hover:translate-y-0">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/25 shadow-inner ring-2 ring-white/30 transition-transform duration-300 group-hover:scale-105">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="font-semibold leading-snug [text-shadow:0_1px_8px_rgba(0,0,0,0.15)]">
                  {t("statPrivacy")}
                </p>
                <p className="mt-0.5 text-sm leading-snug text-white/85">{t("statPrivacySub")}</p>
              </div>
            </div>
            <div className="group flex items-center gap-4 rounded-2xl border border-white/20 bg-white/[0.08] px-4 py-3 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.2)] backdrop-blur-[8px] transition-all duration-300 ease-out hover:-translate-y-1 hover:border-white/40 hover:bg-white/[0.14] hover:shadow-[0_16px_40px_-10px_rgba(0,0,0,0.28)] motion-reduce:transition-colors motion-reduce:hover:translate-y-0">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/25 shadow-inner ring-2 ring-white/30 transition-transform duration-300 group-hover:scale-105">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1a1 1 0 01-1-1v-3a1 1 0 011-1h2a2 2 0 001.732-1z" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="font-semibold leading-snug [text-shadow:0_1px_8px_rgba(0,0,0,0.15)]">
                  {t("statFamilies")}
                </p>
                <p className="mt-0.5 text-sm leading-snug text-white/85">{t("statFamiliesSub")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
