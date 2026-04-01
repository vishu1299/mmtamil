"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { IoChevronBack } from "react-icons/io5";
import { FiBell, FiSettings } from "react-icons/fi";
import Credits from "./_components/credits";

const Page = () => {
  const router = useRouter();

  return (
    <main className="flex-1 flex flex-col max-w-[1560px] min-h-screen w-full lg:w-[90%] mx-auto lg:py-6">
      {/* Mobile Header */}
      <div className="flex items-center justify-between px-4 py-4 lg:hidden">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="text-[#2C2C2C]">
            <IoChevronBack className="text-2xl" />
          </button>
          <h1 className="font-playfair text-xl font-semibold text-[#2C2C2C]">
            Premium
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="w-10 h-10 rounded-full flex items-center justify-center">
            <FiBell className="text-xl text-[#2C2C2C]" />
          </button>
          <button className="w-10 h-10 rounded-full flex items-center justify-center">
            <FiSettings className="text-lg text-[#2C2C2C]" />
          </button>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block mb-4 px-4 lg:px-0">
        <h1 className="font-playfair text-[28px] font-semibold text-maroon">
          Premium Plans
        </h1>
        <p className="text-[#6B6B6B] text-sm mt-1">
          Unlock exclusive features and connect with your matches
        </p>
      </div>

      {/* Browse Plans Title */}
      <div className="text-center mb-6 px-4">
        <h2 className="font-playfair text-2xl font-bold text-[#2C2C2C]">
          Browse Plans
        </h2>
      </div>

      <Credits />
    </main>
  );
};

export default Page;
