"use client";
import OnlineNowSidebar from "@/app/(pages)/people/onlineNowSidebar";
import { Button } from "@/components/ui/button";
import { PaidItem } from "@/data/paid-features/paid-features";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const PaidFeatures = () => {
  const pathname = usePathname();
  const t = useTranslations("paidFeatures");

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex flex-col gap-y-4 rounded-2xl border border-border-soft bg-white px-5 py-5 shadow-card transition-all duration-300 hover:border-maroon/15 hover:shadow-card-hover">
        <p className="text-[16px] font-playfair font-semibold text-maroon">
          {t("title")}
        </p>
        <div className="flex flex-col">
          {PaidItem.map((item, index) => (
            <div key={index} className="flex gap-3 items-center py-2">
              <div className="bg-soft-rose w-8 h-8 rounded-full flex justify-center items-center text-maroon">
                {item.icon}
              </div>
              <p className="text-sm text-[#2C2C2C]">{t(item.messageKey)}</p>
            </div>
          ))}
        </div>
        <Link href="/credits">
          <Button
            variant="secondary"
            size="secondary"
            className="w-full px-6 py-5 border-2 border-gold text-gold bg-white hover:bg-gold hover:text-white rounded-lg font-semibold transition-all duration-200"
          >
            {t("getPremium")}
          </Button>
        </Link>
      </div>

      {/* <div className="flex flex-col text-[#6B6B6B] bg-white border border-border-soft rounded-2xl py-4">
        <p className="py-2 px-5 text-[16px] font-playfair text-maroon font-semibold">
          My Activity
        </p>
        <div className="flex px-5 hover:bg-soft-rose py-2.5 justify-between items-center transition-colors cursor-pointer">
          <Link href="/chat" className="text-sm">Chat</Link>
          <p className="bg-maroon px-2.5 py-0.5 text-xs rounded-full flex justify-center items-center text-white">
            2
          </p>
        </div>

        <Link href="/mails">
          <p className="py-2.5 px-5 hover:bg-soft-rose text-sm transition-colors">Message</p>
        </Link>

        <Link href="/search?type=following">
          <p className="py-2.5 px-5 hover:bg-soft-rose text-sm transition-colors">Following</p>
        </Link>
      </div> */}

      {pathname === "/people" && <OnlineNowSidebar />}
    </div>
  );
};
export default PaidFeatures;
