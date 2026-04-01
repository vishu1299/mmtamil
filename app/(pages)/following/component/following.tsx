"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { RiUserFollowLine } from "react-icons/ri";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PiChats } from "react-icons/pi";
import { CiCamera } from "react-icons/ci";
import { followUnfollow, LikeUnlike, peopleFollowing } from "../api/api";
import Link from "next/link";

const calculateAge = (dateOfBirth: string): number | "N/A" => {
  if (!dateOfBirth || dateOfBirth === "Not Available") return "N/A";

  const birthDate = new Date(dateOfBirth);
  if (isNaN(birthDate.getTime())) return "N/A"; // Invalid date check

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

const FollowedProfile = ({
  id,
  name,
  image,
  dateofBirth,
  country,
  totalPostsCount,
  onUnfollow,
}: {
  id: number;
  name: string;
  dateofBirth: string;
  image: string;
  country: string;
  totalPostsCount: number;
  onUnfollow: (id: number) => void;
}) => {
  const age = calculateAge(dateofBirth);
  const [isFollowing, setIsFollowing] = useState<boolean>(true);
  const [isLiked, setIsLiked] = useState<boolean>(false);

  useEffect(() => {
    const checkFollowingStatus = async () => {
      try {
        const result = await peopleFollowing();

        if (
          result?.data?.result?.followingUsers?.some(
            (user: { id: number }) => user.id === id
          )
        ) {
          setIsFollowing(true);
        }
      } catch (error) {
        console.error("Error checking following status:", error);
      }
    };
    checkFollowingStatus();
  }, [id]);

  const handleFollowUnfollow = async () => {
    try {
      const result = await followUnfollow(id);
      console.log("Follow/Unfollow Response:", result);

      if (result) {
        setIsFollowing((prev) => !prev);
        if (!isFollowing) {
          onUnfollow(id);
        }
      }
    } catch (error) {
      console.error("Error toggling follow status:", error);
    }
  };

  const handleLikeUnlike = async () => {
    try {
      await LikeUnlike(id);
      console.log("unlikedId for your follower", id);
      setIsLiked((prev) => !prev);
    } catch (error) {
      console.error("Error toggling like status:", error);
    }
  };

  return (
    <Card className="w-full mb-4">
      <CardContent className="flex flex-col sm:flex-row items-center p-4 space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="flex-shrink-0">
          <img
            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${image}`}
            alt={`${name}'s profile`}
            className="w-20 h-20 rounded-full object-cover"
          />
        </div>
        <div className="flex-grow text-center sm:text-left">
          <h3 className="text-xl font-semibold">
            {name}, {age !== "N/A" ? `${age} years old` : "N/A"}
          </h3>
          <div className="flex justify-center sm:justify-start items-center gap-2 text-gray-500 text-lg">
            <p>{country}</p>
            <CiCamera className="text-lg" />
            <p className="text-gray-400">{totalPostsCount} photos</p>
          </div>
        </div>
        <div className="flex flex-col gap-2 lg:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
          <Link href={`/chat/${id}`}>
            <button className="hover:bg-pink-600 hover:text-white text-[#F77705] border border-gray-100 flex items-center gap-1 justify-center p-2 rounded-md">
              <PiChats /> Chat now
            </button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="hover:bg-pink-600 hover:text-white text-[#F77705] border border-gray-100 flex items-center justify-center p-2 rounded-md">
                More ▾
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="text-[#F77705]"
                onClick={handleLikeUnlike}
              >
                {isLiked ? "👍 Like" : "👍 Liked"}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-[#F77705]  hover:bg-[#EF4765] flex gap-2 cursor-pointer"
                onClick={handleFollowUnfollow}
              >
                {isFollowing ? (
                  <>
                    <RiUserFollowLine /> Unfollow
                  </>
                ) : (
                  <>
                    <RiUserFollowLine /> Follow
                  </>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
};

export default FollowedProfile;
