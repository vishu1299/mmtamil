"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { GrClose } from "react-icons/gr";
import { IoMdChatboxes } from "react-icons/io";
import { FaHeart } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import SearchCarousel, { SearchCarouselHandle } from "./search-carousel";
import SearchNav from "./search-nav";
import { User } from "../type/type";
import { FilterProps } from "../api/api";
import { createInteraction, getAllUsersForSearch } from "../api/api";
import { fetchHasActivePackage } from "@/lib/subscription/has-active-package";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

/** Numeric token vs user id, profile id, registration / profileId strings (modal search). */
function tokenMatchesProfileIds(p: User, token: string): boolean {
  const t = token.trim().toLowerCase();
  if (!/^\d+$/.test(t)) return false;

  const raw: (string | number | null | undefined)[] = [
    p.id,
    p.profile?.id,
    p.profileId,
    p.registrationId,
    p.profile?.registrationId,
  ];

  for (const v of raw) {
    if (v === undefined || v === null) continue;
    const s = String(v).trim().toLowerCase();
    if (!s) continue;
    if (s === t || s.includes(t)) return true;
  }
  return false;
}

interface SearchMainProps {
  profiles: User[];
  filters: FilterProps;
  /** Same body as `getAll` for the carousel (e.g. opposite gender). Used for modal bulk load — must not send values the API rejects (e.g. `lookingFor: "All"`). */
  searchBulkFilters?: FilterProps;
  /** FEMALE | MALE — opposite of viewer; keeps filter dialog `lookingFor` in sync with API. */
  matchLookingForGender?: string | null;
  setFilters: React.Dispatch<React.SetStateAction<FilterProps>>;
  change: boolean;
  setChange: React.Dispatch<React.SetStateAction<boolean>>;
  totalPages: number;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  activeFilter: "all" | "following";
  setActiveFilter: React.Dispatch<React.SetStateAction<"all" | "following">>;
}

const SearchMain: React.FC<SearchMainProps> = ({
  profiles,
  filters,
  searchBulkFilters,
  matchLookingForGender,
  setFilters,
  change,
  setChange,
  totalPages,
  currentPage,
  setCurrentPage,
  activeFilter,
  setActiveFilter,
}) => {
  const carouselRef = useRef<SearchCarouselHandle>(null);
  const router = useRouter();
  const tSearch = useTranslations("search");
  const skipSearchRedirectRef = useRef(false);
  const [packageRequiredOpen, setPackageRequiredOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [allSearchProfiles, setAllSearchProfiles] = useState<User[]>([]);
  const [isSearchingAll, setIsSearchingAll] = useState(false);
  const [hasActivePackage, setHasActivePackage] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const tokenData = localStorage.getItem("access-token");
      if (tokenData) {
        const parsed = JSON.parse(tokenData);
        setCurrentUserId(parsed?.data?.result?.id ?? null);
      }
    } catch {
      // ignore
    }
  }, []);

  const bulkFilters = searchBulkFilters ?? filters;

  /** Modal bulk list: same `getAll` filter as carousel so the API returns rows (rejects unknown `lookingFor` values). */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setIsSearchingAll(true);
      try {
        const response = await getAllUsersForSearch(8000, bulkFilters);
        const users = response?.data?.data?.data;
        if (!cancelled) setAllSearchProfiles(Array.isArray(users) ? users : []);
      } catch {
        if (!cancelled) setAllSearchProfiles([]);
      } finally {
        if (!cancelled) setIsSearchingAll(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [bulkFilters]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const ok = await fetchHasActivePackage();
        if (!cancelled) setHasActivePackage(ok);
      } catch {
        if (!cancelled) setHasActivePackage(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const showPackageRequired = useCallback(() => {
    setPackageRequiredOpen(true);
  }, []);

  /** Modal search: name / username, plus user id, profile id, registrationId / profileId for numeric queries. */
  const modalFilteredProfiles = allSearchProfiles.filter((p) => {
    if (currentUserId && p.id === currentUserId) return false;
    if (!searchQuery.trim()) return true;

    const raw = searchQuery.trim().toLowerCase();
    const tokens = raw.split(/\s+/).filter(Boolean);
    if (tokens.length === 0) return true;

    const first = String(p.profile?.firstName ?? "").trim().toLowerCase();
    const last = String(p.profile?.lastName ?? "").trim().toLowerCase();
    const userName = String(p.userName ?? "").trim().toLowerCase();
    const fullName = [first, last].filter(Boolean).join(" ").trim();
    const haystack = [fullName, userName].filter(Boolean).join(" ").trim();

    return tokens.every((token) => {
      if (tokenMatchesProfileIds(p, token)) return true;
      return haystack.includes(token);
    });
  });

  const carouselProfiles = profiles.filter((p) =>
    currentUserId ? p.id !== currentUserId : true
  );

  const handleModalAction = async (
    profileId: number,
    type: "interest" | "ignored"
  ) => {
    if (!currentUserId) return;
    try {
      await createInteraction({
        userId: currentUserId,
        targetId: profileId,
        type,
      });
      setAllSearchProfiles((prev) => prev.filter((profile) => profile.id !== profileId));
      setChange(!change);
    } catch {
      // ignore
    }
  };

  const handleSkip = () => {
    const profile = carouselRef.current?.getActiveProfile();
    if (profile && currentUserId) {
      createInteraction({
        userId: currentUserId,
        targetId: profile.id,
        type: "ignored",
      }).then(() => setChange(!change)).catch(() => {});
    }
    carouselRef.current?.skipProfile();
  };

  const handleLike = () => {
    const profile = carouselRef.current?.getActiveProfile();
    if (profile && currentUserId) {
      createInteraction({
        userId: currentUserId,
        targetId: profile.id,
        type: "interest",
      }).then(() => setChange(!change)).catch(() => {});
    }
    carouselRef.current?.likeProfile();
  };

  const handleChat = () => {
    const profile = carouselRef.current?.getActiveProfile();
    if (profile) {
      router.push(`/mails?userId=${profile.id}`);
    }
  };

  return (
    <div className="px-2 lg:px-0">
      <SearchNav
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        filters={filters}
        matchLookingForGender={matchLookingForGender}
        setFilters={setFilters}
        data={profiles}
        change={change}
        setChange={setChange}
        totalPages={totalPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        modalResults={modalFilteredProfiles}
        searchLoading={isSearchingAll}
        onModalAction={handleModalAction}
        hasActivePackage={hasActivePackage}
        onPackageRequired={showPackageRequired}
      />

      <SearchCarousel
        ref={carouselRef}
        profiles={carouselProfiles}
        hasActivePackage={hasActivePackage}
        onPackageRequired={showPackageRequired}
      />

      <AlertDialog
        open={packageRequiredOpen}
        onOpenChange={(open) => {
          setPackageRequiredOpen(open);
          if (!open) {
            if (skipSearchRedirectRef.current) {
              skipSearchRedirectRef.current = false;
              return;
            }
            router.replace("/search");
          }
        }}
      >
        <AlertDialogContent className="rounded-2xl border-border-soft sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-playfair text-maroon">
              {tSearch("packageRequiredTitle")}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[#6B6B6B]">
              {tSearch("errPackageRequired")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:justify-end">
            <AlertDialogCancel className="border-border-soft">
              {tSearch("close")}
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-maroon hover:bg-maroon/90"
              onClick={() => {
                skipSearchRedirectRef.current = true;
                router.push("/credits");
              }}
            >
              {tSearch("viewPlans")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="lg:w-[400px] my-4 flex justify-center items-center gap-5 md:gap-8 mx-auto md:bottom-2 bottom-16 sticky z-20">
        <button
          onClick={handleSkip}
          className="h-14 w-14 border border-border-soft bg-white rounded-full flex justify-center items-center shadow-md hover:shadow-lg hover:border-red-400 hover:bg-red-50 transition-all duration-200 active:scale-90"
        >
          <GrClose className="text-2xl text-[#6B6B6B]" />
        </button>
        <button
          onClick={handleChat}
          className="h-10 w-10 border border-border-soft bg-white rounded-full flex justify-center items-center shadow-md hover:shadow-lg hover:border-maroon/30 hover:bg-soft-rose transition-all duration-200 active:scale-90"
        >
          <IoMdChatboxes className="text-xl text-maroon" />
        </button>
        <button
          onClick={handleLike}
          className="h-14 w-14 bg-maroon rounded-full flex justify-center items-center shadow-md hover:shadow-lg hover:bg-maroon/90 transition-all duration-200 active:scale-90"
        >
          <FaHeart className="text-2xl text-white" />
        </button>
      </div>
    </div>
  );
};

export default SearchMain;
