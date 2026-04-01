import React from "react";

import PaidFeatures from "@/app/_components/paid-features/paid-features";
import PeopleMain from "./_components/people-main";

const page = () => {
  return (
    <div className="max-w-[1560px] min-h-screen w-full lg:w-[90%] mx-auto lg:py-6">
      <div className="mb-4 px-4 lg:px-0">
        <h1 className="font-playfair text-[28px] font-semibold text-maroon">
          Discover
        </h1>
        <p className="text-[#6B6B6B] text-sm mt-1">
          Explore profiles and find your perfect match
        </p>
      </div>

      <div className="flex flex-col lg:flex-row w-full gap-6">
        <div className="w-full flex flex-col">
          <PeopleMain />
        </div>

        <div className="hidden xl:block min-w-[312px] w-[312px] flex-shrink-0">
          <PaidFeatures />
        </div>
      </div>
    </div>
  )
}

export default page;
