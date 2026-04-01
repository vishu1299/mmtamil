"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { FaWhatsapp } from "react-icons/fa";
import { HiOutlinePhone } from "react-icons/hi";
import { getSuccessStories } from "@/app/api/api";

const DEFAULT_SUCCESS_RATE = 98;
const DEFAULT_MARRIAGE_DISPLAY = "5000+";

function formatMarriageCount(count: number): string {
  if (count <= 0) return "0";
  if (count >= 10000) return `${Math.floor(count / 1000)}k+`;
  if (count >= 1000) return `${(count / 1000).toFixed(1).replace(/\.0$/, "")}k+`;
  return `${count}+`;
}

/** Parse optional success rate from API (0–1 or 0–100). */
function normalizeSuccessRate(raw: unknown): number | null {
  if (typeof raw !== "number" || Number.isNaN(raw)) return null;
  if (raw > 0 && raw <= 1) return Math.round(raw * 100);
  if (raw > 1 && raw <= 100) return Math.round(raw);
  return null;
}

/** Supports `data.data.data.stories` (success page) or flatter shapes. */
function extractStoriesPayload(res: {
  data?: Record<string, unknown>;
}): { totalCount: number; stories: unknown[]; rateRaw: unknown } {
  const body = (res?.data ?? {}) as Record<string, unknown>;
  const d1 = body.data as Record<string, unknown> | undefined;
  const d2 = d1?.data as Record<string, unknown> | undefined;

  let stories: unknown[] = [];
  if (Array.isArray(d2?.stories)) stories = d2.stories as unknown[];
  else if (Array.isArray(d1?.stories)) stories = d1.stories as unknown[];
  else if (Array.isArray(body.stories)) stories = body.stories as unknown[];

  const payload = (d2 ?? d1 ?? body) as Record<string, unknown>;
  const rateRaw =
    payload.successRate ??
    payload.successRatePercent ??
    payload.totalSuccessRate;
  const totalCount =
    typeof payload.totalCount === "number" && payload.totalCount >= 0
      ? payload.totalCount
      : stories.length;

  return { totalCount, stories, rateRaw };
}

const HowItWorks = () => {
  const t = useTranslations("howItWorks");
  const [successRateDisplay, setSuccessRateDisplay] = useState<string | null>(
    null
  );
  const [marriagesDisplay, setMarriagesDisplay] = useState<string | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setStatsLoading(true);
      try {
        const res = await getSuccessStories();
        if (!res?.data) {
          throw new Error("No response");
        }
        const { totalCount, stories, rateRaw } = extractStoriesPayload(res);
        const rate = normalizeSuccessRate(rateRaw);

        if (!cancelled) {
          setSuccessRateDisplay(
            rate != null ? `${rate}%` : `${DEFAULT_SUCCESS_RATE}%`
          );
          setMarriagesDisplay(
            formatMarriageCount(totalCount > 0 ? totalCount : stories.length)
          );
        }
      } catch {
        if (!cancelled) {
          setSuccessRateDisplay(`${DEFAULT_SUCCESS_RATE}%`);
          setMarriagesDisplay(DEFAULT_MARRIAGE_DISPLAY);
        }
      } finally {
        if (!cancelled) setStatsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const steps = useMemo(
    () => [
      {
        icon: (
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        ),
        title: t("step1Title"),
        description: t("step1Desc"),
      },
      {
        icon: (
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        ),
        title: t("step2Title"),
        description: t("step2Desc"),
      },
      {
        icon: (
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        ),
        title: t("step3Title"),
        description: t("step3Desc"),
      },
      {
        icon: (
          <span className="flex items-center justify-center gap-1 text-maroon">
            <HiOutlinePhone className="w-7 h-7" aria-hidden />
            <FaWhatsapp className="w-7 h-7 text-[#25D366]" aria-hidden />
          </span>
        ),
        title: t("step4NeedHelpTitle"),
        description: t("step4CareLine"),
        contactLine: t("step4ContactLine"),
      },
    ],
    [t]
  );

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-[1560px] w-[90%] mx-auto">
        <h2 className="font-playfair text-maroon text-3xl md:text-4xl font-bold">
          {t("title")}
        </h2>
        <p className="text-[#6B6B6B] mt-2">{t("subtitle")}</p>

        <div className="mt-6 p-4 rounded-xl bg-soft-rose/70 border border-maroon/20">
          <p className="text-maroon font-semibold text-lg text-center">
            {t("trustBanner")}
          </p>
        </div>

        <div className="mt-6 flex flex-col items-center gap-6 p-6 rounded-2xl bg-maroon/5 border border-maroon/20">
          <div className="flex flex-wrap justify-center gap-6 md:gap-12">
            <div className="text-center min-w-[140px]">
              <p className="font-playfair text-4xl md:text-5xl font-bold text-maroon min-h-[3rem] md:min-h-[3.5rem] flex items-center justify-center">
                {statsLoading ? (
                  <span className="inline-block h-12 md:h-14 w-24 bg-maroon/10 rounded-lg animate-pulse" />
                ) : (
                  (successRateDisplay ?? `${DEFAULT_SUCCESS_RATE}%`)
                )}
              </p>
              <p className="text-[#6B6B6B] font-semibold mt-1">
                {t("successRate")}
              </p>
              <p className="text-maroon/80 text-sm mt-0.5">
                {t("successRateTa")}
              </p>
            </div>
            {/* <div className="text-center min-w-[140px]">
              <p className="font-playfair text-4xl md:text-5xl font-bold text-maroon min-h-[3rem] md:min-h-[3.5rem] flex items-center justify-center">
                {statsLoading ? (
                  <span className="inline-block h-12 md:h-14 w-28 bg-maroon/10 rounded-lg animate-pulse" />
                ) : (
                  marriagesDisplay ? `+${marriagesDisplay}` : `${DEFAULT_MARRIAGE_DISPLAY}`
                )}
              </p>
              <p className="text-[#6B6B6B] font-semibold mt-1">
                {t("happyMarriages")}
              </p>
              <p className="text-maroon/80 text-sm mt-0.5">
                {t("happyMarriagesTa")}
              </p>
            </div> */}
          </div>
          <Link href="/success-stories">
            <button className="bg-maroon text-white font-semibold px-8 py-3 rounded-lg hover:bg-maroon/90 transition-colors">
              {t("viewStories")}
            </button>
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6 rounded-2xl bg-soft-rose/50 border border-border-soft"
            >
              <div className="w-16 h-16 rounded-full bg-maroon/10 flex items-center justify-center text-maroon mb-4">
                {step.icon}
              </div>
              <h3 className="font-playfair font-bold text-lg text-maroon mb-2">
                {step.title}
              </h3>
              <p className="text-[#6B6B6B] text-sm">{step.description}</p>
              {"contactLine" in step && step.contactLine ? (
                <p className="mt-2 text-sm font-medium text-maroon">
                  {step.contactLine}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
