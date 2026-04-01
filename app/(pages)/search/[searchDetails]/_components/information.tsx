import React, { useState } from "react";
import { BsStars } from "react-icons/bs";
// import { usePathname } from "next/navigation";

import { PiListHeartFill } from "react-icons/pi";
// import { SearchImg } from "@/data/search/search";
import { User } from "../../type/type";
const Information = ({ data }: { data: User }) => {
  const [isshow, setIsshow] = useState(false);
 

  return (
    <>
      {data && (
        <div className="flex flex-col gap-y-3">
          {data.profile.interests.length > 0 && (
            <div className="bg-white flex flex-col gap-y-3 mt-3 shadow-lg px-4 py-2 rounded-lg">
              <div className="flex gap-1   items-center text-[#333333]">
                <BsStars className="text-xl" />
                <p className="text-xl font-semibold">Interests</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {data.profile.interests.map((item, index) => (
                  <div
                    key={index}
                    className=" text-[#333333] bg-[#F5F5F5] px-4 py-1 rounded-lg"
                  >
                    <p className="text-sm font-semibold">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data?.preferences?.looking_goal?.length > 0 && (
            <div className="bg-white flex flex-col gap-y-3 mt-3 shadow-lg px-4 py-2 rounded-lg">
              <div className="flex gap-1 items-center text-[#333333]">
                <PiListHeartFill className="text-xl" />
                <p className="text-xl font-semibold">Looking For</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {data.preferences.looking_goal.map((item, index) => (
                  <div
                    key={index}
                    className="text-[#333333] bg-[#F5F5F5] px-4 py-1 rounded-lg"
                  >
                    <p className="text-sm font-semibold">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white flex flex-col gap-y-3 mt-3 shadow-lg px-4 py-2 rounded-lg">
            <div className="flex gap-1   items-center text-[#333333]">
              <PiListHeartFill className="text-xl" />
              <p className="text-xl font-semibold">About Me</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {data.profile.traits.map((item, index) => (
                <div
                  key={index}
                  className=" text-[#333333] bg-[#F5F5F5] px-4 py-1 rounded-lg"
                >
                  <p className="text-sm font-semibold">{item}</p>
                </div>
              ))}
            </div>

            <div>
              <p>
                {isshow
                  ? data.profile.bio ?? ""
                  : `${
                      data.profile.bio && data.profile?.bio.slice(0, 200)
                    }...`}{" "}
                <button onClick={() => setIsshow(!isshow)}>
                  {isshow ? (
                    <p className="text-[#DA6A05] font-medium text-base underline">
                      Show Less
                    </p>
                  ) : (
                    <p className="text-[#DA6A05] font-medium text-base underline">
                      Show More
                    </p>
                  )}
                </button>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Information;
