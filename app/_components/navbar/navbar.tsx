"use client";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";

import { NavMenu } from "./nav-menu";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { MdPersonSearch } from "react-icons/md";
import { IoMdMail } from "react-icons/io";
import { FiUsers, FiUser } from "react-icons/fi";
import { FaCrown } from "react-icons/fa";
import { BsBell } from "react-icons/bs";
import { SocialLinks } from "../social-links";

const Navbar = () => {
  const t = useTranslations("nav");
  const [activeId, setActiveId] = useState<number | null>(1);
  const path = usePathname();

  const navItems = useMemo(
    () => [
      { path: "/search", icon: <MdPersonSearch className="text-xl" />, label: t("explore") },
      { path: "/matches", icon: <FiUsers className="text-xl" />, label: t("matches") },
      { path: "/mails", icon: <IoMdMail className="text-xl" />, label: t("messages") },
      { path: "/premium", icon: <FaCrown className="text-xl" />, label: t("premium") },
      { path: "/notifications", icon: <BsBell className="text-xl" />, label: t("notifications") },
    ],
    [t]
  );

  const mobileNavItems = useMemo(
    () => [
      { id: 1, url: "/search", icon: <MdPersonSearch className="text-xl" />, label: t("explore") },
      { id: 2, url: "/matches", icon: <FiUsers className="text-xl" />, label: t("matches") },
      { id: 3, url: "/mails", icon: <IoMdMail className="text-xl" />, label: t("inbox") },
      { id: 4, url: "/premium", icon: <FaCrown className="text-xl" />, label: t("premium") },
      { id: 5, url: "/profile", icon: <FiUser className="text-xl" />, label: t("profile") },
    ],
    [t]
  );

  useEffect(() => {}, [activeId]);

  return (
    <>
      <div className="sticky top-0 z-50 border-b border-border-soft bg-white shadow-soft">
        {/* Desktop */}
        <div className="hidden lg:block">
          <div className="max-w-[1560px] w-[90%] mx-auto flex justify-between items-center gap-3">
            <div className="flex min-w-0 shrink items-center gap-3 xl:gap-4">
              <Link
                href="/search"
                className="shrink-0 rounded-lg py-3 transition-all duration-200 hover:shadow-soft"
              >
                <Image
                  src="/assets/mmtlogo.png"
                  alt="logo"
                  width={110}
                  height={16}
                />
              </Link>
              
            </div>

            <div className="flex shrink-0 gap-4">
              {navItems.map((item) => {
                const isActive = path === item.path;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`group flex w-[75px] cursor-pointer flex-col items-center gap-y-1 border-b-2 py-4 transition-all duration-200 xl:w-[90px] ${
                      isActive
                        ? "border-maroon shadow-[0_4px_20px_-8px_rgba(141,27,61,0.2)]"
                        : "border-transparent hover:border-gold hover:shadow-soft"
                    }`}
                  >
                    <div
                      className={`relative flex h-9 w-9 items-center justify-center rounded-full border border-transparent transition-all duration-200 ${
                        isActive
                          ? "bg-soft-rose text-maroon shadow-soft ring-1 ring-maroon/15"
                          : "text-[#6B6B6B] group-hover:scale-110 group-hover:border-border-soft group-hover:bg-soft-rose group-hover:text-maroon group-hover:shadow-soft"
                      }`}
                    >
                      {item.icon}
                    </div>
                    <p
                      className={`text-xs font-semibold transition-colors duration-200 ${
                        isActive
                          ? "text-maroon"
                          : "text-[#6B6B6B] group-hover:text-maroon"
                      }`}
                    >
                      {item.label}
                    </p>
                  </Link>
                );
              })}
            </div>

            <div className="flex">
              <NavMenu />
            </div>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between gap-2 px-4 py-3">
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <Link href="/search" className="shrink-0">
                <Image
                  src="/assets/mmtlogo.png"
                  alt="logo"
                  width={100}
                  height={15}
                />
              </Link>
              <SocialLinks
                variant="header"
                className="min-w-0 flex-1 justify-start overflow-x-auto no-scrollbar"
              />
            </div>
            <div className="flex shrink-0 justify-end">
              <NavMenu />
            </div>
          </div>

          {/* Mobile Bottom Nav */}
          <div className="fixed bottom-0 z-50 w-full border-t border-border-soft bg-white shadow-nav-up">
            <div className="flex justify-around items-center py-1.5">
              {mobileNavItems.map((item) => {
                const isActive = path === item.url;
                return (
                  <Link
                    href={item.url || "#"}
                    key={item.id}
                    onClick={() => setActiveId(item.id)}
                    className={`group flex w-full flex-col items-center p-1.5 text-xs font-medium transition-all duration-200 ${
                      isActive
                        ? "text-maroon"
                        : "text-[#6B6B6B] active:text-maroon"
                    }`}
                  >
                    <div
                      className={`relative flex h-9 w-9 items-center justify-center rounded-full border border-transparent transition-all duration-200 ${
                        isActive
                          ? "bg-soft-rose text-maroon shadow-soft ring-1 ring-maroon/20"
                          : "group-hover:border-border-soft group-hover:shadow-sm group-active:scale-95 group-active:bg-soft-rose"
                      }`}
                    >
                      {item.icon}
                    </div>
                    <p className="mt-0.5">{item.label}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
