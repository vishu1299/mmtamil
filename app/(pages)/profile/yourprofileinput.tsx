"use client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { TbCameraPlus } from "react-icons/tb";
import { CiCirclePlus } from "react-icons/ci";
import { MdOutlineModeEdit } from "react-icons/md";
import { DualRangeSlider } from "@/components/ui/expension/dual-range-slider";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  interestsData,
  lookingForData,
  moviesData,
  musicData,
  traitsData,
} from "./data";
import { formSchema } from ".";
import { FormErrors, ProfileFormData } from "./type";
import { User } from "./type/type";
import { formatDisplayProfileId } from "./utils/display-profile-id";
import DateSelectorprofile from "./components/dob";
import CountryCitySelector from "./components/countryDrop";
import { updateuserById } from "./api/api";
import { imgFun } from "@/app/_components/image_function/imgFunction";
import imgwomen from "@/public/assets/images/search/images (2).jpg";
import imgmen from "@/public/assets/images/search/images (4).jpg";

// type FormData = z.infer<typeof formSchema>;
const YourProfileInput = ({
  fetch,
  setShow,
}: {
  fetch: User;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [values, setValues] = useState([18, 100]);
  const [from, setFrom] = useState<number | "">(18);
  const [to, setTo] = useState(100);
  useEffect(() => {
    if (fetch) {
      setFrom(Number(fetch.preferences?.ageRangefrom) || 18);
      setTo(Number(fetch.preferences?.ageRangeTo) || 100);
      setValues([
        fetch.preferences?.ageRangefrom ?? 18,
        fetch.preferences?.ageRangeTo ?? 100,
      ]);
    }
  }, []);

  const [formData, setFormData] = useState<ProfileFormData>({
    name: "",

    month: "",
    day: "",
    year: "",

    country: "",
    city: "",
    englishLevel: "",
    languages: [],
    maritalStatus: "SINGLE",
    fieldOfWork: "",
    traits: [],
    interests: [],
    movies: [],
    music: [],
    lookingFor: [],
    ageRange: [18, 100],
    gender: "",
    personality: "",
    story: "",
  });

  const [errors, setErrors] = useState<FormErrors>({
    name: "Name is required",
    month: "Month is required",
    day: "Day is required",
    year: "Year is required",
    country: "Country is required",
    city: "City is required",
    englishLevel: "English level is required",
    languages: "Languages are required",
    maritalStatus: "Marital status is required",
    fieldOfWork: "Field of work is required",
    traits: "You can select up to 3 traits",
    interests: "You can select up to 5 interests",
    movies: "You can select up to 3 movies",
    music: "You can select up to 3 music genres",
    lookingFor: "You can select up to 3 goals",
    ageRange: "Age range is required",
    gender: "Gender is required",
    personality: "Personality is required",
  });
  // Range to select

  const [selecttraits, setTraits] = useState<string[]>([]);
  const [selectInterest, setSelectIntrest] = useState<string[]>([]);
  const [selectedRange, setSelectedRange] = useState<string[]>([]);
  const [selectedMovies, setSelectedMovies] = useState<string[]>([]);
  const [selectedMusic, setSelectedMusic] = useState<string[]>([]);
  const [preview, setPreview] = useState<string | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imageSelected, setImageSelected] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedImages([...selectedImages, ...Array.from(e.target.files)]);
      const filesArray = Array.from(e.target.files);
      const previews = filesArray.map((file) => URL.createObjectURL(file));
      setPhotos([...photos, ...previews]);
    }
  };

  const handlePhotoUpload = () => {
    fileInputRef.current?.click();
  };

  const handleSelectMusic = (music: string) => {
    if (selectedMusic.includes(music)) {
      setSelectedMusic((prev) => prev.filter((item) => item !== music));
      setFormData({ ...formData, music: selectedMusic });
    } else if (selectedMusic.length < 3) {
      setSelectedMusic((prev) => [...prev, music]);
      setFormData({ ...formData, music: selectedMusic });
    } else {
      // alert("You can only select up to 3 items.");
      toast.warning("You can only select up to 3 music genres.");
    }
  };

  const handleSelectMovie = (movie: string) => {
    if (selectedMovies.includes(movie)) {
      setSelectedMovies((prev) => prev.filter((item) => item !== movie));
      setFormData({ ...formData, movies: selectedMovies });
    } else if (selectedMovies.length < 3) {
      setSelectedMovies((prev) => [...prev, movie]);
      setFormData({ ...formData, movies: selectedMovies });
    } else {
      toast.warning("You can only select up to 3 movies.");
    }
  };

  const handleSelectInterest = (interest: string) => {
    if (selectInterest.includes(interest)) {
      setSelectIntrest((prev) => prev.filter((item) => item !== interest));
      setFormData({ ...formData, interests: selectInterest });
    } else if (selectInterest.length < 5) {
      setSelectIntrest((prev) => [...prev, interest]);
      setFormData({ ...formData, interests: selectInterest });
    } else {
      toast.warning("You can only select up to 5 interests.");
    }
  };

  const handleTraitSelect = (trait: string) => {
    if (selecttraits.includes(trait)) {
      setTraits((prev) => prev.filter((item) => item !== trait));
      setFormData({ ...formData, traits: selecttraits });
    } else if (selecttraits.length < 3) {
      setTraits((prev) => [...prev, trait]);
      setFormData({ ...formData, traits: selecttraits });
    } else {
      toast.warning("You can only select up to 3 traits.");
    }
  };

  const handleSelect = (goal: string) => {
    if (selectedRange.includes(goal)) {
      setSelectedRange((prev) => prev.filter((item) => item !== goal));
      setFormData({ ...formData, lookingFor: selectedRange });
    } else if (selectedRange.length < 3) {
      setSelectedRange((prev) => [...prev, goal]);
      setFormData({ ...formData, lookingFor: selectedRange });
    } else {
      toast.warning("You can only select up to 3 goals.");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleLanguageChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      languages: [...formData.languages, value],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(imageSelected);

    // Validate the form data using Zod
    const result = formSchema.safeParse(formData);
    console.log("form data", result);
    let imageUrl = preview;
    if (preview?.startsWith("blob:")) {
      imageUrl = await imgFun(preview);
    }
    if (result.success) {
      console.log("Form Data:", formData);
      toast.info("Saving profile...");

      console.log("saving.........:", formData);
      try {
        const updateddata = {
          userName: formData.name,
          profile: {
            profilePicture: imageUrl,
            dateOfBirth: `${formData.year}-${formData.month}-${formData.day}`,
            country: formData.country,
            city: formData.city,
            understand_english: formData.englishLevel,
            languagesSpoken: formData.languages,
            maritalStatus: formData.maritalStatus,
            field_of_work: formData.fieldOfWork,
            traits: selecttraits,
            interests: selectInterest,
            movies: selectedMovies,
            music: selectedMusic,
            bio: formData.story,
          },
          preferences: {
            looking_goal: formData.lookingFor,
            ageRangefrom: from,
            ageRangeTo: to,
            preferredGender: "MALE",
            preferredPersonality: formData.personality,
          },
        };
        const result = await updateuserById(updateddata);
        console.log("Reponsible", result);
        if (result?.data.code === 201 || result?.data.code === 200) {
          toast.success("Profile updated successfully!");
          setShow(true);
        } else {
          toast.error("Failed to update profile. Please try again.");
        }
      } catch (error) {
        console.log(error);
        toast.error("An error occurred while updating profile.");
      }
      setErrors({});
    } else {
      const newErrors: { [key in keyof ProfileFormData]?: string } = {};
      result.error.errors.forEach((err) => {
        const path = err.path[0] as keyof ProfileFormData;
        newErrors[path] = err.message;
      });
      setErrors(newErrors);
      console.log("Validation errors:", newErrors);

      toast.error("Please fill all input field.");
    }
  };

  // Update dropdowns when the slider changes
  const handleSliderChange = (newValues: number[]) => {
    setValues(newValues);
    setFrom(newValues[0]);
    setTo(newValues[1]);
  };

  const handleFromChange = (value: number | string): void => {
    const newValue = parseInt(value.toString(), 10);
    // setFrom(Number(value));
    setValues([newValue, Math.max(newValue, values[1])]);
  };

  const handleToChange = (value: number | string): void => {
    const newValue = parseInt(value.toString(), 10);
    // setTo(newValue);
    setValues([Math.min(newValue, values[0]), newValue]);
  };

  useEffect(() => {
    if (fetch) {
      console.log("Fetch", fetch);

      setFormData({
        name: fetch.userName ?? "",
        month: fetch.profile?.dateOfBirth?.slice(5, 7) ?? "",
        day: fetch.profile?.dateOfBirth?.slice(8, 10) ?? "",
        year: fetch.profile?.dateOfBirth?.slice(0, 4) ?? "",
        country: fetch.profile?.country ?? "",
        city: fetch.profile?.city ?? "",
        englishLevel: fetch.profile?.understand_english ?? "",
        languages: fetch.profile?.languagesSpoken ?? [],
        maritalStatus: fetch.profile?.maritalStatus ?? fetch.profile?.martialStatus ?? "SINGLE",
        fieldOfWork: fetch.profile?.field_of_work ?? "",
        traits: fetch.profile?.traits ?? [],
        interests: fetch.profile?.interests ?? [],
        movies: fetch.profile?.movies ?? [],
        music: fetch.profile?.music ?? [],
        lookingFor: fetch.preferences?.looking_goal ?? [],
        ageRange: [
          fetch.preferences?.ageRangefrom ?? 18,
          fetch.preferences?.ageRangeTo ?? 100,
        ],
        gender: fetch.preferences?.looking_for ?? "",
        personality: fetch.preferences?.preferredPersonality ?? "",
        story: fetch.profile?.bio ?? "",
      });
      // setFrom(fetch.preferences.ageRangefrom ?? 0)
      // setTo(fetch.preferences.ageRangeTo ?? 2)
      // setValues([fetch.preferences.ageRangefrom??0,fetch.preferences.ageRangeTo??100])
      setSelectIntrest(fetch.profile?.interests ?? []);
      setSelectedMovies(fetch.profile?.movies ?? []);
      setSelectedMusic(fetch.profile?.music ?? []);
      setSelectedRange(fetch.preferences?.looking_goal ?? []);
      setTraits(fetch.profile?.traits ?? []);
      setPreview(fetch.profile?.profilePicture ?? null);
    }
  }, [fetch]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      console.log("Selected File:", file);
      // Create a preview using a Blob URL
      const blobUrl = URL.createObjectURL(file);
      console.log("Generated Blob URL:", blobUrl);
      setPreview(blobUrl);
      setImageSelected(true);
    }
  };

  const handleDeleteImage = (indexToDelete: number) => {
    setPhotos(photos.filter((_, index) => index !== indexToDelete));
    setSelectedImages(
      selectedImages.filter((_, index) => index !== indexToDelete)
    );
  };

  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      {/* {formData &&  */}
      <div className="flex flex-col lg:flex-row gap-4 px-4 lg:px-0">
        <div className="w-full lg:w-[450px]">
          <div className="py-4 bg-[#fdfdfd]">
            <div className="w-full">
              <Image
                src={
                  preview
                    ? preview.startsWith("blob")
                      ? preview
                      : `${process.env.NEXT_PUBLIC_IMAGE_URL}${preview}`
                    : fetch?.profile?.gender === "FEMALE"
                    ? imgwomen
                    : imgmen
                }
                alt="profile"
                width={450}
                height={450}
                className="w-full h-auto object-cover"
              />
            </div>

            {/* Photo upload section */}

            <div className="px-4">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <label
                  htmlFor="picture"
                  className="w-full bg-maroon py-4 text-white text-base rounded-full my-2 flex items-center justify-center gap-2 font-semibold hover:bg-maroon/90 transition-colors"
                >
                  <TbCameraPlus />
                  Take a photo
                </label>
                <input
                  id="picture"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </div>
          </div>
          <div onClick={handlePhotoUpload} className="py-2">
            <p className="text-black font-semibold py-2">Public Photos</p>
            <label htmlFor="public-photos" className="cursor-pointer">
              <div className="font-semibold w-32 h-32 flex items-center flex-col justify-center gap-4 border-2 border-maroon rounded-lg bg-white text-maroon hover:bg-maroon hover:text-white transition-colors cursor-pointer">
                <div className="bg-maroon text-white font-bold text-3xl rounded-full">
                  <CiCirclePlus />
                </div>
                <p>Add photo</p>
              </div>
            </label>

            <input
              id="public-photos"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {/* Preview the uploaded images */}
          <div className="mt-4 flex gap-2 flex-wrap">
            {photos.map((photo, index) => (
              <div key={index} className="relative">
                <Image
                  src={photo}
                  alt={`Uploaded ${index}`}
                  width={96}
                  height={96}
                  className="w-24 h-24 object-cover rounded"
                />
                <button
                  onClick={() => handleDeleteImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full space-y-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between p-2">
            <div>
              <p className="text-lg font-semibold">
                {fetch.userName}, {fetch.profile?.dateOfBirth?.slice(0, 10) ?? "-"}
              </p>
              <div className="">
                <p className="text-sm text-gray-700">
                  Profile ID:{" "}
                  {formatDisplayProfileId(
                    fetch.profile?.registrationId ??
                      fetch.profileId ??
                      fetch.profile?.id,
                    fetch.profile?.gender
                  )}
                </p>
              </div>
            </div>
            <Button
              onClick={() => setShow(true)}
              className="mt-4 lg:mt-0 border-2 border-maroon flex items-center gap-2 text-base bg-white text-maroon py-6 px-6 rounded-full font-semibold hover:bg-maroon hover:text-white transition-colors"
            >
              <MdOutlineModeEdit /> Edit Profile
            </Button>
          </div>
          <form action="">
            <div className="bg-white shadow-md rounded-md">
              {/* Header Section */}
              <div className="bg-soft-rose px-6 py-3 rounded-t-lg">
                <h2 className="text-lg font-semibold text-maroon">Bio</h2>
              </div>

              {/* Form Sections */}
              <div className="divide-y divide-gray-100">
                {/* Section 1: Name and Birthday */}
                <div className="space-y-6 bg-white px-6 py-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                    {/* Name Field */}
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm text-gray-700  mb-1"
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your name"
                        className=" w-full p-2 border border-gray-300 rounded-md shadow-sm "
                      />
                      {formData.name == "" ? (
                        <p className="text-red-500 text-sm">{errors.name}</p>
                      ) : (
                        ""
                      )}
                    </div>

                    {/* Birthday Field */}
                    <div>
                      <label
                        htmlFor="birthday"
                        className="block text-sm text-gray-700  mb-1"
                      >
                        Birthday
                      </label>

                      <DateSelectorprofile
                        formdata={formData}
                        setFormData={setFormData}
                      />
                      <div className="flex  justify-between items-center">
                        {formData.month == "" ? (
                          <p className="text-red-500 text-sm">{errors.month}</p>
                        ) : (
                          ""
                        )}

                        {formData.day == "" ? (
                          <p className="text-red-500 text-sm">{errors.day}</p>
                        ) : (
                          ""
                        )}

                        {formData.year == "" ? (
                          <p className="text-red-500 text-sm">{errors.year}</p>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {formData && (
                  <CountryCitySelector
                    formdata={formData}
                    setFormdata={setFormData}
                  />
                )}
                {/* Section 3: English Level and Languages */}
                <div className="space-y-6 px-6 py-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                    {/* English Level Field */}
                    <div>
                      <label
                        htmlFor="englishLevel"
                        className="block text-sm text-gray-700 mb-1"
                      >
                        English Level
                      </label>
                      {formData && (
                        <select
                          className="w-full p-2 border border-gray-300 rounded-md shadow-sm "
                          value={formData.englishLevel}
                          onChange={handleInputChange}
                          name="englishLevel"
                        >
                          <option value="">Select your Level</option>
                          <option value="_">_</option>
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced"> Advanced</option>
                          <option value="Beginner">Beginner</option>
                          <option value="native">native</option>
                        </select>
                      )}

                      {formData.englishLevel == "" ? (
                        <p className="text-red-500 text-sm">
                          {errors.englishLevel}
                        </p>
                      ) : (
                        ""
                      )}
                    </div>

                    {/* Languages Field */}
                    {/* // Modify the select element and its handling */}
                    <div>
                      <label
                        htmlFor="languages"
                        className="block text-sm text-gray-700 mb-1"
                      >
                        Languages
                      </label>
                      <select
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm "
                        value="" // Set to empty string since we handle selection separately
                        onChange={handleLanguageChange}
                        name="languages"
                      >
                        <option value="">Select other languages</option>

                        <option value="English">English</option>
                        <option value="Mandarin Chinese">
                          Mandarin Chinese
                        </option>
                        <option value="Spanish">Spanish</option>
                        <option value="Hindi">Hindi</option>
                        <option value="French">French</option>
                        <option value="Russian">Russian</option>
                        <option value="Portuguese">Portuguese</option>
                        <option value="Arabic">Arabic</option>
                        <option value="Nepali">Nepali</option>
                        <option value="Bengali">Bengali</option>
                      </select>
                      {formData.languages && (
                        <div>
                          {formData.languages.length > 0 && (
                            <div className="flex my-3  gap-2 flex-wrap ">
                              {formData.languages.map((item, index) => (
                                <div
                                  key={index}
                                  className="bg-soft-rose text-maroon gap-x-2 py-0.5 mx-2 w-fit flex rounded-lg text-sm px-3"
                                >
                                  {item}{" "}
                                  <span
                                    onClick={() => {
                                      setFormData({
                                        ...formData,
                                        languages: formData.languages.filter(
                                          (stop) => stop !== item
                                        ),
                                      });
                                    }}
                                  >
                                    X
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {formData.languages.length < 0 ? (
                        <p className="text-red-500 text-sm">
                          {errors.languages}
                        </p>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </div>

                {/* Section 4: Marital Status and Field of Work */}
                <div className="space-y-6 px-6 py-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                    {/* Marital Status Field */}
                    <div>
                      <label
                        htmlFor="maritalStatus"
                        className="block text-sm text-gray-700 mb-1"
                      >
                        Marital Status
                      </label>
                      <select
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm "
                        value={formData.maritalStatus}
                        onChange={handleInputChange}
                        name="maritalStatus"
                      >
                        <option value={"SINGLE"}>Not married</option>
                        <option value="MARRIED">Married</option>
                        <option value="DIVORCED">Divorced</option>
                        <option value="WIDOW">Widowed</option>
                      </select>

                      {formData.maritalStatus == "" ? (
                        <p className="text-red-500 text-sm">
                          {errors.maritalStatus}
                        </p>
                      ) : (
                        ""
                      )}
                    </div>

                    {/* Field of Work */}
                    <div>
                      <label
                        htmlFor="fieldOfWork"
                        className="block text-sm text-gray-700 mb-1"
                      >
                        Field of Work
                      </label>
                      <select
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm "
                        value={formData.fieldOfWork}
                        onChange={handleInputChange}
                        name="fieldOfWork"
                      >
                        <option value={"_"}>_</option>
                        <option value={"Communication"}>Communication</option>
                        <option value={"Engineer"}>Engineer</option>
                        <option value={"Healthcare"}>Healthcare</option>
                      </select>

                      {formData.fieldOfWork == "" ? (
                        <p className="text-red-500 text-sm">
                          {errors.fieldOfWork}
                        </p>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white shadow-md rounded-lg border border-border-soft">
              <div className="bg-soft-rose px-4 py-2 rounded-t-lg">
                <h2 className="text-lg font-semibold text-maroon">About</h2>
              </div>

              <div className="px-4 py-2">
                <p className="text-sm text-gray-700">Traits</p>
                <p className="text-sm text-gray-700">
                  You may select up to 3 options
                </p>
              </div>

              <div className="px-4 py-2 pb-6">
                <div className="flex flex-wrap gap-4">
                  {traitsData.map((trait, index) => (
                    <div
                      key={index}
                      className={`border rounded-3xl p-3 text-center transition cursor-pointer ${
                        selecttraits.includes(trait)
                          ? "bg-soft-rose border-2 border-maroon"
                          : "bg-gray-100 hover:bg-soft-rose/50"
                      }`}
                      onClick={() => handleTraitSelect(trait)}
                    >
                      <p
                        className={` ${
                          selecttraits.includes(trait)
                            ? "text-maroon"
                            : "text-gray-700"
                        }`}
                      >
                        {trait}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white border-t  pb-4">
                {/* Header Section */}
                <div className="bg-soft-rose px-4 py-2 rounded-t-lg">
                  <h2 className="text-lg font-semibold text-maroon">
                    Interests
                  </h2>
                </div>

                {/* Description Section */}
                <div className="px-4 py-2">
                  <p className="text-sm text-gray-700">
                    You may select up to 5 options
                  </p>
                </div>

                {/* Interests Section */}
                <div className="px-4 py-2">
                  <div className="flex flex-wrap gap-4">
                    {interestsData.map((interest, index) => (
                      <div
                        key={index}
                      className={`border rounded-3xl p-3 text-center transition cursor-pointer ${
                            selectInterest.includes(interest)
                            ? "bg-soft-rose border-2 border-maroon"
                            : "bg-gray-100 hover:bg-soft-rose/50"
                        }`}
                        onClick={() => handleSelectInterest(interest)}
                      >
                        <p
                          className={` ${
                            selectInterest.includes(interest)
                              ? "text-maroon"
                              : "text-gray-700"
                          }`}
                        >
                          {interest}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="bg-white  border-t pb-4">
                {/* Header Section */}
                <div className="bg-soft-rose px-4 py-2 rounded-t-lg">
                  <h2 className="text-lg font-semibold text-maroon">
                    Movies
                  </h2>
                </div>

                {/* Description Section */}
                <div className="px-4 py-2">
                  <p className="text-sm text-gray-700">
                    You may select up to 3 options
                  </p>
                </div>

                {/* Movies Section */}
                <div className="px-4 py-2 pb-4 ">
                  <div className="flex flex-wrap gap-4">
                    {moviesData.map((movie, index) => (
                      <div
                        key={index}
                      className={`border rounded-3xl p-3 text-center transition cursor-pointer ${
                            selectedMovies.includes(movie)
                            ? "bg-soft-rose border-2 border-maroon"
                            : "bg-gray-100 hover:bg-soft-rose/50"
                        }`}
                        onClick={() => handleSelectMovie(movie)}
                      >
                        <p
                          className={`  ${
                            selectedMovies.includes(movie)
                              ? "text-maroon"
                              : "text-gray-700"
                          }`}
                        >
                          {movie}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="bg-white  border-t  pb-4">
                {/* Header Section */}
                <div className="bg-soft-rose px-4 py-2 rounded-t-lg">
                  <h2 className="text-lg font-semibold text-maroon">Music</h2>
                </div>

                {/* Description Section */}
                <div className="px-4 py-2">
                  <p className="text-sm text-gray-700">
                    You may select up to 3 options
                  </p>
                </div>

                {/* Music Section */}
                <div className="px-4 py-2">
                  <div className="flex flex-wrap gap-4">
                    {musicData.map((music, index) => (
                      <div
                        key={index}
                      className={`border rounded-3xl p-3 text-center transition cursor-pointer ${
                            selectedMusic.includes(music)
                            ? "bg-soft-rose border-2 border-maroon"
                            : "bg-gray-100 hover:bg-soft-rose/50"
                        }`}
                        onClick={() => handleSelectMusic(music)}
                      >
                        <p
                          className={`${
                            selectedMusic.includes(music)
                              ? "text-maroon"
                              : "text-gray-700"
                          }`}
                        >
                          {music}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white shadow-md rounded-lg border border-border-soft mt-5">
              {/* Header Section */}
              <div className="bg-soft-rose px-4 py-2 rounded-t-lg">
                <h2 className="text-lg font-semibold text-maroon">
                  Looking for
                </h2>
              </div>

              {/* Description Section */}
              <div className="px-4 py-2">
                <p className="text-sm text-gray-700">
                  You may select up to 3 options
                </p>
              </div>

              {/* Goal Section */}
              <div className="px-4 py-2">
                <div className="flex flex-wrap gap-6 justify-center sm:justify-start">
                  {lookingForData.map((goal, index) => (
                    <div
                      key={index}
                      className={`border rounded-3xl p-3 text-center cursor-pointer transition ${
                        selectedRange.includes(goal)
                          ? "bg-soft-rose border-2 border-maroon"
                          : "bg-gray-100 hover:bg-soft-rose/50"
                      }`}
                      onClick={() => handleSelect(goal)}
                    >
                      <p
                        className={` ${
                          selectedRange.includes(goal)
                            ? "text-maroon"
                            : "text-gray-700"
                        }`}
                      >
                        {goal}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="px-4 py-2">
                <h2 className="text-lg font-semibold text-gray-700 mb-3">
                  Age range
                </h2>
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <span className="text-gray-600">From</span>
                  <Select value={`${from}`} onValueChange={handleFromChange}>
                    <SelectTrigger className="w-full sm:w-32 px-8 border">
                      <SelectValue placeholder="From" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Age</SelectLabel>
                        {[...Array(83)].map((_, i) => (
                          <SelectItem key={i} value={`${i + 18}`}>
                            {i + 18}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>

                  <div className="w-full sm:px-10 py-4">
                    <DualRangeSlider
                      className="text-maroon"
                      label={(value) => value}
                      value={values}
                      onValueChange={handleSliderChange}
                      min={18}
                      max={100}
                      step={1}
                    />
                  </div>

                  <Select value={`${to}`} onValueChange={handleToChange}>
                    <SelectTrigger className="w-full sm:w-32 px-8 border">
                      <SelectValue placeholder="To" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Age</SelectLabel>
                        {[...Array(83)].map((_, i) => (
                          <SelectItem key={i} value={`${i + 18}`}>
                            {i + 18}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {/* Gender and Personality Section */}
              <div className="px-4 lg:pb-6 py-4">
                <div className="grid sm:grid-cols-2 gap-4 grid-cols-1">
                  {/* Gender Section */}
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Gender</p>
                    <select
                      className="w-full border border-gray-300 rounded-md p-2 text-gray-600"
                      value={formData.gender}
                      onChange={handleInputChange}
                      name="gender"
                    >
                      <option value="FEMALE">
                        I am a man looking for a woman
                      </option>
                      <option value="MALE">I am a man looking for a man</option>
                      <option value="ALL">
                        I am a man looking for everyone
                      </option>
                      <option value="MALE">
                        I am a woman looking for a man
                      </option>
                      <option value="FEMALE">
                        I am a woman looking for a woman
                      </option>
                      <option value="ALL">
                        I am a woman looking for everyone
                      </option>
                    </select>

                    {formData.gender === "" ? (
                      <p className="text-red-500 text-sm ">{errors.gender}</p>
                    ) : (
                      ""
                    )}
                  </div>

                  {/* Personality Section */}
                  <div>
                    <h2 className=" text-sm text-gray-600 mb-2">Personality</h2>
                    <select
                      className="w-full border border-gray-300 rounded-md p-2 text-gray-600"
                      value={formData.personality}
                      onChange={handleInputChange}
                      name="personality"
                    >
                      <option value={"_"}>_</option>
                      <option value={"Career Chaser"}>Career chaser</option>
                      <option value="Adventurer">Adventurer</option>
                      <option value="Creative Thinker">Creative thinker</option>
                      <option value="Family focused">Family-focused</option>
                    </select>

                    {formData.personality === "" ? (
                      <p className="text-red-500 text-sm">
                        {errors.personality}
                      </p>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white shadow-md rounded-md mt-4 ">
              {/* Header Section */}
              <div className="bg-soft-rose px-4 py-2 rounded-t-lg">
                <h2 className="text-lg font-semibold text-maroon">STORY</h2>
              </div>

              {/* Input Section */}
              <div className="px-6 py-4">
                <textarea
                  value={formData.story}
                  onChange={(e) =>
                    setFormData({ ...formData, story: e.target.value })
                  }
                  placeholder="Start typing here..."
                  className="w-full h-32 border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-700 placeholder-gray-400 focus:border-2 focus:border-maroon focus:outline-none"
                ></textarea>
              </div>
            </div>
            {/* <div className="bg-white shadow-md rounded-md mt-4 ">
              <CreatePostComponent/>
            </div> */}
            <div className="bg-white shadow-md lg:bottom-0 bottom-8 rounded-md p-6 sticky py-6">
              <div className="flex justify-center space-x-6">
                <button
                  className="px-10 py-2.5 text-maroon border-2 border-maroon rounded-full font-semibold hover:bg-soft-rose transition-colors"
                  type="button"
                  aria-label="Cancel"
                  onClick={() => setShow(true)}
                >
                  Cancel
                </button>
                <button
                  className="px-10 py-2.5 text-white bg-maroon border-2 border-maroon rounded-full font-semibold hover:bg-maroon/90 transition-colors"
                  type="button"
                  aria-label="Save"
                  onClick={handleSubmit}
                >
                  Save
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      {/* } */}
    </div>
  );
};

export default YourProfileInput;
