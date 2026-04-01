"Use client";
import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { FaRegUser } from "react-icons/fa";
import { AiFillLike, AiFillProfile } from "react-icons/ai";

import { PostResponse } from "../type";
import MultipleImages from "./multipleImage";
import { followUnfollow, LikeUnlike } from "../api/api";
import { CreateCont } from "../main";
import { PaginationDemo } from "../../search/_components/pagination";
import { MenuDetails } from "../../search/[searchDetails]/_components/menu";
import Link from "next/link";

const NewsFeeddata = ({
  data,
}: {
  data: PostResponse[];
  reload: boolean;
  setReload: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const cont = useContext(CreateCont);
  const [token, setToken] = useState<any | null>(null);

  useEffect(() => {
    const localtoken = JSON.parse(localStorage.getItem("access-token") ?? "");
    if (localtoken) {
      setToken(localtoken);
    }
  }, []);

  useEffect(() => {
    console.log("data in the news feed", data);
  }, []);

  const Liking = async (id: number) => {
    const result = await LikeUnlike(id);
    console.log(result);
    cont?.setReload(!cont.reload);
  };
  const following = async (id: number) => {
    const result = await followUnfollow(id);
    console.log(result);
    cont?.setReload(!cont.reload);
  };

  return (
    <div>
      {data.length > 0 && token ? (
        <div className="w-full px-2 md:px-4 lg:px-0">
          {data.map((item, index) => (
            <div
              key={index}
              className="mt-3 px-2 md:px-3 bg-white shadow-lg py-2 rounded-lg w-full max-w-3xl mx-auto"
            >
              <div className="flex items-center justify-between mb-4 px-2 md:px-10">
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="h-[40px] w-[40px] md:h-[50px] md:w-[50px]">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${item.User.profile.profilePicture}`}
                      width={60}
                      height={60}
                      alt={`${item.image}'s profile`}
                      className="w-full h-full rounded-full"
                    />
                  </div>
                  <p className="text-[#333333] font-semibold text-sm md:text-lg lg:text-xl">
                    {item.User.userName}
                  </p>
                </div>
                <div className="flex gap-2 items-center">
                  {item.User.following.some(
                    (like) => like.followerId === token.data.result.id
                  ) ? (
                    <Button
                      onClick={() => following(item.User.id)}
                      variant="dark"
                      size="secondary"
                      className="text-sm md:text-base"
                    >
                      <FaRegUser className="mr-1" /> Following
                    </Button>
                  ) : (
                    <Button
                      onClick={() => following(item.User.id)}
                      variant="dark"
                      size="secondary"
                      className="text-sm md:text-base"
                    >
                      <FaRegUser className="mr-1" /> Follow
                    </Button>
                  )}
                  <MenuDetails id={item.id} />
                </div>
              </div>
              <hr className="ml-4 md:ml-10 mr-4 md:mr-10" />

              <div>
                <p className="text-dark-mmm font-normal mb-1 py-2 px-2 md:px-10 text-sm md:text-base">
                  {item.description}
                </p>
              </div>

              <div className="w-full px-2 md:px-0">
                <MultipleImages image={item.image} />
              </div>

              <div className="text-dark-mmm flex ml-4 md:ml-9 py-2 gap-1 items-center text-xs md:text-sm lg:text-base">
                <AiFillLike className="text-dark-mmm font-bold" />
                <p className="font-medium">{item.LikeDislike.length}</p>
                <p>people liked this post</p>
              </div>

              <div className="mt-2 flex flex-col md:flex-row justify-between items-center px-2 md:px-9 gap-2 md:gap-0">
                <div className="flex justify-between w-full max-w-2xl gap-2 md:gap-4">
                  {item.LikeDislike.some(
                    (like) => like.userId === token.data.result.id
                  ) ? (
                    <Button
                      onClick={() => Liking(item.id)}
                      size="default"
                      className="px-3 md:px-6 lg:px-10 bg-pink-mmm hover:bg-pink-mmm text-white text-sm md:text-base flex-1 md:flex-none"
                    >
                      <AiFillLike className="mr-1" /> Liked
                    </Button>
                  ) : (
                    <Button
                      onClick={() => Liking(item.id)}
                      size="default"
                      className="px-3 md:px-6 lg:px-10 bg-pink-mmm hover:bg-pink-mmm text-white text-sm md:text-base flex-1 md:flex-none"
                    >
                      <AiFillLike className="mr-1" /> Like
                    </Button>
                  )}
                  <Link
                    href={{
                      pathname: `/search/${item.id}`,
                    }}
                    className="flex-1 md:flex-none"
                  >
                    <Button className="w-full hover:border-pink-mmm bg-pink-mmm text-white hover:bg-pink-mmm text-sm md:text-base">
                      <AiFillProfile className="mr-1" />
                      View Profile
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
          <div className="mt-8 mb-4">
            <PaginationDemo
              totalPages={cont?.totalPages ?? 1}
              currentPage={cont?.currentPage ?? 1}
              setCurrentPage={cont?.setCurrentPage ?? (() => {})}
            />
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-screen text-xl shadow-xl">
          No post to show
        </div>
      )}
    </div>
  );
};

export default NewsFeeddata;
