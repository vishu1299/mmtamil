import { SearchImg } from "@/data/search/search";
import { usePathname } from "next/navigation";
import { BsStars } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { FaGlobeAmericas } from "react-icons/fa";
import { LiaBirthdayCakeSolid } from "react-icons/lia";
import { PiBagSimpleFill, PiListHeartFill } from "react-icons/pi";
import { TbMoodBoy } from "react-icons/tb";
import { PeopleResponse } from "../api/api";
// import Image from "next/image";

const AboutProfile = ({ profileData }: { profileData: PeopleResponse }) => {
  console.log("here is profile data", profileData);

  const pathname = usePathname();
  const chartid = parseInt(pathname.split("/")[2], 10);
  const chartData = SearchImg[chartid] || SearchImg[1];
  console.log("chartData", chartData);
  if (!chartData) {
    return <div>Chart not found!</div>;
  }
  return (
    <div>
      <div className="py-4 bg-cream rounded-2xl flex px-4 flex-wrap gap-3 items-center w-full border border-border-soft">
        {profileData?.profile.country !== "Not Specified" && (
          <div className="flex items-center gap-1.5 bg-white border border-border-soft px-3 py-1.5 rounded-full text-sm text-[#2C2C2C] shadow-sm">
            <FaGlobeAmericas className="text-maroon/70" />
            <p>{profileData?.profile.country}</p>
          </div>
        )}

        {profileData?.profile.dateOfBirth !== "Not Specified" && (
          <div className="flex items-center gap-1.5 bg-white border border-border-soft px-3 py-1.5 rounded-full text-sm text-[#2C2C2C] shadow-sm">
            <LiaBirthdayCakeSolid className="text-maroon/70" />
            <p>
              {
                new Date(profileData?.profile.dateOfBirth)
                  .toISOString()
                  .split("T")[0]
              }
            </p>
          </div>
        )}

        {profileData?.profile.maritalStatus !== "Not Specified" && (
          <div className="flex items-center gap-1.5 bg-white border border-border-soft px-3 py-1.5 rounded-full text-sm text-[#2C2C2C] shadow-sm">
            <TbMoodBoy className="text-maroon/70" />
            <p>{profileData?.profile.maritalStatus}</p>
          </div>
        )}

        {profileData?.profile.field_of_work !== "Not Specified" && (
          <div className="flex items-center gap-1.5 bg-white border border-border-soft px-3 py-1.5 rounded-full text-sm text-[#2C2C2C] shadow-sm">
            <PiBagSimpleFill className="text-maroon/70" />
            <p>{profileData?.profile.field_of_work}</p>
          </div>
        )}
      </div>
      {profileData.profile.interests.length > 0 && (
        <div className="bg-white flex flex-col gap-y-3 mt-3 border border-border-soft px-4 py-3 rounded-xl">
          <div>
            <div className="flex gap-1.5 items-center text-maroon mb-2">
              <BsStars className="text-lg" />
              <p className="font-playfair text-lg font-semibold">Interests</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {profileData.profile.interests.map((item, index) => (
                <div
                  key={index}
                  className="text-[#2C2C2C] bg-soft-rose px-3 py-1 rounded-full"
                >
                  <p className="text-xs font-medium">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {profileData?.preferences?.looking_for && (
        <div className="bg-white flex flex-col gap-y-3 mt-3 border border-border-soft px-4 py-3 rounded-xl">
          <div>
            <div className="flex gap-1.5 items-center text-maroon mb-2">
              <PiListHeartFill className="text-lg" />
              <p className="font-playfair text-lg font-semibold">Looking For</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="text-[#2C2C2C] bg-soft-rose px-3 py-1 rounded-full">
                <p className="text-xs font-medium">
                  {profileData?.preferences?.looking_for}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* add the multiple image section */}
      {/* {profileData?.mutipleImages?.length > 0 && (
        <div className="bg-white flex flex-col gap-y-3 mt-3 shadow-lg px-4 py-2 rounded-lg">
          <div>
            <div className="flex gap-1 items-center text-[#333333]">
              <CgProfile className="text-xl" />
              <p className="text-xl font-semibold">Photos</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
              {profileData.mutipleImages.map((image, index) => (
                <div key={index} className="aspect-square rounded-lg overflow-hidden">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${image}`}
                    alt={`Photo ${index + 1}`}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )} */}

      <div className="bg-white flex flex-col gap-y-3 mt-3 border border-border-soft px-4 py-3 rounded-xl">
        {profileData?.profile.bio && (
          <div>
            <div className="flex gap-1.5 items-center text-maroon mb-2">
              <CgProfile className="text-lg" />
              <p className="font-playfair text-lg font-semibold">About Me</p>
            </div>
            <div>
              <p className="text-sm text-[#2C2C2C] leading-relaxed bg-cream p-3 rounded-lg border-l-4 border-maroon">
                {profileData?.profile.bio}
              </p>
            </div>
          </div>
        )}

        {/* <div>
          <p>
            {isshow
              ? profileData?.profile.bio
              : `${profileData?.profile.bio.slice(0, 200)}...`}{" "}
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
        </div> */}
      </div>
    </div>
  );
};

export default AboutProfile;
