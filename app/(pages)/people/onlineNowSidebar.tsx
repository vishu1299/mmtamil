import Image from 'next/image';
import React from 'react';
import { CiCamera } from "react-icons/ci";

const onlineUsers = [
  {
    id: 1,
    name: "Nurgerim",
    age: 28,
    location: "Bishkek, Kyrgyzstan",
    photoCount: 16,
    imgSrc: "/assets/images/people/img1.webp",
  },
  {
    id: 2,
    name: "Katherine",
    age: 24,
    location: "Caldas, Colombia",
    photoCount: 27,
    imgSrc: "/assets/images/people/img2.webp",
  },
  {
    id: 3,
    name: "Tatiana",
    age: 26,
    location: "Izmail, Ukraine",
    photoCount: 19,
    imgSrc: "/assets/images/people/img3.webp",
  },
];

const OnlineNowSidebar = () => {
  return (
    <div>
      <p className="font-playfair text-lg font-semibold text-maroon">Online now</p>
      <div className="flex flex-col mt-3 space-y-2">
        {onlineUsers.map((user) => (
          <div key={user.id} className="flex items-center gap-4 p-3 bg-white border border-border-soft rounded-xl hover:shadow-md hover:border-maroon/20 transition-all duration-200 cursor-pointer">
            <div className="relative flex-shrink-0">
              <Image 
                src={user.imgSrc} 
                alt={user.name} 
                width={48} 
                height={48} 
                className="rounded-full object-cover w-12 h-12 border-2 border-soft-rose"
              />
              <span className="absolute bottom-0 right-0 h-3 w-3 bg-[#2E7D32] rounded-full border-2 border-white"></span>
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm text-[#2C2C2C]">{user.name}, {user.age}</p>
              <p className="text-xs text-[#6B6B6B] truncate">{user.location}</p>
              <div className="flex items-center text-[#6B6B6B] text-xs mt-0.5">
                <CiCamera className="text-sm text-maroon/60" />
                <p className="ml-1">{user.photoCount} photos</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OnlineNowSidebar;