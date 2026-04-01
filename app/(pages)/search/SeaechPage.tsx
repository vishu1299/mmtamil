"use client";
import React, { useEffect, useMemo, useState } from "react";
import SearchMain from "./_components/search-main";
import {
  allUser,
  filterProfilesFromAdmin,
  FilterProps,
  getAllFollowingPostSearch,
} from "./api/api";
import { User } from "./type/type";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter, useSearchParams } from "next/navigation";
import WelcomeCreditsPopup from "./welcome-credits/welcome-credits-popup";
import { hasAccessToken } from "@/lib/auth/access-token";
import {
  parseLandingSearchParams,
  hasLandingSearchParams,
} from "./lib/landing-search-params";
import {
  filterUsersByMatchGender,
  oppositeLookingForFilter,
  resolveViewerGender,
  ViewerGender,
} from "./lib/viewer-match-gender";
import { getuserByid } from "../profile/api/api";

const now = new Date().toISOString();
const dummyBase = {
  profileId: "",
  email: "",
  password: "",
  phoneNumber: null,
  role: "USER",
  createdAt: now,
  updatedAt: now,
  isActive: true,
  preferences: { id: 1, userId: 1, looking_for: "", looking_goal: [], martialStatus: null, preferredPersonality: "", preferredGender: null, ageRangefrom: null, ageRangeTo: null, country: null, city: null, countryCode: null, address: null, state: null, zip: null, createdAt: now, updatedAt: now },
  engagement: null,
  receivedMessage: [],
  reportedBy: [],
  reportsGiven: [],
  sendMessage: [],
  subscription: null,
  interestGiven: [],
  followers: [],
  following: [],
};

const dummyProfiles: User[] = [
  {
    ...dummyBase,
    id: 9001,
    userName: "Divya Shankar",
    profile: { id: 1, userId: 9001, gender: "FEMALE", dateOfBirth: "1999-03-15", profilePicture: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=800&fit=crop&crop=face", bio: "Love traveling and cooking", interests: [], languagesSpoken: [], traits: [], movies: [], music: [], personality: null, country: "India", city: "Coimbatore", field_of_work: "Nursing", understand_english: "YES", credits: 0, religion: "HINDU", martialStatus: "UNMARRIED", children: "NO", isAggredTandC: true, createdAt: now, updatedAt: now },
    posts: [{ id: 1, description: "", userId: 9001, createdAt: now, updatedAt: now, comments: [], LikeDislike: [], User: {} as any, image: [{ id: 1, image: "", postId: 1, createdAt: now, updatedAt: now }] }, { id: 2, description: "", userId: 9001, createdAt: now, updatedAt: now, comments: [], LikeDislike: [], User: {} as any, image: [{ id: 2, image: "", postId: 2, createdAt: now, updatedAt: now }] }, { id: 3, description: "", userId: 9001, createdAt: now, updatedAt: now, comments: [], LikeDislike: [], User: {} as any, image: [] }],
    verification: { id: 1, userId: 9001, emailVerified: true, phoneVerified: true, isBanned: false, banReason: null, lastLoginAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), createdAt: now, updatedAt: now },
    interestReceived: [],
  },
  {
    ...dummyBase,
    id: 9002,
    userName: "Priya Murugan",
    profile: { id: 2, userId: 9002, gender: "FEMALE", dateOfBirth: "1997-07-22", profilePicture: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&h=800&fit=crop&crop=face", bio: "Software engineer who loves music", interests: [], languagesSpoken: [], traits: [], movies: [], music: [], personality: null, country: "India", city: "Chennai", field_of_work: "Software Engineer", understand_english: "YES", credits: 0, religion: "HINDU", martialStatus: "UNMARRIED", children: "NO", isAggredTandC: true, createdAt: now, updatedAt: now },
    posts: [{ id: 4, description: "", userId: 9002, createdAt: now, updatedAt: now, comments: [], LikeDislike: [], User: {} as any, image: [{ id: 3, image: "", postId: 4, createdAt: now, updatedAt: now }] }, { id: 5, description: "", userId: 9002, createdAt: now, updatedAt: now, comments: [], LikeDislike: [], User: {} as any, image: [] }],
    verification: { id: 2, userId: 9002, emailVerified: true, phoneVerified: false, isBanned: false, banReason: null, lastLoginAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), createdAt: now, updatedAt: now },
    interestReceived: [],
  },
  {
    ...dummyBase,
    id: 9003,
    userName: "Anitha Raj",
    profile: { id: 3, userId: 9003, gender: "FEMALE", dateOfBirth: "1995-11-08", profilePicture: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=800&fit=crop&crop=face", bio: "Doctor based in Madurai", interests: [], languagesSpoken: [], traits: [], movies: [], music: [], personality: null, country: "India", city: "Madurai", field_of_work: "Doctor", understand_english: "YES", credits: 0, religion: "CHRISTIAN", martialStatus: "UNMARRIED", children: "NO", isAggredTandC: true, createdAt: now, updatedAt: now },
    posts: [{ id: 6, description: "", userId: 9003, createdAt: now, updatedAt: now, comments: [], LikeDislike: [], User: {} as any, image: [{ id: 4, image: "", postId: 6, createdAt: now, updatedAt: now }] }],
    verification: { id: 3, userId: 9003, emailVerified: true, phoneVerified: true, isBanned: false, banReason: null, lastLoginAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(), createdAt: now, updatedAt: now },
    interestReceived: [],
  },
  {
    ...dummyBase,
    id: 9004,
    userName: "Karthik Selvam",
    profile: { id: 4, userId: 9004, gender: "MALE", dateOfBirth: "1996-04-20", profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop&crop=face", bio: "Entrepreneur from Salem", interests: [], languagesSpoken: [], traits: [], movies: [], music: [], personality: null, country: "India", city: "Salem", field_of_work: "Business Owner", understand_english: "YES", credits: 0, religion: "HINDU", martialStatus: "UNMARRIED", children: "NO", isAggredTandC: true, createdAt: now, updatedAt: now },
    posts: [{ id: 7, description: "", userId: 9004, createdAt: now, updatedAt: now, comments: [], LikeDislike: [], User: {} as any, image: [{ id: 5, image: "", postId: 7, createdAt: now, updatedAt: now }] }, { id: 8, description: "", userId: 9004, createdAt: now, updatedAt: now, comments: [], LikeDislike: [], User: {} as any, image: [{ id: 6, image: "", postId: 8, createdAt: now, updatedAt: now }] }, { id: 9, description: "", userId: 9004, createdAt: now, updatedAt: now, comments: [], LikeDislike: [], User: {} as any, image: [] }, { id: 10, description: "", userId: 9004, createdAt: now, updatedAt: now, comments: [], LikeDislike: [], User: {} as any, image: [] }],
    verification: { id: 4, userId: 9004, emailVerified: true, phoneVerified: true, isBanned: false, banReason: null, lastLoginAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), createdAt: now, updatedAt: now },
    interestReceived: [],
  },
  {
    ...dummyBase,
    id: 9005,
    userName: "Meena Lakshmi",
    profile: { id: 5, userId: 9005, gender: "FEMALE", dateOfBirth: "1998-01-12", profilePicture: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=800&fit=crop&crop=face", bio: "Teacher and classical dancer", interests: [], languagesSpoken: [], traits: [], movies: [], music: [], personality: null, country: "India", city: "Trichy", field_of_work: "Teacher", understand_english: "YES", credits: 0, religion: "HINDU", martialStatus: "UNMARRIED", children: "NO", isAggredTandC: true, createdAt: now, updatedAt: now },
    posts: [{ id: 11, description: "", userId: 9005, createdAt: now, updatedAt: now, comments: [], LikeDislike: [], User: {} as any, image: [{ id: 7, image: "", postId: 11, createdAt: now, updatedAt: now }] }, { id: 12, description: "", userId: 9005, createdAt: now, updatedAt: now, comments: [], LikeDislike: [], User: {} as any, image: [] }],
    verification: { id: 5, userId: 9005, emailVerified: false, phoneVerified: true, isBanned: false, banReason: null, lastLoginAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), createdAt: now, updatedAt: now },
    interestReceived: [],
  },
  {
    ...dummyBase,
    id: 9006,
    userName: "Ravi Kumar",
    profile: { id: 6, userId: 9006, gender: "MALE", dateOfBirth: "1994-09-05", profilePicture: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=800&fit=crop&crop=face", bio: "CA working in Bangalore", interests: [], languagesSpoken: [], traits: [], movies: [], music: [], personality: null, country: "India", city: "Bangalore", field_of_work: "Chartered Accountant", understand_english: "YES", credits: 0, religion: "HINDU", martialStatus: "DIVORCED", children: "NO", isAggredTandC: true, createdAt: now, updatedAt: now },
    posts: [{ id: 13, description: "", userId: 9006, createdAt: now, updatedAt: now, comments: [], LikeDislike: [], User: {} as any, image: [{ id: 8, image: "", postId: 13, createdAt: now, updatedAt: now }] }],
    verification: { id: 6, userId: 9006, emailVerified: true, phoneVerified: true, isBanned: false, banReason: null, lastLoginAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), createdAt: now, updatedAt: now },
    interestReceived: [],
  },
];

const defaultFilters = (): FilterProps => ({
  from: "",
  city: "",
  ageFrom: 18,
  ageTo: 80,
  lookingFor: "",
  maritalStatus: "",
  heightFrom: "",
  heightTo: "",
  religion: "",
  motherTongue: "",
  caste: "",
  qualification: "",
});

const SearchPage: React.FC = () => {
  const params = useSearchParams();
  const router = useRouter();
  const search = params.get("type");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [data, setData] = useState<User[] | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  const [activeFilter, setActiveFilter] = useState<"all" | "following">("all");

  const [change, setChange] = useState<boolean>(false);
  const [filters, setFilters] = useState<FilterProps>(() => defaultFilters());
  const [viewerGender, setViewerGender] = useState<ViewerGender | null>(null);

  /** Same filters as the panel, plus opposite gender for getAll when viewer is known (male→female, female→male). */
  const filtersForCarousel = useMemo(() => {
    if (viewerGender) {
      return { ...filters, lookingFor: oppositeLookingForFilter(viewerGender) };
    }
    return filters;
  }, [filters, viewerGender]);

  /** API value for opposite-gender matches (FEMALE | MALE); passed into filter UI + client-side trim. */
  const matchLookingForGender = useMemo(
    () => (viewerGender ? oppositeLookingForFilter(viewerGender) : null),
    [viewerGender]
  );

  /** Require login before viewing search */
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!hasAccessToken()) {
      const path = `${window.location.pathname}${window.location.search}`;
      router.replace(`/login?redirect=${encodeURIComponent(path)}`);
      return;
    }
    setAuthChecked(true);
  }, [router]);

  /** Load viewer gender / iAm so carousel API requests opposite gender. */
  useEffect(() => {
    if (!authChecked) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await getuserByid();
        const userData = res?.data;
        if (!cancelled && userData) {
          setViewerGender(resolveViewerGender(userData));
        }
      } catch {
        if (!cancelled) setViewerGender(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [authChecked]);

  /** Apply landing hero query (?age=&religion=&location=) to filters */
  useEffect(() => {
    if (!hasLandingSearchParams(params)) return;
    const fromUrl = parseLandingSearchParams(params);
    setFilters((prev) => ({ ...prev, ...fromUrl }));
  }, [params]);

  const isAnyFilterApplied = (filter: FilterProps) =>
    Boolean(
      filter.from ||
        (filter.city && filter.city.trim()) ||
        filter.maritalStatus ||
        filter.heightFrom ||
        filter.heightTo ||
        filter.religion ||
        filter.motherTongue ||
        (filter.caste && filter.caste.trim()) ||
        (filter.qualification && filter.qualification.trim()) ||
        filter.ageFrom !== 18 ||
        filter.ageTo !== 80
    );

  useEffect(() => {
    if (search === "following") {
      setActiveFilter("following");
    } else {
      setActiveFilter("all");
    }
  }, [search]);

  const fetchData = async (currentPage: number, filters: FilterProps) => {
    const wantMatch = viewerGender
      ? oppositeLookingForFilter(viewerGender)
      : null;
    try {
      if (activeFilter === "following") {
        const result = await getAllFollowingPostSearch(currentPage, filters);
        console.log("following data search", result?.data.data.data);
        const filtered = result?.data.data.data.map((item: any) => ({
          id: item.following.id,
          profile: item.following.profile,
          posts: item.following.posts,
          userName: item.following.userName,
          interestReceived: item.following.interestReceived,
        }));
        const rows = filtered?.length ? filtered : [];
        setData(filterUsersByMatchGender(rows, wantMatch));
      }
      if (activeFilter === "all") {
        if (isAnyFilterApplied(filters)) {
          let filtered = await filterProfilesFromAdmin(filters);
          const city = filters.city?.trim();
          if (city && filtered.length) {
            filtered = filtered.filter(
              (u) =>
                (u.profile?.city || "").toLowerCase() === city.toLowerCase()
            );
          }
          const countries = (filters.from ?? "")
            .split(",")
            .map((item) => item.trim().toLowerCase())
            .filter(Boolean);
          if (countries.length && filtered.length) {
            filtered = filtered.filter((u) =>
              countries.includes((u.profile?.country || "").trim().toLowerCase())
            );
          }
          const castes = (filters.caste ?? "")
            .split(",")
            .map((item) => item.trim().toLowerCase())
            .filter(Boolean);
          if (castes.length && filtered.length) {
            filtered = filtered.filter((u) =>
              castes.includes((u.profile?.caste || "").trim().toLowerCase())
            );
          }
          const motherTongues = (filters.motherTongue ?? "")
            .split(",")
            .map((item) => item.trim().toLowerCase())
            .filter(Boolean);
          if (motherTongues.length && filtered.length) {
            filtered = filtered.filter((u) =>
              motherTongues.includes(
                (u.profile?.motherTongue || "").trim().toLowerCase()
              )
            );
          }
          const qualifications = (filters.qualification ?? "")
            .split(",")
            .map((item) => item.trim().toLowerCase())
            .filter(Boolean);
          if (qualifications.length && filtered.length) {
            filtered = filtered.filter((u) =>
              qualifications.includes(
                (u.profile?.education || "").trim().toLowerCase()
              )
            );
          }
          setData(filterUsersByMatchGender(filtered, wantMatch));
          setTotalPages(1);
        } else {
          const result = await allUser(currentPage, filters);
          let apiData = result?.data?.data?.data;
          const city = filters.city?.trim();
          if (city && Array.isArray(apiData) && apiData.length) {
            apiData = apiData.filter(
              (u: User) =>
                (u.profile?.city || "").toLowerCase() === city.toLowerCase()
            );
          }
          const countries = (filters.from ?? "")
            .split(",")
            .map((item) => item.trim().toLowerCase())
            .filter(Boolean);
          if (countries.length && Array.isArray(apiData) && apiData.length) {
            apiData = apiData.filter((u: User) =>
              countries.includes((u.profile?.country || "").trim().toLowerCase())
            );
          }
          const castes = (filters.caste ?? "")
            .split(",")
            .map((item) => item.trim().toLowerCase())
            .filter(Boolean);
          if (castes.length && Array.isArray(apiData) && apiData.length) {
            apiData = apiData.filter((u: User) =>
              castes.includes((u.profile?.caste || "").trim().toLowerCase())
            );
          }
          const motherTongues = (filters.motherTongue ?? "")
            .split(",")
            .map((item) => item.trim().toLowerCase())
            .filter(Boolean);
          if (motherTongues.length && Array.isArray(apiData) && apiData.length) {
            apiData = apiData.filter((u: User) =>
              motherTongues.includes(
                (u.profile?.motherTongue || "").trim().toLowerCase()
              )
            );
          }
          const qualifications = (filters.qualification ?? "")
            .split(",")
            .map((item) => item.trim().toLowerCase())
            .filter(Boolean);
          if (qualifications.length && Array.isArray(apiData) && apiData.length) {
            apiData = apiData.filter((u: User) =>
              qualifications.includes(
                (u.profile?.education || "").trim().toLowerCase()
              )
            );
          }
          setData(
            filterUsersByMatchGender(
              apiData?.length ? apiData : [],
              wantMatch
            )
          );
          setTotalPages(result?.data?.data?.totalPages || 1);
        }
      }
    } catch (error) {
      console.log("API unavailable");
      setData((prev) => prev ?? []);
    }
  };

  useEffect(() => {
    if (!authChecked) return;
    fetchData(currentPage, filtersForCarousel);
  }, [change, currentPage, filtersForCarousel, activeFilter, authChecked]);

  if (!authChecked) {
    return (
      <div className="px-2 lg:px-0">
        <div className="flex flex-wrap justify-center w-full gap-4 mt-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="flex flex-col space-y-3 w-[300px]">
              <Skeleton className="h-[225px] w-full rounded-xl bg-soft-rose" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full bg-soft-rose" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-2 lg:px-0">
      <WelcomeCreditsPopup />

      {!data ? (
        <div className="flex flex-wrap justify-center w-full gap-4 mt-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="flex flex-col space-y-3 w-[300px]">
              <Skeleton className="h-[225px] w-full rounded-xl bg-soft-rose" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full bg-soft-rose" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <SearchMain
          profiles={data}
          filters={filters}
          searchBulkFilters={filtersForCarousel}
          matchLookingForGender={matchLookingForGender}
          setFilters={setFilters}
          change={change}
          setChange={setChange}
          totalPages={totalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />
      )}
    </div>
  );
};

export default SearchPage;
