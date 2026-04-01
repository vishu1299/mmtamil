"use client";

import React, { useEffect, useCallback } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { IoClose, IoChevronBack, IoChevronForward } from "react-icons/io5";
import { FiTrash2 } from "react-icons/fi";

interface PictureModalViewerProps {
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  onIndexChange?: (index: number) => void;
  labels?: string[];
  onDeleteCurrent?: () => void;
  canDeleteCurrent?: boolean;
  deletingCurrent?: boolean;
}

const PictureModalViewer: React.FC<PictureModalViewerProps> = ({
  images,
  currentIndex,
  onClose,
  onPrev,
  onNext,
  onIndexChange,
  labels = [],
  onDeleteCurrent,
  canDeleteCurrent = false,
  deletingCurrent = false,
}) => {
  const t = useTranslations("editProfilePage");
  const hasMultiple = images.length > 1;
  const currentImage = images[currentIndex] ?? images[0];
  const currentLabel = labels[currentIndex] ?? "";

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && onPrev) onPrev();
      if (e.key === "ArrowRight" && onNext) onNext();
    },
    [onClose, onPrev, onNext]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  if (!currentImage) return null;

  return (
    <>
      {/* Backdrop with blur */}
      <div
        className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal content */}
      <div className="fixed inset-0 z-[101] flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 pointer-events-none">
        <div
          className="relative w-full max-w-4xl flex flex-col items-center gap-4 pointer-events-auto animate-in fade-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header bar */}
          <div className="flex items-center justify-between w-full max-w-2xl px-4 py-3 rounded-2xl bg-white/95 backdrop-blur-md shadow-lg border border-white/20">
            <span className="font-playfair text-base font-semibold text-[#2C2C2C] truncate max-w-[60%]">
              {currentLabel || t("modalPhotoFallback")}
            </span>
            <div className="flex items-center gap-3">
              {hasMultiple && (
                <span className="text-sm text-[#6B6B6B] font-medium tabular-nums">
                  {currentIndex + 1} / {images.length}
                </span>
              )}
              {canDeleteCurrent && onDeleteCurrent ? (
                <button
                  onClick={onDeleteCurrent}
                  disabled={deletingCurrent}
                  className="w-9 h-9 rounded-full bg-red-50 hover:bg-red-100 disabled:opacity-60 flex items-center justify-center text-red-600 transition-all duration-200"
                  aria-label={t("ariaDeletePhoto")}
                >
                  <FiTrash2 className="text-base" />
                </button>
              ) : null}
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-soft-rose hover:bg-maroon/10 flex items-center justify-center text-[#6B6B6B] hover:text-maroon transition-all duration-200"
                aria-label="Close"
              >
                <IoClose className="text-xl" />
              </button>
            </div>
          </div>

          {/* Image + nav container */}
          <div className="relative w-full flex items-center justify-center gap-2 sm:gap-4">
            {/* Prev button */}
            {hasMultiple && currentIndex > 0 && onPrev && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onPrev();
                }}
                className="shrink-0 w-12 h-12 rounded-full bg-white/95 backdrop-blur-md shadow-lg border border-white/20 flex items-center justify-center text-[#2C2C2C] hover:bg-maroon hover:text-white hover:border-maroon/30 transition-all duration-200 active:scale-95"
                aria-label="Previous"
              >
                <IoChevronBack className="text-2xl" />
              </button>
            )}

            {/* Image container */}
            <div className="relative w-full aspect-[4/5] max-h-[75vh] rounded-2xl overflow-hidden bg-white/5 shadow-2xl border border-white/10 ring-1 ring-black/5">
              <Image
                src={currentImage}
                alt={currentLabel || "Photo"}
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 896px"
                priority
                unoptimized
              />
            </div>

            {/* Next button */}
            {hasMultiple && currentIndex < images.length - 1 && onNext && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNext();
                }}
                className="shrink-0 w-12 h-12 rounded-full bg-white/95 backdrop-blur-md shadow-lg border border-white/20 flex items-center justify-center text-[#2C2C2C] hover:bg-maroon hover:text-white hover:border-maroon/30 transition-all duration-200 active:scale-95"
                aria-label="Next"
              >
                <IoChevronForward className="text-2xl" />
              </button>
            )}
          </div>

          {/* Thumbnail strip */}
          {hasMultiple && images.length <= 8 && onIndexChange && (
            <div className="flex gap-2 overflow-x-auto scrollbar-hide py-2 px-1 max-w-full">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    onIndexChange(i);
                  }}
                  className={`relative w-14 h-14 shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    i === currentIndex
                      ? "border-maroon ring-2 ring-maroon/30"
                      : "border-transparent opacity-60 hover:opacity-100 hover:border-white/30"
                  }`}
                  aria-label={`View photo ${i + 1}`}
                  aria-current={i === currentIndex}
                >
                  <Image
                    src={img}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="56px"
                    unoptimized
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PictureModalViewer;