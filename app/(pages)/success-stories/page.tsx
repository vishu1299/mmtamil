"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { IoChevronBack } from "react-icons/io5";
import { FaHeart } from "react-icons/fa";
import { FiBell } from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";
import { getSuccessStories } from "@/app/api/api";
import { hasAccessToken } from "@/lib/auth/access-token";

interface SuccessStory {
  id: number;
  marriedOn: string;
  bride: { name: string; image: string };
  groom: { name: string; image: string };
}


const SuccessStoriesPage = () => {
  const router = useRouter();
  const t = useTranslations("successStories");
  const tc = useTranslations("common");
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!hasAccessToken()) {
      const path = `${window.location.pathname}${window.location.search}`;
      router.replace(`/login?redirect=${encodeURIComponent(path)}`);
      return;
    }
    setAuthChecked(true);
  }, [router]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["success-stories"],
    queryFn: getSuccessStories,
  });

  if (isLoading || !authChecked) {
    return <div>{tc("loading")}</div>;
  }

  if (error) {
    return (
      <div>{t("errorWithMessage", { message: (error as Error).message })}</div>
    );
  }

  const rawStories: SuccessStory[] = data?.data?.data?.stories ?? [];
  if (rawStories.length === 0) {
    return <div className="text-center py-10">No success stories available right now.</div>;
  }
  const successStories = Array.isArray(rawStories) ? rawStories : [];

  return (
    <div className="max-w-[1560px] min-h-screen w-full lg:w-[90%] mx-auto lg:py-6">
      <div className="flex items-center justify-between px-4 py-4 lg:hidden">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="text-[#2C2C2C]"
            aria-label={t("backAria")}
          >
            <IoChevronBack className="text-2xl" />
          </button>
          <h1 className="font-playfair text-xl font-semibold text-[#2C2C2C]">
            {t("title")}
          </h1>
        </div>
        <button
          type="button"
          className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center"
          aria-label={t("bellAria")}
        >
          <FiBell className="text-lg text-[#2C2C2C]" />
        </button>
      </div>

      <div className="hidden lg:block mb-6 px-4 lg:px-0">
        <h1 className="font-playfair text-[28px] font-semibold text-maroon">
          {t("title")}
        </h1>
        <p className="text-[#6B6B6B] text-sm mt-1">{t("subtitle")}</p>
      </div>

      <div className="px-4 lg:px-0">
        <div className="flex items-center justify-center gap-3 mb-6">
          <h2 className="text-lg font-semibold text-[#2C2C2C]">
            {t("title")}
          </h2>
          <span className="text-2xl font-bold text-maroon">
            +{successStories.length}
          </span>
        </div>

        <div className="space-y-6 lg:grid lg:grid-cols-2 xl:grid-cols-3 lg:gap-6 lg:space-y-0">
          {successStories.map((story: SuccessStory) => (
            <div
              key={story.id}
              className="border border-gray-200 rounded-2xl p-6 bg-white"
            >
              <p className="text-center text-sm text-[#6B6B6B] mb-4">
                {t("marriedOnPrefix")}{" "}
                <span className="font-semibold text-[#2C2C2C]">
                  {story.marriedOn}
                </span>
              </p>

              <div className="flex items-center justify-center gap-0">
                <span className="text-[15px] font-medium text-[#2C2C2C] mr-3">
                  {story.bride.name}
                </span>

                <div className="relative flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-[3px] border-white shadow-md z-10">
                    <Image
                      src={story.bride.image}
                      alt={story.bride.name}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="w-24 h-24 rounded-full overflow-hidden border-[3px] border-white shadow-md -ml-6 z-0">
                    <Image
                      src={story.groom.image}
                      alt={story.groom.name}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-20">
                    <FaHeart className="text-pink-400 text-xl drop-shadow-sm" />
                  </div>
                </div>

                <span className="text-[15px] font-medium text-[#2C2C2C] ml-3">
                  {story.groom.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SuccessStoriesPage;
