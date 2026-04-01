"use client";

import PaidFeatures from "@/app/_components/paid-features/paid-features";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import YourProfile from "./yourprofile";
import { getuserByid, getStoredUser } from "./api/api";
import { getHoroscopeByUserId } from "@/app/api/api";

const Page = () => {
  const t = useTranslations("profile");
  const tc = useTranslations("common");
  const [data, setData] = useState<any>();
  const [horoscope, setHoroscope] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(false);
  const [selectInputFiled, setSelectedInputField] = useState(true);
  const [changeMade, setChangeMade] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setApiError(false);
    try {
      const result = await getuserByid();
      const userData = result?.data;
      setData(userData);
      if (userData?.id) {
        try {
          const horoRes = await getHoroscopeByUserId(userData.id);
          const horoData = horoRes ? (horoRes?.data?.data ?? horoRes?.data ?? null) : null;
          setHoroscope(horoData);
        } catch {
          setHoroscope(null);
        }
      } else {
        setHoroscope(null);
      }
    } catch {
      setData(undefined);
      setApiError(true);
      setHoroscope(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectInputFiled, changeMade]);

  if (loading) {
    return (
      <div className="max-w-[1560px] min-h-screen w-full lg:w-[90%] lg:py-4 mx-auto flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-maroon/30 border-t-maroon rounded-full animate-spin" />
          <p className="text-[#6B6B6B]">{t("loading")}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    const hasToken = !!getStoredUser()?.id;
    return (
      <div className="max-w-[1560px] min-h-screen w-full lg:w-[90%] lg:py-4 mx-auto flex items-center justify-center">
        <div className="flex flex-col items-center gap-6 p-8 bg-white rounded-2xl shadow-md border border-border-soft max-w-md text-center">
          <p className="text-[#6B6B6B] text-lg">
            {hasToken && apiError ? t("errorLoad") : t("pleaseLogin")}
          </p>
          {hasToken && apiError ? (
            <button
              onClick={fetchData}
              className="bg-maroon text-white font-semibold px-8 py-3 rounded-lg hover:bg-maroon/90 transition-colors"
            >
              {tc("retry")}
            </button>
          ) : (
            <Link
              href="/login"
              className="bg-maroon text-white font-semibold px-8 py-3 rounded-lg hover:bg-maroon/90 transition-colors"
            >
              {tc("goToLogin")}
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1560px] min-h-screen w-full lg:w-[90%] lg:py-4 mx-auto">
      <div className="flex justify-between items-start w-full">
        <div className="w-full flex flex-col lg:mr-4">
          <YourProfile
            changeMade={changeMade}
            setChangeMade={setChangeMade}
            data={data}
            horoscope={horoscope}
            selectInputFiled={selectInputFiled}
            setSelectedInputField={setSelectedInputField}
          />
        </div>
        <div className="hidden xl:block min-w-[312px] w-[312px]">
          <PaidFeatures />
        </div>
      </div>
    </div>
  );
};

export default Page;
