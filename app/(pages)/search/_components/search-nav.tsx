"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import SearchFilter from "./search-filter";
import ChangeFilter from "./changefilter";
import { Button } from "@/components/ui/button";
import { FilterProps } from "../api/api";
import { User } from "../type/type";

interface SearchNavProps {
  activeFilter: "all" | "following";
  setActiveFilter: React.Dispatch<React.SetStateAction<"all" | "following">>;
  filters: FilterProps;
  matchLookingForGender?: string | null;
  setFilters: React.Dispatch<React.SetStateAction<FilterProps>>;
  data: any[];
  change: boolean;
  setChange: React.Dispatch<React.SetStateAction<boolean>>;
  totalPages: number;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  modalResults: User[];
  searchLoading: boolean;
  onModalAction: (profileId: number, type: "interest" | "ignored") => void;
  hasActivePackage: boolean | null;
  onPackageRequired: () => void;
}

const SearchNav: React.FC<SearchNavProps> = ({
  filters,
  matchLookingForGender,
  setFilters,
  data,
  searchQuery,
  setSearchQuery,
  modalResults,
  searchLoading,
  onModalAction,
  hasActivePackage,
  onPackageRequired,
}) => {
  const t = useTranslations("search");
  const router = useRouter();

  const isFilterApplied =
    filters.from ||
    filters.city ||
    filters.ageFrom > 18 ||
    filters.ageTo < 80 ||
    filters.maritalStatus ||
    filters.heightFrom ||
    filters.heightTo ||
    filters.religion ||
    filters.motherTongue ||
    filters.caste ||
    filters.qualification;

  const handleResetSearch = () => {
    try {
      localStorage.removeItem("search-filter-preferences");
    } catch {
      // ignore
    }
    setFilters({
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
    router.replace("/search");
  };

  return (
    <div>
      <div className="flex items-center justify-end px-1 py-2">
        <SearchFilter
          filters={filters}
          matchLookingForGender={matchLookingForGender}
          setFilters={setFilters}
          searchResultProfiles={data}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          modalResults={modalResults}
          searchLoading={searchLoading}
          onModalAction={onModalAction}
          hasActivePackage={hasActivePackage}
          onPackageRequired={onPackageRequired}
        />
      </div>

      {isFilterApplied && data.length === 0 && (
        <div className="mt-4 flex min-h-[60vh] flex-col items-center justify-center rounded-2xl border border-border-soft bg-white px-4 py-10 text-center shadow-card transition-shadow duration-300 sm:px-6 lg:px-8">
          <div className="mb-6">
            <img
              src="/assets/images/filterNotFound/img.png"
              alt="No users icon"
              className="w-20 h-20 sm:w-24 sm:h-24"
            />
          </div>

          <h2 className="mb-2 font-playfair text-lg font-semibold tracking-tight text-maroon sm:text-xl">
            {t("noProfilesTitle")}
          </h2>
          <p className="mb-6 max-w-md text-sm leading-relaxed text-[#6B6B6B] sm:text-base">
            {t("noProfilesHint")}
          </p>

          <div className="flex gap-4 flex-col sm:flex-row w-full sm:w-auto">
            <Button className="w-full rounded-xl border-2 border-maroon bg-white py-6 font-semibold text-maroon shadow-sm transition-all duration-200 ease-out hover:-translate-y-px hover:bg-maroon hover:text-white hover:shadow-md focus-visible:ring-2 focus-visible:ring-maroon/35 motion-reduce:hover:translate-y-0">
              <ChangeFilter filters={filters} setFilters={setFilters} />
            </Button>
            <Button
              onClick={handleResetSearch}
              className="w-full rounded-xl bg-maroon py-6 text-white shadow-md transition-all duration-200 ease-out hover:bg-maroon-light hover:shadow-lg focus-visible:ring-2 focus-visible:ring-maroon/45 sm:w-auto motion-reduce:hover:translate-y-0"
            >
              {t("resetSearch")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchNav;
