"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { FaCrown } from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5";
import { FaHeart } from "react-icons/fa";
import { getuserByid } from "@/app/(pages)/profile/api/api";
import { getInterestedUser } from "@/app/api/api";

const PAGE_SIZE = 20;

interface MatchNotification {
  id: number;
  name: string;
  age: number;
  distance: number;
  avatar: string;
  time: string;
}

const DEFAULT_AVATAR = "/assets/images/search/DefaultAvatar.svg";
const IMAGE_BASE = process.env.NEXT_PUBLIC_IMAGE_URL ?? "";

function getAge(dateOfBirth: string | null | undefined): number {
  if (!dateOfBirth) return 0;
  const dob = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  return age;
}

function formatTimeAgo(dateStr: string | null | undefined): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hr ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
  return d.toLocaleDateString();
}

function isToday(dateStr: string | null | undefined): boolean {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const t = new Date();
  return d.getDate() === t.getDate() && d.getMonth() === t.getMonth() && d.getFullYear() === t.getFullYear();
}

function isYesterday(dateStr: string | null | undefined): boolean {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const y = new Date();
  y.setDate(y.getDate() - 1);
  return d.getDate() === y.getDate() && d.getMonth() === y.getMonth() && d.getFullYear() === y.getFullYear();
}

function mapRawToNotifications(list: any[]): MatchNotification[] {
  return list.map((item: any, idx: number) => {
    const u = item?.userInterest ?? item?.user ?? item;
    const profile = u?.profile ?? {};
    const createdAt = item?.createdAt ?? item?.updatedAt ?? u?.createdAt;
    const first = profile?.firstName ?? "";
    const last = profile?.lastName ?? "";
    const name = u?.userName ?? ([first, last].filter(Boolean).join(" ").trim() || "Someone");
    const avatar = profile?.profilePicture
      ? `${IMAGE_BASE}uploads/${profile.profilePicture}`
      : DEFAULT_AVATAR;
    return {
      id: item?.id ?? u?.id ?? idx,
      name,
      age: getAge(profile?.dateOfBirth ?? u?.dateOfBirth),
      distance: item?.distance ?? 0,
      avatar,
      time: formatTimeAgo(createdAt),
    };
  });
}

function categorizeByDate(
  list: any[],
  mapped: MatchNotification[]
): { today: MatchNotification[]; yesterday: MatchNotification[]; other: MatchNotification[] } {
  const today: MatchNotification[] = [];
  const yesterday: MatchNotification[] = [];
  const other: MatchNotification[] = [];
  list.forEach((item: any, i: number) => {
    const created = item?.createdAt ?? item?.updatedAt ?? item?.userInterest?.createdAt;
    const notif = mapped[i];
    if (!notif) return;
    if (isToday(created)) today.push(notif);
    else if (isYesterday(created)) yesterday.push(notif);
    else other.push(notif);
  });
  return { today, yesterday, other };
}

const PremiumCard = ({ subscribedAt, packageName }: { subscribedAt?: string; packageName?: string }) => (
  <div className="flex items-start gap-4 border-b border-border-soft bg-gradient-to-r from-gold-light/20 to-cream/40 px-4 py-5 transition-all duration-200 hover:shadow-soft">
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-[#FFF8F0] shadow-sm">
      <FaCrown className="text-xl text-[#D4AF37]" />
    </div>
    <div className="flex-1 min-w-0">
      <h3 className="text-[15px] font-semibold text-[#2C2C2C]">
        {packageName ? `${packageName} Plan` : "Premium Plan"}
      </h3>
      <p className="text-[13px] text-[#6B6B6B] mt-0.5 leading-[1.4]">
        You&apos;ve successfully subscribed to Premium. Enjoy profile views,
        contact views, and exclusive features.
      </p>
      {subscribedAt && (
        <span className="text-xs text-[#9CA3AF] mt-1.5 block">
          {formatTimeAgo(subscribedAt)}
        </span>
      )}
    </div>
  </div>
);

const Avatar = ({ src, name }: { src: string; name: string }) => {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-maroon/15 bg-soft-rose shadow-sm">
        <span className="text-maroon font-semibold text-sm">
          {name.charAt(0)}
        </span>
      </div>
    );
  }

  return (
    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-border-soft bg-gray-200 shadow-sm ring-2 ring-white transition-shadow duration-200 hover:shadow-soft">
      <Image
        src={src}
        alt={name}
        width={48}
        height={48}
        className="w-full h-full object-cover"
        onError={() => setError(true)}
      />
    </div>
  );
};

const MatchNotificationItem = ({ notification }: { notification: MatchNotification }) => (
  <div className="flex items-center gap-3 border-b border-border-soft px-4 py-4 transition-all duration-200 last:border-b-0 hover:bg-soft-rose/25 hover:shadow-sm">
    <Avatar src={notification.avatar} name={notification.name} />
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <span className="text-[14px] font-semibold text-[#2C2C2C]">
          {notification.name}, {notification.age}
        </span>
        {notification.distance > 0 && (
          <div className="flex items-center gap-0.5">
            <IoLocationSharp className="text-xs text-[#EF4765]" />
            <span className="text-xs text-[#6B6B6B]">
              {notification.distance} KM
            </span>
          </div>
        )}
      </div>
      <p className="text-[13px] text-[#6B6B6B] mt-0.5">
        Invites you for a match!
      </p>
      <span className="text-xs text-[#9CA3AF] mt-0.5 block">
        {notification.time}
      </span>
    </div>
    <button
      type="button"
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-maroon/20 bg-maroon text-white shadow-maroon transition-all duration-200 hover:bg-maroon-light hover:shadow-maroon-lg hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon/40 motion-reduce:hover:translate-y-0"
    >
      <FaHeart className="text-lg text-white" />
    </button>
  </div>
);

const Notifications = () => {
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasPremium, setHasPremium] = useState(false);
  const [premiumSubscribedAt, setPremiumSubscribedAt] = useState<string | undefined>();
  const [premiumPackageName, setPremiumPackageName] = useState<string | undefined>();
  const [todayList, setTodayList] = useState<MatchNotification[]>([]);
  const [yesterdayList, setYesterdayList] = useState<MatchNotification[]>([]);
  const [otherList, setOtherList] = useState<MatchNotification[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [userId, setUserId] = useState<number | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (!userId || loadingMore || !hasMore) return;
    const nextPage = page + 1;
    setLoadingMore(true);
    try {
      const res = await getInterestedUser(userId, nextPage, PAGE_SIZE);
      const payload = (res?.data as any)?.data;
      const raw = Array.isArray(payload) ? payload : payload?.data ?? [];
      const list: any[] = Array.isArray(raw) ? raw : [];
      if (list.length === 0 || list.length < PAGE_SIZE) {
        setHasMore(false);
      }
      const mapped = mapRawToNotifications(list);
      const { today, yesterday, other } = categorizeByDate(list, mapped);
      setTodayList((prev) => [...prev, ...today]);
      setYesterdayList((prev) => [...prev, ...yesterday]);
      setOtherList((prev) => [...prev, ...other]);
      setPage(nextPage);
    } catch {
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  }, [userId, page, loadingMore, hasMore]);

  useEffect(() => {
    const load = async () => {
      try {
        const userRes = await getuserByid();
        const userData = userRes?.data;
        if (!userData?.id) {
          setLoading(false);
          return;
        }
        setUserId(Number(userData.id));
        const payments = userData?.UserPayment ?? userData?.userPayment ?? [];
        const hasPayments = Array.isArray(payments) && payments.length > 0;
        setHasPremium(hasPayments);
        if (hasPayments) {
          const latest = payments.sort(
            (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )[0];
          setPremiumSubscribedAt(latest?.createdAt);
          setPremiumPackageName(latest?.package?.name);
        } else {
          setPremiumSubscribedAt(undefined);
          setPremiumPackageName(undefined);
        }

        const res = await getInterestedUser(Number(userData.id), 1, PAGE_SIZE);
        const payload = (res?.data as any)?.data;
        const raw = Array.isArray(payload) ? payload : payload?.data ?? [];
        const list: any[] = Array.isArray(raw) ? raw : [];
        if (list.length < PAGE_SIZE) setHasMore(false);
 
        const mapped: MatchNotification[] = list.map((item: any, idx: number) => {
          const u = item?.userInterest ?? item?.user ?? item;
          const profile = u?.profile ?? {};
          const createdAt = item?.createdAt ?? item?.updatedAt ?? u?.createdAt;
          const first = profile?.firstName ?? "";
          const last = profile?.lastName ?? "";
          const name = u?.userName ?? ([first, last].filter(Boolean).join(" ").trim() || "Someone");
          const avatar = profile?.profilePicture
            ? ( `${IMAGE_BASE}${profile.profilePicture.split("uploads/")[1]}`)
            : DEFAULT_AVATAR;
          return {
            id: item?.id ?? u?.id ?? idx,
            name,
            age: getAge(profile?.dateOfBirth ?? u?.dateOfBirth),
            distance: item?.distance ?? 0,
            avatar,
            time: formatTimeAgo(createdAt),
          };
        });
        const today: MatchNotification[] = [];
        const yesterday: MatchNotification[] = [];
        const other: MatchNotification[] = [];
        list.forEach((item: any, i: number) => {
          const created = item?.createdAt ?? item?.updatedAt ?? item?.userInterest?.createdAt;
          const notif = mapped[i];
          if (!notif) return;
          if (isToday(created)) today.push(notif);
          else if (isYesterday(created)) yesterday.push(notif);
          else other.push(notif);
        });
        setTodayList(today);
        setYesterdayList(yesterday);
        setOtherList(other);
      } catch {
        setTodayList([]);
        setYesterdayList([]);
        setOtherList([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (!hasMore || loading || loadingMore) return;
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore();
      },
      { rootMargin: "100px", threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, loading, loadingMore, loadMore]);

  const hasAny = todayList.length > 0 || yesterdayList.length > 0 || otherList.length > 0;
  
  return (
    <div className="px-4 lg:px-0 pb-24 lg:pb-6">
      <div className="overflow-hidden rounded-2xl border border-border-soft bg-white shadow-card transition-all duration-300 hover:border-maroon/10 hover:shadow-card-hover lg:border-2">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-10 h-10 border-2 border-maroon/30 border-t-maroon rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {hasPremium && (
              <PremiumCard
                subscribedAt={premiumSubscribedAt}
                packageName={premiumPackageName}
              />
            )}

            {todayList.length > 0 && (
              <>
                <div className="pt-4 pb-1 px-4">
                  <h2 className="text-[15px] font-semibold text-[#2C2C2C]">Today</h2>
                </div>
                {todayList.map((notification) => (
                  <MatchNotificationItem key={notification.id} notification={notification} />
                ))}
              </>
            )}

            {yesterdayList.length > 0 && (
              <>
                <div className="pt-6 pb-1 px-4">
                  <h2 className="text-[15px] font-semibold text-[#2C2C2C]">Yesterday</h2>
                </div>
                {yesterdayList.map((notification) => (
                  <MatchNotificationItem key={notification.id} notification={notification} />
                ))}
              </>
            )}

            {otherList.length > 0 && (
              <>
                <div className="pt-6 pb-1 px-4">
                  <h2 className="text-[15px] font-semibold text-[#2C2C2C]">Older</h2>
                </div>
                {otherList.map((notification) => (
                  <MatchNotificationItem key={notification.id} notification={notification} />
                ))}
              </>
            )}

            {!hasAny && (
              <p className="px-4 py-8 text-center text-[#6B6B6B] text-sm">
                No pending match invites. When someone shows interest, they&apos;ll appear here.
              </p>
            )}

            {hasAny && hasMore && (
              <div ref={sentinelRef} className="flex justify-center py-6">
                {loadingMore && (
                  <div className="w-8 h-8 border-2 border-maroon/30 border-t-maroon rounded-full animate-spin" />
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Notifications;
