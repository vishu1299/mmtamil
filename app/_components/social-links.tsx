"use client";

import React from "react";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTiktok,
  FaYoutube,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

/** Official MM Tamil social profiles — used in header & footer */
export const SOCIAL_LINKS = [
  {
    href: "https://www.facebook.com/share/16fxsUme6K/?mibextid=wwXIfr",
    label: "Facebook",
    Icon: FaFacebook,
  },
  {
    href: "https://www.tiktok.com/@mmsltamil?_r=1&_t=ZS-952SSXpxvap",
    label: "TikTok",
    Icon: FaTiktok,
  },
  {
    href: "https://www.instagram.com/mmsltamil?igsh=MWd5dWxpaGdjNjVlcg%3D%3D&utm_source=qr",
    label: "Instagram",
    Icon: FaInstagram,
  },
  {
    href: "https://youtube.com/@mmsltamil?si=U6q5NMhx-GITzA-I",
    label: "YouTube",
    Icon: FaYoutube,
  },
  {
    href: "https://x.com/mmsltamil?s=11",
    label: "X (Twitter)",
    Icon: FaXTwitter,
  },
  {
    href: "https://www.linkedin.com/in/%E0%AE%AE%E0%AE%BE%E0%AE%99%E0%AF%8D%E0%AE%95%E0%AE%B2%E0%AF%8D%E0%AE%AF%E0%AE%AE%E0%AF%8D-%E0%AE%A4%E0%AE%AE%E0%AE%BF%E0%AE%B4%E0%AF%8D-1b74743ba?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
    label: "LinkedIn",
    Icon: FaLinkedin,
  },
] as const;

type SocialLinksProps = {
  /** Slightly smaller icons in the sticky header */
  variant?: "header" | "footer";
  className?: string;
};

export function SocialLinks({
  variant = "footer",
  className = "",
}: SocialLinksProps) {
  const iconWrap =
    variant === "header"
      ? "h-8 w-8 [&>svg]:h-[15px] [&>svg]:w-[15px]"
      : "h-9 w-9 [&>svg]:h-[18px] [&>svg]:w-[18px]";

  return (
    <div
      className={`flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 ${className}`}
      role="navigation"
      aria-label="Social media"
    >
      {SOCIAL_LINKS.map(({ href, label, Icon }) => (
        <a
          key={href}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className={`flex shrink-0 items-center justify-center rounded-full border border-maroon/15 bg-white text-maroon transition-all duration-200 hover:border-maroon/40 hover:bg-soft-rose hover:shadow-sm ${iconWrap}`}
        >
          <Icon className="shrink-0" aria-hidden />
        </a>
      ))}
    </div>
  );
}

export default SocialLinks;
