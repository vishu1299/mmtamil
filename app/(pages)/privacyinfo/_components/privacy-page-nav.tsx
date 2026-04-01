"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { isPolicyPageHref, POLICY_PAGE_NEW_TAB } from "@/lib/policy-page-links";
import { IoIosMenu } from "react-icons/io";
import { RxCross1 } from "react-icons/rx";

export function PrivacyPageNav() {
  const t = useTranslations("privacyInfo");
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: t("navHome") },
    { href: "/privacyinfo", label: t("navRulesPolicies") },
    { href: "/support", label: t("navGuides") },
  ] as const;

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const toggleMenu = useCallback(() => setMenuOpen((o) => !o), []);

  return (
    <header className="sticky top-0 z-50 border-b border-border-soft bg-[#F5F5F5]/95 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 md:py-3.5">
        <div className="flex min-w-0 flex-1 items-center gap-3 md:gap-4">
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="privacy-mobile-nav"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="shrink-0 rounded-lg p-1 text-[#2C2C2C] transition-colors hover:bg-black/5 md:hidden"
            onClick={toggleMenu}
          >
            {menuOpen ? (
              <RxCross1 className="text-2xl" />
            ) : (
              <IoIosMenu className="text-2xl" />
            )}
          </button>

          <Link
            href="/"
            className="relative h-8 w-[120px] shrink-0 sm:h-9 sm:w-[140px]"
            onClick={closeMenu}
          >
            <Image
              src="/assets/mmtlogo.png"
              alt="Mangalyam Tamil"
              fill
              className="object-contain object-left"
              sizes="140px"
              priority
            />
          </Link>
        </div>

        <nav
          className="hidden items-center gap-6 lg:gap-8 md:flex"
          aria-label="Privacy page navigation"
        >
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm font-medium text-[#2C2C2C] transition-colors hover:text-maroon lg:text-base"
              {...(isPolicyPageHref(href) ? POLICY_PAGE_NEW_TAB : {})}
            >
              {label}
            </Link>
          ))}
        </nav>

        <Link
          href="/search"
          className="hidden shrink-0 rounded-lg border border-maroon px-3 py-2 text-sm font-semibold text-maroon transition-colors hover:bg-maroon hover:text-white md:inline-flex md:px-4"
          onClick={closeMenu}
        >
          {t("navBackToSearch")}
        </Link>
      </div>

      {menuOpen && (
        <nav
          id="privacy-mobile-nav"
          className="border-t border-border-soft bg-[#F5F5F5] px-4 py-4 md:hidden"
          aria-label="Mobile privacy navigation"
        >
          <ul className="flex flex-col gap-3">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="block rounded-lg px-2 py-2 text-sm font-medium text-[#2C2C2C] hover:bg-white hover:text-maroon"
                  onClick={closeMenu}
                  {...(isPolicyPageHref(href) ? POLICY_PAGE_NEW_TAB : {})}
                >
                  {label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/search"
                className="mt-1 block rounded-lg border border-maroon px-3 py-2.5 text-center text-sm font-semibold text-maroon hover:bg-maroon hover:text-white"
                onClick={closeMenu}
              >
                {t("navBackToSearch")}
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
