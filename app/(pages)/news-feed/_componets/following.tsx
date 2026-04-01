"Use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { AiFillLike, AiFillProfile } from "react-icons/ai";

import { Followers } from "../type";
import MultipleImages from "./multipleImage";
import { getAllFollowingPost, LikeUnlike } from "../api/api";

import { Skeleton } from "@/components/ui/skeleton";
import { PaginationDemo } from "../../search/_components/pagination";
import { MenuDetails } from "../../search/[searchDetails]/_components/menu";
import Link from "next/link";

const AllFollowing = () => {
 
  const [token, setToken] = useState<any | null>(null);

  const [data, setData] = useState<Followers[] | null>(null);
  const [reload, setReload] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    const localtoken = JSON.parse(localStorage.getItem("access-token") ?? "");
    if (localtoken) {
      setToken(localtoken);
    }
  }, []);

  const fetch = async (currentPage: number) => {
    const response = await getAllFollowingPost(currentPage);
    console.log("Response in the all post", response?.data.data.followers);
    setData(response?.data.data.data.followers);
    setTotalPages(response?.data.data.totalPages);
  };

  useEffect(() => {
    console.log("data in the news feed", data);
    fetch(currentPage);
  }, []);

  useEffect(() => {
    fetch(currentPage);
  }, [reload, currentPage]);

  const Liking = async (id: number) => {
    const result = await LikeUnlike(id);

    console.log(result);
    setReload(!reload);
  }
  return (
    <>
      {data ? (
        <div>
          {data.length > 0 && token ? (
            <div className="w-full px-2 md:px-4 lg:px-0">
              {" "}
              {/* Added responsive padding */}
              {data.map((item) => (
                <div key={item.following.id}>
                  {item.following.posts.map((post, index) => (
                    <div
                      key={index}
                      className="mt-3 px-2 md:px-3 bg-white shadow-lg py-2 rounded-lg w-full max-w-3xl mx-auto" // Added max-width and centering
                    >
                      <div className="flex items-center justify-between mb-4 px-2 md:px-10">
                        {" "}
                        {/* Adjusted padding */}
                        <div className="flex items-center gap-2 md:gap-3">
                          <div className="h-[40px] w-[40px] md:h-[50px] md:w-[50px]">
                            {" "}
                            {/* Responsive image size */}
                            <Image
                              src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${item.following.profile.profilePicture}`}
                              width={60}
                              height={60}
                              alt={`${item.following.profile.profilePicture}'s profile`}
                              className="w-full h-full rounded-full"
                            />
                          </div>
                          <p className="text-[#333333] font-semibold text-lg md:text-xl">
                            {" "}
                            {/* Responsive text */}
                            {item.following.userName}
                          </p>
                        </div>

                        
                        <MenuDetails id={post.id} />
                      </div>
                      <hr className="ml-10 mr-10" />
                      <div>
                        <p className="text-dark-mmm font-normal mb-1 py-2 px-2 md:px-10">
                          {" "}
                          {/* Adjusted padding */}
                          {post.description}
                        </p>
                      </div>

                      <div className="w-full">
                        <MultipleImages image={post.image} />
                      </div>

                      <div className="text-dark-mmm flex ml-9 py-2 gap-1 items-center text-sm md:text-base">
                        {" "}
                        {/* Responsive text */}
                        <AiFillLike className="text-dark-mmm font-bold" />
                        <p className="font-medium">{post.LikeDislike.length}</p>
                        <p>people liked this post</p>
                      </div>
                      <div className="mt-2 flex justify-between items-center px-2 md:px-9">
                        {" "}
                        {/* Adjusted padding */}
                        {/* Like button section */}
                        <div className="flex justify-between w-full max-w-2xl">
                          {post.LikeDislike.some(
                            (like) => like.userId === token.data.result.id
                          ) ? (
                            <Button
                              onClick={() => Liking(post.id)}
                              size="default"
                              className="px-4 md:px-10 bg-pink-mmm hover:bg-pink-mmm text-white text-sm md:text-base"
                            >
                              <AiFillLike /> Liked
                            </Button>
                          ) : (
                            <Button
                              onClick={() => Liking(post.id)}
                              size="default"
                              className="px-4 md:px-10 bg-pink-mmm hover:bg-pink-mmm text-white text-sm md:text-base"
                            >
                              <AiFillLike /> Like
                            </Button>
                          )}
                          <Link
                            href={{
                              pathname: `/search/${post.id}`,
                            }}
                          >
                            <Button className="px-4 md:px-10 bg-pink-mmm hover:bg-pink-mmm text-white text-sm md:text-base">
                              <AiFillProfile />
                              View Profile
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
              <div className="mt-8 mb-4">
                <PaginationDemo
                  totalPages={totalPages ?? 1}
                  currentPage={currentPage ?? 1}
                  setCurrentPage={setCurrentPage ?? (() => {})}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[50vh] md:h-screen text-lg md:text-xl shadow-xl">
              {" "}
              {/* Responsive height and text */}
              No post to show
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col w-full items-center justify-center gap-4 mt-4">
          {[1, 2, 3].map((_, index) => (
            <div key={index} className="flex flex-col space-y-3">
              <Skeleton className="h-[300px] md:h-[412px] w-full md:w-[450px] rounded-xl" />{" "}
              {/* Responsive skeleton */}
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default AllFollowing;
