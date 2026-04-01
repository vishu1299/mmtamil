"use client";
import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { FaRegHeart, FaRegStar } from "react-icons/fa";
import { FaRegFaceGrinTongueWink } from "react-icons/fa6";
import { useParams } from "next/navigation";
import { User } from "../../type/type";
import { followUnfollow } from "@/app/(pages)/news-feed/api/api";
import { showInterest } from "../../api/api";
import { ContUser } from "../main";
import { GalleryResponse, getGalleryImages } from "./api/api";

const SliderImage: React.FC<{ data: User }> = (data) => {
  const [token, setToken] = useState<any | null>(null);
  const contedata = useContext(ContUser);
  const params = useParams();

  useEffect(() => {
    const localtoken = JSON.parse(localStorage.getItem("access-token") ?? "");
    if (localtoken) {
      setToken(localtoken);
    }
  }, []);


  const interact = async (targetId: number, type: string) => {
    const data = { targetId, type };
    await showInterest(data);
    contedata?.setReload(!contedata.reload);
  };

  const following = async (id: number) => {
    const result = await followUnfollow(id);
    if (result?.data.code === 200 || result?.data.code === 201) {
      contedata?.setReload(!contedata.reload);
    }
  };

  const [publicPhotos, setPublicPhotos] = useState<GalleryResponse[]>([]);
  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        // Add null check for params.searchDetails
        if (!params.searchDetails) return;

        const images = await getGalleryImages(params.searchDetails.toString());
        setPublicPhotos(images);
        console.log("image", images);
      } catch (error) {
        console.error("Error fetching gallery images:", error);
      }
    };
    fetchGalleryImages();
  }, []);

  return (
    <div className="flex">
      {token && (
        <div className="flex flex-col gap-y-3">
          <Card>
            <Image
              src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${data.data.profile.profilePicture}`}
              width={1000}
              height={296}
              className="xl:min-w-[296px] xl:w-[296px] w-full h-full object-cover cursor-pointer"
              alt="img"
            />
          </Card>
          <div className="flex justify-between items-center gap-2">
            {["Like", "Follow"].map((action, index) => (
              <div
                key={index}
                onClick={() => action === "Follow" && following(data.data.id)}
                className="flex items-center w-full flex-col shadow-xl bg-white py-3 text-base text-[#EF4765] hover:bg-[#EF4765] hover:text-white rounded-md border-2 hover:border-[#F77705] font-semibold"
              >
                {index === 0 && <FaRegHeart className="text-xl" />}
                {index === 1 && <FaRegFaceGrinTongueWink className="text-xl" />}
                {index === 2 && <FaRegStar className="text-xl" />}
                {action === "Like" && (
                  <div onClick={() => interact(data.data.id, "interest")}>
                    {data.data.interestReceived.some(
                      (interest) => interest.userId === token.data.result.id
                    )
                      ? "Like"
                      : "UnLike"}
                  </div>
                )}
                {action === "Follow" && (
                  <div onClick={() => following(data.data.id)}>
                    {data.data.following.some(
                      (like) => like.followerId === token.data.result.id
                    )
                      ? "Following"
                      : "Follow"}
                  </div>
                )}
                {action === "Wink" && <div>{action}</div>}
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <p className="font-semibold text-sm text-black">PUBLIC PHOTOS</p>
            {/* <div className="grid grid-cols-2 gap-2 w-64">
              <Image
                src="/assets/images/people/img1.webp"
                alt="Photo 1"
                width={128}
                height={128}
                className="w-full h-32 object-cover rounded"
              />
              <img
                src="/assets/images/people/img1.webp"
                alt="Photo 2"
                className="w-full h-32 object-cover rounded"
              />
              <img
                src="/assets/images/people/img1.webp"
                alt="Photo 3"
                className="w-full h-32 object-cover rounded"
              />
              <div className="relative w-full h-32 rounded overflow-hidden">
                <img
                 src="/assets/images/people/img1.webp"
                  alt="Photo 4"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center text-white text-xl font-semibold">
                  +11
                </div>
              </div>
            </div> */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
              {publicPhotos.map((photo, index) => (
                <Image
                  key={photo.id}
                  src={process.env.NEXT_PUBLIC_IMAGE_URL + photo.imageUrl}
                  width={100}
                  height={100}
                  className="w-full h-full aspect-square object-cover"
                  alt={`gallery-image-${index}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SliderImage;
