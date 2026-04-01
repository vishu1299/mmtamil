"use client";

import React, { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import Image from "next/image";
import Link from "next/link";
import { isPolicyPageHref, POLICY_PAGE_NEW_TAB } from "@/lib/policy-page-links";
import AboutUs from "./aboutus/page";

const navLinks = [
  { label: "Home", href: "/" },
  // { label: "Search", href: "/search" },
  { label: "Success Stories", href: "/success-stories" },
  { label: "About", href: "/about" },
  { label: "Rules & Policies", href: "/privacyinfo" },
  { label: "Terms & Conditions", href: "/legal-terms" },
];

const AboutHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-[1560px] w-[90%] mx-auto flex items-center justify-between py-4">
          <Link href="/" className="flex items-center shrink-0">
            <Image
              src="/assets/mmtlogo.png"
              alt="MM Tamil"
              width={120}
              height={22}
            />
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`text-sm font-semibold tracking-wide transition-colors ${
                  link.href === "/about"
                    ? "text-maroon"
                    : "text-[#2C2C2C] hover:text-maroon"
                }`}
                {...(isPolicyPageHref(link.href) ? POLICY_PAGE_NEW_TAB : {})}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/login"
              className="text-maroon text-sm font-semibold border border-maroon rounded-full px-6 py-2.5 hover:bg-soft-rose transition-colors"
            >
              Login
            </Link>
            <Link
              href="/loginstep"
              className="bg-maroon text-white text-sm font-semibold rounded-full px-6 py-2.5 hover:bg-maroon/90 transition-colors"
            >
              Register
            </Link>
          </nav>

          <button
            className="md:hidden text-[#2C2C2C] text-2xl"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <HiX /> : <HiMenu />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-white border-t border-border-soft px-6 pb-4 pt-3 flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-[#2C2C2C] text-sm font-semibold hover:text-maroon"
                {...(isPolicyPageHref(link.href) ? POLICY_PAGE_NEW_TAB : {})}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="text-maroon text-sm font-semibold border border-maroon rounded-full px-6 py-2 text-center"
            >
              Login
            </Link>
            <Link
              href="/loginstep"
              onClick={() => setMenuOpen(false)}
              className="bg-maroon text-white text-sm font-semibold rounded-full px-6 py-2 text-center"
            >
              Register
            </Link>
          </div>
        )}
      </header>

      <AboutUs />
    </div>
  );
};

export default AboutHeader;
