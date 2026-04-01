"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { IoMdMail } from "react-icons/io";
import { FaHeart } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { IoChevronBack } from "react-icons/io5";
import { FiArrowUpRight } from "react-icons/fi";
import { getuserByid } from "@/app/(pages)/profile/api/api";
import { getInteractionUserInterest, getPendingRequestsList, updateInteraction, deleteInteraction } from "./api/api";
import { MatchAvatar } from "./_components/match-avatar";
import { useTranslations } from "next-intl";
import Link from "next/link";

/** Map API item (targetInterest/userInterest) to display shape. interactionId = interaction record id for accept/reject APIs */
const toMatchDisplay = (item: any, unknownLabel: string) => {
  const t = item?.targetInterest ?? item?.userInterest ?? {};
  const profile = t?.profile ?? {};
  return {
    id: t?.id ?? item?.targetId ?? item?.userId ?? item?.id,
    interactionId: item?.id,
    name: t?.userName ?? ([profile?.firstName, profile?.lastName].filter(Boolean).join(" ").trim() || unknownLabel),
    age: t?.age ?? (profile?.dateOfBirth ? calculateAge(profile.dateOfBirth) : null),
    profession: profile?.profession ?? "",
    image: profile?.profilePicture ?? null,
    raw: item,
  };
};

const calculateAge = (dob: string) => {
  if (!dob) return 0;
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
  return age;
};

const successStoryImages = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&h=80&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=80&h=80&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=80&h=80&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=80&h=80&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&h=80&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face",
];





type PendingTab = "pending-matches" | "pending-requests";

const MatchesPage = () => {
  const router = useRouter();
  const t = useTranslations("matches");
  const tc = useTranslations("common");
  const unknownLabel = tc("unknown");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<PendingTab>("pending-matches");
  const [acceptedMatches, setAcceptedMatches] = useState<any[]>([]);
  const [acceptedFromRequests, setAcceptedFromRequests] = useState<any[]>([]);
  const [acceptedManual, setAcceptedManual] = useState<any[]>([]);
  const [acceptedMatchesLoading, setAcceptedMatchesLoading] = useState(true);
  const [acceptedViewAll, setAcceptedViewAll] = useState(false);
  const [pendingMatches, setPendingMatches] = useState<any[]>([]);
  const [pendingMatchesLoading, setPendingMatchesLoading] = useState(true);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [pendingRequestsLoading, setPendingRequestsLoading] = useState(true);
  const [pendingTotalPages, setPendingTotalPages] = useState(1);
  const [viewAllPendingLoading, setViewAllPendingLoading] = useState(false);
  const [viewAllPending, setViewAllPending] = useState(false);

  useEffect(() => {
    const fetchAllMatches = async () => {
      try {
        setAcceptedMatchesLoading(true);
        setPendingMatchesLoading(true);
        const first = await getInteractionUserInterest(1);
        const totalPages = first.totalPages ?? 1;
        setPendingTotalPages(totalPages);
        let allItems = [...(first.data ?? [])];
        if (totalPages > 1) {
          const rest = await Promise.all(
            Array.from({ length: totalPages - 1 }, (_, i) => getInteractionUserInterest(i + 2))
          );
          rest.forEach((r) => { allItems = allItems.concat(r.data ?? []); });
        }
        const accepted = allItems.filter((m: any) => m?.interestAccepted === true).map((m: any) => toMatchDisplay(m, unknownLabel));
        const pending = allItems.filter((m: any) => m?.interestAccepted !== true).map((m: any) => toMatchDisplay(m, unknownLabel));
        setAcceptedMatches(accepted);
        setPendingMatches(pending);
        setViewAllPending(false);
      } catch {
        setAcceptedMatches([]);
        setPendingMatches([]);
      } finally {
        setAcceptedMatchesLoading(false);
        setPendingMatchesLoading(false);
      }
    };
    fetchAllMatches();
  }, [unknownLabel]);

  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        setPendingRequestsLoading(true);
        const userRes = await getuserByid();
        const userData = userRes?.data?.data ?? userRes?.data;
        const currentUserId = userData?.id ?? userData?.data?.id;
        if (!currentUserId) {
          setPendingRequests([]);
          return;
        }
        const first = await getPendingRequestsList(currentUserId, 1);
        const totalPages = first.totalPages ?? 1;
        let allItems = [...(first.data ?? [])];
        if (totalPages > 1) {
          const rest = await Promise.all(
            Array.from({ length: totalPages - 1 }, (_, i) =>
              getPendingRequestsList(currentUserId, i + 2)
            )
          );
          rest.forEach((r) => {
            allItems = allItems.concat(r.data ?? []);
          });
        }
        const pendingOnly = allItems
          .filter((m: any) => m?.interestAccepted === false)
          .map((m: any) => toMatchDisplay(m, unknownLabel));
        const acceptedOnly = allItems
          .filter((m: any) => m?.interestAccepted === true)
          .map((m: any) => toMatchDisplay(m, unknownLabel));
        setPendingRequests(pendingOnly);
        setAcceptedFromRequests(acceptedOnly);
      } catch {
        setPendingRequests([]);
        setAcceptedFromRequests([]);
      } finally {
        setPendingRequestsLoading(false);
      }
    };
    fetchPendingRequests();
  }, [unknownLabel]);

  const handleViewAllPending = () => {
    setViewAllPendingLoading(true);
    setViewAllPending(true);
    setViewAllPendingLoading(false);
  };

  const dedupeByInteractionId = (items: any[]) => {
    const map = new Map<string, any>();
    items.forEach((item) => {
      const key = String(item.interactionId ?? item.id);
      if (!map.has(key)) map.set(key, item);
    });
    return Array.from(map.values());
  };

  const matchesSearch = (item: any) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.trim().toLowerCase();
    const name = String(item?.name ?? "").toLowerCase();
    const profession = String(item?.profession ?? "").toLowerCase();
    return name.includes(q) || profession.includes(q);
  };

  const acceptedCombined = dedupeByInteractionId([
    ...acceptedMatches,
    ...acceptedFromRequests,
    ...acceptedManual,
  ]);
  const acceptedFiltered = acceptedCombined.filter(matchesSearch);
  const acceptedVisible = acceptedViewAll
    ? acceptedFiltered
    : acceptedFiltered.slice(0, 2);
  const pendingMatchesFiltered = pendingMatches.filter(matchesSearch);
  const pendingRequestsFiltered = pendingRequests.filter(matchesSearch);




  const handleAcceptInterest = async (interactionId: number) => {
    const match = pendingRequests.find((m) => m.interactionId === interactionId);
    if (!match) return;
    try {
      await updateInteraction(interactionId);
      setPendingRequests((prev) => prev.filter((m) => m.interactionId !== interactionId));
      setAcceptedManual((prev) => [match, ...prev]);
    } catch {
      setPendingRequests((prev) => prev.filter((m) => m.interactionId !== interactionId));
      setAcceptedManual((prev) => [match, ...prev]);
    }
  };

  const handleRejectInterest = async (interactionId: number) => {
    const match = pendingRequests.find((m) => m.interactionId === interactionId);
    if (!match) return;
    try {
      await deleteInteraction(interactionId);
      setPendingRequests((prev) => prev.filter((m) => m.interactionId !== interactionId));
    } catch {
      setPendingRequests((prev) => prev.filter((m) => m.interactionId !== interactionId));
    }
  };




  return (
    <div className="mx-auto min-h-screen w-full max-w-[1560px] lg:w-[90%] lg:py-6">
      {/* Mobile Header */}
      <div className="flex items-center gap-3 px-4 py-4 lg:hidden">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border border-transparent p-1 text-[#2C2C2C] transition-all duration-200 hover:border-border-soft hover:bg-soft-rose/60 hover:shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon/30"
        >
          <IoChevronBack className="text-2xl" />
        </button>
        <h1 className="font-playfair text-xl font-semibold text-[#2C2C2C]">
          {t("title")}
        </h1>
      </div>

      {/* Desktop Header */}
      <div className="mb-5 hidden rounded-2xl border border-border-soft bg-gradient-to-br from-white to-cream/30 px-4 py-5 shadow-card transition-all duration-300 hover:shadow-card-hover lg:block lg:px-6">
        <h1 className="font-playfair text-[28px] font-semibold tracking-tight text-maroon">
          {t("title")}
        </h1>
        <p className="mt-1 text-sm text-[#6B6B6B]">{t("subtitle")}</p>
      </div>

      <div className="mb-4 px-4 lg:px-0">
        <input
          type="text"
          placeholder={t("searchProfile")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-border-soft bg-white px-4 py-3 text-sm text-[#2C2C2C] shadow-sm transition-[border-color,box-shadow] duration-200 placeholder:text-[#6B6B6B]/75 focus:outline-none focus:border-maroon/45 focus:ring-2 focus:ring-maroon/12 hover:border-maroon/35 hover:shadow-soft lg:max-w-md"
        />
      </div>

      <div className="px-4 lg:px-0">
        {/* Success Stories Banner */}
        <button
          type="button"
          onClick={() => router.push("/success-stories")}
          className="relative mb-6 w-full overflow-hidden rounded-2xl border border-maroon/20 bg-gradient-to-r from-[#8B1A1A] via-[#A52222] to-[#C43030] p-5 text-left shadow-maroon ring-1 ring-white/15 transition-all duration-300 hover:-translate-y-0.5 hover:opacity-[0.98] hover:shadow-maroon-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 motion-reduce:hover:translate-y-0"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-white/90 text-sm">{t("view")}</p>
              <p className="text-white text-2xl font-bold">+10,000</p>
              <div className="flex items-center gap-1 mt-0.5">
                <p className="text-white font-semibold text-lg">
                  {t("successStoriesBanner")}
                </p>
                <FiArrowUpRight className="text-white text-xl" />
              </div>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {successStoryImages.map((img, i) => (
                <div
                  key={i}
                  className="w-9 h-9 rounded-full overflow-hidden border-2 border-white/30"
                >
                  <Image
                    src={img}
                    alt=""
                    width={36}
                    height={36}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </button>

        {/* Accepted Matches */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-[#2C2C2C] text-base">
              {t("accepted")}
            </h2>
            {!acceptedViewAll && acceptedFiltered.length > 2 && (
              <button
                type="button"
                onClick={() => setAcceptedViewAll(true)}
                className="rounded-lg px-2 py-1 text-sm font-medium text-maroon transition-all duration-200 hover:bg-soft-rose/60 hover:underline hover:shadow-sm"
              >
                {tc("viewAll")}
              </button>
            )}
          </div>
          {acceptedMatchesLoading ? (
            <p className="text-[#6B6B6B] text-sm py-4">{tc("loading")}</p>
          ) : (
            <div className="divide-y divide-border-soft overflow-hidden rounded-2xl border border-border-soft bg-white shadow-card">
              {acceptedVisible.map((match) => (
                <Link
                  key={`${match.id}-${match.interactionId ?? "na"}`}
                  href={`/search/${match.id}`}
                  className="-mx-px flex items-center justify-between px-3 py-4 transition-all duration-200 first:rounded-t-2xl last:rounded-b-2xl hover:bg-cream/40 hover:shadow-soft"
                >

                  <div className="flex items-center gap-3">
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-border-soft shadow-sm ring-2 ring-white">
                      <MatchAvatar
                        src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${match.image}`}
                        alt={match.name}
                        width={56}
                        height={56}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#2C2C2C] text-[15px]">
                        {match.name}, {match.age}
                      </h3>
                      <p className="text-[#6B6B6B] text-sm">{match.profession}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      router.push(`/mails?userId=${match.id}`);
                    }}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-[#2C2C2C]/20 bg-[#2C2C2C] text-white shadow-soft transition-all duration-200 hover:bg-[#1a1a1a] hover:shadow-soft-lg hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon/30 motion-reduce:hover:translate-y-0"
                  >
                    <IoMdMail className="text-lg text-white" />
                  </button>
                </Link>
              ))}
              {!acceptedMatchesLoading && acceptedFiltered.length === 0 && (
                <p className="text-[#6B6B6B] text-sm py-4">
                  {t("noAccepted")}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Pending Matches / Pending Requests Tabs */}
        <div>
          <div className="mb-4 flex w-fit gap-1 rounded-xl border border-border-soft bg-cream/50 p-1 shadow-inner">
            <button
              type="button"
              onClick={() => setActiveTab("pending-requests")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${activeTab === "pending-requests"
                ? "bg-white text-maroon shadow-soft ring-1 ring-maroon/10"
                : "text-[#6B6B6B] hover:bg-white/80 hover:text-[#2C2C2C] hover:shadow-sm"
                }`}
            >
              {t("tabPendingRequests")}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("pending-matches")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${activeTab === "pending-matches"
                ? "bg-white text-maroon shadow-soft ring-1 ring-maroon/10"
                : "text-[#6B6B6B] hover:bg-white/80 hover:text-[#2C2C2C] hover:shadow-sm"
                }`}
            >
              {t("tabPendingMatches")}
            </button>
          </div>

          {activeTab === "pending-matches" && (
            <div className="mb-3 overflow-hidden rounded-2xl border border-border-soft bg-white shadow-card">
              <div className="flex items-center justify-between border-b border-border-soft px-3 pb-3 pt-3">
                <span className="text-[#6B6B6B] text-sm">
                  {t("pendingCount", { count: pendingMatches.length })}
                </span>
                {pendingTotalPages > 1 && !viewAllPending && (
                  <button
                    type="button"
                    onClick={handleViewAllPending}
                    disabled={viewAllPendingLoading}
                    className="rounded-lg px-2 py-1 text-sm font-medium text-maroon transition-all duration-200 hover:bg-soft-rose/60 hover:underline hover:shadow-sm disabled:opacity-50"
                  >
                    {viewAllPendingLoading ? tc("loading") : tc("viewAll")}
                  </button>
                )}
              </div>
              {pendingMatchesLoading ? (
                <p className="px-3 py-4 text-sm text-[#6B6B6B]">{tc("loading")}</p>
              ) : (
                <>
                  {(viewAllPending ? pendingMatchesFiltered : pendingMatchesFiltered.slice(0, 2)).map((match: any) => (
                    <Link
                      href={`/search/${match.id}`}
                      key={`${match.id}-${match.interactionId ?? "na"}`}
                      className="flex items-center justify-between border-b border-border-soft px-3 py-4 transition-all duration-200 last:border-b-0 hover:bg-cream/40 hover:shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-border-soft shadow-sm ring-2 ring-white">
                          <MatchAvatar
                            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${match.image}`}
                            alt={match.name}
                            width={56}
                            height={56}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold text-[#2C2C2C] text-[15px]">
                            {match.name}, {match.age ?? tc("dash")}
                          </h3>
                          <p className="text-[#6B6B6B] text-sm">{match.profession || tc("dash")}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-gray-500">
                        <span>{t("requestSent")}</span>
                      </div>
                      </Link>
                  ))}
                  {!pendingMatchesLoading && pendingMatchesFiltered.length === 0 && (
                    <p className="px-3 py-4 text-sm text-[#6B6B6B]">
                      {t("noPendingMatches")}
                    </p>
                  )}
                </>
              )}
            </div>
          )}

          {activeTab === "pending-requests" && (
            <div className="overflow-hidden rounded-2xl border border-border-soft bg-white shadow-card">
              {pendingRequestsLoading ? (
                <p className="px-3 py-4 text-sm text-[#6B6B6B]">{tc("loading")}</p>
              ) : (
                <>
                  {pendingRequestsFiltered.map((match) => (
                    <Link
                      href={`/search/${match.id}`}
                      key={`${match.id}-${match.interactionId ?? "na"}`}
                      className="flex items-center justify-between border-b border-border-soft px-3 py-4 transition-all duration-200 last:border-b-0 hover:bg-cream/40 hover:shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-border-soft shadow-sm ring-2 ring-white">
                          <MatchAvatar
                            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${match.image}`}
                            alt={match.name}
                            width={56}
                            height={56}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="text-[15px] font-semibold text-[#2C2C2C]">
                            {match.name}, {match.age ?? tc("dash")}
                          </h3>
                          <p className="text-sm text-[#6B6B6B]">{match.profession || tc("dash")}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (match.interactionId != null) handleAcceptInterest(match.interactionId);
                          }}
                          className="flex h-11 w-11 items-center justify-center rounded-full border border-maroon/20 bg-maroon text-white shadow-maroon transition-all duration-200 hover:bg-maroon/90 hover:shadow-maroon-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon/35"
                        >
                          <FaHeart className="text-[15px] text-white" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (match.interactionId != null) handleRejectInterest(match.interactionId);
                          }}
                          className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-border-soft bg-white transition-all duration-200 hover:border-maroon/35 hover:bg-cream/50 hover:shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon/25"
                        >
                          <RxCross2 className="text-lg text-[#6B6B6B]" />
                        </button>
                      </div>
                    </Link>
                  ))}
                  {!pendingRequestsLoading && pendingRequestsFiltered.length === 0 && (
                    <p className="px-3 py-4 text-sm text-[#6B6B6B]">
                      {t("noPendingRequests")}
                    </p>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchesPage;
