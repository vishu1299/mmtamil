"use client";

import React, { useState } from "react";
import { GrPowerReset } from "react-icons/gr";
import { AiOutlineMenuFold } from "react-icons/ai";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FilterProps } from "../api/api";
import { countries } from "countries-list";
import type { ICountry } from "countries-list";

interface SearchFilterProps {
  filters: FilterProps;
  setFilters: React.Dispatch<React.SetStateAction<FilterProps>>;
}

const ChangeFilter: React.FC<SearchFilterProps> = ({ filters, setFilters }) => {
  const [open, setOpen] = useState(false);

  const handleFilterChange = (
    field: keyof FilterProps,
    value: string | number
  ) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetFilters = () => {
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
  };

  const showPeople = () => {
    console.log("Showing people with filters: ", filters);
    setOpen(false);
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div
            className="flex gap-x-1 items-center cursor-pointer  "
            onClick={() => setOpen(true)}
          >
            change filter
            <AiOutlineMenuFold className="text-2xl" />
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-[#333] lg:text-[20px]">
              Search Filters
            </DialogTitle>
          </DialogHeader>
          <div>
            {/* Country Select */}
            <div className="mb-4">
              <label className="block text-[#525252] mb-2 font-medium">
                From
              </label>
              <Select
                onValueChange={(value) => handleFilterChange("from", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Country</SelectLabel>
                    {Object.entries(countries).map(
                      ([code, country]: [string, ICountry]) => (
                        <SelectItem key={code} value={country.name}>
                          {country.name}
                        </SelectItem>
                      )
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Age From and To Select */}
            <div>
              <p className="text-[#525252] mb-2 font-medium">Age</p>
              <div className="flex items-center gap-4 mb-4">
                <Select
                  onValueChange={(value) =>
                    handleFilterChange("ageFrom", Number(value))
                  }
                >
                  <SelectTrigger className="w-full px-8">
                    <SelectValue placeholder="From" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {[...Array(63)].map((_, i) => (
                        <SelectItem key={i} value={`${i + 18}`}>
                          {i + 18}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <p className="text-[#525252] text-center">To</p>

                <Select
                  onValueChange={(value) =>
                    handleFilterChange("ageTo", Number(value))
                  }
                >
                  <SelectTrigger className="w-full px-8">
                    <SelectValue placeholder="To" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {[...Array(63)].map((_, i) => (
                        <SelectItem key={i} value={`${i + 18}`}>
                          {i + 18}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Reset and Show Buttons */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
              <Button
                onClick={resetFilters}
                className="flex items-center justify-center gap-2 w-full border bg-white font-semibold text-[#EF4765] hover:text-white py-6"
              >
                Reset
                <GrPowerReset className="text-center" />
              </Button>
              <Button onClick={showPeople} className="w-full py-6">
                Show People
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChangeFilter;
