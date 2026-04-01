"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IoChevronBack } from "react-icons/io5";
import { FiImage, FiUser } from "react-icons/fi";
import { getuserByid } from "@/app/(pages)/profile/api/api";

interface UserPaymentItem {
  id: number;
  userId: number;
  packageId: number;
  profileShowLimit: number;
  contactViewLimit: number;
  validityPeriod: string;
  createdAt: string;
  package?: {
    id: number;
    name: string;
    profileShowLimit: number;
    contactViewLimit: number;
    validityPeriod: string;
  };
}

const PremiumPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profileShowLimit, setProfileShowLimit] = useState(0);
  const [contactViewLimit, setContactViewLimit] = useState(0);
  const [expireOn, setExpireOn] = useState<string | null>(null);
  const [packageName, setPackageName] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await getuserByid();
        const user = res?.data;
        const payments: UserPaymentItem[] = user?.UserPayment ?? user?.userPayment ?? [];
        if (payments.length > 0) {
          const latest = payments.sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )[0];
          const pkg = latest.package;
          setProfileShowLimit(latest.profileShowLimit ?? pkg?.profileShowLimit ?? 0);
          setContactViewLimit(latest.contactViewLimit ?? pkg?.contactViewLimit ?? 0);
          setPackageName(pkg?.name ?? null);
          const months = parseInt(latest.validityPeriod || pkg?.validityPeriod || "0", 10);
          if (months && latest.createdAt) {
            const end = new Date(latest.createdAt);
            end.setMonth(end.getMonth() + months);
            const d = end.getDate().toString().padStart(2, "0");
            const m = (end.getMonth() + 1).toString().padStart(2, "0");
            const y = end.getFullYear();
            setExpireOn(`${d}-${m}-${y}`);
          } else {
            setExpireOn(null);
          }
        } else {
          setProfileShowLimit(0);
          setContactViewLimit(0);
          setExpireOn(null);
          setPackageName(null);
        }
      } catch {
        setProfileShowLimit(0);
        setContactViewLimit(0);
        setExpireOn(null);
        setPackageName(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const hasPremium = profileShowLimit > 0 || contactViewLimit > 0;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[1560px] flex-1 flex-col lg:w-[90%] lg:py-6">
      {/* Mobile Header */}
      <div className="flex items-center gap-3 px-4 py-4 lg:hidden">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border border-transparent p-1 text-[#2C2C2C] transition-all duration-200 hover:border-border-soft hover:bg-soft-rose/60 hover:shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon/30"
        >
          <IoChevronBack className="text-2xl" />
        </button>
        <h1 className="font-playfair text-xl font-semibold text-[#2C2C2C]">
          Premium
        </h1>
      </div>

      {/* Desktop Header */}
      <div className="mb-5 hidden rounded-2xl border border-border-soft bg-gradient-to-br from-white to-cream/30 px-4 py-5 shadow-card transition-all duration-300 hover:shadow-card-hover lg:block lg:px-6">
        <h1 className="font-playfair text-[28px] font-semibold tracking-tight text-maroon">
          Premium
        </h1>
        <p className="mt-1 text-sm text-[#6B6B6B]">
          Your balance and premium features
        </p>
      </div>

      {/* Content */}
      <div className="px-4 pb-24 lg:px-0">
        <div className="mb-4 flex items-center justify-between rounded-xl border border-border-soft bg-white px-4 py-3 shadow-soft">
          <h2 className="font-playfair text-lg font-semibold text-[#2C2C2C]">
            Your Balance
          </h2>
          <button
            type="button"
            onClick={() => router.push("/credits")}
            className="rounded-xl border-2 border-maroon/25 bg-maroon px-5 py-2.5 text-sm font-semibold text-white shadow-maroon transition-all duration-200 hover:bg-maroon/92 hover:shadow-maroon-lg hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon/40 focus-visible:ring-offset-2 motion-reduce:hover:translate-y-0"
          >
            {hasPremium ? "Upgrade" : "Get Premium"}
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-10 h-10 border-2 border-maroon/30 border-t-maroon rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {packageName && (
              <p className="text-sm text-[#6B6B6B] mb-3">
                Package: <span className="text-[#2C2C2C] font-medium">{packageName}</span>
              </p>
            )}
            <div className="overflow-hidden rounded-2xl border-2 border-border-soft bg-white shadow-card transition-all duration-300 hover:border-maroon/15 hover:shadow-card-hover">
              <div className="flex items-center justify-between border-b border-border-soft px-4 py-4 transition-colors duration-200 hover:bg-cream/30">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-maroon/10 bg-soft-rose text-maroon shadow-sm">
                    <FiImage className="text-lg" />
                  </div>
                  <span className="text-sm font-medium text-[#2C2C2C]">Photo View</span>
                </div>
                <span className="text-sm font-semibold text-[#2C2C2C]">
                  {profileShowLimit}
                </span>
              </div>
              <div className="flex items-center justify-between px-4 py-4 transition-colors duration-200 hover:bg-cream/30">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-maroon/10 bg-soft-rose text-maroon shadow-sm">
                    <FiUser className="text-lg" />
                  </div>
                  <span className="text-sm font-medium text-[#2C2C2C]">Contact View</span>
                </div>
                <span className="text-sm font-semibold text-[#2C2C2C]">
                  {contactViewLimit}
                </span>
              </div>
            </div>

            {expireOn ? (
              <p className="mt-4 text-sm text-[#6B6B6B]">
                Expire on: <span className="text-[#2C2C2C] font-medium">{expireOn}</span>
              </p>
            ) : (
              !hasPremium && (
                <p className="mt-4 text-sm text-[#6B6B6B]">
                  You don&apos;t have an active premium package. Upgrade to get Photo View and Contact View.
                </p>
              )
            )}
          </>
        )}
      </div>
    </main>
  );
};

export default PremiumPage;
