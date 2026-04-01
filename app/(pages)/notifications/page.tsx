"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { IoChevronBack } from "react-icons/io5";
import { FiSettings } from "react-icons/fi";
import Notifications from "./_components/notifications";

const Page = () => {
  const router = useRouter();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[1560px] flex-1 flex-col lg:w-[90%] lg:py-6">
      {/* Mobile Header */}
      <div className="flex items-center justify-between px-4 py-4 lg:hidden">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-lg border border-transparent p-1 text-[#2C2C2C] transition-all duration-200 hover:border-border-soft hover:bg-soft-rose/60 hover:shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon/30"
          >
            <IoChevronBack className="text-2xl" />
          </button>
          <h1 className="font-playfair text-xl font-semibold text-[#2C2C2C]">
            Notification
          </h1>
        </div>
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-transparent transition-all duration-200 hover:border-border-soft hover:bg-soft-rose/50 hover:shadow-soft"
        >
          <FiSettings className="text-lg text-maroon" />
        </button>
      </div>

      {/* Desktop Header */}
      <div className="mb-5 hidden rounded-2xl border border-border-soft bg-gradient-to-br from-white to-cream/30 px-4 py-5 shadow-card transition-all duration-300 hover:shadow-card-hover lg:block lg:px-6">
        <h1 className="font-playfair text-[28px] font-semibold tracking-tight text-maroon">
          Notifications
        </h1>
        <p className="mt-1 text-sm text-[#6B6B6B]">
          Stay updated with your matches and activity
        </p>
      </div>

      <Notifications />
    </main>
  );
};

export default Page;
