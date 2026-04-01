"use client";

import { Card } from "@/components/ui/card";
import Image from "next/image";
import React, { useState } from "react";
import { FaAngleDown, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { IoChevronUp } from "react-icons/io5";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Post, User } from "../type/type";
import { deletePostById } from "../api/api";

const CarouselViewDetails = ({
  fetch,
  posts,
  changeMade,
  setChangeMade,
}: {
  fetch: User;
  posts: Post[];
  changeMade: boolean;
  setChangeMade: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const t = useTranslations("profileComponents");
  const [carouselState, setCarouselState] = useState({
    startIndex: 0,
    visibleImagesCount: 5,
  });
  const { startIndex } = carouselState;
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleDelete = async (id: number) => {
    const result = await deletePostById(id);
    if (result?.data.code === 200 || result?.data.code === 201) {
      setChangeMade(!changeMade);
      setShowMenu(false);
    }
  };

  const handleNext = () => {
    setCarouselState((prevState) => ({
      ...prevState,
      startIndex:
        (prevState.startIndex + 1 + fetch.posts.length) % fetch.posts.length,
    }));
  };

  const handlePrevious = () => {
    if (startIndex > 0) {
      setCarouselState((prevState) => ({
        ...prevState,
        startIndex:
          (prevState.startIndex - 1 + fetch.posts.length) % fetch.posts.length,
      }));
    }
  };

  const handleThumbnailClick = (post: number, index: number) => {
    setCarouselState((prevState) => ({
      ...prevState,
      startIndex: index,
    }));
  };

  return (
    <div className="grid grid-cols-1 w-full  sm:flex-row justify-center  px-2 md:gap-20 ">
      {posts.map((item, indexpost) => (
        <div key={item.id} className="flex flex-col">
          <Dialog>
            <Card className="flex flex-col">
              <div className="flex flex-col">
                <div className="text-gray-800 text-lg mb-4 flex items-center justify-between">
                  <span>{item.description}</span>
                  <div className="flex justify-between items-center mb-4">
                    <div className="relative">
                      <button
                        type="button"
                        onClick={toggleMenu}
                        className="text-gray-500 hover:text-gray-700"
                        aria-label={t("delete")}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                          />
                        </svg>
                      </button>

                      {showMenu && (
                        <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg z-10">
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id)}
                            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                          >
                            {t("delete")}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <DialogTrigger asChild>
                  <div
                    className={`rounded-lg overflow-hidden ${
                      item.image.length > 1 ? "grid grid-cols-3 gap-x-6 h-64" : ""
                    }`}
                  >
                    {item.image.map((block, index) => (
                      <Image
                        key={index}
                        width={600}
                        height={700}
                        src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${block.image}`}
                        alt={t("altProfilePhoto")}
                        className="w-full h-auto object-cover"
                      />
                    ))}
                  </div>
                </DialogTrigger>
              </div>
            </Card>
            <DialogContent className="max-w-[90%] sm:max-w-[600px] md:max-w-[700px] lg:max-w-[800px] mx-auto">
              <DialogHeader>
                <DialogTitle>
                  <div className="grid grid-cols-2 items-center shadow-md w-full p-2">
                    <div className="flex items-center gap-2">
                      <Image
                        className="w-12 h-12 md:w-16 md:h-16 rounded-full"
                        src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${fetch.profile.profilePicture}`}
                        width={50}
                        height={50}
                        alt={t("altProfilePhoto")}
                      />
                      <p className="text-sm ">{fetch.userName}</p>
                    </div>

                    <p className="text-sm md:text-base">
                      {t("photosCount", { n: startIndex + 1 })}
                    </p>
                  </div>
                </DialogTitle>
                <DialogDescription />
              </DialogHeader>

              <div className="flex flex-col sm:flex-row justify-center  px-2 md:gap-20 ">
                <div className="hidden sm:flex flex-col items-center">
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className="mb-2 bg-gray-200 p-2 rounded-full hover:bg-gray-300"
                    aria-label={t("scrollThumbsUp")}
                  >
                    <IoChevronUp />
                  </button>
                  <div className="sm:h-[300px] sm:w-[80px] md:w-[100px] overflow-hidden border border-gray-300 flex flex-col items-center gap-2">
                    {item.image.map((img, indeximage) => (
                      <Image
                        key={indeximage}
                        src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${img.image}`}
                        alt={t("altCarouselThumb", { n: indeximage + 1 })}
                        width={60}
                        height={60}
                        className="rounded-md object-cover  cursor-pointer"
                        onClick={() =>
                          handleThumbnailClick(indexpost, indeximage)
                        }
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="mt-2 bg-gray-200 p-2 rounded-full hover:bg-gray-300"
                    aria-label={t("scrollThumbsDown")}
                  >
                    <FaAngleDown />
                  </button>
                </div>

                <div className="flex justify-center items-center gap-4">
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className="bg-gray-200 p-2 rounded-full hover:bg-gray-300"
                    aria-label={t("prevImage")}
                  >
                    <FaChevronLeft />
                  </button>
                  <Image
                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${item.image[startIndex]?.image}`}
                    alt={t("altMainCarousel")}
                    width={200}
                    height={300}
                    className="  rounded-md border aspect-square sm:aspect-auto sm:h-[200px] sm:w-[200px] md:h-[300px] md:w-[300px] border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={handleNext}
                    className="bg-gray-200 p-2 rounded-full hover:bg-gray-300"
                    aria-label={t("nextImage")}
                  >
                    <FaChevronRight />
                  </button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      ))}
    </div>
  );
};

export default CarouselViewDetails;
