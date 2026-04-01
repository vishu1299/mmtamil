"use client"
import React, { createContext, useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import SearchDetails from './search-details'
import PaidFeatures from '@/app/_components/paid-features/paid-features'
import { getUserById } from '../api/api'
import { User } from '../type/type'
import { extractUserPayload, mergeApiUserResponse } from '../utils/mergeApiUser'
import { fetchHasActivePackage } from '@/lib/subscription/has-active-package'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface ContextProp {
  reload: boolean,
  setReload: React.Dispatch<React.SetStateAction<boolean>>
}
export const ContUser = createContext<ContextProp | null>(null)

const now = new Date().toISOString();
const emptyUser: User = {
  id: 0,
  profileId: "",
  userName: "",
  email: "",
  password: "",
  phoneNumber: null,
  role: "USER",
  createdAt: "",
  updatedAt: "",
  isActive: true,
  profile: {
    id: 0, userId: 0, gender: "",
    dateOfBirth: now,
    profilePicture: "",
    bio: "",
    interests: [],
    languagesSpoken: [],
    traits: [],
    movies: [], music: [],
    personality: null,
    country: "", city: "",
    field_of_work: "",
    understand_english: "",
    credits: 0,
    religion: "",
    martialStatus: "",
    children: "",
    isAggredTandC: false,
    createdAt: now, updatedAt: now,
  },
  preferences: { id: 0, userId: 0, looking_for: "", looking_goal: [], martialStatus: null, preferredPersonality: "", preferredGender: null, ageRangefrom: null, ageRangeTo: null, country: null, city: null, countryCode: null, address: null, state: null, zip: null, createdAt: now, updatedAt: now },
  posts: [],
  verification: { id: 0, userId: 0, emailVerified: false, phoneVerified: false, isBanned: false, banReason: null, lastLoginAt: now, createdAt: now, updatedAt: now },
  engagement: null,
  receivedMessage: [],
  reportedBy: [],
  reportsGiven: [],
  sendMessage: [],
  subscription: null,
  interestGiven: [],
  interestReceived: [],
  followers: [],
  following: [],
};

const MainPage = ({ id }: { id: number }) => {
  const router = useRouter();
  const tSearch = useTranslations("search");
  const skipSearchRedirectRef = useRef(false);
  const [packageAllowed, setPackageAllowed] = useState<boolean | null>(null);
  const [packageGateOpen, setPackageGateOpen] = useState(false);
  const [data, setData] = useState<User | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [reload, setReload] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const ok = await fetchHasActivePackage();
        if (cancelled) return;
        if (!ok) {
          setPackageAllowed(false);
          setPackageGateOpen(true);
          return;
        }
        setPackageAllowed(true);
      } catch {
        if (!cancelled) {
          setPackageAllowed(false);
          setPackageGateOpen(true);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const fetchUser = async (userId: number) => {
    setLoadingProfile(true);
    try {
      const result = await getUserById(userId);
      const payload = extractUserPayload(result);
      if (payload) {
        setData(mergeApiUserResponse(payload, emptyUser));
      } else {
        setData(null);
      }
    } catch (error) {
      console.log("Failed to fetch profile details");
      setData(null);
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    if (id && packageAllowed) fetchUser(Number(id));
  }, [id, reload, packageAllowed]);

  return (
    <ContUser.Provider value={{ reload, setReload }}>
      <div className="mx-auto min-h-screen w-full max-w-[1560px] lg:w-[88%] lg:py-6">
        <div className="hidden lg:block" />
        <div className="flex w-full items-start justify-between gap-4">
          <div className="flex w-full flex-col overflow-hidden rounded-2xl border border-border-soft bg-white shadow-card transition-all duration-300 hover:border-maroon/10 hover:shadow-card-hover lg:mr-4">
            {packageAllowed === null ? (
              <div className="flex min-h-[60vh] items-center justify-center py-8">
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-maroon/30 border-t-maroon" />
              </div>
            ) : packageAllowed === false ? (
              <div className="min-h-[40vh]" aria-hidden />
            ) : loadingProfile ? (
              <div className="flex min-h-[60vh] items-center justify-center py-8">
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-maroon/30 border-t-maroon" />
              </div>
            ) : data ? (
              <SearchDetails data={data} />
            ) : (
              <div className="flex min-h-[60vh] items-center justify-center px-4 text-center text-sm text-[#6B6B6B]">
                Unable to load profile details right now.
              </div>
            )}
          </div>
          <div className="hidden lg:block w-[312px]">
            <PaidFeatures />
          </div>
        </div>
      </div>

      <AlertDialog
        open={packageGateOpen}
        onOpenChange={(open) => {
          setPackageGateOpen(open);
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
    </ContUser.Provider>
  )
}

export default MainPage