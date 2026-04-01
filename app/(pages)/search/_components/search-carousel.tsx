"use client";

import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { BsPatchCheckFill } from "react-icons/bs";
import { User } from "../type/type";
import imgwomen from "@/public/assets/images/search/images (2).jpg";
import imgmen from "@/public/assets/images/search/images (4).jpg";

export interface SearchCarouselHandle {
  skipProfile: () => void;
  likeProfile: () => void;
  getActiveProfile: () => User | null;
}

type SwipeDirection = "left" | "right" | null;

const getProfileImages = (user: User): string[] => {
  const images: string[] = [];
  const profilePic = user?.profile?.profilePicture;
  if (profilePic) {
    images.push(
      profilePic.startsWith("http")
        ? profilePic
        : `${process.env.NEXT_PUBLIC_IMAGE_URL || ""}${profilePic}`
    );
  }
  user?.posts?.forEach((post) => {
    post?.image?.forEach((img) => {
      if (img?.image) {
        const url = img.image.startsWith("http")
          ? img.image
          : `${process.env.NEXT_PUBLIC_IMAGE_URL || ""}${img.image}`;
        if (!images.includes(url)) images.push(url);
      }
    });
  });
  return images;
};

const getDisplayImage = (
  user: User,
  index: number
): string | typeof imgwomen => {
  const images = getProfileImages(user);
  if (images.length > 0 && images[index]) return images[index];
  return user?.profile?.gender === "FEMALE" ? imgwomen : imgmen;
};

const SearchCarousel = forwardRef<
  SearchCarouselHandle,
  {
    profiles: User[];
    onSkip?: (user: User) => void;
    onLike?: (user: User) => void;
    /** null while loading subscription state */
    hasActivePackage?: boolean | null;
    onPackageRequired?: () => void;
  }
>(({ profiles, onSkip, onLike, hasActivePackage, onPackageRequired }, ref) => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<SwipeDirection>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const activeProfile = profiles[currentIndex] ?? null;

  const handleViewProfile = useCallback(() => {
    if (!activeProfile) return;
    if (hasActivePackage === null) return;
    if (!hasActivePackage) {
      onPackageRequired?.();
      return;
    }
    router.push(`/search/${activeProfile.id}`);
  }, [activeProfile, router, hasActivePackage, onPackageRequired]);
  const images = activeProfile ? getProfileImages(activeProfile) : [];
  const hasMultiplePhotos = images.length > 1;
  const displayImg = activeProfile
    ? hasMultiplePhotos
      ? (images[photoIndex] || images[0]) as string
      : getDisplayImage(activeProfile, 0)
    : null;

  const advanceToNext = useCallback(() => {
    if (profiles.length === 0) return;
    const nextIdx = (currentIndex + 1) % profiles.length;
    setCurrentIndex(nextIdx);
    setPhotoIndex(0);
  }, [currentIndex, profiles.length]);

  const triggerSwipe = useCallback(
    (direction: SwipeDirection) => {
      if (isAnimating || !activeProfile) return;
      setIsAnimating(true);
      setSwipeDirection(direction);
      if (direction === "left" && onSkip) onSkip(activeProfile);
      if (direction === "right" && onLike) onLike(activeProfile);
      setTimeout(() => {
        advanceToNext();
        setSwipeDirection(null);
        setIsAnimating(false);
      }, 400);
    },
    [isAnimating, activeProfile, advanceToNext, onSkip, onLike]
  );

  useImperativeHandle(
    ref,
    () => ({
      skipProfile: () => triggerSwipe("left"),
      likeProfile: () => triggerSwipe("right"),
      getActiveProfile: () => activeProfile,
    }),
    [triggerSwipe, activeProfile]
  );

  const handleNext = () => {
    if (isAnimating) return;
    if (hasMultiplePhotos && photoIndex < images.length - 1) {
      setPhotoIndex((p) => p + 1);
    } else {
      advanceToNext();
    }
  };

  const handlePrev = () => {
    if (isAnimating) return;
    if (hasMultiplePhotos && photoIndex > 0) {
      setPhotoIndex((p) => p - 1);
    } else {
      const prevIdx =
        currentIndex === 0 ? profiles.length - 1 : currentIndex - 1;
      setCurrentIndex(prevIdx);
      const prevImages = getProfileImages(profiles[prevIdx]);
      setPhotoIndex(Math.max(0, prevImages.length - 1));
    }
  };

  const swipeStyles: React.CSSProperties = swipeDirection
    ? {
        transition: "transform 0.4s ease-out, opacity 0.4s ease-out",
        transform:
          swipeDirection === "left"
            ? "translateX(-120%) rotate(-15deg)"
            : "translateX(120%) rotate(15deg)",
        opacity: 0,
      }
    : {
        transition: "transform 0.3s ease, opacity 0.3s ease",
        transform: "translateX(0) rotate(0deg)",
        opacity: 1,
      };

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  if (!activeProfile) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 bg-soft-rose rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-maroon text-2xl font-bold">?</span>
          </div>
          <p className="text-[#6B6B6B]">No profiles to show</p>
        </div>
      </div>
    );
  }

  const initials = activeProfile.userName?.charAt(0)?.toUpperCase() || "?";

  return (
    <div className="flex justify-center">
      <div className="flex flex-col justify-center items-center">
        <div
          className="w-full lg:w-[95%] mx-auto xl:w-[400px] relative"
          style={swipeStyles}
        >
          {/* <Button
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className="px-4 py-4 absolute left-0 top-1/2 -translate-y-1/2 z-10 text-white rounded-r-full bg-black/20 hover:bg-black/40 transition-all duration-200"
          >
            <FaAngleLeft className="text-xl" />
          </Button> */}
          <Card
            role="button"
            tabIndex={0}
            aria-label={`View profile, ${activeProfile.userName}`}
            className="group relative aspect-[2/3] cursor-pointer overflow-hidden rounded-2xl border border-border-soft shadow-card outline-none transition-all duration-300 ease-out hover:-translate-y-0.5 hover:scale-[1.01] hover:shadow-card-hover hover:ring-2 hover:ring-maroon/25 focus-visible:ring-2 focus-visible:ring-maroon/40 focus-visible:ring-offset-2 motion-reduce:hover:translate-y-0 motion-reduce:hover:scale-100 motion-reduce:transition-shadow"
            onClick={handleViewProfile}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleViewProfile();
              }
            }}
          >
            {displayImg ? (
              <Image
                key={`${activeProfile.id}-${photoIndex}`}
                src={displayImg}
                fill
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02] motion-reduce:group-hover:scale-100"
                alt={`${activeProfile.userName}-photo`}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-b from-soft-rose to-cream flex flex-col items-center justify-center">
                <div className="mb-4 flex h-28 w-28 items-center justify-center rounded-full border-2 border-maroon/25 bg-maroon/10 shadow-inner ring-2 ring-white/40">
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
                  <span className="text-red-500 font-extrabold text-5xl tracking-wider">
                    NOPE
                  </span>
                </div>
              </div>
            )}
            {swipeDirection === "right" && (
              <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none">
                <div className="border-4 border-green-500 rounded-xl px-6 py-2 rotate-[20deg] opacity-90">
                  <span className="text-green-500 font-extrabold text-5xl tracking-wider">
                    LIKE
                  </span>
                </div>
              </div>
            )}

            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/60 to-transparent" />
          </Card>
          {/* <Button
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="px-4 py-4 absolute top-1/2 -translate-y-1/2 right-0 z-10 text-white rounded-l-full bg-black/20 hover:bg-black/40 transition-all duration-200"
          >
            <FaAngleRight className="text-xl" />
          </Button> */}
          {hasMultiplePhotos && images.length > 0 && (
            <div className="absolute px-4 z-30 top-2 left-0 flex gap-1.5 justify-center w-full">
              {images.map((_, index) => (
                <div
                  key={index}
                  className={`w-full h-1 rounded-full transition-all duration-200 ${
                    photoIndex === index ? "bg-white" : "bg-white/40"
                  }`}
                />
              ))}
            </div>
          )}
          <div className="absolute bottom-6 left-4 z-10 flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md ring-2 ring-white/80">
              <BsPatchCheckFill className="text-lg text-gold" aria-hidden />
            </span>
            <div className="flex min-w-0 flex-col">
              <p className="font-playfair text-lg font-bold text-white drop-shadow-md sm:text-xl">
                {activeProfile.userName},{" "}
                {calculateAge(activeProfile.profile?.dateOfBirth || "")}
              </p>
            </div>
          </div>
        </div>
        <div
          role="button"
          tabIndex={0}
          onClick={handleViewProfile}
          onKeyDown={(e) => e.key === "Enter" && handleViewProfile()}
          className="xl:w-[400px] w-full mt-2 cursor-pointer"
        >
          <SearchAboutProfile profile={activeProfile} />
        </div>
      </div>
    </div>
  );
});

SearchCarousel.displayName = "SearchCarousel";

const SearchAboutProfile = ({ profile }: { profile: User }) => (
  <div className="xl:w-[400px] w-full mt-2">
    <div className="flex w-full flex-wrap items-center gap-2.5 rounded-2xl border border-border-soft bg-cream px-4 py-4 shadow-sm transition-shadow duration-300 hover:shadow-md sm:gap-3">
      {profile?.profile?.country && (
        <div className="flex items-center gap-1.5 rounded-full border border-border-soft bg-white px-3 py-1.5 text-sm text-[#2C2C2C] shadow-sm transition-shadow duration-200 hover:shadow">
          <span className="text-maroon/70">📍</span>
          <p>{profile.profile.country}</p>
        </div>
      )}
      {profile?.profile?.dateOfBirth && (
        <div className="flex items-center gap-1.5 rounded-full border border-border-soft bg-white px-3 py-1.5 text-sm text-[#2C2C2C] shadow-sm transition-shadow duration-200 hover:shadow">
          <span className="text-maroon/70">🎂</span>
          <p>
            {new Date(profile.profile.dateOfBirth).toISOString().split("T")[0]}
          </p>
        </div>
      )}
      {profile?.profile?.martialStatus && (
        <div className="flex items-center gap-1.5 rounded-full border border-border-soft bg-white px-3 py-1.5 text-sm text-[#2C2C2C] shadow-sm transition-shadow duration-200 hover:shadow">
          <span className="text-maroon/70">💍</span>
          <p>{profile.profile.martialStatus}</p>
        </div>
      )}
      {profile?.profile?.field_of_work && (
        <div className="flex items-center gap-1.5 rounded-full border border-border-soft bg-white px-3 py-1.5 text-sm text-[#2C2C2C] shadow-sm transition-shadow duration-200 hover:shadow">
          <span className="text-maroon/70">💼</span>
          <p>{profile.profile.field_of_work}</p>
        </div>
      )}
    </div>
    {profile?.profile?.bio && (
      <div className="mt-3 flex flex-col gap-y-3 rounded-xl border border-border-soft bg-white px-4 py-4 shadow-sm transition-shadow duration-300 hover:shadow-md">
        <p className="font-playfair text-lg font-semibold text-maroon">About</p>
        <p className="rounded-lg border-l-4 border-maroon bg-cream p-3 text-sm leading-relaxed text-[#2C2C2C]">
          {profile.profile.bio}
        </p>
      </div>
    )}
  </div>
);

export default SearchCarousel;
