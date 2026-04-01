"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { IoChevronBack } from "react-icons/io5";
import { FiBell } from "react-icons/fi";

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  defaultEnabled: boolean;
}

const pushSettingDefaults = [
  { id: "matches", defaultEnabled: true },
  { id: "messages", defaultEnabled: true },
] as const;

const smsSettingDefaults = [
  { id: "sms-messages", defaultEnabled: false },
  { id: "sms-matches", defaultEnabled: false },
] as const;

const Toggle = ({
  enabled,
  onToggle,
}: {
  enabled: boolean;
  onToggle: () => void;
}) => (
  <button
    role="switch"
    aria-checked={enabled}
    onClick={onToggle}
    className={`relative inline-flex h-[30px] w-[52px] items-center rounded-full transition-colors duration-300 flex-shrink-0 cursor-pointer ${
      enabled ? "bg-maroon" : "bg-[#D1D5DB]"
    }`}
  >
    <span
      className={`inline-block h-[24px] w-[24px] rounded-full bg-white shadow-md transition-transform duration-300 ease-in-out ${
        enabled ? "translate-x-[24px]" : "translate-x-[4px]"
      }`}
    />
  </button>
);

const SettingRow = ({
  setting,
  enabled,
  onToggle,
  showBorder,
}: {
  setting: NotificationSetting;
  enabled: boolean;
  onToggle: () => void;
  showBorder: boolean;
}) => (
  <div
    className={`flex justify-between py-5 gap-6 rounded-xl px-2 transition-colors duration-200 hover:bg-soft-rose/25 ${
      showBorder ? "border-b border-[#F0E8E8]" : ""
    }`}
  >
    <div className="flex-1 min-w-0 pt-0.5">
      <h4 className="text-[15px] font-semibold text-[#1A1A1A]">
        {setting.title}
      </h4>
      <p className="text-[13px] text-[#6B6B6B] mt-1 leading-[1.45]">
        {setting.description}
      </p>
    </div>
    <div className="flex items-start pt-1">
      <Toggle enabled={enabled} onToggle={onToggle} />
    </div>
  </div>
);

export default function NotificationSettingsPage() {
  const router = useRouter();
  const tc = useTranslations("common");
  const t = useTranslations("settingsPages");

  const pushSettings: NotificationSetting[] = [
    {
      id: "matches",
      title: t("matchesNotificationsTitle"),
      description: t("matchesNotificationsDesc"),
      defaultEnabled: true,
    },
    {
      id: "messages",
      title: t("messagesTitle"),
      description: t("messagesDesc"),
      defaultEnabled: true,
    },
  ];

  const smsSettings: NotificationSetting[] = [
    {
      id: "sms-messages",
      title: t("messageAlertsTitle"),
      description: t("messageAlertsDesc"),
      defaultEnabled: false,
    },
    {
      id: "sms-matches",
      title: t("matchAlertsTitle"),
      description: t("matchAlertsDesc"),
      defaultEnabled: false,
    },
  ];

  const [toggles, setToggles] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    pushSettingDefaults.forEach((s) => (init[s.id] = s.defaultEnabled));
    smsSettingDefaults.forEach((s) => (init[s.id] = s.defaultEnabled));
    return init;
  });

  const toggle = (id: string) =>
    setToggles((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <main className="flex-1 flex flex-col max-w-[1560px] min-h-screen w-full lg:w-[90%] mx-auto lg:py-6 bg-gradient-to-b from-cream/50 via-white to-soft-rose/20 rounded-2xl">
      {/* Mobile Header */}
      <div className="flex items-center justify-between px-5 py-4 lg:hidden">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/settings")} className="text-[#2C2C2C]">
            <IoChevronBack className="text-2xl" />
          </button>
          <h1 className="font-playfair text-xl font-semibold text-[#2C2C2C]">
            {tc("settings")}
          </h1>
        </div>
        <button className="relative w-10 h-10 rounded-full flex items-center justify-center">
          <FiBell className="text-xl text-maroon" />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#EF4765] rounded-full border-2 border-white" />
        </button>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block mb-6 px-4 lg:px-0">
        <h1 className="font-playfair text-[28px] font-semibold text-maroon">
          {t("notificationsTitle")}
        </h1>
        <p className="text-[#6B6B6B] text-sm mt-1">
          {t("notificationsSubtitle")}
        </p>
      </div>

      {/* Content */}
      <div className="px-5 lg:px-0 pb-28 lg:pb-6">
        <div className="lg:bg-white lg:border lg:border-border-soft lg:rounded-2xl lg:p-8 shadow-card hover:shadow-card-hover transition-all duration-300">
          {/* Page Title */}
          <div className="mt-4 mb-8 lg:mt-0 lg:mb-6">
            <h2 className="font-playfair text-[22px] lg:text-2xl font-bold text-[#1A1A1A]">
              {t("notificationsShortTitle")}
            </h2>
            <p className="text-[14px] text-[#6B6B6B] mt-2 leading-[1.55] max-w-md">
              {t("notificationsSubtitle")}
            </p>
          </div>

          {/* Push Notifications */}
          <section>
            <h3 className="text-[13px] font-semibold text-[#9CA3AF] uppercase tracking-wide mb-1">
              {t("pushNotifications")}
            </h3>
            {pushSettings.map((s, i) => (
              <SettingRow
                key={s.id}
                setting={s}
                enabled={toggles[s.id]}
                onToggle={() => toggle(s.id)}
                showBorder={i < pushSettings.length - 1}
              />
            ))}
          </section>

          <div className="h-px bg-[#F0E8E8] my-2" />

          {/* SMS Notifications */}
          <section className="mt-4">
            <h3 className="text-[13px] font-semibold text-[#9CA3AF] uppercase tracking-wide mb-1">
              {t("smsNotifications")}
            </h3>
            {smsSettings.map((s, i) => (
              <SettingRow
                key={s.id}
                setting={s}
                enabled={toggles[s.id]}
                onToggle={() => toggle(s.id)}
                showBorder={i < smsSettings.length - 1}
              />
            ))}
          </section>
        </div>
      </div>
    </main>
  );
}
