import React from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { SearchImg } from "@/data/search/search";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaRegStar } from "react-icons/fa";
import { AiFillLike } from "react-icons/ai";
import { IoSend } from "react-icons/io5";
const ProfileDetails = () => {
  const pathname = usePathname();
  const chartid = parseInt(pathname.split("/")[2], 10);
  const chartData = SearchImg[chartid];
  // if (!chartData) {
  //   return <div>Chart not found!</div>;
  // }
  return (
    <div>
      {Object.values(SearchImg)
        .slice(0, 6)
        .map((item, index) => (
          <div
            key={index}
            className="mt-3 px-3 bg-white shadow-lg   py-2 rounded-lg"
          >
            <div className="flex justify-between   items-center">
              <div className="flex gap-2  items-center">
                <div className="h-[60px] w-[60px]">
                  <Image
                    src={item.image}
                    width={60}
                    height={60}
                    alt={`${chartData.image}'s profile`}
                    className="w-full h-full  rounded-full"
                  />
                </div>
                <p className="text-[#333333]  font-semibold text-xl">
                  {item.name}
                </p>
              </div>
              <div>
                <Button variant="dark" size="secondary">
                  <FaRegStar /> Follow
                </Button>
              </div>
            </div>

            <div>

             
            </div>



            <div>
              <p className="text-dark-mmm   font-normal">{item.aboutMe}</p>
            </div>

            <div className="">
              <Card className="mt-2 h-[600px]">
                <Image
                  src={item.image}
                  width={1000}
                  height={296}
                  className="w-full  h-full "
                  alt={`${chartData.image}'s profile`}
                />
              </Card>
            </div>

            <div className="mt-2 flex justify-between items-center">
              <Button variant="secondary" size="secondary" className="px-10">
                <AiFillLike /> Like
              </Button>
              <div className="text-dark-mmm  flex gap-1 items-center">
                <AiFillLike className="text-dark-mmm font-bold " />
                <p className="font-medium">20</p>
                <p>liked</p>
              </div>
            </div>
            <div className="flex gap-2  mt-1 py-2">
              <textarea
                className="w-full h-14 rounded-md border boder-dark-mmm shadow-md bg-[#f5f5f5] px-4 pt-1 pb-2 outline-none"
                placeholder="Type your message..."
              />
              <Button className="h-14">
                Send <IoSend />
              </Button>
            </div>
          </div>
        ))}
    </div>
  );
};

export default ProfileDetails;
