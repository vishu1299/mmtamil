import React from "react";
import Image from "next/image";
import { GoDotFill } from "react-icons/go";
export default function LandingAbout() {
  return (
    <div className="bg-gray-100  flex justify-center items-center">
      <div className="lg:p-6 p-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Section - Images */}
          <div className="col-span-1 md:col-span-2 grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* First Column */}
            <div className="col-span-1 grid lg:grid-rows-3 gap-2">
              <Image
                src="/assets/images/search/body (9).webp"
                alt="Person 1"
                width={400}
                height={400}
                className="w-full h-full aspect-square lg:row-start-2 "
              />
            </div>

            {/* Second Column */}
            <div className="col-span-1  grid lg:grid-rows-3 gap-2 ">
            <Image
                src="/assets/images/search/body (10).webp"
                alt="Person 1"
                width={400}
                height={400}
                className="w-full h-full aspect-square  "
              />
              <Image
                src="/assets/images/search/body (11).webp"
                alt="Person 1"
                width={400}
                height={400}
                className="w-full h-full aspect-square  "
              />
            </div>

            {/* Third Column */}
            <div className="col-span-1 grid  lg:grid-rows-3 gap-2">
            <Image
                src="/assets/images/search/body (15).webp"
                alt="Person 1"
                width={400}
                height={400}
                className="w-full h-full aspect-square lg:row-start-2 "
              />
               <Image
                src="/assets/images/search/body (14).webp"
                alt="Person 1"
                width={400}
                height={400}
                className="w-full h-full aspect-square lg:row-start-3 "
              />
            </div>
          </div>

          {/* Right Section - About Us */}
          <div className="p-6 flex flex-col gap-10 ">
               <div className='flex items-center gap-2 text-red-500'>
              <GoDotFill className='text-3xl' />
                <p className='text-2xl font-semibold'>About Us</p>
              </div>
            <p className=" text-[18px]">
              Match Meet & Marry is a premium site with an impressive history of bringing
              people from different backgrounds together to communicate with
              each other.
            </p>
            <p className=" text-[18px]">
           {`   Here at Match Meet & Marry, we believe that you shouldn't be limited in
              opportunities to build a social connection with someone. On the
              contrary, with the possibilities of the Internet, you should be
              able to spark some exciting conversations that can lead to
              learning fun and unexpected things.`}
            </p>
            <p className="text-[18px]">
              Find people who share your values and goals and take in the
              pleasure of a great conversation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
