"Use client";
import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { FaRegStar } from "react-icons/fa";
import { AiFillLike } from "react-icons/ai";
import { IoSend } from "react-icons/io5";
// import { AboutMenu } from './about-menu';
// import MultipleImages from './multipleImage';
// import { CreateCont } from '../main';
import { PostResponse, User } from "../../type/type";
import {
  followUnfollow,
  LikeUnlike,
  postcomment,
} from "@/app/(pages)/news-feed/api/api";
import MultipleImages from "./imageCarousel";
// import { AboutMenu } from './about-menu';
import { ContUser } from "../main";
import CommentModal from "@/app/(pages)/news-feed/_componets/commentModal";
import { AboutMenu } from "@/app/(pages)/news-feed/_componets/about-menu";

const NewsFeeddataUser = ({
  userData,
  data,
}: {
  userData: User;
  data: PostResponse[];
  reload: boolean;
  setReload: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  // const cont = useContext(CreateCont);
  const [token, setToken] = useState<any | null>(null);
  const [comment, setComment] = useState("");
  const contedata = useContext(ContUser);
  useEffect(() => {
    const localtoken = JSON.parse(localStorage.getItem("access-token") ?? "");
    if (localtoken) {
      setToken(localtoken);
    }
  }, []);

  const Liking = async (id: number) => {
    const result = await LikeUnlike(id);
    console.log(result);

    contedata?.setReload(!contedata.reload);
  };
  const following = async (id: number) => {
    const result = await followUnfollow(id);
    if (result?.data.code === 200 || result?.data.code === 201) {
      contedata?.setReload(!contedata.reload);
    }
    console.log(result);
    // cont?.setReload(!cont.reload)
  };

  const sendComment = async (id: number) => {
    const data = {
      id: id,
      description: comment,
    };
    const result = await postcomment(data);
    if (result?.data.data.code === 200 || result?.data.code === 201) {
      // cont?.setReload(!cont.reload);
      setComment("");
    }
    contedata?.setReload(!contedata.reload);
  };

  return (
    <>
      {data.length > 0 && token ? (
        <div className=" ">
          {data.map((item, index) => (
            <div
              key={index}
              className="mt-3 px-3 bg-white shadow-lg  py-2 rounded-lg"
            >
              <div className="flex justify-between items-center ">
                <div className="flex gap-2  items-center">
                  <div className="h-[60px] w-[60px]">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${userData.profile.profilePicture}`}
                      width={60}
                      height={60}
                      alt={`${item.image}'s profile`}
                      className="w-full h-full  rounded-full"
                    />
                  </div>
                  <p className="text-[#333333] font-semibold text-xl">
                    {userData.userName}
                  </p>
                </div>
                <div>
                  {userData.following.some(
                    (like) => like.followerId === token.data.result.id
                  ) ? (
                    <Button
                      onClick={() => following(userData.id)}
                      variant="dark"
                      size="secondary"
                    >
                      <FaRegStar /> Following
                    </Button>
                  ) : (
                    <Button
                      onClick={() => following(userData.id)}
                      variant="dark"
                      size="secondary"
                    >
                      <FaRegStar /> Follow
                    </Button>
                  )}

                  <AboutMenu id={item.id} />
                </div>
              </div>

              <div>
                <p className="text-dark-mmm font-normal">{item.description}</p>
              </div>

              <div className="">
                <MultipleImages image={item.image} />
              </div>

              <div className="mt-2 flex justify-between items-center">
                {item.LikeDislike.some(
                  (like) => like.userId === token.data.result.id
                ) ? (
                  <Button
                    onClick={() => Liking(item.id)}
                    variant="secondary"
                    size="secondary"
                    className="px-10 bg-pink-500 text-white"
                  >
                    <AiFillLike /> UnLike
                  </Button>
                ) : (
                  <Button
                    onClick={() => Liking(item.id)}
                    variant="secondary"
                    size="secondary"
                    className="px-10"
                  >
                    <AiFillLike /> Like
                  </Button>
                )}
                <div className="text-dark-mmm  flex gap-1 items-center">
                  <AiFillLike className="text-dark-mmm font-bold " />
                  <p className="font-medium">{item.LikeDislike.length}</p>
                  <p>liked</p>
                  <CommentModal item={item} />
                </div>
              </div>
              <div className="flex gap-2  mt-1 py-2">
                <textarea
                  rows={1}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full h-8 rounded-md border boder-dark-mmm shadow-md bg-[#f5f5f5] px-4 pt-1 pb-2 outline-none"
                  placeholder="Type your message..."
                />
                <Button onClick={() => sendComment(item.id)} className="h-8">
                  Send <IoSend />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-screen text-xl shadow-xl">
          No post to show
        </div>
      )}
    </>
  );
};

export default NewsFeeddataUser;
