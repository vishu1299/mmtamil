import React, { Suspense } from "react";
import SearchPage from "./SeaechPage";
import LoadingPage from "@/app/loadingPage";
import PaidFeatures from "@/app/_components/paid-features/paid-features";

function SearchBarFallback() {
  return (
    <div className="w-full h-screen flex gap-2 justify-center items-center">
      <LoadingPage />
    </div>
  );
}

const Page = () => {
  return (
    <Suspense fallback={<SearchBarFallback />}>
      <div className="mx-auto min-h-screen w-full max-w-[1560px] lg:w-[90%] lg:py-6">
        <div className="mb-5 rounded-2xl border border-border-soft bg-gradient-to-br from-white via-white to-cream/40 px-4 py-5 shadow-card transition-all duration-300 hover:border-maroon/15 hover:shadow-card-hover lg:px-6">
          <h1 className="font-playfair text-[28px] font-semibold tracking-tight text-maroon">
            Discover
          </h1>
          <p className="mt-1 text-sm leading-relaxed text-[#6B6B6B]">
            Explore profiles and find your perfect match
          </p>
        </div>

        <div className="flex w-full flex-col gap-6 lg:flex-row">
          <div className="flex w-full flex-col rounded-2xl border border-border-soft/90 bg-white p-3 shadow-card transition-all duration-300 hover:shadow-soft-lg sm:p-4 lg:border-border-soft">
            <SearchPage />
          </div>

          <div className="hidden xl:block min-w-[312px] w-[312px] flex-shrink-0">
            <PaidFeatures />
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default Page;