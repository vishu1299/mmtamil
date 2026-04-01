import FollowedProfile from "./following";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { peopleFollowing } from "../api/api";
import { User } from "../type";
import Image from "next/image";

const PeopleFollowing = () => {
  const [data, setData] = useState<User | null>(null);

  console.log("Data for Id", data);

  const fetchData = async () => {
    try {
      const response = await peopleFollowing();

      const fetchedData = response?.data?.data;

      console.log("Fetched Data:", JSON.stringify(fetchedData, null, 2));

      if (fetchedData) {
        setData(fetchedData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [data]);

  const handleUnfollow = (id: number) => {
    setData((prevData) => {
      if (!prevData) return prevData;

      return {
        ...prevData,
        followers: prevData.followers.filter(
          (user) => user.following?.id !== id
        ),
      };
    });
  };

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-[90%] mx-auto">
      {data.followers && data.followers.length > 0 ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">People you follow</h2>
            <span className="text-gray-500">
              {data.followers.length} members
            </span>
          </div>
          {data.followers.map((item, index) => (
            <FollowedProfile
              key={index}
              id={item.following.id}
              name={item.following.userName}
              image={item.following.profile?.profilePicture ?? ""}
              dateofBirth={
                item.following.profile?.dateOfBirth ?? "Not Available"
              }
              country={item.following.profile?.country ?? "Not Available"}
              totalPostsCount={item.following.posts?.length ?? 0}
              onUnfollow={handleUnfollow}
            />
          ))}

          <div className="flex justify-center space-x-2 mt-4">
            <Button variant="outline">Previous</Button>
            <Button variant="default">1</Button>
            <Button variant="outline">Next</Button>
          </div>
        </>
      ) : (
        <div className="">
          <div className="flex flex-col items-center bg-white p-4 rounded-lg shadow-md">
            <Image
              src="/assets/images/Following/following.png"
              alt="following"
              width={350}
              height={450}
              className="rounded-md"
            />
            <p className="mt-6 font-bold text-2xl sm:text-3xl lg:text-4xl text-gray-500 text-center">
              You have no users in list
            </p>
            <p className="mt-2 text-base sm:text-lg lg:text-xl text-gray-500 text-center">
              Let’s change that!
            </p>
            <button className="mt-6 px-6 sm:px-10 lg:px-16 py-3 rounded-md bg-[#e6246b]text-white text-sm sm:text-base lg:text-lg transition duration-300 hover:bg-[#e66a00]">
              Go to Search
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PeopleFollowing;
