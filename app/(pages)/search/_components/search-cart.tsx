"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { GoDotFill } from "react-icons/go";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5";
import { MdVerified, MdWork } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import { RxCross2 } from "react-icons/rx";
import { HiUser } from "react-icons/hi";
import { GiBodyHeight } from "react-icons/gi";
import Link from "next/link";
import { PaginationDemo } from "./pagination";
import { User } from "../type/type";
import { showInterest } from "../api/api";

import imgwomen from "@/public/assets/images/search/images (2).jpg";
import imgmen from "@/public/assets/images/search/images (4).jpg";

const SearchCart = ({
  data,
  change,
  setChange,
  totalPages,
  currentPage,
  setCurrentPage,
}: {
  data: User[];
  change: boolean;
  setChange: React.Dispatch<React.SetStateAction<boolean>>;
  totalPages: number;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const [token, setToken] = useState<any | null>();

  useEffect(() => {
    const tokendata = localStorage.getItem("access-token");
    if (tokendata) {
      const toker = JSON.parse(tokendata);
      setToken(toker);
    }
  }, []);

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const getRelativeTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Online";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const formatReligion = (religion: string) => {
    if (!religion) return "";
    return religion.charAt(0).toUpperCase() + religion.slice(1).toLowerCase();
  };

  const interact = async (targetId: number, type: string) => {
    const data = {
      targetId: targetId,
      type: type,
    };
    const result = await showInterest(data);
    console.log(result);
    setChange(!change);
  };

  const currentUserId = token?.data?.result?.id;

  return (
    <>
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mt-5 px-4 lg:px-0">
          {data.map(
            (item, index) =>
              item.id !== currentUserId && (
                  <div
                    key={item.id}
                    className="bg-white border border-border-soft rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300"
                  >
                    {/* Image Section */}
                    <Link href={`/search/${item.id}`}>
                      <div className="relative">
                        <Image
                          src={
                            item?.profile?.profilePicture
                              ? item.profile.profilePicture.startsWith("http")
                                ? item.profile.profilePicture
                                : `${process.env.NEXT_PUBLIC_IMAGE_URL}${item.profile.profilePicture}`
                              : item.profile.gender === "FEMALE"
                              ? imgwomen
                              : imgmen
                          }
                          width={400}
                          height={530}
                          className="w-full aspect-[3/4] object-cover"
                          alt={`profile-${index}`}
                        />

                        {/* Image carousel indicators */}
                        <div className="absolute top-3 left-3 right-12 flex gap-1.5">
                          {[
                            ...Array(
                              Math.max(Math.min(item.posts.length, 4), 1)
                            ),
                          ].map((_, i) => (
                            <div
                              key={i}
                              className={`h-1 flex-1 rounded-full ${
                                i === 0 ? "bg-white" : "bg-white/40"
                              }`}
                            />
                          ))}
                        </div>

                        {/* Menu button */}
                        <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center">
                          <BsThreeDotsVertical className="text-white text-sm" />
                        </button>

                        {/* Bottom overlay */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-4 pb-4 pt-12">
                          <div className="flex items-center gap-4">
                            {(item.profile.city || item.profile.country) && (
                              <span className="flex items-center gap-1 text-white text-sm">
                                <IoLocationSharp className="text-red-400" />
                                {item.profile.city || item.profile.country}
                              </span>
                            )}
                            {item.verification?.lastLoginAt && (
                              <span className="flex items-center gap-1 text-white text-sm">
                                <GoDotFill className="text-green-400" />
                                {getRelativeTime(
                                  item.verification.lastLoginAt
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>

                    {/* Info Section */}
                    <div className="px-4 py-4">
                      <Link href={`/search/${item.id}`}>
                        <div className="flex items-center gap-2 mb-3">
                          <h3 className="font-playfair font-semibold text-lg text-[#2C2C2C]">
                            {item.userName.split(" ").slice(0, 2).join(" ")},{" "}
                            {calculateAge(item.profile.dateOfBirth)}
                          </h3>
                          {item.verification?.emailVerified && (
                            <MdVerified className="text-green-500 text-lg" />
                          )}
                        </div>
                      </Link>

                      <div className="space-y-2 text-sm text-[#6B6B6B]">
                        <div className="flex items-center gap-3 flex-wrap">
                          {(item.profile.city || item.profile.country) && (
                            <span className="flex items-center gap-1.5">
                              <IoLocationSharp className="text-maroon shrink-0" />
                              {[item.profile.city, item.profile.country]
                                .filter(Boolean)
                                .join(", ")}
                            </span>
                          )}
                          <span className="flex items-center gap-1.5">
                            <GiBodyHeight className="shrink-0" />
                            5&apos;3&quot;
                          </span>
                        </div>
                        {item.profile.religion && (
                          <div className="flex items-center gap-1.5">
                            <HiUser className="text-[#6B6B6B] shrink-0" />
                            <span>
                              {formatReligion(item.profile.religion)}
                            </span>
                          </div>
                        )}
                        {item.profile.field_of_work && (
                          <div className="flex items-center gap-1.5">
                            <MdWork className="text-[#6B6B6B] shrink-0" />
                            <span>{item.profile.field_of_work}</span>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex justify-center items-center gap-5 mt-5">
                        <button
                          onClick={() => interact(item.id, "skip")}
                          className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-[#6B6B6B] hover:bg-gray-200 transition-colors"
                        >
                          <RxCross2 className="text-xl" />
                        </button>
                        <button
                          onClick={() => interact(item.id, "interest")}
                          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-md transition-all duration-200 ${
                            item?.interestReceived?.some(
                              (interest) =>
                                interest.userId === currentUserId
                            )
                              ? "bg-maroon text-white"
                              : "bg-[#E74C5E] text-white hover:bg-maroon"
                          }`}
                        >
                          {item?.interestReceived?.some(
                            (interest) =>
                              interest.userId === currentUserId
                          ) ? (
                            <FaHeart className="text-xl" />
                          ) : (
                            <FaRegHeart className="text-xl" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )
            )}
          </div>
          <div className="mt-10 mb-6">
            <PaginationDemo
              totalPages={totalPages}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          </div>
        </div>
    </>
  );
};

export default SearchCart;
