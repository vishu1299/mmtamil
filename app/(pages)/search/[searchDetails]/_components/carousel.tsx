"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { getCarouselData } from "../../api/api";
import { sliderPropaginatedResponse } from "../../type/type";

const CarouselViewDetails = () => {
  const [active, setActive] = useState(0);
  const [carouselData, setCarouselData] =
    useState<sliderPropaginatedResponse | null>(null);
  const itemsPerPage =14;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCarouselData();
        setCarouselData(data);
      } catch {
        // API unavailable — carousel stays hidden
      }
    };
    fetchData();
  }, []);

  const totalItems = carouselData?.data?.length || 0;
  if (totalItems === 0) return null;

  
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePrev = () => {
    if (active > 0) setActive(active - 1);
  };

  const handleNext = () => {
    if (active < totalPages - 1) setActive(active + 1);
  };

  return (
    <div className="hidden lg:block">
      <div className="flex mb-3 items-center">
        <button
          onClick={handlePrev}
          className={`px-2 py-2 bg-white text-dark shadow-md rounded-full ${
            active === 0 ? "cursor-not-allowed opacity-50" : ""
          }`}
          disabled={active === 0}
        >
          <FaChevronLeft />
        </button>

        <div className="flex gap-2 overflow-hidden">
          {carouselData?.data
            ?.slice(active * itemsPerPage, (active + 1) * itemsPerPage)
            .map((item) => (
              <div key={item?.id} className="w-[100px] h-[80px] flex-shrink-0">
                <Link href={`/search/${item?.id}`}>
                  <Card className="overflow-hidden rounded-xl shadow-lg w-full h-full">
                    <div className="w-full h-full">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${item.profile?.profilePicture}`}
                        width={100}
                        height={80}
                        className="w-full h-full rounded-xl hover:opacity-50 cursor-pointer object-cover"
                        alt={`Image `}
                      />
                    </div>
                  </Card>
                </Link>
              </div>
            ))}
        </div>
        <button
          onClick={handleNext}
          className={`px-2 py-2 bg-white text-dark shadow-md rounded-full ${
            active >= totalPages - 1 ? "cursor-not-allowed opacity-50" : ""
          }`}
          disabled={active >= totalPages - 1}
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
};

export default CarouselViewDetails;
