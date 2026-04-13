"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { getAllPackage, createPayPalOrder, type PayPalOrderCurrency } from "../api/api";
import { getPayPalApprovalUrl } from "../_utils/paypal-approval-url";
import { FaCheck, FaTimes } from "react-icons/fa";
import { IoDiamond } from "react-icons/io5";

type BenefitKey =
  | "viewPhotos"
  | "timeFrame"
  | "viewContacts"
  | "unlimitedInvitation"
  | "unlimitedHoroscope"
  | "expressInterest";

type BenefitValue =
  | { kind: "profiles"; count: number }
  | { kind: "months"; count: number }
  | { kind: "years"; count: number }
  | { kind: "unlimited" }
  | { kind: "bool"; value: boolean };

interface BenefitItem {
  key: BenefitKey;
  value: BenefitValue;
}

interface PlanCard {
  id: number | string;
  tier: "silver" | "gold" | "diamond" | "platinum" | "vip";
  price: number;
  currency: string;
  priceUsd: string;
  benefits: BenefitItem[];
  payCurrency: PayPalOrderCurrency;
  totalSubscribers: number;
}

const BENEFIT_LABEL_KEY: Record<BenefitKey, string> = {
  viewPhotos: "benefitViewPhotos",
  timeFrame: "benefitTimeFrame",
  viewContacts: "benefitViewContacts",
  unlimitedInvitation: "benefitUnlimitedInvitation",
  unlimitedHoroscope: "benefitUnlimitedHoroscope",
  expressInterest: "benefitExpressInterest",
};

const TIER_LABEL_KEY: Record<PlanCard["tier"], string> = {
  silver: "tierSilver",
  gold: "tierGold",
  diamond: "tierDiamond",
  platinum: "tierPlatinum",
  vip: "tierVip",
};

function validityToValue(months: number): BenefitValue {
  const m = Number.isFinite(months) ? Math.max(0, months) : 0;
  if (m >= 12) {
    return { kind: "years", count: m / 12 };
  }
  return { kind: "months", count: m };
}

function formatYearsForMessage(years: number): string {
  if (Number.isInteger(years)) return String(years);
  const rounded = Math.round(years * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

const dummyPlans: PlanCard[] = [
  {
    id: "silver-plan",
    tier: "silver",
    price: 9000,
    currency: "LKR",
    payCurrency: "USD",
    totalSubscribers: 0,
    priceUsd: "30.4$",
    benefits: [
      { key: "viewPhotos", value: { kind: "profiles", count: 5 } },
      { key: "timeFrame", value: { kind: "months", count: 6 } },
      { key: "viewContacts", value: { kind: "profiles", count: 3 } },
      { key: "unlimitedInvitation", value: { kind: "bool", value: true } },
      { key: "unlimitedHoroscope", value: { kind: "bool", value: true } },
      { key: "expressInterest", value: { kind: "bool", value: false } },
    ],
  },
  {
    id: "gold-plan",
    tier: "gold",
    price: 18000,
    currency: "LKR",
    payCurrency: "USD",
    totalSubscribers: 0,
    priceUsd: "60.8$",
    benefits: [
      { key: "viewPhotos", value: { kind: "profiles", count: 15 } },
      { key: "timeFrame", value: { kind: "months", count: 12 } },
      { key: "viewContacts", value: { kind: "profiles", count: 10 } },
      { key: "unlimitedInvitation", value: { kind: "bool", value: true } },
      { key: "unlimitedHoroscope", value: { kind: "bool", value: true } },
      { key: "expressInterest", value: { kind: "bool", value: true } },
    ],
  },
  {
    id: "diamond-plan",
    tier: "diamond",
    price: 30000,
    currency: "LKR",
    payCurrency: "USD",
    totalSubscribers: 0,
    priceUsd: "101.3$",
    benefits: [
      { key: "viewPhotos", value: { kind: "unlimited" } },
      { key: "timeFrame", value: { kind: "months", count: 24 } },
      { key: "viewContacts", value: { kind: "unlimited" } },
      { key: "unlimitedInvitation", value: { kind: "bool", value: true } },
      { key: "unlimitedHoroscope", value: { kind: "bool", value: true } },
      { key: "expressInterest", value: { kind: "bool", value: true } },
    ],
  },
];

const TierBadge = ({
  tier,
  displayName,
}: {
  tier: string;
  displayName: string;
}) => {
  if (tier === "silver") {
    return (
      <div
        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-[#4A4A4A] font-semibold text-sm shadow-md border border-[#C0C0C0]/50"
        style={{
          background:
            "linear-gradient(135deg, #E8E8E8 0%, #C0C0C0 30%, #D8D8D8 50%, #B0B0B0 70%, #A0A0A0 100%)",
        }}
      >
        <span>{displayName}</span>
        <span
          className="text-base"
          style={{
            color: "#A0A0A0",
            filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.15))",
          }}
        >
          ★
        </span>
      </div>
    );
  }

  if (tier === "gold") {
    return (
      <div
        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-[#6B5A1E] font-semibold text-sm shadow-md border border-[#D4AF37]/40"
        style={{
          background:
            "linear-gradient(135deg, #F5E6A7 0%, #D4AF37 30%, #EEDC82 50%, #D4AF37 70%, #C49B30 100%)",
        }}
      >
        <span>{displayName}</span>
        <span
          className="text-base"
          style={{
            color: "#B8941F",
            filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.15))",
          }}
        >
          ★
        </span>
      </div>
    );
  }

  if (tier === "platinum") {
    return (
      <div
        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-[#4A5568] font-semibold text-sm shadow-md border border-[#A0AEC0]/50"
        style={{
          background:
            "linear-gradient(135deg, #E2E8F0 0%, #A0AEC0 40%, #718096 100%)",
        }}
      >
        <span>{displayName}</span>
        <span className="text-base" style={{ color: "#718096" }}>
          ★
        </span>
      </div>
    );
  }

  if (tier === "vip") {
    return (
      <div
        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-[#744210] font-semibold text-sm shadow-md border border-[#D69E2E]/50"
        style={{
          background:
            "linear-gradient(135deg, #FEF3C7 0%, #F59E0B 50%, #D97706 100%)",
        }}
      >
        <span>{displayName}</span>
        <span className="text-base" style={{ color: "#B45309" }}>
          ★
        </span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-[#2C2C2C] font-semibold text-sm shadow-sm border border-gray-200">
      <span>{displayName}</span>
      <IoDiamond className="text-lg text-[#5CE1E6]" />
    </div>
  );
};

function formatScalarBenefit(
  v: Exclude<BenefitValue, { kind: "bool" }>,
  t: (key: string, values?: Record<string, string | number>) => string
): string {
  switch (v.kind) {
    case "unlimited":
      return t("valueUnlimited");
    case "profiles":
      return t("valueProfiles", { count: v.count });
    case "months":
      return v.count === 1
        ? t("durationMonthOne")
        : t("durationMonthMany", { count: v.count });
    case "years": {
      const c = v.count;
      if (!Number.isInteger(c)) {
        return t("durationYearDecimal", {
          years: formatYearsForMessage(c),
        });
      }
      if (c === 1) return t("durationYearOne");
      return t("durationYearMany", { count: c });
    }
    default:
      return "";
  }
}

const Credits = () => {
  const t = useTranslations("creditsPage");
  const [plans, setPlans] = useState<PlanCard[]>(dummyPlans);
  const [checkoutPackageId, setCheckoutPackageId] = useState<number | null>(
    null
  );
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const result = await getAllPackage();
        const pkgs = result?.data?.data ?? result?.data;
        if (pkgs && Array.isArray(pkgs) && pkgs.length > 0) {
          const tierMap: Record<
            string,
            "silver" | "gold" | "diamond" | "platinum" | "vip"
          > = {
            Silver: "silver",
            Gold: "gold",
            Diamond: "diamond",
            Platinum: "platinum",
            VIP: "vip",
          };
          const mapped: PlanCard[] = pkgs.map((item: {
            id: number;
            name: string;
            validityPeriod?: string;
            priceLKR?: number;
            price?: number;
            priceUSD?: number;
            totalSubscribers?: number;
            profileShowLimit?: number;
            contactViewLimit?: number;
            unlimitedInvitation?: boolean;
            unlimitedHoroscope?: boolean;
            expressInterest?: boolean;
          }) => {
            const months = parseInt(item.validityPeriod || "0", 10);
            const profileLimit = item.profileShowLimit ?? 0;
            const contactLimit = item.contactViewLimit ?? 0;
            const photosValue: BenefitValue = {
              kind: "profiles",
              count: profileLimit,
            };
            const contactsValue: BenefitValue = {
              kind: "profiles",
              count: contactLimit,
            };

            return {
              id: item.id,
              tier: tierMap[item.name] ?? "silver",
              price: item.priceLKR ?? item.price ?? 0,
              currency: "LKR",
              payCurrency: "USD",
              priceUsd: `$${item.priceUSD ?? item.price ?? 0}`,
              totalSubscribers:
                typeof item.totalSubscribers === "number"
                  ? item.totalSubscribers
                  : 0,
              benefits: [
                { key: "viewPhotos", value: photosValue },
                { key: "timeFrame", value: validityToValue(months) },
                { key: "viewContacts", value: contactsValue },
                {
                  key: "unlimitedInvitation",
                  value: { kind: "bool", value: !!item.unlimitedInvitation },
                },
                {
                  key: "unlimitedHoroscope",
                  value: { kind: "bool", value: !!item.unlimitedHoroscope },
                },
                {
                  key: "expressInterest",
                  value: { kind: "bool", value: !!item.expressInterest },
                },
              ],
            };
          });
          setPlans(mapped);
        }
      } catch {
        // API unavailable, keep dummy plans
      }
    };
    fetchPackages();
  }, []);

  const handleBuy = async (plan: PlanCard) => {
    if (typeof plan.id !== "number") {
      console.warn(
        "Package id missing — load live plans from the API to purchase."
      );
      return;
    }
    setCheckoutPackageId(plan.id);
    try {
      const { data: body } = await createPayPalOrder(plan.id, plan.payCurrency);
      const approvalUrl = getPayPalApprovalUrl(body);
      if (approvalUrl) {
        window.location.assign(approvalUrl);
        return;
      }
      console.error("PayPal create-order: no approval URL in response", body);
    } catch (error) {
      console.error("PayPal checkout failed:", error);
    } finally {
      setCheckoutPackageId(null);
    }
  };

  return (
    <div className="px-4 lg:px-0 pb-10">
      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide lg:grid lg:grid-cols-3 lg:overflow-visible"
      >
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="min-w-[300px] w-[300px] lg:w-full lg:min-w-0 snap-center flex-shrink-0 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden flex flex-col"
          >
            <div className="p-6 pb-4">
              <div className="flex items-baseline justify-between mb-4">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-bold text-[#2C2C2C]">
                    {plan.price.toLocaleString()}
                  </span>
                  <span className="text-sm font-medium text-[#6B6B6B]">
                    {plan.currency}
                  </span>
                </div>
                <span className="text-sm text-[#6B6B6B]">
                  ({plan.priceUsd})
                </span>
              </div>

              <div className="mb-3">
                <TierBadge
                  tier={plan.tier}
                  displayName={t(TIER_LABEL_KEY[plan.tier])}
                />
              </div>

              <p className="text-xs text-[#2C2C2C] text-center mb-5 font-bold tabular-nums">
                {t("subscribersLine", { count: plan.totalSubscribers })}
              </p>

              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-sm font-semibold text-[#2C2C2C]">
                  {t("benefitsHeading")}
                </span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              <div className="space-y-3.5">
                {plan.benefits.map((benefit, i) => (
                  <div
                    key={`${plan.id}-${benefit.key}-${i}`}
                    className="flex items-center justify-between gap-2"
                  >
                    <span className="text-sm text-[#6B6B6B]">
                      {t(BENEFIT_LABEL_KEY[benefit.key])}
                    </span>
                    {benefit.value.kind === "bool" ? (
                      benefit.value.value ? (
                        <FaCheck
                          className="text-green-500 text-sm shrink-0"
                          aria-label={t("includedAria")}
                        />
                      ) : (
                        <FaTimes
                          className="text-red-500 text-sm shrink-0"
                          aria-label={t("notIncludedAria")}
                        />
                      )
                    ) : (
                      <span className="text-sm font-semibold text-[#2C2C2C] text-right">
                        {formatScalarBenefit(benefit.value, t)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 pt-4 mt-auto">
              <button
                type="button"
                disabled={
                  checkoutPackageId === plan.id || typeof plan.id !== "number"
                }
                onClick={() => handleBuy(plan)}
                className="w-full py-3.5 bg-maroon text-white text-sm font-semibold rounded-xl hover:bg-maroon/90 transition-colors disabled:opacity-60 disabled:pointer-events-none"
              >
                {checkoutPackageId === plan.id
                  ? t("redirecting")
                  : t("buyNow")}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Credits;
