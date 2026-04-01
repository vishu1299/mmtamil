"use client";
import React from "react";
import { GoDotFill } from "react-icons/go";
import { HiCheckBadge } from "react-icons/hi2";
import { MenuDetails } from "./menu";
import { FaGlobeAmericas } from "react-icons/fa";
import { LiaBirthdayCakeSolid } from "react-icons/lia";
import { TbMoodBoy } from "react-icons/tb";
import { PiBagSimpleFill } from "react-icons/pi";
import { User } from "../../type/type";

const ChatDetails = ({ data }: { data: User }) => {
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

  return (
    <div className="flex flex-col gap-4 w-full p-4 bg-white shadow-md rounded-lg">
      <div className="flex w-full justify-between items-center">
        <div className="flex items-center gap-2 text-lg lg:text-2xl font-semibold text-gray-800">
          <HiCheckBadge className="text-[#2e73fb]" />
          <p>{data.userName},</p>
          <p>{calculateAge(data.profile.dateOfBirth)}</p>
          <GoDotFill className="text-[#41cc89]" />
        </div>
        <MenuDetails id={data.id} />
      </div>

      <div className="flex flex-wrap gap-4 text-gray-600 text-base lg:text-lg">
        {data.profile.country !== "Not Specified" && (
          <div className="flex items-center gap-2 border border-gray-300 px-4 py-1 rounded-full">
            <FaGlobeAmericas />
            <p>{data.profile.country}</p>
          </div>
        )}

        <div className="flex items-center gap-2 border border-gray-300 px-4 py-1 rounded-full">
          <LiaBirthdayCakeSolid />
          <p>{data.profile.dateOfBirth.slice(0, 10)}</p>
        </div>

        {data.profile.martialStatus && (
          <div className="flex items-center gap-2 border border-gray-300 px-4 py-1 rounded-full">
            <TbMoodBoy />
            <p>{data.profile.martialStatus}</p>
          </div>
        )}

        {data.profile.field_of_work !== "Not Specified" && (
          <div className="flex items-center gap-2 border border-gray-300 px-4 py-1 rounded-full">
            <PiBagSimpleFill />
            <p>{data.profile.field_of_work}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatDetails;
