"use client";
import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { User } from "../type/type";
import {
  showInterest,
  getGalleryImages,
  fetchGalleryWithAccess,
  unlockProfileGalleryView,
  postContactView,
  type GalleryResponse,
} from "../api/api";
import {
  hasRecordedProfileGalleryView,
  recordProfileGalleryView,
} from "@/lib/profile-gallery-view-storage";
import { ContUser } from "./main";
import { FaChevronLeft, FaHeart, FaRegHeart, FaWhatsapp } from "react-icons/fa";
import { MdVerified, MdWork } from "react-icons/md";
import { IoLocationSharp, IoEyeOutline } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { FiBookmark, FiShare2 } from "react-icons/fi";
import { HiOutlineUser } from "react-icons/hi";
import { IoMdHeart } from "react-icons/io";
import { GiBodyHeight } from "react-icons/gi";
import { FaGraduationCap } from "react-icons/fa";
import { BsBriefcase, BsKey } from "react-icons/bs";
import { BiDonateHeart } from "react-icons/bi";
import { HiOutlinePhone } from "react-icons/hi";
import { IoSend } from "react-icons/io5";
import { FaBookOpen, FaCamera, FaRunning, FaUtensils } from "react-icons/fa";
import { getHoroscopeByUserId } from "@/app/api/api";
import { HoroscopeChartGrid } from "@/app/_components/horoscope/horoscope-chart-grid";
import MessageChat from "@/app/(pages)/chat/_components/message";
import { toast } from "react-toastify";

import imgwomen from "@/public/assets/images/search/images (2).jpg";
import imgmen from "@/public/assets/images/search/images (4).jpg";

function displayOr(
  v: string | null | undefined,
  fallback = "Not specified"
): string {
  const s = typeof v === "string" ? v.trim() : "";
  return s.length ? s : fallback;
}

const SearchDetails = ({ data }: { data: User }) => {
  const router = useRouter();
  const context = useContext(ContUser);
  const [showFullBio, setShowFullBio] = useState(false);
  const [token, setToken] = useState<any | null>(null);
  /** false until we've read localStorage so we don't flash paywall on own profile */
  const [tokenReady, setTokenReady] = useState(false);
  const [showHoroscopeModal, setShowHoroscopeModal] = useState(false);
  const [horoscopeLoading, setHoroscopeLoading] = useState(false);
  const [horoscopeData, setHoroscopeData] = useState<{ rasiChart?: string[]; navamsaChart?: string[]; image?: string } | null>(null);

  const [galleryPhotos, setGalleryPhotos] = useState<GalleryResponse[]>([]);
  const [galleryUnlocked, setGalleryUnlocked] = useState(false);
  const [galleryLoading, setGalleryLoading] = useState(true);
  const [unlockLoading, setUnlockLoading] = useState(false);
  const [galleryError, setGalleryError] = useState<string | null>(null);

  const handleViewHoroscope = async () => {
    setShowHoroscopeModal(true);
    setHoroscopeLoading(true);
    setHoroscopeData(null);
    try {
      const res = await getHoroscopeByUserId(data.id);
      const horo = res?.data?.data ?? res?.data ?? null;
      setHoroscopeData(horo);
    } catch {
      setHoroscopeData(null);
    } finally {
      setHoroscopeLoading(false);
    }
  };

  useEffect(() => {
    const tokendata = localStorage.getItem("access-token");
    if (tokendata) setToken(JSON.parse(tokendata));
    setTokenReady(true);
  }, []);

  const isOwnProfile =
    token?.data?.result?.id != null && token.data.result.id === data.id;

  /** POST /mmm/package/contact-view when viewing someone else's profile (package / contact limits). */
  useEffect(() => {
    if (!tokenReady) return;
    if (isOwnProfile) return;
    const viewerId = token?.data?.result?.id as number | undefined;
    if (!viewerId) return;

    let cancelled = false;
    (async () => {
      try {
        await postContactView();
      } catch (e) {
        if (!cancelled && process.env.NODE_ENV === "development") {
          console.warn("contact-view:", e);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [tokenReady, isOwnProfile, data.id, token?.data?.result?.id]);

  useEffect(() => {
    if (!tokenReady) return;

    let cancelled = false;
    (async () => {
      setGalleryLoading(true);
      setGalleryError(null);

      // Own profile: always load gallery (no paywall)
      if (isOwnProfile) {
        try {
          const imgs = await getGalleryImages(data.id);
          const list = Array.isArray(imgs) ? imgs : [];
          if (!cancelled) {
            setGalleryPhotos(list);
            setGalleryUnlocked(true);
          }
        } catch {
          if (!cancelled) setGalleryPhotos([]);
        } finally {
          if (!cancelled) setGalleryLoading(false);
        }
        return;
      }

      const viewerId = token?.data?.result?.id as number | undefined;
      const profileId = data.profile?.id;

      if (!viewerId || !profileId) {
        if (!cancelled) {
          setGalleryPhotos([]);
          setGalleryUnlocked(false);
          setGalleryLoading(false);
        }
        return;
      }

      const storedUnlock = hasRecordedProfileGalleryView(viewerId, profileId);

      // Until POST /mmm/package/profile-view succeeds, never show real gallery — even if GET would return images.
      if (!storedUnlock) {
        if (!cancelled) {
          setGalleryPhotos([]);
          setGalleryUnlocked(false);
          setGalleryLoading(false);
        }
        return;
      }

      try {
        const { photos, accessDenied } = await fetchGalleryWithAccess(data.id);
        if (cancelled) return;

        if (accessDenied) {
          setGalleryPhotos([]);
          setGalleryUnlocked(false);
          setGalleryError(
            "Gallery could not be loaded. Please refresh or sign in again."
          );
          setGalleryLoading(false);
          return;
        }

        setGalleryPhotos(photos);
        setGalleryUnlocked(true);
      } catch {
        if (!cancelled) {
          setGalleryPhotos([]);
          setGalleryUnlocked(false);
          setGalleryError("Could not load gallery. Please try again.");
        }
      } finally {
        if (!cancelled) setGalleryLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [
    data.id,
    data.profile?.id,
    token?.data?.result?.id,
    isOwnProfile,
    tokenReady,
  ]);

  const handleUnlockGallery = async () => {
    const profileId = data.profile?.id;
    const viewerId = token?.data?.result?.id as number | undefined;
    if (!profileId) {
      setGalleryError("Profile information is missing.");
      return;
    }
    if (!token || !viewerId) {
      router.push(`/login?redirect=${encodeURIComponent(`/search/${data.id}`)}`);
      return;
    }
    setUnlockLoading(true);
    setGalleryError(null);
    try {
      await unlockProfileGalleryView(profileId);
      recordProfileGalleryView(viewerId, profileId);
      const { photos, accessDenied } = await fetchGalleryWithAccess(data.id);
      if (accessDenied) {
        setGalleryPhotos([]);
        setGalleryUnlocked(false);
        setGalleryError(
          "Unable to load gallery after unlock. Please try again."
        );
        return;
      }
      setGalleryPhotos(photos);
      setGalleryUnlocked(true);
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } }; message?: string };
      setGalleryError(
        err?.response?.data?.message ??
          err?.message ??
          "Unable to unlock photos. Please try again."
      );
    } finally {
      setUnlockLoading(false);
    }
  };

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

  const formatEnum = (val: string) => {
    if (!val) return "";
    return val.charAt(0).toUpperCase() + val.slice(1).toLowerCase().replace(/_/g, " ");
  };

  const ageYears = calculateAge(data.profile.dateOfBirth);
  const ageLabel = Number.isFinite(ageYears) ? ageYears : "—";

  const interact = async (targetId: number, type: string) => {
    await showInterest({ targetId, type });
    context?.setReload(!context.reload);
  };

  const handleShareProfile = async () => {
    if (typeof window === "undefined") return;
    const url = `${window.location.origin}/search/${data.id}`;
    const title = (data.userName || "Profile").trim();
    try {
      if (navigator.share) {
        await navigator.share({
          title,
          text: `View ${title}`,
          url,
        });
        return;
      }
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === "AbortError") return;
    }
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard");
    } catch {
      toast.error("Could not copy link. Please copy the URL from the address bar.");
    }
  };

  const isLiked = token
    ? data.interestReceived?.some((i) => i.userId === token?.data?.result?.id)
    : false;

  const profileSrc = data.profile.profilePicture
    ? data.profile.profilePicture.startsWith("http")
      ? data.profile.profilePicture
      : `${process.env.NEXT_PUBLIC_IMAGE_URL}${data.profile.profilePicture}`
    : data.profile.gender === "FEMALE"
    ? imgwomen
    : imgmen;

  const bioText = (data.profile.bio || "").trim();
  const aboutFirstName =
    data.profile.firstName?.trim() ||
    data.userName.split(/\s+/).filter(Boolean)[0] ||
    "Member";

  const hobbiesList = [...new Set((data.profile.hobbies ?? []).map(String))];
  const interestsList = [
    ...new Set(
      [
        ...(data.profile.interests ?? []),
        ...(data.profile.traits ?? []),
        ...(data.profile.movies ?? []),
        ...(data.profile.music ?? []),
      ].map(String)
    ),
  ];

  const getHobbyIcon = (hobby: string) => {
    const text = hobby.toLowerCase();
    if (text.includes("read") || text.includes("book")) {
      return <FaBookOpen className="text-[#D65050]" />;
    }
    if (text.includes("photo") || text.includes("camera")) {
      return <FaCamera className="text-[#D65050]" />;
    }
    if (
      text.includes("dance") ||
      text.includes("run") ||
      text.includes("gym") ||
      text.includes("sport")
    ) {
      return <FaRunning className="text-[#D65050]" />;
    }
    if (text.includes("cook") || text.includes("food")) {
      return <FaUtensils className="text-[#D65050]" />;
    }
    return <BiDonateHeart className="text-[#D65050]" />;
  };

  const keyDetails: string[] = [];
  if (data.profile.religion) keyDetails.push(formatEnum(data.profile.religion));
  if (data.profile.caste?.trim()) keyDetails.push(data.profile.caste.trim());
  if (data.profile.field_of_work) keyDetails.push(data.profile.field_of_work);
  if (data.profile.martialStatus) keyDetails.push(formatEnum(data.profile.martialStatus));
  if (data.profile.children) keyDetails.push(formatEnum(data.profile.children));
  if (data.profile.motherTongue?.trim())
    keyDetails.push(data.profile.motherTongue.trim());
  if (data.profile.subCaste?.trim())
    keyDetails.push(data.profile.subCaste.trim());
  if (data.profile.traits?.length) keyDetails.push(...data.profile.traits.map(String));

  return (
    <div className="mx-auto max-w-lg pb-24 animate-fade-in lg:max-w-none">
      {/* Back Button */}
      <div className="sticky top-0 z-10 bg-gradient-to-b from-white via-white/95 to-transparent px-4 pb-6 pt-3 lg:hidden">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border-soft bg-white shadow-soft transition-all duration-300 hover:border-maroon/20 hover:shadow-card-hover"
        >
          <FaChevronLeft className="text-sm text-[#2C2C2C]" />
        </button>
      </div>

      {/* Profile Image */}
      <div className="mx-auto max-w-[240px] -mt-4 overflow-hidden rounded-2xl border border-border-soft shadow-card transition-shadow duration-300 hover:shadow-card-hover lg:mt-0 lg:max-w-[280px]">
        <Image
          src={profileSrc}
          width={240}
          height={300}
          className="aspect-[4/5] w-full object-cover"
          alt={data.userName || "Profile"}
        />
      </div>

      {/* Stats Row */}
      <div className="flex justify-between items-center px-6 py-3 text-sm text-[#6B6B6B]">
        <span className="flex items-center gap-1.5">
          <IoEyeOutline className="text-base" />
          Views: 320
        </span>
        <span>Registered No: {data.registrationId || data.profile?.registrationId || data.profileId || "—"}</span>
      </div>

      {/* Name + icon actions (single row — avoids tall flex row pushing content down) */}
      <div className="flex items-center justify-between px-6 gap-3">
        <div className="flex flex-wrap items-center gap-2 min-w-0">
          <h2 className="font-playfair font-semibold text-xl text-[#2C2C2C]">
            {data.userName}, {ageLabel}
          </h2>
          {data.verification?.emailVerified && (
            <MdVerified className="text-green-500 text-lg shrink-0" />
          )}
        </div>
        <div className="flex items-center gap-3 text-[#6B6B6B] shrink-0">
          <button
            type="button"
            onClick={() => interact(data.id, "interest")}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border-soft shadow-soft transition-all duration-300 hover:border-maroon/20 hover:bg-soft-rose hover:shadow-maroon"
          >
            {isLiked ? (
              <IoMdHeart className="text-maroon" />
            ) : (
              <FaRegHeart className="text-sm" />
            )}
          </button>
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border-soft shadow-soft transition-all duration-300 hover:border-maroon/20 hover:bg-soft-rose hover:shadow-maroon"
          >
            <FiBookmark className="text-sm" />
          </button>
          <button
            type="button"
            onClick={handleShareProfile}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border-soft shadow-soft transition-all duration-300 hover:border-maroon/20 hover:bg-soft-rose hover:shadow-maroon"
            aria-label="Share profile link"
          >
            <FiShare2 className="text-sm" />
          </button>
        </div>
      </div>

      {/* Quick info + Send message (one band: details left, button right, top-aligned) */}
      <div className="px-6 mt-2 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="flex min-w-0 flex-1 flex-col gap-1 text-sm text-[#6B6B6B]">
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {(data.profile.city?.trim() ||
              data.profile.state?.trim() ||
              data.profile.country?.trim()) && (
              <span className="flex items-center gap-1">
                <IoLocationSharp className="text-maroon shrink-0" />
                {[data.profile.city, data.profile.state, data.profile.country]
                  .filter((x) => x && String(x).trim())
                  .join(", ")}
              </span>
            )}
            <span className="flex items-center gap-1">
              <GiBodyHeight className="shrink-0" />
              {data.profile.height?.trim() ? data.profile.height : "—"}
            </span>
            {data.profile.religion && (
              <span className="flex items-center gap-1">
                <HiOutlineUser className="shrink-0" />
                {formatEnum(data.profile.religion)}
                {data.profile.caste?.trim()
                  ? ` · ${data.profile.caste.trim()}`
                  : ""}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {(data.profile.education?.trim() || data.profile.field_of_work) && (
              <span className="flex items-center gap-1">
                <FaGraduationCap className="shrink-0" />
                {[
                  data.profile.education?.trim(),
                  data.profile.field_of_work,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </span>
            )}
            <span className="flex items-center gap-1">
              <BsBriefcase className="shrink-0" />
              {displayOr(data.profile.profession)}
            </span>
          </div>
        </div>
        <MessageChat
          id={data.id}
          triggerClassName="inline-flex shrink-0 items-center justify-center gap-1.5 self-stretch rounded-full border border-maroon px-3 py-1.5 text-sm font-semibold text-maroon shadow-maroon transition-all duration-300 hover:-translate-y-0.5 hover:bg-soft-rose hover:shadow-maroon-lg sm:self-start"
          triggerContent={
            <>
              <IoSend className="text-base" />
              Send message
            </>
          }
        />
      </div>

      {/* About Section */}
      <section className="mx-4 mt-5 rounded-2xl border border-border-soft bg-cream/30 p-5 shadow-card transition-all duration-300 hover:border-maroon/10 hover:shadow-card-hover motion-reduce:transition-shadow">
        <div className="flex items-center gap-2 mb-3">
          <HiOutlineUser className="text-maroon text-lg" />
          <h3 className="font-playfair font-semibold text-base text-[#2C2C2C]">
            About {aboutFirstName}
          </h3>
        </div>
        <p className="text-sm text-[#6B6B6B] leading-relaxed">
          {showFullBio
            ? bioText || "No bio available"
            : bioText
              ? `${bioText.slice(0, 150)}${bioText.length > 150 ? "…" : ""}`
              : "No bio available"}
        </p>
        {bioText.length > 150 && (
          <button
            onClick={() => setShowFullBio(!showFullBio)}
            className="text-maroon text-sm font-medium mt-2 flex items-center gap-1"
          >
            {showFullBio ? "View less" : "View more"}{" "}
            <span className="text-xs">{showFullBio ? "∧" : "∨"}</span>
          </button>
        )}
      </section>

      {/* Key Details */}
      {keyDetails.length > 0 && (
        <section className="mx-4 mt-4 rounded-2xl border border-border-soft bg-cream/30 p-5 shadow-card transition-all duration-300 hover:border-maroon/10 hover:shadow-card-hover motion-reduce:transition-shadow">
          <div className="flex items-center gap-2 mb-3">
            <BsKey className="text-maroon text-lg" />
            <h3 className="font-playfair font-semibold text-base text-[#2C2C2C]">
              Key Details
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {keyDetails.map((detail, i) => (
              <span
                key={i}
                className="rounded-full border border-border-soft px-4 py-1.5 text-sm text-[#6B6B6B] transition-all duration-200 hover:border-maroon/20 hover:shadow-soft"
              >
                {detail}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Education & career */}
      <section className="mx-4 mt-4 rounded-2xl border border-border-soft bg-cream/30 p-5 shadow-card transition-all duration-300 hover:border-maroon/10 hover:shadow-card-hover motion-reduce:transition-shadow">
        <div className="flex items-center gap-2 mb-4">
          <FaGraduationCap className="text-maroon text-lg" />
          <h3 className="font-playfair font-semibold text-base text-[#2C2C2C]">
            Education & career
          </h3>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between text-sm gap-4">
            <span className="text-[#6B6B6B] flex items-center gap-1.5 shrink-0">
              <FaGraduationCap className="text-[#6B6B6B]" /> Education
            </span>
            <span className="text-[#2C2C2C] font-medium text-right">
              {displayOr(data.profile.education)}
            </span>
          </div>
          <div className="flex justify-between text-sm gap-4">
            <span className="text-[#6B6B6B] flex items-center gap-1.5 shrink-0">
              <MdWork className="text-[#6B6B6B]" /> Profession
            </span>
            <span className="text-[#2C2C2C] font-medium text-right">
              {displayOr(data.profile.profession)}
            </span>
          </div>
          {data.profile.company?.trim() ? (
            <div className="flex justify-between text-sm gap-4">
              <span className="text-[#6B6B6B] flex items-center gap-1.5 shrink-0">
                <BsBriefcase className="text-[#6B6B6B]" /> Company
              </span>
              <span className="text-[#2C2C2C] font-medium text-right">
                {data.profile.company.trim()}
              </span>
            </div>
          ) : null}
          {data.profile.field_of_work?.trim() ? (
            <div className="flex justify-between text-sm gap-4">
              <span className="text-[#6B6B6B] shrink-0">Field of work</span>
              <span className="text-[#2C2C2C] font-medium text-right">
                {data.profile.field_of_work.trim()}
              </span>
            </div>
          ) : null}
        </div>
      </section>

      {/* Family Details */}
      <section className="mx-4 mt-4 rounded-2xl border border-border-soft bg-cream/30 p-5 shadow-card transition-all duration-300 hover:border-maroon/10 hover:shadow-card-hover motion-reduce:transition-shadow">
        <div className="flex items-center gap-2 mb-4">
          <HiOutlineUser className="text-maroon text-lg" />
          <h3 className="font-playfair font-semibold text-base text-[#2C2C2C]">
            Family Details
          </h3>
        </div>
        {data.profile.familyDetails?.trim() ? (
          <p className="text-sm text-[#6B6B6B] leading-relaxed mb-4">
            {data.profile.familyDetails.trim()}
          </p>
        ) : null}
        <div className="space-y-3">
          <div className="flex justify-between text-sm gap-4">
            <span className="text-[#6B6B6B] flex items-center gap-1.5 shrink-0">
              <HiOutlineUser className="text-[#6B6B6B]" /> Father
            </span>
            <span className="text-[#2C2C2C] font-medium text-right">
              {displayOr(data.profile.fatherDetails)}
            </span>
          </div>
          <div className="flex justify-between text-sm gap-4">
            <span className="text-[#6B6B6B] flex items-center gap-1.5 shrink-0">
              <HiOutlineUser className="text-[#6B6B6B]" /> Mother
            </span>
            <span className="text-[#2C2C2C] font-medium text-right">
              {displayOr(data.profile.motherDetails)}
            </span>
          </div>
          <div className="flex justify-between text-sm gap-4">
            <span className="text-[#6B6B6B] flex items-center gap-1.5 shrink-0">
              <HiOutlineUser className="text-[#6B6B6B]" /> Siblings
            </span>
            <span className="text-[#2C2C2C] font-medium text-right">
              {displayOr(data.profile.siblingsDetails)}
            </span>
          </div>
        </div>
      </section>

      {/* Lifestyle Section - Interests & Hobbies */}
      <section className="mx-4 mt-4 rounded-2xl border border-border-soft bg-cream/30 p-5 shadow-card transition-all duration-300 hover:border-maroon/10 hover:shadow-card-hover motion-reduce:transition-shadow">
        <div className="flex items-center gap-2 mb-3">
          <BiDonateHeart className="text-maroon text-lg" />
          <h3 className="font-playfair font-semibold text-base text-[#2C2C2C]">
            Lifestyle Section
          </h3>
        </div>
        {interestsList.length > 0 && (
          <>
            <p className="text-sm text-[#2C2C2C] mb-3">• Interests</p>
            <div className="flex flex-wrap gap-3 mb-4">
              {interestsList.map((interest, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-2 rounded-full border border-transparent bg-cream/80 px-5 py-2 text-sm font-medium text-[#2C2C2C] transition-all duration-200 hover:border-border-soft hover:shadow-soft"
                >
                  {getHobbyIcon(interest)}
                  {interest}
                </span>
              ))}
            </div>
          </>
        )}
        {hobbiesList.length > 0 && (
          <>
            <p className="text-sm text-[#2C2C2C] mb-3">• Hobbies</p>
            <div className="flex flex-wrap gap-3">
              {hobbiesList.map((hobby, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-2 rounded-full border border-transparent bg-cream/80 px-5 py-2 text-sm font-medium text-[#2C2C2C] transition-all duration-200 hover:border-border-soft hover:shadow-soft"
                >
                  {getHobbyIcon(hobby)}
                  {hobby}
                </span>
              ))}
            </div>
          </>
        )}
        {interestsList.length === 0 && hobbiesList.length === 0 && (
          <p className="text-sm text-[#6B6B6B]">No lifestyle details available.</p>
        )}
      </section>

      {/* Languages */}
      {data.profile.languagesSpoken?.length > 0 && (
        <section className="mx-4 mt-4 rounded-2xl border border-border-soft bg-cream/30 p-5 shadow-card transition-all duration-300 hover:border-maroon/10 hover:shadow-card-hover motion-reduce:transition-shadow">
          <div className="flex items-center gap-2 mb-3">
            <MdVerified className="text-maroon text-lg" />
            <h3 className="font-playfair font-semibold text-base text-[#2C2C2C]">
              Languages
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.profile.languagesSpoken.map((lang, i) => (
              <span
                key={i}
                className="rounded-full border border-border-soft px-4 py-1.5 text-sm text-[#6B6B6B] transition-all duration-200 hover:border-maroon/20 hover:shadow-soft"
              >
                {lang}
              </span>
            ))}
          </div>
        </section>
      )}

      {(data.profile.birthTime?.trim() ||
        data.profile.zodiac?.trim() ||
        data.profile.star?.trim()) && (
        <section className="mx-4 mt-4 rounded-2xl border border-border-soft bg-cream/30 p-5 shadow-card transition-all duration-300 hover:border-maroon/10 hover:shadow-card-hover motion-reduce:transition-shadow">
          <div className="flex items-center gap-2 mb-3">
            <BiDonateHeart className="text-maroon text-lg" />
            <h3 className="font-playfair font-semibold text-base text-[#2C2C2C]">
              Horoscope details
            </h3>
          </div>
          <div className="space-y-2 text-sm">
            {data.profile.birthTime?.trim() ? (
              <div className="flex justify-between gap-4">
                <span className="text-[#6B6B6B]">Birth time</span>
                <span className="text-[#2C2C2C] font-medium text-right">
                  {data.profile.birthTime.trim()}
                </span>
              </div>
            ) : null}
            {data.profile.zodiac?.trim() ? (
              <div className="flex justify-between gap-4">
                <span className="text-[#6B6B6B]">Zodiac (Rasi)</span>
                <span className="text-[#2C2C2C] font-medium text-right">
                  {data.profile.zodiac.trim()}
                </span>
              </div>
            ) : null}
            {data.profile.star?.trim() ? (
              <div className="flex justify-between gap-4">
                <span className="text-[#6B6B6B]">Star</span>
                <span className="text-[#2C2C2C] font-medium text-right">
                  {data.profile.star.trim()}
                </span>
              </div>
            ) : null}
          </div>
        </section>
      )}

      {/* View Horoscope — Figma-style CTA */}
      <div className="mx-4 mt-5">
        <button
          type="button"
          onClick={handleViewHoroscope}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-maroon bg-white py-3.5 text-sm font-semibold text-maroon shadow-maroon transition-all duration-300 hover:-translate-y-0.5 hover:bg-soft-rose/80 hover:shadow-maroon-lg"
        >
          <BiDonateHeart className="text-lg" />
          View Horoscope
        </button>
      </div>

      {/* Horoscope Modal — Figma: instruction + two stacked 4×4 charts with center “கிரக நிலை” */}
      {showHoroscopeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border-soft bg-white shadow-soft-lg sm:max-w-xl">
            <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-2xl border-b border-border-soft bg-white/95 px-4 py-3 backdrop-blur-sm">
              <h3 className="font-playfair font-semibold text-maroon">Horoscope</h3>
              <button
                type="button"
                onClick={() => { setShowHoroscopeModal(false); setHoroscopeData(null); }}
                className="rounded-full p-2 text-[#6B6B6B] transition-colors hover:bg-soft-rose/50 hover:text-maroon"
                aria-label="Close"
              >
                <RxCross2 className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              {horoscopeLoading ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <div className="w-10 h-10 border-2 border-maroon/30 border-t-maroon rounded-full animate-spin" />
                  <p className="text-sm text-[#6B6B6B]">Loading horoscope...</p>
                </div>
              ) : !horoscopeData || (!horoscopeData.rasiChart?.length && !horoscopeData.navamsaChart?.length && !horoscopeData.image) ? (
                <p className="text-sm text-[#6B6B6B] py-8 text-center">No horoscope data available.</p>
              ) : (
                <div className="space-y-4">
                  {horoscopeData.image && (
                    <div className="overflow-hidden rounded-xl border border-border-soft bg-cream/40 p-2 shadow-soft">
                      <p className="text-sm font-medium text-[#2C2C2C] mb-2 text-center">Horoscope image</p>
                      <Image
                        src={horoscopeData.image.startsWith("http") ? horoscopeData.image : `${process.env.NEXT_PUBLIC_IMAGE_URL ?? ""}${horoscopeData.image}`}
                        alt="Horoscope"
                        width={280}
                        height={360}
                        className="rounded-lg object-cover w-full"
                      />
                    </div>
                  )}
                  {(() => {
                    const hasRasi = (horoscopeData.rasiChart?.length ?? 0) > 0;
                    const hasNav = (horoscopeData.navamsaChart?.length ?? 0) > 0;
                    if (!hasRasi && !hasNav) return null;
                    return (
                      <div className="rounded-2xl border border-border-soft bg-cream/30 p-4 shadow-card">
                        <p className="mb-4 text-center text-sm font-medium text-[#191919]">
                          Horoscope Details
                        </p>
                        <div className="flex flex-col gap-6">
                          {hasRasi ? (
                            <HoroscopeChartGrid
                              cells={horoscopeData.rasiChart}
                              title="Rasi chart"
                            />
                          ) : null}
                          {hasRasi && hasNav ? (
                            <div className="border-t border-border-soft" />
                          ) : null}
                          {hasNav ? (
                            <HoroscopeChartGrid
                              cells={horoscopeData.navamsaChart}
                              title="Navamsa chart"
                            />
                          ) : null}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Gallery — unlock via credits (POST mmm/package/profile-view) */}
      <section className="mx-4 mt-8">
        <h3 className="mb-3 text-base font-semibold text-[#2C2C2C]">Gallery</h3>

        {galleryLoading ? (
          <div className="animate-pulse rounded-2xl border border-maroon/25 bg-cream/20 p-6 shadow-card">
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-4" />
            <div className="h-11 bg-maroon/20 rounded-lg mb-4" />
            <div className="grid grid-cols-3 gap-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="aspect-[3/4] rounded-lg bg-gray-200" />
              ))}
            </div>
          </div>
        ) : galleryPhotos.length > 0 ? (
          <div className="grid grid-cols-3 gap-2">
            {galleryPhotos.map((photo, index) => (
              <div
                key={photo.id}
                className="relative aspect-[3/4] overflow-hidden rounded-lg border border-border-soft bg-[#f0f0f0] shadow-soft transition-all duration-300 hover:border-maroon/20 hover:shadow-card-hover"
              >
                <Image
                  src={
                    photo.imageUrl.startsWith("http")
                      ? photo.imageUrl
                      : `${process.env.NEXT_PUBLIC_IMAGE_URL ?? ""}${photo.imageUrl}`
                  }
                  alt={`Gallery ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 33vw, 200px"
                  unoptimized={
                    !photo.imageUrl.startsWith("http") &&
                    Boolean(process.env.NEXT_PUBLIC_IMAGE_URL)
                  }
                />
              </div>
            ))}
          </div>
        ) : isOwnProfile ? (
          <p className="rounded-2xl border border-border-soft bg-cream/30 py-6 text-center text-sm text-[#6B6B6B] shadow-card">
            No gallery photos yet. Add photos from your profile settings.
          </p>
        ) : galleryUnlocked ? (
          <p className="rounded-2xl border border-border-soft bg-cream/30 py-6 text-center text-sm text-[#6B6B6B] shadow-card">
            No gallery photos yet.
          </p>
        ) : (
          <div className="rounded-2xl border-2 border-maroon/80 bg-white p-5 shadow-maroon transition-all duration-300 hover:shadow-maroon-lg">
            <p className="text-center text-[#6B6B6B] text-sm leading-relaxed">
              To view photos, 1 point will be deducted from your account
            </p>
            <button
              type="button"
              onClick={handleUnlockGallery}
              disabled={unlockLoading}
              className="mt-4 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-maroon py-3 text-sm font-semibold text-white shadow-maroon transition-all duration-300 hover:-translate-y-0.5 hover:bg-maroon/90 hover:shadow-maroon-lg disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {unlockLoading ? (
                <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <IoEyeOutline className="text-xl" />
              )}
              {unlockLoading ? "Processing…" : "View Photos"}
            </button>
            {galleryError ? (
              <p className="mt-3 text-center text-sm text-red-600">{galleryError}</p>
            ) : null}

            <div className="grid grid-cols-3 gap-2 mt-5">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="relative aspect-[3/4] overflow-hidden rounded-lg border border-border-soft bg-[#e8e4e4] shadow-inner"
                >
                  <Image
                    src={profileSrc}
                    alt=""
                    fill
                    className="object-cover blur-xl scale-110 opacity-90"
                    sizes="33vw"
                    aria-hidden
                  />
                  <div
                    className="absolute inset-0 opacity-30"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(-45deg, transparent, transparent 6px, rgba(255,255,255,0.15) 6px, rgba(255,255,255,0.15) 8px)",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Action Buttons */}
      {/* <div className="flex justify-center items-center gap-6 mt-6">
        <button
          onClick={() => interact(data.id, "skip")}
          className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-[#6B6B6B] hover:bg-gray-200 transition-colors shadow-sm"
        >
          <RxCross2 className="text-2xl" />
        </button>
        <button
          onClick={() => interact(data.id, "interest")}
          className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 ${
            isLiked
              ? "bg-maroon text-white"
              : "bg-[#E74C5E] text-white hover:bg-maroon"
          }`}
        >
          {isLiked ? (
            <FaHeart className="text-2xl" />
          ) : (
            <FaRegHeart className="text-2xl" />
          )}
        </button>
      </div> */}

      {/* Need Help */}
      <div className="mx-4 mt-8 rounded-2xl border border-border-soft bg-cream/20 px-4 py-5 text-center text-sm text-[#6B6B6B] shadow-soft">
        <p className="flex items-center justify-center gap-1.5">
          <HiOutlinePhone className="text-base text-maroon" aria-hidden />
          <FaWhatsapp
            className="text-lg text-[#25D366]"
            aria-hidden
          />
          Need Help?
        </p>
        <p className="mt-1">Our customer care.</p>
        <p className="font-medium text-maroon">
          Call / Whatsapp: +44 7752 564477 
        </p>
      </div>
    </div>
  );
};

export default SearchDetails;