"use client";
import React, { useState, useEffect, useRef } from "react";
import { getAllPackage, createPayPalOrder, type PayPalOrderCurrency } from "../api/api";
import { getPayPalApprovalUrl } from "../_utils/paypal-approval-url";
import { FaCheck, FaTimes } from "react-icons/fa";
import { IoDiamond } from "react-icons/io5";

interface BenefitItem {
  label: string;
  value: string | boolean;
}

interface PlanCard {
  id: number | string;
  name: string;
  tier: "silver" | "gold" | "diamond" | "platinum" | "vip";
  price: number;
  currency: string;
  priceUsd: string;
  benefits: BenefitItem[];
  /** ISO currency for PayPal create-order (from package.prices). */
  payCurrency: PayPalOrderCurrency;
  totalSubscribers: number;
}

const dummyPlans: PlanCard[] = [
  {
    id: "silver-plan",
    name: "Silver",
    tier: "silver",
    price: 9000,
    currency: "LKR",
    payCurrency: "USD",
    totalSubscribers: 0,
    priceUsd: "30.4$",
    benefits: [
      { label: "View Photos", value: "5 Profiles" },
      { label: "Time Frame", value: "6 Months" },
      { label: "View Contacts", value: "3 Profiles" },
      { label: "Unlimited Invitation", value: true },
      { label: "Unlimited Horoscope", value: true },
      { label: "Express Interest", value: false },
    ],
  },
  {
    id: "gold-plan",
    name: "Gold",
    tier: "gold",
    price: 18000,
    currency: "LKR",
    payCurrency: "USD",
    totalSubscribers: 0,
    priceUsd: "60.8$",
    benefits: [
      { label: "View Photos", value: "15 Profiles" },
      { label: "Time Frame", value: "12 Months" },
      { label: "View Contacts", value: "10 Profiles" },
      { label: "Unlimited Invitation", value: true },
      { label: "Unlimited Horoscope", value: true },
      { label: "Express Interest", value: true },
    ],
  },
  {
    id: "diamond-plan",
    name: "Diamond",
    tier: "diamond",
    price: 30000,
    currency: "LKR",
    payCurrency: "USD",
    totalSubscribers: 0,
    priceUsd: "101.3$",
    benefits: [
      { label: "View Photos", value: "Unlimited" },
      { label: "Time Frame", value: "24 Months" },
      { label: "View Contacts", value: "Unlimited" },
      { label: "Unlimited Invitation", value: true },
      { label: "Unlimited Horoscope", value: true },
      { label: "Express Interest", value: true },
    ],
  },
];

const TierBadge = ({ tier, name }: { tier: string; name: string }) => {
  if (tier === "silver") {
    return (
      <div
        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-[#4A4A4A] font-semibold text-sm shadow-md border border-[#C0C0C0]/50"
        style={{
          background: "linear-gradient(135deg, #E8E8E8 0%, #C0C0C0 30%, #D8D8D8 50%, #B0B0B0 70%, #A0A0A0 100%)",
        }}
      >
        <span>{name}</span>
        <span className="text-base" style={{ color: "#A0A0A0", filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.15))" }}>★</span>
      </div>
    );
  }

  if (tier === "gold") {
    return (
      <div
        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-[#6B5A1E] font-semibold text-sm shadow-md border border-[#D4AF37]/40"
        style={{
          background: "linear-gradient(135deg, #F5E6A7 0%, #D4AF37 30%, #EEDC82 50%, #D4AF37 70%, #C49B30 100%)",
        }}
      >
        <span>{name}</span>
        <span className="text-base" style={{ color: "#B8941F", filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.15))" }}>★</span>
      </div>
    );
  }

  if (tier === "platinum") {
    return (
      <div
        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-[#4A5568] font-semibold text-sm shadow-md border border-[#A0AEC0]/50"
        style={{
          background: "linear-gradient(135deg, #E2E8F0 0%, #A0AEC0 40%, #718096 100%)",
        }}
      >
        <span>{name}</span>
        <span className="text-base" style={{ color: "#718096" }}>★</span>
      </div>
    );
  }

  if (tier === "vip") {
    return (
      <div
        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-[#744210] font-semibold text-sm shadow-md border border-[#D69E2E]/50"
        style={{
          background: "linear-gradient(135deg, #FEF3C7 0%, #F59E0B 50%, #D97706 100%)",
        }}
      >
        <span>{name}</span>
        <span className="text-base" style={{ color: "#B45309" }}>★</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-[#2C2C2C] font-semibold text-sm shadow-sm border border-gray-200">
      <span>{name}</span>
      <IoDiamond className="text-lg text-[#5CE1E6]" />
    </div>
  );
};

const Credits = () => {
  const [plans, setPlans] = useState<PlanCard[]>(dummyPlans);
  const [checkoutPackageId, setCheckoutPackageId] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const result = await getAllPackage();
        const pkgs = result?.data?.data ?? result?.data;
        if (pkgs && Array.isArray(pkgs) && pkgs.length > 0) {
          const tierMap: Record<string, "silver" | "gold" | "diamond" | "platinum" | "vip"> = {
            Silver: "silver",
            Gold: "gold",
            Diamond: "diamond",
            Platinum: "platinum",
            VIP: "vip",
          };
          const mapped: PlanCard[] = pkgs.map((item: any) => {
            const months = parseInt(item.validityPeriod || "0", 10);
            const timeFrame = months >= 12 ? `${months / 12} Year${months > 12 ? "s" : ""}` : `${months} Month${months !== 1 ? "s" : ""}`;
            return {
              id: item.id,
              name: item.name,
              tier: tierMap[item.name] ?? "silver",
              price: item.priceLKR ?? item.price,
              currency: "LKR",
              payCurrency: "USD",
              priceUsd: `$${item.priceUSD ?? item.price ?? 0}`,
              totalSubscribers:
                typeof item.totalSubscribers === "number"
                  ? item.totalSubscribers
                  : 0,
              benefits: [
                { label: "View Photos", value: `${item.profileShowLimit ?? 0} Profiles` },
                { label: "Time Frame", value: timeFrame },
                { label: "View Contacts", value: `${item.contactViewLimit ?? 0} Profiles` },
                { label: "Unlimited Invitation", value: !!item.unlimitedInvitation },
                { label: "Unlimited Horoscope", value: !!item.unlimitedHoroscope },
                { label: "Express Interest", value: !!item.expressInterest },
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
      console.warn("Package id missing — load live plans from the API to purchase.");
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
      {/* Scrollable cards on mobile, grid on desktop */}
      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide lg:grid lg:grid-cols-3 lg:overflow-visible"
      >
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="min-w-[300px] w-[300px] lg:w-full lg:min-w-0 snap-center flex-shrink-0 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden flex flex-col"
          >
            {/* Price Header */}
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

              {/* Tier Badge */}
              <div className="mb-3">
                <TierBadge tier={plan.tier} name={plan.name} />
              </div>

              <p className="text-xs text-[#2C2C2C] text-center mb-5 font-bold tabular-nums">
                {plan.totalSubscribers.toLocaleString()} total subscriber
                {plan.totalSubscribers === 1 ? "" : "s"}
              </p>

              {/* Benefits Divider */}
              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-sm font-semibold text-[#2C2C2C]">
                  Benefits
                </span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {/* Benefits List */}
              <div className="space-y-3.5">
                {plan.benefits.map((benefit, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm text-[#6B6B6B]">
                      {benefit.label}
                    </span>
                    {typeof benefit.value === "boolean" ? (
                      benefit.value ? (
                        <FaCheck className="text-green-500 text-sm" />
                      ) : (
                        <FaTimes className="text-red-500 text-sm" />
                      )
                    ) : (
                      <span className="text-sm font-semibold text-[#2C2C2C]">
                        {benefit.value}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Buy Button */}
            <div className="p-6 pt-4 mt-auto">
              <button
                type="button"
                disabled={
                  checkoutPackageId === plan.id || typeof plan.id !== "number"
                }
                onClick={() => handleBuy(plan)}
                className="w-full py-3.5 bg-maroon text-white text-sm font-semibold rounded-xl hover:bg-maroon/90 transition-colors disabled:opacity-60 disabled:pointer-events-none"
              >
                {checkoutPackageId === plan.id ? "Redirecting…" : "Buy Now"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Credits;
