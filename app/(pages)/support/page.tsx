"use client";

import React, { useState } from "react";
import { IoIosMenu } from "react-icons/io";
import { RxCross1 } from "react-icons/rx";

import Image from "next/image";
import Link from "next/link";
import { POLICY_PAGE_NEW_TAB } from "@/lib/policy-page-links";
import Faq from "./faq/page";

const FAQHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="border-b-2 border-gray-300 bg-gray-100">
      <div className="bg-gray-100 sticky top-0">
        <div className="w-[90%] mx-auto">
          <div className="flex items-center justify-between md:py-2">
            {menuOpen ? (
              <RxCross1
                aria-label="Close menu"
                className="text-3xl cursor-pointer md:hidden"
                onClick={toggleMenu}
              />
            ) : (
              <IoIosMenu
                aria-label="Open menu"
                className="text-3xl cursor-pointer md:hidden"
                onClick={toggleMenu}
              />
            )}

            {/* Logo */}
            <Image
              src="/assets/mmtlogo.png"
              alt="logo"
              width={150}
              height={20}
            />

            <ul className="hidden md:flex items-center gap-4 md:gap-8">
              <li className="cursor-pointer hover:text-[#e6246b] text-sm md:text-md lg:text-lg xl:text-xl">
                <Link href="/">Home</Link>
              </li>
              <li className="cursor-pointer hover:text-[#e6246b] text-sm md:text-md lg:text-lg xl:text-xl">
                <Link href="/privacyinfo" {...POLICY_PAGE_NEW_TAB}>
                  Rules and Policies
                </Link>
              </li>
              <li className="cursor-pointer hover:text-[#e6246b] text-sm md:text-md lg:text-lg xl:text-xl">
                <Link href="/support">Educational Guides</Link>
              </li>
            </ul>

            <Link href="/search">
              <p className="hidden md:block cursor-pointer hover:bg-[#e6246b] hover:text-white text-[#e6246b]text-sm md:text-md lg:text-lg xl:text-xl border py-2 px-2 rounded-md">
                Back to Match Meet & Marry
              </p>
            </Link>
          </div>

          {menuOpen && (
            <ul className="flex flex-col gap-4 bg-gray-100 p-4 md:hidden">
              <li className="cursor-pointer hover:text-[#e6246b] text-sm">
                <a href="#about-us-section">Home</a>
              </li>
              <li className="cursor-pointer hover:text-[#e6246b] text-sm">
                <a href="#How-we-enforce-the-rules">Rules and Policies</a>
              </li>
              <li className="cursor-pointer hover:text-[#e6246b] text-sm">
                <a href="#Transparency-reports">Transparency</a>
              </li>
              <li className="cursor-pointer hover:text-[#e6246b] text-sm">
                <a href="#How-we-prevent-sca">Educational Guides</a>
              </li>
              <Link href="/">
                <p className="text-sm hover:bg-[#e6246b]hover:text-white text-[#e6246b]">
                  Back to Match Meet & Marry
                </p>
              </Link>
            </ul>
          )}
        </div>
      </div>
      <Faq />
    </div>
  );
};

export default FAQHeader;
