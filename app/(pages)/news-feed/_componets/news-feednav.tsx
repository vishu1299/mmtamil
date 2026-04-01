"use client";
import React, { useState } from "react";
import { IoMdStar } from "react-icons/io";
import NewsFeeddata from "./news-feeddata";
import { PostResponse } from "../type";
import AllFollowing from "./following";

const NewsFeedNav = ({
  data,
  reload,
  setReload,
}: {
  data: PostResponse[];
  setReload: React.Dispatch<React.SetStateAction<boolean>>;
  reload: boolean;
}) => {
  const [activeNav, setActiveNav] = useState(0);
  const Navitems = [
    { name: "All Posts" },
    { name: "Following", icon: <IoMdStar /> },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm mb-4 p-4">
        <div className="flex justify-center gap-4">
          {Navitems.map((item, index) => (
            <button
              key={index}
              className={`px-6 py-2 rounded-full transition-all ${
                activeNav === index
                  ? "bg-pink-100 text-pink-600 font-medium"
                  : "bg-gray-50 hover:bg-gray-100 text-gray-700"
              }`}
              onClick={() => setActiveNav(index)}
            >
              <span className="flex items-center gap-2">
                {item.icon} {item.name}
              </span>
            </button>
          ))}
        </div>
      </div>
      <div className=" w-full">
        {activeNav === 0 && (
          <div>
            <NewsFeeddata reload={reload} setReload={setReload} data={data} />
          </div>
        )}
        {activeNav === 1 && (
          <div>
            <AllFollowing />
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsFeedNav;
