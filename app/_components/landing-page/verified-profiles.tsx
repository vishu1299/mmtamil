"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { getAllUsersForSearch } from "@/app/(pages)/search/api/api";
import type { User } from "@/app/(pages)/search/type/type";
import { hasAccessToken } from "@/lib/auth/access-token";

/** Fallback visuals only if getAll fails (same layout as before). */
const STATIC_MAIN_THREE = [
  {
    id: 0,
    name: "Priya",
    age: 25,
    profession: "Software Engineer",
    location: "Chennai",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop&crop=face",
  },
  {
    id: 0,
    name: "Sneha",
    age: 27,
    profession: "Doctor",
    location: "Mumbai",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop&crop=face",
  },
  {
    id: 0,
    name: "Nisha",
    age: 24,
    profession: "Teacher",
    location: "Bangalore",
    image:
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=500&fit=crop&crop=face",
  },
];

const CREATE_CARD_IMAGE =
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=500&fit=crop&crop=face";

const THREE_MONTHS_MS = 90 * 24 * 60 * 60 * 1000;

function displayName(u: User): string {
  const first = String(u.profile?.firstName ?? "").trim();
  const last = String(u.profile?.lastName ?? "").trim();
  const full = [first, last].filter(Boolean).join(" ");
  return full || String(u.userName ?? "").trim() || "Member";
}

/** Softer than ALL CAPS from API (readability). */
function formatDisplayName(raw: string): string {
  const t = raw.trim();
  if (!t) return t;
  if (t !== t.toUpperCase() || !/[A-Z]/.test(t)) return t;
  return t
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
    .join(" ");
}

function ageFromUser(u: User): number | null {
  const dob = u.profile?.dateOfBirth;
  if (!dob) return null;
  const d = new Date(dob);
  if (Number.isNaN(d.getTime())) return null;
  const age = Math.floor(
    (Date.now() - d.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
  );
  /* Reject 0 / invalid DOB so we never show ", 0" */
  if (age < 1 || age >= 120) return null;
  return age;
}

function profileImageSrc(u: User): string {
  const pic = u.profile?.profilePicture;
  if (pic) {
    const base = process.env.NEXT_PUBLIC_IMAGE_URL ?? "";
    return pic.startsWith("http") ? pic : `${base}${pic}`;
  }
  return "/assets/images/search/DefaultAvatar.svg";
}

function joinedTime(u: User): number {
  const raw = u.createdAt || u.profile?.createdAt;
  if (!raw) return 0;
  const t = new Date(raw).getTime();
  return Number.isNaN(t) ? 0 : t;
}

/** Last 3 months, newest first, max 2 */
function pickRecentTwo(users: User[]): User[] {
  const cutoff = Date.now() - THREE_MONTHS_MS;
  return users
    .filter((u) => {
      const t = joinedTime(u);
      return t > 0 && t >= cutoff;
    })
    .sort((a, b) => joinedTime(b) - joinedTime(a))
    .slice(0, 2);
}

type MainRow = {
  id: number;
  name: string;
  age: number | string;
  profession: string;
  location: string;
  image: string;
  /** Real user id for /search/[id]; 0 = fallback mock */
  targetId: number;
};

function buildMainThree(users: User[] | null): MainRow[] {
  const rows: MainRow[] = [];
  for (let i = 0; i < 3; i++) {
    const u = users?.[i];
    if (u) {
      const age = ageFromUser(u);
      rows.push({
        id: u.id,
        targetId: u.id,
        name: formatDisplayName(displayName(u)),
        age: age ?? "—",
        profession: String(
          u.profile?.field_of_work ?? u.profile?.profession ?? ""
        ).trim(),
        location: String(
          u.profile?.city ?? u.profile?.country ?? ""
        ).trim(),
        image: profileImageSrc(u),
      });
    } else {
      const s = STATIC_MAIN_THREE[i];
      rows.push({
        id: i + 1,
        targetId: 0,
        name: s.name,
        age: s.age,
        profession: s.profession,
        location: s.location,
        image: s.image,
      });
    }
  }
  return rows;
}

const VerifiedProfiles = () => {
  const t = useTranslations("verifiedProfiles");
  const [users, setUsers] = useState<User[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(hasAccessToken());
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const response = await getAllUsersForSearch(80);
        const list = response?.data?.data?.data;
        if (!cancelled && Array.isArray(list)) {
          setUsers(list);
        } else if (!cancelled) {
          setUsers([]);
        }
      } catch {
        if (!cancelled) setUsers(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const mainThree = useMemo(() => buildMainThree(users), [users]);

  const recentTwo = useMemo(() => {
    if (!users?.length) return [];
    return pickRecentTwo(users);
  }, [users]);

  const seeProfileHref = (targetId: number) => {
    if (targetId <= 0) {
      return `/login?redirect=${encodeURIComponent("/search")}`;
    }
    const path = `/search/${targetId}`;
    if (loggedIn) return path;
    return `/login?redirect=${encodeURIComponent(path)}`;
  };

  const browseHref = loggedIn
    ? "/search"
    : `/login?redirect=${encodeURIComponent("/search")}`;

  const imgUnopt = (src: string) =>
    src.startsWith("http") && !src.includes("unsplash.com");

  return (
    <section className="py-16 lg:py-24 bg-cream">
      <div className="max-w-[1560px] w-[90%] mx-auto">
        <h2 className="font-playfair text-maroon text-3xl md:text-4xl font-bold">
          {t("title")}
        </h2>
        <p className="text-[#6B6B6B] mt-2">{t("subtitle")}</p>

        <div className="mt-12 flex flex-col xl:flex-row gap-10">
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl overflow-hidden shadow-md border border-border-soft flex flex-col h-full"
                  >
                    <div className="aspect-[3/4] bg-gray-200 animate-pulse shrink-0" />
                    <div className="p-4 flex flex-col flex-1 min-h-[168px]">
                      <div className="flex-1 space-y-2">
                        <div className="h-5 bg-gray-200 rounded animate-pulse" />
                        <div className="h-4 bg-gray-200 rounded w-4/5 animate-pulse" />
                        <div className="h-4 bg-gray-200 rounded w-3/5 animate-pulse" />
                      </div>
                      <div className="h-10 bg-gray-200 rounded animate-pulse mt-4 w-full shrink-0" />
                    </div>
                  </div>
                ))
              : mainThree.map((profile, idx) => (
                  <div
                    key={`main-${idx}-${profile.targetId}`}
                    className="bg-white rounded-2xl overflow-hidden shadow-md border border-border-soft hover:shadow-lg transition-shadow flex flex-col h-full"
                  >
                    <div className="relative aspect-[3/4] w-full shrink-0 bg-[#f0f0f0]">
                      <Image
                        src={profile.image}
                        alt={profile.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, 25vw"
                        unoptimized={imgUnopt(profile.image)}
                      />
                    </div>
                    <div className="p-4 flex flex-col flex-1 min-h-[168px]">
                      <div className="flex-1 space-y-1 min-h-0">
                        <p className="font-playfair font-bold text-base sm:text-lg text-maroon leading-snug line-clamp-2 break-words normal-case">
                          {profile.name}
                          {profile.age !== "—" && profile.age !== ""
                            ? `, ${profile.age}`
                            : ""}
                        </p>
                        <p className="text-[#6B6B6B] text-sm line-clamp-1">
                          {profile.profession
                            ? profile.profession
                            : t("notSpecified")}
                        </p>
                        <p className="text-[#6B6B6B] text-sm line-clamp-1">
                          {profile.location
                            ? profile.location
                            : t("notSpecified")}
                        </p>
                      </div>
                      <Link
                        href={seeProfileHref(profile.targetId)}
                        className="mt-4 block w-full shrink-0"
                      >
                        <button
                          type="button"
                          className="w-full min-h-[40px] py-2 rounded-lg font-semibold text-sm transition-colors bg-maroon text-white hover:bg-maroon/90"
                        >
                          {t("seeProfile")}
                        </button>
                      </Link>
                    </div>
                  </div>
                ))}

            {!loading && (
              <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-border-soft hover:shadow-lg transition-shadow flex flex-col h-full">
                <div className="relative aspect-[3/4] w-full shrink-0">
                  <Image
                    src={CREATE_CARD_IMAGE}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 25vw"
                  />
                </div>
                <div className="p-4 flex flex-col flex-1 min-h-[168px]">
                  <div className="flex-1 space-y-1">
                    <p className="font-playfair font-bold text-base sm:text-lg text-maroon leading-snug">
                      {t("createCardTitle")}
                    </p>
                    <p className="text-[#6B6B6B] text-sm line-clamp-2">
                      {t("createCardLine2")}
                    </p>
                    <p className="text-[#6B6B6B] text-sm line-clamp-2">
                      {t("createCardLine3")}
                    </p>
                  </div>
                  <Link href="/loginstep" className="mt-4 block w-full shrink-0">
                    <button
                      type="button"
                      className="w-full min-h-[40px] py-2 rounded-lg font-semibold text-sm transition-colors border-2 border-maroon text-maroon hover:bg-soft-rose"
                    >
                      {t("createFreeProfile")}
                    </button>
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="xl:w-[280px] flex-shrink-0">
            <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-border-soft sticky top-24">
              <div className="relative bg-maroon py-3 px-4">
                <h3 className="font-playfair font-bold text-white text-lg">
                  {t("recentlyJoined")}
                </h3>
                <div className="absolute top-0 right-0 w-16 h-8 bg-gold/90 -skew-x-12 flex items-center justify-center">
                  <span className="text-xs font-bold text-white">
                    {t("newBadge")}
                  </span>
                </div>
              </div>
              <div className="p-4 space-y-4">
                {loading ? (
                  <>
                    {[0, 1].map((i) => (
                      <div key={i} className="flex gap-3">
                        <div className="relative w-16 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200 animate-pulse" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded animate-pulse" />
                          <div className="h-3 bg-gray-200 rounded w-4/5 animate-pulse" />
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  recentTwo.map((profile) => {
                    const lineAge = ageFromUser(profile);
                    return (
                    <div key={profile.id} className="flex gap-3">
                      <div className="relative w-16 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-[#f0f0f0]">
                        <Image
                          src={profileImageSrc(profile)}
                          alt={displayName(profile)}
                          fill
                          className="object-cover"
                          unoptimized={imgUnopt(profileImageSrc(profile))}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-maroon line-clamp-2 break-words normal-case">
                          {formatDisplayName(displayName(profile))}
                          {lineAge != null ? `, ${lineAge}` : ""}
                        </p>
                        <p className="text-[#6B6B6B] text-xs truncate">
                          {String(
                            profile.profile?.field_of_work ??
                              profile.profile?.profession ??
                              ""
                          ).trim() || t("notSpecified")}
                        </p>
                        <p className="text-[#6B6B6B] text-xs truncate">
                          {String(
                            profile.profile?.city ?? profile.profile?.country ?? ""
                          ).trim() || t("notSpecified")}
                        </p>
                      </div>
                    </div>
                    );
                  })
                )}
                <Link href={browseHref} className="block w-full">
                  <button
                    type="button"
                    className="w-full min-h-[40px] mt-4 bg-maroon text-white py-2 rounded-lg font-semibold text-sm hover:bg-maroon/90 transition-colors flex items-center justify-center gap-2"
                  >
                    {t("viewMoreProfiles")}
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VerifiedProfiles;
