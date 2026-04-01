"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import { useTranslations } from "next-intl";

const NavbarSecond = () => {
  const t = useTranslations("navbarSecond");

  return (
    <div className="sticky top-0 z-50 bg-[#ffffff] shadow-md">
      <div className="">
        <div className="max-w-[1560px]   w-[90%] mx-auto flex justify-between items-center ">
          <Link className="" href={"/"}>
          <Image
                src="/assets/mmtlogo.png"
                alt={t("logoAlt")}
                width={110}
                height={16}
              />
          </Link>
          <div className="hidden lg:block">
            <div className="flex gap-4">
              <p className="text-dark-mmm font-semibold">{t("notMember")}</p>
              <Link href="/loginstep">
                <div className="flex gap-2 text-pink-mmm font-semibold  items-center cursor-pointer">
                  <p>{t("registerNow")}</p>
                  <FaArrowRightLong />
                </div>
              </Link>
            </div>
          </div>
          <div className=" lg:hidden">
            <Link href="/loginstep">
              <p className="border px-3 py-2 shadow-md bg-white rounded-xl text-pink-mmm font-semibold">
                {" "}
                {t("signUp")}
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavbarSecond;
