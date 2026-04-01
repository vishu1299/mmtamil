"use client";

import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { MdOutlineModeEdit } from "react-icons/md";
import YourProfileInput from "./yourprofileinput";
import { User } from "./type/type";
import PublishedPostComponent from "./components/postsAll";
import { ToastContainer } from "react-toastify";
import imgwomen from "@/public/assets/images/search/images (2).jpg";
import imgmen from "@/public/assets/images/search/images (4).jpg";
import CreateImageComponent from "./components/uploadImage";
import { getGalleryByUserId, UserGalleryItem } from "./api/api";
import { formatDisplayProfileId } from "./utils/display-profile-id";
import { HoroscopeChartGrid } from "@/app/_components/horoscope/horoscope-chart-grid";
import { useRouter } from "next/navigation";

const YourProfile = ({
  data,
  horoscope,
  selectInputFiled,
  setSelectedInputField,
  setChangeMade,
  changeMade,
}: {
  data: any;
  horoscope?: { rasiChart?: string[]; navamsaChart?: string[]; image?: string } | null;
  setSelectedInputField: React.Dispatch<React.SetStateAction<boolean>>;
  changeMade: boolean;
  selectInputFiled: boolean;
  setChangeMade: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const t = useTranslations("profile");
  const router = useRouter();
  const [fetch, setFetch] = useState<User>();
  const [gallery, setGallery] = useState<UserGalleryItem[]>([]);
  useEffect(() => {
    setFetch(data);
  }, [data]);

  useEffect(() => {
    const run = async () => {
      if (!fetch?.id) {
        setGallery([]);
        return;
      }
      const photos = await getGalleryByUserId(fetch.id);
      setGallery(photos);
    };
    run();
  }, [fetch?.id]);

  return (
    <>
      {fetch && (
        <div className="">
          {selectInputFiled ? (
            <div>
              <div className="flex flex-col lg:flex-row gap-4 px-4 lg:px-0">
                <div className="w-full lg:w-[450px]">
                  <div className="py-4 bg-cream rounded-lg border border-border-soft">
                    <div className="w-full">
                      <Image
                        src={
                          fetch.profile?.profilePicture
                            ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${fetch.profile?.profilePicture}`
                            : fetch.profile?.gender === "FEMALE"
                            ? imgwomen
                            : imgmen
                        }
                        alt={t("altProfile")}
                        width={450}
                        height={450}
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  </div>

                  {/* PublicImage */}
                  
                  <div className="bg-white shadow-md rounded-lg border border-border-soft mt-4">
                    <CreateImageComponent
                      setChangeMade={setChangeMade}
                      changeMade={changeMade}
                    />
                  </div>

                  {/* Private Image */}
                  
                </div>
                <div className="w-full space-y-6">
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between p-2">
                    <div>
                      <p className="text-lg font-semibold">
                        {fetch.userName},{" "}
                        {fetch.profile?.dateOfBirth?.slice(0, 10) ?? "-"}
                      </p>

                      <div className="">
                        <p className="text-sm text-gray-700">
                          {t("profileId", {
                            id: formatDisplayProfileId(
                              fetch.profile?.registrationId ??
                                fetch.profileId ??
                                fetch.profile?.id,
                              fetch.profile?.gender
                            ),
                          })}
                        </p>
                      </div>
                    </div>
                    <Button
                      className="mt-4 lg:mt-0 border-2 border-maroon flex items-center gap-2 text-base bg-white text-maroon py-6 px-6 rounded-full font-semibold hover:bg-maroon hover:text-white transition-colors"
                      onClick={() => router.push("/settings/edit-profile")}
                    >
                      <MdOutlineModeEdit /> {t("editProfile")}
                    </Button>
                  </div>

                  <div className="bg-white shadow-md rounded-lg border border-border-soft space-y-6">
                    <div className="bg-soft-rose px-6 py-3 rounded-t-lg">
                      <h2 className="text-lg font-semibold text-maroon">{t("bio")}</h2>
                    </div>
                    <div className="space-y-6 bg-white px-6 ">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                          <p className="text-sm text-gray-700">{t("fieldName")}</p>
                          <p className="text-sm">{fetch.userName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-700">{t("fieldBirthday")}</p>
                          <p className="text-sm">
                            {fetch.profile?.dateOfBirth?.slice(0, 10) ?? "-"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-700">
                            {t("fieldMaritalStatus")}
                          </p>
                          <p className="text-sm">
                            {fetch.profile?.maritalStatus ?? fetch.profile?.martialStatus ?? "-"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-6 bg-soft-rose/50 px-6 py-3 ">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                          <p className="text-sm text-gray-700">{t("fieldCountry")}</p>
                          <p className="text-sm">
                            {fetch.profile?.country === "Not Specified"
                              ? "-"
                              : fetch.profile?.country ?? "-"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-700">{t("fieldCity")}</p>
                          <p className="text-sm">
                            {fetch.profile?.city === "Not Specified"
                              ? "-"
                              : fetch.profile?.city ?? "-"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-700">{t("fieldState")}</p>
                          <p className="text-sm">
                            {fetch.profile?.state === "Not Specified" || !fetch.profile?.state
                              ? "-"
                              : fetch.profile.state}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-700">{t("fieldFieldOfWork")}</p>
                          <p className="text-sm">
                            {fetch.profile?.field_of_work === "Not Specified"
                              ? "-"
                              : fetch.profile?.field_of_work ?? "-"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6 bg-white px-6 ">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                          <p className="text-sm text-gray-700">{t("fieldEnglish")}</p>
                          <p className="text-sm">
                            {fetch.profile?.understand_english === "Not Specified" || !fetch.profile?.understand_english
                              ? "-"
                              : fetch.profile.understand_english}
                          </p>
                        </div>
                        <div className="pb-4">
                          <p className="text-sm text-gray-700">{t("fieldLanguages")}</p>
                          <div className="text-sm flex ">
                            {fetch.profile?.languagesSpoken?.length > 0 ? (
                              <p className="flex gap-x-4 flex-wrap">
                                {fetch.profile.languagesSpoken.map(
                                  (item, index) => (
                                    <span
                                      className="bg-soft-rose text-maroon px-2 py-1 w-fit flex items-center justify-center mx-1 rounded-lg text-sm"
                                      key={index}
                                    >
                                      {item}
                                    </span>
                                  )
                                )}
                              </p>
                            ) : (
                              <p>-</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-6 bg-soft-rose/50 px-6 py-3 ">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                          <p className="text-sm text-gray-700">{t("fieldHeight")}</p>
                          <p className="text-sm">{fetch.profile?.height ?? "-"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-700">{t("fieldReligion")}</p>
                          <p className="text-sm">{fetch.profile?.religion ?? "-"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-700">{t("fieldChildren")}</p>
                          <p className="text-sm">
                            {fetch.profile?.childrenStatus ?? fetch.profile?.children ?? "-"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-700">{t("fieldEducation")}</p>
                          <p className="text-sm">{fetch.profile?.education ?? "-"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-700">{t("fieldProfession")}</p>
                          <p className="text-sm">{fetch.profile?.profession ?? "-"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-700">{t("fieldMotherTongue")}</p>
                          <p className="text-sm">{fetch.profile?.motherTongue ?? "-"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-700">{t("fieldCaste")}</p>
                          <p className="text-sm">{fetch.profile?.caste ?? "-"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-700">{t("fieldSubCaste")}</p>
                          <p className="text-sm">{fetch.profile?.subCaste ?? "-"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-700">{t("fieldDiet")}</p>
                          <p className="text-sm">{fetch.profile?.diet ?? "-"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-700">{t("fieldSmoking")}</p>
                          <p className="text-sm">{fetch.profile?.smoking ?? "-"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-700">{t("fieldDrinking")}</p>
                          <p className="text-sm">{fetch.profile?.drinking ?? "-"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-700">{t("fieldProfileFor")}</p>
                          <p className="text-sm">{fetch.profile?.profileFor ?? "-"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-700">{t("fieldIAm")}</p>
                          <p className="text-sm">{fetch.profile?.iAm ?? "-"}</p>
                        </div>
                      </div>
                    </div>
                    {(fetch.profile?.hobbies?.length ?? 0) > 0 && (
                      <div className="space-y-6 bg-white px-6 py-3">
                        <p className="text-sm text-gray-700">{t("hobbies")}</p>
                        <div className="flex flex-wrap gap-2">
                          {(fetch.profile?.hobbies ?? []).map((item, index) => (
                            <span
                              className="bg-soft-rose text-maroon px-2 py-1 rounded-lg text-sm"
                              key={index}
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {(fetch.profile?.fatherDetails || fetch.profile?.motherDetails || fetch.profile?.siblingsDetails || fetch.profile?.familyDetails) && (
                      <div className="space-y-6 bg-soft-rose/50 px-6 py-3">
                        <h3 className="text-sm font-medium text-maroon">{t("familyDetails")}</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          {fetch.profile?.fatherDetails && (
                            <div>
                              <p className="text-sm text-gray-700">{t("fieldFather")}</p>
                              <p className="text-sm">{fetch.profile.fatherDetails}</p>
                            </div>
                          )}
                          {fetch.profile?.motherDetails && (
                            <div>
                              <p className="text-sm text-gray-700">{t("fieldMother")}</p>
                              <p className="text-sm">{fetch.profile.motherDetails}</p>
                            </div>
                          )}
                          {fetch.profile?.siblingsDetails && (
                            <div>
                              <p className="text-sm text-gray-700">{t("fieldSiblings")}</p>
                              <p className="text-sm">{fetch.profile.siblingsDetails}</p>
                            </div>
                          )}
                          {fetch.profile?.familyDetails && (
                            <div className="sm:col-span-2">
                              <p className="text-sm text-gray-700">{t("fieldFamily")}</p>
                              <p className="text-sm">{fetch.profile.familyDetails}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    {(fetch.profile?.zodiac || fetch.profile?.star || fetch.profile?.birthTime || horoscope?.rasiChart?.length || horoscope?.navamsaChart?.length || horoscope?.image) && (
                      <div className="space-y-6 bg-soft-rose/30 px-6 py-4">
                        <h3 className="text-sm font-medium text-maroon">{t("horoscope")}</h3>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
                          {fetch.profile?.birthTime && (
                            <div>
                              <p className="text-sm text-gray-700">{t("fieldBirthTime")}</p>
                              <p className="text-sm">{fetch.profile.birthTime}</p>
                            </div>
                          )}
                          {fetch.profile?.zodiac && (
                            <div>
                              <p className="text-sm text-gray-700">{t("fieldZodiac")}</p>
                              <p className="text-sm">{fetch.profile.zodiac}</p>
                            </div>
                          )}
                          {fetch.profile?.star && (
                            <div>
                              <p className="text-sm text-gray-700">{t("fieldStar")}</p>
                              <p className="text-sm">{fetch.profile.star}</p>
                            </div>
                          )}
                        </div>
                        {horoscope?.image && (
                          <div className="overflow-hidden rounded-xl border border-border-soft bg-white p-3 shadow-soft">
                            <p className="mb-2 text-sm font-medium text-gray-700">{t("horoscopeImage")}</p>
                            <Image
                              src={`${process.env.NEXT_PUBLIC_IMAGE_URL ?? ""}${horoscope.image.split("uploads/")[1]}`}
                              alt={t("altHoroscope")}
                              width={280}
                              height={360}
                              className="w-full max-w-xs rounded-lg border border-border-soft object-cover"
                            />
                          </div>
                        )}
                        {(horoscope?.rasiChart?.length || horoscope?.navamsaChart?.length) ? (
                          <div className="rounded-2xl border border-border-soft bg-white p-4 shadow-card">
                            <p className="mb-4 text-center text-sm font-medium text-[#191919]">
                              {t("horoscopeCharts")}
                            </p>
                            <div className="flex flex-col items-center gap-6">
                              {horoscope?.rasiChart?.length ? (
                                <HoroscopeChartGrid cells={horoscope.rasiChart} title={t("rasiChartTitle")} />
                              ) : null}
                              {horoscope?.rasiChart?.length && horoscope?.navamsaChart?.length ? (
                                <div className="w-full max-w-xs border-t border-border-soft sm:max-w-sm" />
                              ) : null}
                              {horoscope?.navamsaChart?.length ? (
                                <HoroscopeChartGrid cells={horoscope.navamsaChart} title={t("navamsaChartTitle")} />
                              ) : null}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    )}
                  </div>

                  {/* About Section */}
                  {(fetch.profile?.traits?.length > 0 ||
                    fetch.profile?.interests?.length > 0 ||
                    fetch.profile?.movies?.length > 0 ||
                    fetch.profile?.music?.length > 0) && (
                    <div className="bg-white shadow-md rounded-lg border border-border-soft">
                      <div className="bg-soft-rose px-4 py-2 rounded-t-lg">
                        <h2 className="text-lg font-semibold text-maroon">
                          {t("aboutSection")}
                        </h2>
                      </div>
                        <div className="divide-y divide-gray-200">
                          {fetch.profile?.traits?.length > 0 && (
                            <div className="flex items-center justify-start gap-8 px-6 py-4 flex-wrap">
                              <p className="text-sm font-medium text-gray-700 w-48">
                                {t("traits")}
                              </p>
                              <div className="text-sm">
                                <p className="flex sm:gap-x-4 gap-2">
                                  {fetch.profile.traits.map((item, index) => (
                                    <span
                                      className="bg-soft-rose text-maroon sm:px-2 px-1 py-1 w-fit flex items-center justify-center mx-1 rounded-lg"
                                      key={index}
                                    >
                                      {item}
                                    </span>
                                  ))}
                                </p>
                              </div>
                            </div>
                          )}

                          {fetch.profile?.interests?.length > 0 && (
                            <div className="flex items-center justify-start gap-8 px-6 py-4 flex-wrap">
                              <p className="text-sm font-medium text-gray-700 w-48">
                                {t("interests")}
                              </p>
                              <div className="text-sm">
                                <p className="flex flex-wrap sm:gap-x-4 gap-2">
                                  {fetch.profile.interests.map(
                                    (item, index) => (
                                      <span
                                        className="bg-soft-rose text-maroon w-fit px-2 py-1 flex items-center justify-center mx-1 rounded-lg"
                                        key={index}
                                      >
                                        {item}
                                      </span>
                                    )
                                  )}
                                </p>
                              </div>
                            </div>
                          )}

                          {fetch.profile?.movies?.length > 0 && (
                            <div className="flex items-center justify-start gap-8 px-6 py-4 flex-wrap">
                              <p className="text-sm font-medium text-gray-700 w-48">
                                {t("movies")}
                              </p>
                              <div className="text-sm">
                                <p className="flex sm:gap-x-4 gap-2">
                                  {fetch.profile.movies.map((item, index) => (
                                    <span
                                      className="bg-soft-rose text-maroon w-fit px-2 py-1 flex items-center justify-center mx-1 rounded-lg"
                                      key={index}
                                    >
                                      {item}
                                    </span>
                                  ))}
                                </p>
                              </div>
                            </div>
                          )}

                          {fetch.profile?.music?.length > 0 && (
                            <div className="flex items-center justify-start gap-8 px-6 py-4 flex-wrap">
                              <p className="text-sm font-medium text-gray-700 w-48">
                                {t("music")}
                              </p>
                              <div className="text-sm">
                                <p className="flex gap-x-4">
                                  {fetch.profile.music.map((item, index) => (
                                    <span
                                      className="bg-soft-rose text-maroon w-fit px-2 py-1 flex items-center justify-center mx-1 rounded-lg"
                                      key={index}
                                    >
                                      {item}
                                    </span>
                                  ))}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                  )}

                  {/* Looking for section*/}
                  {(fetch.preferences?.looking_goal?.length > 0 ||
                    (fetch.preferences?.ageRangefrom &&
                      fetch.preferences?.ageRangeTo) ||
                    fetch.preferences?.preferredPersonality !==
                      "Not Specified" ||
                    fetch.preferences?.looking_for) && (
                    <div className="bg-white shadow-md rounded-lg border border-border-soft">
                      <div className="bg-soft-rose px-4 py-2 rounded-t-lg">
                        <h2 className="text-lg font-semibold text-maroon">
                          {t("lookingFor")}
                        </h2>
                      </div>
                      <div className="divide-y divide-gray-200">
                        <div className="flex items-center  justify-start  gap-8 px-6 py-4 flex-wrap">
                          <p className="text-sm font-medium text-gray-700 w-48">
                            {t("goal")}
                          </p>
                          <div className="text-sm flex flex-row">
                            {fetch.preferences?.looking_goal?.length > 0 ? (
                              <p className="flex gap-x-4">
                                {fetch.preferences.looking_goal.map(
                                  (item, index) => (
                                    <span
                                      className="bg-soft-rose text-maroon px-2 w-fit py-1 flex items-center justify-center mx-1 rounded-lg"
                                      key={index}
                                    >
                                      {item}
                                    </span>
                                  )
                                )}
                              </p>
                            ) : (
                              <p>-</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center  justify-start  gap-8 px-6 py-4 flex-wrap">
                          <p className="text-sm font-medium text-gray-700 w-48">
                            {t("ageRange")}
                          </p>
                          <p className="text-sm text-gray-700">
                            {fetch.preferences.ageRangefrom &&
                            fetch.preferences.ageRangeTo
                              ? t("ageRangeFromTo", {
                                  from: String(fetch.preferences.ageRangefrom),
                                  to: String(fetch.preferences.ageRangeTo),
                                })
                              : "-"}
                          </p>
                        </div>
                        <div className="flex items-center  justify-start  gap-8 px-6 py-4 flex-wrap">
                          <p className="text-sm font-medium text-gray-700 w-48 ">
                            {t("personality")}
                          </p>
                          <p className="text-sm">
                            {fetch.preferences.preferredPersonality ===
                              "Not Specified" ||
                            fetch.preferences.preferredPersonality === "_"
                              ? "-"
                              : fetch.preferences.preferredPersonality}
                          </p>
                        </div>
                        <div className="flex items-center  justify-start  gap-8 px-6 py-4 flex-wrap">
                          <p className="text-sm font-medium text-gray-700 w-48">
                            {t("gender")}
                          </p>
                          <p className="text-sm text-gray-700">
                            {fetch.preferences?.looking_for ?? fetch.preferences?.preferredGender ?? "-"}
                          </p>
                        </div>
                      </div>
                    </div>
                    )}
                  
                  {/* Gallery section*/}
                  {gallery.length > 0 && (
                    <div className="bg-white shadow-md rounded-lg border border-border-soft">
                      <div className="bg-soft-rose px-4 py-2 rounded-t-lg">
                        <h2 className="text-lg font-semibold text-maroon">
                          {t("gallery")}
                        </h2>
                      </div>
                      <div className="px-6 py-4">
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                          {gallery.map((item) => (
                            <Image
                              key={item.id}
                              src={`${process.env.NEXT_PUBLIC_IMAGE_URL ?? ""}${item.imageUrl}`}
                              alt={t("altGallery")}
                              width={220}
                              height={220}
                              className="w-full h-40 rounded-lg border border-border-soft object-cover"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Story Section */}
                  {fetch.profile?.bio &&
                    fetch.profile.bio !== "Start typing here.." && (
                      <div className="bg-white shadow-md rounded-lg border border-border-soft">
                        <div className="bg-soft-rose px-4 py-2 rounded-t-lg">
                          <h2 className="text-lg font-semibold text-maroon">
                            {t("story")}
                          </h2>
                        </div>
                        <div className="flex items-center  justify-start  gap-8 px-6 py-4 flex-wrap">
                          <p className="text-sm font-medium text-gray-700 ">
                            {fetch.profile.bio ?? "Start typing here.."}
                          </p>
                        </div>
                      </div>
                    )}

                  <div>
                    <PublishedPostComponent
                      changeMade={changeMade}
                      setChangeMade={setChangeMade}
                      fetch={fetch}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <YourProfileInput setShow={setSelectedInputField} fetch={fetch} />
            </div>
          )}
        </div>
      )}
      <ToastContainer />
    </>
  );
};

export default YourProfile;
