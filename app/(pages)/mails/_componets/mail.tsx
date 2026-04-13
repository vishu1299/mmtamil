"use client";

import React, { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { MdInbox, MdOutlineMailOutline } from "react-icons/md";
import { FaRegStar } from "react-icons/fa";
import { FiTrash2 } from "react-icons/fi";
import MailInbox from "./mail-inbox";
import MailOutbox from "./mail-outbox";
import MailStarred from "./mail-starred";
import MailTrash from "./mail-trash";

interface MailProps {
  searchQuery?: string;
}

const Mail: React.FC<MailProps> = ({ searchQuery = "" }) => {
  const [activeTab, setActiveTab] = useState("inbox");
  const t = useTranslations("mails");

  const tabs = useMemo(
    () => [
      { id: "inbox", label: t("tabInbox"), icon: <MdInbox className="text-lg" /> },
      { id: "sent", label: t("tabSent"), icon: <MdOutlineMailOutline className="text-lg" /> },
      { id: "starred", label: t("tabStarred"), icon: <FaRegStar className="text-base" /> },
      { id: "trash", label: t("tabTrash"), icon: <FiTrash2 className="text-base" /> },
    ],
    [t]
  );

  return (
    <div className="h-full w-full overflow-hidden rounded-2xl border border-border-soft bg-white shadow-card transition-all duration-300 hover:border-maroon/15 hover:shadow-card-hover">
      {/* Tabs */}
      <div className="flex border-b border-border-soft bg-cream/20">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-1 items-center justify-center gap-2 border-b-2 py-3.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "border-maroon bg-soft-rose/40 text-maroon shadow-sm"
                  : "border-transparent text-[#6B6B6B] hover:bg-soft-rose/25 hover:text-maroon hover:shadow-sm"
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === "inbox" && <MailInbox searchQuery={searchQuery} />}
      {activeTab === "sent" && <MailOutbox />}
      {activeTab === "starred" && <MailStarred />}
      {activeTab === "trash" && <MailTrash />}
    </div>
  );
};

export default Mail;
