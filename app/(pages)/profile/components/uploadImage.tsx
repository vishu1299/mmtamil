"use client";

import Image from "next/image";
import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";

const CreateImageComponent = ({
  setChangeMade,
  changeMade,
}: {
  setChangeMade: React.Dispatch<React.SetStateAction<boolean>>;
  changeMade: boolean;
}) => {
  const t = useTranslations("profileComponents");
  const [photos, setPhotos] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedImages([...selectedImages, ...Array.from(e.target.files)]);
      const filesArray = Array.from(e.target.files);
      const previews = filesArray.map((file) => URL.createObjectURL(file));
      setPhotos([...photos, ...previews]);
    }
  };

  const handleCreatePost = async () => {
    if (selectedImages.length === 0) {
      toast.error(t("toastPostNoImage"));
      return;
    }

    const imageTooLarge = selectedImages.some(
      (image) => image.size > 2 * 1024 * 1024
    );
    if (imageTooLarge) {
      toast.error(t("toastImageTooLarge"));
      return;
    }

    const formData = new FormData();
    selectedImages.forEach((image) => formData.append("images", image));

    const tokenString = localStorage.getItem("access-token");
    if (!tokenString) {
      toast.error(t("toastAuthMissing"));
      return;
    }

    const token = JSON.parse(tokenString);
    if (!token?.token?.access?.token) {
      toast.error(t("toastInvalidToken"));
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/gallery/upload`,
        {
          headers: {
            Authorization: token.token.access.token,
          },
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data?.message || t("toastUploadFailed"));
        return;
      }

      setPhotos([]);
      setSelectedImages([]);
      setChangeMade(!changeMade);
      toast.success(t("toastUploadSuccess"));
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error(t("toastUploadError"));
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-xl font-medium text-gray-800 mb-6">
        {t("uploadPublicPhotoTitle")}
      </h2>

      <div className="mb-4">
        <input
          type="file"
          accept="image/*"
          multiple
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
        <div
          onClick={handlePhotoUpload}
          className="w-32 h-32 border border-gray-300 rounded flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50"
        >
          <div className="w-10 h-10 rounded-full bg-maroon flex items-center justify-center mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </div>
          <span className="text-maroon font-medium">{t("addPhotos")}</span>
        </div>

        <div className="mt-4 flex gap-2 flex-wrap">
          {photos.map((photo, index) => (
            <Image
              key={index}
              src={photo}
              alt={t("altUploaded", { n: index + 1 })}
              width={96}
              height={96}
              className="w-24 h-24 object-cover rounded"
            />
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={handleCreatePost}
        className="bg-maroon hover:bg-maroon/90 text-white font-semibold py-2.5 px-8 rounded-full transition-colors"
      >
        {t("publish")}
      </button>
    </div>
  );
};

export default CreateImageComponent;
