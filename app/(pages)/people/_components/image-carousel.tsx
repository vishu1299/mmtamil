"use client";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from "react";
import { BsPatchCheckFill } from "react-icons/bs";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import AboutProfile from "./about-profile";
import {
  GalleryResponse,
  getGalleryImages,
  PeopleResponse,
  randomPeople,
} from "../api/api";
import { Button } from "@/components/ui/button";
import ProfileImage from "./profile-image";

export interface ImageCarouselHandle {
  skipProfile: () => void;
  likeProfile: () => void;
  getActiveProfile: () => PeopleResponse | null;
}

interface ProfileData {
  userName: string;
  profilePicture: string;
  userId: number;
}

const makeDummyProfile = (
  id: number,
  userName: string,
  dob: string,
  country: string,
  work: string,
  bio: string,
  interests: string[],
  maritalStatus: string,
  profilePicture: string
): PeopleResponse => ({
  id,
  profileId: `MMT${id}`,
  userName,
  email: `${userName.toLowerCase()}@example.com`,
  password: "",
  phoneNumber: null,
  role: "USER",
  gallery: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  isActive: true,
  isDeleted: false,
  profileViews: Math.floor(Math.random() * 500),
  engagementScore: Math.floor(Math.random() * 100),
  isPremium: false,
  profile: {
    id,
    userId: id,
    gender: "Female",
    dateOfBirth: dob,
    profilePicture,
    posts: [],
    bio,
    interests,
    languagesSpoken: ["Tamil", "English"],
    traits: [],
    movies: [],
    music: [],
    personality: "",
    country,
    city: "",
    field_of_work: work,
    understand_english: "Yes",
    credits: 0,
    religion: "HINDU",
    maritalStatus,
    childrenStatus: "No",
    isAggredTandC: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  preferences: {
    preferredGender: "Male",
    ageRange: [25, 35],
    interests: [],
    languagesSpoken: ["Tamil"],
    country: "",
    city: "",
    relationshipStatus: "",
    childrenPreference: "",
    religion: "HINDU",
    looking_for: "Life Partner",
  },
});

const dummyImages = [
  [
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=900&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=900&fit=crop&crop=face",
  ],
  [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=900&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&h=900&fit=crop&crop=face",
  ],
  [
    "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=600&h=900&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&h=900&fit=crop&crop=face",
  ],
];

const dummyProfiles: PeopleResponse[] = [
  makeDummyProfile(101, "Priya", "1999-06-15", "India", "Software Engineer",
    "I'm a passionate software engineer who loves exploring new technologies. In my free time, I enjoy painting, reading Tamil literature, and traveling to historical places.",
    ["Reading", "Painting", "Travel", "Cooking", "Music"], "UNMARRIED", dummyImages[0][0]),
  makeDummyProfile(102, "Kavitha", "1997-03-22", "USA", "Doctor",
    "A caring doctor with a love for classical music and Bharatanatyam. Looking for someone who values family traditions and has a good sense of humor.",
    ["Dance", "Music", "Yoga", "Photography"], "UNMARRIED", dummyImages[1][0]),
  makeDummyProfile(103, "Meena", "2000-11-08", "Canada", "Teacher",
    "I teach mathematics and love making complex concepts simple. I enjoy gardening, cooking South Indian dishes, and spending time with family.",
    ["Teaching", "Gardening", "Cooking", "Movies", "Fitness"], "UNMARRIED", dummyImages[2][0]),
];

type SwipeDirection = "left" | "right" | null;

const ImageCarousel = forwardRef<ImageCarouselHandle>((_, ref) => {
  const [profiles, setProfiles] = useState<PeopleResponse[]>([]);
  const [activeProfile, setActiveProfile] = useState<PeopleResponse | null>(null);
  const [active, setActive] = useState(0);
  const [publicPhotos, setPublicPhotos] = useState<GalleryResponse[]>([]);
  const [useDummy, setUseDummy] = useState(false);
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [dummyPhotoIndex, setDummyPhotoIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<SwipeDirection>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const fetchPeople = async () => {
      try {
        const response = await randomPeople();
        if (response && response.length > 0) {
          setProfiles(response);
          setActiveProfile(response[0]);
        } else {
          setUseDummy(true);
          setActiveProfile(dummyProfiles[0]);
        }
      } catch {
        setUseDummy(true);
        setActiveProfile(dummyProfiles[0]);
      }
    };
    fetchPeople();
  }, []);

  useEffect(() => {
    if (useDummy) return;
    const fetchGalleryImages = async () => {
      try {
        if (activeProfile) {
          const images = await getGalleryImages(activeProfile.id.toString());
          setPublicPhotos(images);
        }
      } catch {
        // Gallery unavailable
      }
    };
    fetchGalleryImages();
  }, [activeProfile, useDummy]);

  const advanceToNextProfile = useCallback(() => {
    if (useDummy) {
      const nextIdx = (currentProfileIndex + 1) % dummyProfiles.length;
      setCurrentProfileIndex(nextIdx);
      setActiveProfile(dummyProfiles[nextIdx]);
      setDummyPhotoIndex(0);
    } else {
      const currentIdx = profiles.findIndex((p) => p.id === activeProfile?.id);
      const nextIdx = (currentIdx + 1) % profiles.length;
      setActiveProfile(profiles[nextIdx]);
      setActive(0);
    }
  }, [useDummy, currentProfileIndex, profiles, activeProfile]);

  const triggerSwipe = useCallback((direction: SwipeDirection) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setSwipeDirection(direction);
    setTimeout(() => {
      advanceToNextProfile();
      setSwipeDirection(null);
      setIsAnimating(false);
    }, 400);
  }, [isAnimating, advanceToNextProfile]);

  useImperativeHandle(ref, () => ({
    skipProfile: () => triggerSwipe("left"),
    likeProfile: () => triggerSwipe("right"),
    getActiveProfile: () => activeProfile,
  }), [triggerSwipe, activeProfile]);

  const currentDummyPhotos = useDummy ? dummyImages[currentProfileIndex] || [] : [];

  const handleNext = () => {
    if (isAnimating) return;
    if (useDummy) {
      if (dummyPhotoIndex < currentDummyPhotos.length - 1) {
        setDummyPhotoIndex((prev) => prev + 1);
      } else {
        const nextProfile = (currentProfileIndex + 1) % dummyProfiles.length;
        setCurrentProfileIndex(nextProfile);
        setActiveProfile(dummyProfiles[nextProfile]);
        setDummyPhotoIndex(0);
      }
      return;
    }
    setActive((prev) =>
      publicPhotos.length > 0 ? (prev + 1) % publicPhotos.length : 0
    );
  };

  const handlePrev = () => {
    if (isAnimating) return;
    if (useDummy) {
      if (dummyPhotoIndex > 0) {
        setDummyPhotoIndex((prev) => prev - 1);
      } else {
        const prevProfile = currentProfileIndex === 0 ? dummyProfiles.length - 1 : currentProfileIndex - 1;
        setCurrentProfileIndex(prevProfile);
        setActiveProfile(dummyProfiles[prevProfile]);
        setDummyPhotoIndex((dummyImages[prevProfile]?.length || 1) - 1);
      }
      return;
    }
    setActive((prev) =>
      publicPhotos.length > 0
        ? prev === 0
          ? publicPhotos.length - 1
          : prev - 1
        : 0
    );
  };

  const swipeStyles: React.CSSProperties = swipeDirection
    ? {
        transition: "transform 0.4s ease-out, opacity 0.4s ease-out",
        transform: swipeDirection === "left"
          ? "translateX(-120%) rotate(-15deg)"
          : "translateX(120%) rotate(15deg)",
        opacity: 0,
      }
    : {
        transition: "transform 0.3s ease, opacity 0.3s ease",
        transform: "translateX(0) rotate(0deg)",
        opacity: 1,
      };

  if (!activeProfile) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 bg-soft-rose rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-maroon text-2xl font-bold">?</span>
          </div>
          <p className="text-[#6B6B6B]">Loading profiles...</p>
        </div>
      </div>
    );
  }

  const initials = activeProfile.userName.charAt(0).toUpperCase();

  return (
    <div className="flex justify-center">
      <div className="flex flex-col justify-center items-center">
        <div className="w-full lg:w-[95%] mx-auto xl:w-[400px] relative" style={swipeStyles}>
          <Button
            variant="ghost"
            onClick={handlePrev}
            className="px-4 py-4 absolute left-0 top-1/2 -translate-y-1/2 z-10 text-white rounded-r-full bg-black/20 hover:bg-black/40 transition-all duration-200"
          >
            <FaAngleLeft className="text-xl" />
          </Button>
          <Card className="aspect-[2/3] relative overflow-hidden rounded-2xl border border-border-soft shadow-md">
            {useDummy ? (
              <Image
                key={`dummy-${currentProfileIndex}-${dummyPhotoIndex}`}
                src={currentDummyPhotos[dummyPhotoIndex] || currentDummyPhotos[0]}
                fill
                className="object-cover"
                alt={`${activeProfile.userName}-photo-${dummyPhotoIndex}`}
              />
            ) : publicPhotos.length > 0 ? (
              <Image
                key={publicPhotos[active].id}
                src={
                  process.env.NEXT_PUBLIC_IMAGE_URL +
                  publicPhotos[active].imageUrl
                }
                fill
                className="object-cover"
                alt={`gallery-image-${active}`}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-b from-soft-rose to-cream flex flex-col items-center justify-center">
                <div className="w-28 h-28 rounded-full bg-maroon/10 border-2 border-maroon/20 flex items-center justify-center mb-4">
                  <span className="text-maroon text-5xl font-playfair font-bold">
                    {initials}
                  </span>
                </div>
                <p className="text-[#6B6B6B] text-sm">No photos available</p>
              </div>
            )}

            {swipeDirection === "left" && (
              <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none">
                <div className="border-4 border-red-500 rounded-xl px-6 py-2 rotate-[-20deg] opacity-90">
                  <span className="text-red-500 font-extrabold text-5xl tracking-wider">NOPE</span>
                </div>
              </div>
            )}
            {swipeDirection === "right" && (
              <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none">
                <div className="border-4 border-green-500 rounded-xl px-6 py-2 rotate-[20deg] opacity-90">
                  <span className="text-green-500 font-extrabold text-5xl tracking-wider">LIKE</span>
                </div>
              </div>
            )}

            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/60 to-transparent" />
          </Card>
          <Button
            variant="ghost"
            onClick={handleNext}
            className="px-4 py-4 absolute top-1/2 -translate-y-1/2 right-0 z-10 text-white rounded-l-full bg-black/20 hover:bg-black/40 transition-all duration-200"
          >
            <FaAngleRight className="text-xl" />
          </Button>
          {!useDummy && publicPhotos.length > 0 && (
            <div className="absolute px-4 z-30 top-2 left-0 flex gap-1.5 justify-center w-full">
              {publicPhotos.map((_, index) => (
                <div
                  key={index}
                  className={`w-full h-1 rounded-full transition-all duration-200 ${
                    active === index ? "bg-white" : "bg-white/40"
                  }`}
                />
              ))}
            </div>
          )}
          {useDummy && currentDummyPhotos.length > 0 && (
            <div className="absolute px-4 z-30 top-2 left-0 flex gap-1.5 justify-center w-full">
              {currentDummyPhotos.map((_, index) => (
                <div
                  key={index}
                  className={`w-full h-1 rounded-full transition-all duration-200 ${
                    dummyPhotoIndex === index ? "bg-white" : "bg-white/40"
                  }`}
                />
              ))}
            </div>
          )}
          <div className="absolute flex items-center gap-2 bottom-6 left-4 z-10">
            <BsPatchCheckFill className="text-lg text-gold bg-white rounded-full" />
            <div className="flex flex-col">
              <p className="text-white font-playfair font-bold text-xl drop-shadow-lg">
                {activeProfile.userName},{" "}
                {new Date().getFullYear() -
                  new Date(activeProfile.profile.dateOfBirth).getFullYear()}
              </p>
            </div>
          </div>
        </div>
        <div className="xl:w-[400px] w-full mt-2">
          <AboutProfile profileData={activeProfile} />
        </div>

        <div className="xl:w-[400px] w-full mt-0">
          <ProfileImage profileData={activeProfile} />
        </div>
      </div>
    </div>
  );
});

ImageCarousel.displayName = "ImageCarousel";

export default ImageCarousel;
