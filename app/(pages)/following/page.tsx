"use client";
import PaidFeatures from "@/app/_components/paid-features/paid-features";
import React, { useEffect, useState } from "react";

import Image from "next/image";
import PeopleFollowing from "./component/PeopleFollowing";
import { peopleFollowing } from "./api/api";
const Page = () => {
  const [data, setData] = useState([]);
  const fetch = async () => {
    const response = await peopleFollowing();
    console.log("Response for following people", response?.data.data.data);
  };
  useEffect(() => {
    fetch();
  }, []);
  useEffect(() => {
    setData([]);
  }, []);
  return (
    <div className="max-w-[1560px] min-h-screen w-full lg:w-[90%] lg:py-4  mx-auto py-4">
      <div className="flex justify-between items-start w-full  ">
        <div className="w-full flex flex-col lg:mr-4   px-4">
          {data.length == 0 ? (
            <div className="flex items-center flex-col pt-16 py-12 ">
              <PeopleFollowing />
            </div>
          ) : (
            <div className="flex items-center flex-col pt-20 py-12 bg-[#ffffff] ">
              <Image
                src="/assets/images/Following/following.png"
                alt="following"
                width={350}
                height={450}
                className=""
              />
              <p className="pt-8 font-bold text-2xl sm:text-3xl lg:text-4xl  text-[#8d8e8d] text-center">
                You have no users in list
              </p>
              <p className="text-base sm:text-lg lg:text-xl font-sans pt-4 text-[#8d8e8d] text-center">
                Let’s change that!
              </p>
              <button className="border px-12 sm:px-16 lg:px-24 mt-6 py-2 rounded-md bg-[#e6246b]text-white text-sm sm:text-base lg:text-lg">
                Go to Search
              </button>
            </div>
          )}
        </div>

        <div className="hidden  sm:block min-w-[312px] w-[312px]">
          <PaidFeatures />
        </div>
      </div>
    </div>
  );
};

export default Page;
