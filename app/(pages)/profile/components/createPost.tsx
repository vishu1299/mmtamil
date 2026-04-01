"use client";
import Image from "next/image";
import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";

const CreatePostComponent = ({
  setChangeMade,
  changeMade,
}: {
  setChangeMade: React.Dispatch<React.SetStateAction<boolean>>;
  changeMade: boolean;
}) => {
  const t = useTranslations("profileComponents");
  const [message, setMessage] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const maxChars = 1500;

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

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
    if (!message.trim()) {
      toast.error(t("toastPostEmptyDesc"));
      return;
    }

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
    formData.append("description", message);
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
        `${process.env.NEXT_PUBLIC_BASE_URL}/posts/createPost`,
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
        toast.error(data?.message || t("toastPostFailed"));
        return;
      }

      setMessage("");
      setPhotos([]);
      setSelectedImages([]);
      setChangeMade(!changeMade);
      toast.success(t("toastPostSuccess"));
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error(t("toastPostError"));
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-md shadow">
      <h2 className="text-xl font-medium text-gray-800 mb-6">
        {t("createPostTitle")}
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
          className="w-48 h-48 border border-gray-300 rounded flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50"
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

      <div className="mb-6">
        <label className="block text-gray-700 mb-2">{t("addText")}</label>
        <div className="relative">
          <textarea
            className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-maroon/30 focus:border-maroon"
            placeholder={t("postPlaceholder")}
            rows={4}
            value={message}
            onChange={handleMessageChange}
            maxLength={maxChars}
          />
          <div className="absolute bottom-2 right-2 text-gray-400 text-sm">
            {maxChars - message.length}
          </div>
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

export default CreatePostComponent;
