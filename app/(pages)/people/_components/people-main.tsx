"use client";
import React, { useRef } from "react";
import ImageCarousel, { ImageCarouselHandle } from "./image-carousel";
import { GrClose } from "react-icons/gr";
import { IoMdChatboxes } from "react-icons/io";
import { FaHeart } from "react-icons/fa";
import { useRouter } from "next/navigation";

const PeopleMain = () => {
  const carouselRef = useRef<ImageCarouselHandle>(null);
  const router = useRouter();

  const handleSkip = () => {
    carouselRef.current?.skipProfile();
  };

  const handleLike = () => {
    carouselRef.current?.likeProfile();
  };

  const handleChat = () => {
    const profile = carouselRef.current?.getActiveProfile();
    if (profile) {
      router.push(`/mails?userId=${profile.id}`);
    }
  };

  return (
    <div className="px-2 lg:px-0">
      <ImageCarousel ref={carouselRef} />

      <div className="lg:w-[400px] my-4 flex justify-center items-center gap-5 md:gap-8 mx-auto md:bottom-2 bottom-16 sticky z-20">
        <button
          onClick={handleSkip}
          className="h-14 w-14 border border-border-soft bg-white rounded-full flex justify-center items-center shadow-md hover:shadow-lg hover:border-red-400 hover:bg-red-50 transition-all duration-200 active:scale-90"
        >
          <GrClose className="text-2xl text-[#6B6B6B]" />
        </button>
        <button
          onClick={handleChat}
          className="h-10 w-10 border border-border-soft bg-white rounded-full flex justify-center items-center shadow-md hover:shadow-lg hover:border-maroon/30 hover:bg-soft-rose transition-all duration-200 active:scale-90"
        >
          <IoMdChatboxes className="text-xl text-maroon" />
        </button>
        <button
          onClick={handleLike}
          className="h-14 w-14 bg-maroon rounded-full flex justify-center items-center shadow-md hover:shadow-lg hover:bg-maroon/90 transition-all duration-200 active:scale-90"
        >
          <FaHeart className="text-2xl text-white" />
        </button>
      </div>
    </div>
  );
};

export default PeopleMain;
