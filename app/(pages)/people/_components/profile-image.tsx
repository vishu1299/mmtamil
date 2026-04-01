"use client";

import { ProfileImg } from "@/data/profile/profile";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FaRegEyeSlash } from "react-icons/fa";
import { GalleryResponse, getGalleryImages } from "../api/api";
import { PeopleResponse } from "../api/api";
// import { useParams } from "next/navigation";

interface ProfileImageProps {
  profileData: PeopleResponse;
}

const ProfileImage: React.FC<ProfileImageProps> = ({ profileData }) => {
  const [publicPhotos, setPublicPhotos] = useState<GalleryResponse[]>([]);
  const [token, setToken] = useState<any | null>(null);

  useEffect(() => {
    const localtoken = JSON.parse(localStorage.getItem("access-token") ?? "");
    if (localtoken) {
      setToken(localtoken);
    }
  }, []);

  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        // Use profileData.id instead of params.searchDetails
        const images = await getGalleryImages(profileData.id.toString());
        setPublicPhotos(images);
        console.log("image", images);
        console.log("profileData", profileData.id.toString());
      } catch (error) {
        console.error("Error fetching gallery images:", error);
      }
    };
    fetchGalleryImages();
  }, [profileData.id]); // Add profileData.id as dependency

  return (
    <div className="flex">
      {token && (
          <div className="xl:w-[400px] mx-auto">
          <div className="mt-5 bg-white border border-border-soft rounded-xl p-4">
            <p className="font-playfair text-lg font-semibold text-maroon mb-3">Public Photos</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {publicPhotos.map((photo, index) => (
                <Image
                  key={photo.id}
                  src={process.env.NEXT_PUBLIC_IMAGE_URL + photo.imageUrl}
                  width={100}
                  height={100}
                  className="w-full h-full aspect-square object-cover rounded-lg"
                  alt={`gallery-image-${index}`}
                />
              ))}
            </div>
          </div>
          <div className="mt-3 bg-white border border-border-soft rounded-xl p-4">
            <p className="font-playfair text-lg font-semibold text-maroon mb-3">Private Photos</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {ProfileImg.slice(0, 3).map((img, index) => (
                <div className="relative rounded-lg overflow-hidden" key={index}>
                  <Image
                    src={img.image}
                    width={100}
                    height={100}
                    className="w-full h-full aspect-square object-cover blur-sm"
                    alt={`search-image-${index}`}
                  />
                  <div className="absolute inset-0 bg-maroon/40"></div>
                  <p className="absolute inset-0 uppercase flex items-center gap-2 justify-center text-white font-semibold text-sm">
                    <FaRegEyeSlash className="text-base" />
                    Private
                  </p>
                </div>
              ))}
            </div>
          </div>
          <p className="mt-3 text-xs text-[#6B6B6B] px-1">
            * Viewing one video costs 50 Coins
          </p>
        </div>
      )}
      ;
    </div>
  );
};

export default ProfileImage;



