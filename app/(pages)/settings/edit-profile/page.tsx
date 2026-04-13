"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoChevronBack } from "react-icons/io5";
import { FiEdit2, FiUser, FiMapPin, FiCalendar, FiTrash2 } from "react-icons/fi";
import { GiBodyHeight } from "react-icons/gi";
import { IoMaleFemale } from "react-icons/io5";
import { BsCurrencyRupee } from "react-icons/bs";
import { MdOutlineTempleHindu, MdWorkOutline } from "react-icons/md";
import { HiOutlineMicrophone } from "react-icons/hi";
import { TbStatusChange } from "react-icons/tb";
import {
  FaGraduationCap,
  FaBuilding,
  FaUtensils,
  FaSmokingBan,
  FaHeart,
  FaGlobeAsia,
  FaMapMarkerAlt,
  FaCity,
} from "react-icons/fa";
import { RiParentLine } from "react-icons/ri";
import { HiOutlineUsers } from "react-icons/hi";
import { BsCamera } from "react-icons/bs";
import { getuserByid } from "../../profile/api/api";
import {
  updateUserDetails,
  UpdateUserDetailsPayload,
  getGallery,
  uploadGalleryImages,
  uploadProfilePicture,
  deleteGalleryImage,
} from "../api/api";
import EditSectionModal, {
  SectionType,
  ProfileData as ModalProfileData,
} from "./_components/edit-section-modal";
import PictureModalViewer from "./_components/picture-modal-viewer";
interface ProfileData {
  name: string;
  showName: boolean;
  profilePicture: string;
  height: string;
  gender: string;
  location: string;
  annualIncome: string;
  dob: string;
  status: string;
  religion: string;
  caste: string;
  subCaste: string;
  motherTongue: string;
  qualification: string;
  profession: string;
  company: string;
  diet: string;
  smokingDrinking: string;
  aboutMe: string;
  hobbies: string;
  country: string;
  state: string;
  city: string;
  fatherOccupation: string;
  motherOccupation: string;
  siblings: string;
  photoCount: number;
}

interface DetailRow {
  icon: React.ReactNode;
  label: string;
  value: string;
}

interface GalleryPhotoView {
  id: number;
  url: string;
}

const DetailItem = ({ icon, label, value }: DetailRow) => (
  <div className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
    <span className="text-maroon/70 shrink-0 w-8 flex justify-center">{icon}</span>
    <div className="flex-1 min-w-0">
      <span className="text-sm text-[#6B6B6B] block">{label}</span>
      <span className="text-sm text-[#2C2C2C] font-medium">{value || "—"}</span>
    </div>
  </div>
);

/** Map display values to API enum format */
const toMaritalStatus = (s: string) => {
  const map: Record<string, string> = {
    "Never Married": "NEVER_MARRIED",
    Divorced: "DIVORCED",
    Widowed: "WIDOWED",
    Separated: "SEPARATED",
  };
  return map[s] || s.toUpperCase().replace(/\s+/g, "_");
};

const toReligion = (s: string) =>
  s ? s.toUpperCase().replace(/\s+/g, "_") : "";

const toGender = (s: string) =>
  s ? (s.toLowerCase() === "male" ? "MALE" : "FEMALE") : "";

/** Parse display DOB (e.g. "28 December 1994") to ISO string */
const dobToISO = (dob: string): string | undefined => {
  if (!dob) return undefined;
  const d = new Date(dob);
  return isNaN(d.getTime()) ? undefined : d.toISOString();
};

interface SectionCardProps {
  title: string;
  rows: DetailRow[];
  onEdit: () => void;
}

const SectionCard = ({ title, rows, onEdit }: SectionCardProps) => (
  <div className="group bg-white border border-border-soft rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-maroon/10 transition-all duration-200">
    <div className="flex items-center justify-between mb-1">
      <h3 className="font-playfair font-semibold text-base text-[#2C2C2C]">{title}</h3>
      <button
        onClick={onEdit}
        className="w-9 h-9 rounded-xl bg-soft-rose flex items-center justify-center hover:bg-maroon hover:text-white transition-all duration-200 text-maroon group-hover:scale-105"
      >
        <FiEdit2 className="text-sm" />
      </button>
    </div>
    <div className="mt-2 -mx-1">
      {rows.map((row, i) => (
        <DetailItem key={i} icon={row.icon} label={row.label} value={row.value} />
      ))}
    </div>
  </div>
);

const EditProfilePage = () => {
  const router = useRouter();
  const t = useTranslations("editProfilePage");
  const [profile, setProfile] = useState<ProfileData>({
    name: "Aravind Subramanian",
    showName: true,
    profilePicture:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop&crop=face",
    height: "5'8\"",
    gender: "Male",
    location: "India, Chennai, Tamil Nadu",
    annualIncome: "₹ 4-5 Lakh",
    dob: "28 December 1994",
    status: "Never Married",
    religion: "Hindu",
    caste: "Brahmin",
    subCaste: "Iyengar",
    motherTongue: "Tamil",
    qualification: "MBA",
    profession: "Software Engineer",
    company: "Brichon Business Solutions",
    diet: "Vegetarian",
    smokingDrinking: "No",
    aboutMe: "",
    hobbies: "Music, Travel",
    country: "India",
    state: "Tamil Nadu",
    city: "Chennai",
    fatherOccupation: "Business",
    motherOccupation: "Home Maker",
    siblings: "1 Brother, 1 Sister",
    photoCount: 4,
  });

  const [editSection, setEditSection] = useState<SectionType | null>(null);
  const [rawUser, setRawUser] = useState<Record<string, unknown> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [galleryPhotos, setGalleryPhotos] = useState<GalleryPhotoView[]>([]);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [uploadingProfilePicture, setUploadingProfilePicture] = useState(false);
  const [deletingPhotoId, setDeletingPhotoId] = useState<number | null>(null);
  const galleryFileInputRef = useRef<HTMLInputElement>(null);
  const profilePicInputRef = useRef<HTMLInputElement>(null);

  const refreshGallery = async (uid: number) => {
    const { gallery } = await getGallery(uid);
    const baseUrl = process.env.NEXT_PUBLIC_IMAGE_URL || "";
    const photos = gallery.map((item) => ({
      id: item.id,
      url: item.imageUrl.startsWith("http")
        ? item.imageUrl
        : `${baseUrl}${item.imageUrl}`,
    }));
    setGalleryPhotos(photos);
    setProfile((prev) => ({
      ...prev,
      photoCount: 1 + photos.length,
    }));
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await getuserByid();
        const user = result?.data?.data ?? result?.data;
        if (user) {
          setRawUser(user);
          const uid =
            typeof user.id === "number"
              ? user.id
              : typeof user.id === "string"
                ? parseInt(user.id, 10)
                : NaN;
          if (!Number.isNaN(uid)) setUserId(uid);
          const dob = user.profile?.dateOfBirth
            ? new Date(user.profile.dateOfBirth).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })
            : profile.dob;

          const formatField = (val: string | null | undefined) =>
            val
              ? val.charAt(0).toUpperCase() +
                val.slice(1).toLowerCase().replace(/_/g, " ")
              : "";

          const smokingDrinking =
            user.profile?.smoking || user.profile?.drinking
              ? [user.profile.smoking, user.profile.drinking]
                  .filter(Boolean)
                  .join(" / ")
              : "";

          setProfile((prev) => ({
            ...prev,
            name: user.userName || prev.name,
            profilePicture: user.profile?.profilePicture
              ? user.profile.profilePicture.startsWith("http")
                ? user.profile.profilePicture
                : `${process.env.NEXT_PUBLIC_IMAGE_URL}${user.profile.profilePicture.replace(/^watermarked_images/, "profile-pic")}`
              : prev.profilePicture,
            height: user.profile?.height || prev.height,
            gender: formatField(user.profile?.gender) || prev.gender,
            dob: dob,
            status:
              formatField(user.profile?.martialStatus ?? user.profile?.maritalStatus) ||
              prev.status,
            religion: formatField(user.profile?.religion) || prev.religion,
            caste: user.profile?.caste || prev.caste,
            subCaste: user.profile?.subCaste || prev.subCaste,
            motherTongue:
              user.profile?.languagesSpoken?.[0] || prev.motherTongue,
            qualification: user.profile?.education || prev.qualification,
            profession: user.profile?.field_of_work || user.profile?.profession || prev.profession,
            company: user.profile?.company || prev.company,
            diet: formatField(user.profile?.diet) || prev.diet,
            smokingDrinking: smokingDrinking || prev.smokingDrinking,
            aboutMe: user.profile?.bio || prev.aboutMe,
            hobbies:
              Array.isArray(user.profile?.hobbies)
                ? user.profile.hobbies.join(", ")
                : user.profile?.hobbies || prev.hobbies,
            country: user.profile?.country || prev.country,
            state: user.profile?.state || prev.state,
            city: user.profile?.city || prev.city,
            location:
              [user.profile?.city, user.profile?.country]
                .filter(Boolean)
                .join(", ") || prev.location,
            fatherOccupation:
              user.profile?.fatherDetails || prev.fatherOccupation,
            motherOccupation:
              user.profile?.motherDetails || prev.motherOccupation,
            siblings: user.profile?.siblingsDetails || prev.siblings,
          }));
          if (!Number.isNaN(uid)) {
            await refreshGallery(uid);
          }
        }
      } catch {
        // API unavailable, use dummy data
      }
    };
    fetchUser();
  }, []);

  const openGalleryPicker = () => {
    if (!userId) {
      toast.error(t("toastProfileLoadError"));
      return;
    }
    galleryFileInputRef.current?.click();
  };

  const openProfilePicturePicker = () => {
    if (!userId) {
      toast.error(t("toastProfileLoadError"));
      return;
    }
    profilePicInputRef.current?.click();
  };

  const resolveProfilePictureUrl = (payload: unknown): string | undefined => {
    const root = (payload as { data?: unknown })?.data ?? payload;
    const src =
      (root as { profilePicture?: unknown })?.profilePicture ??
      (root as { imageUrl?: unknown })?.imageUrl ??
      ((root as { data?: { profilePicture?: unknown } })?.data?.profilePicture ??
        (root as { data?: { imageUrl?: unknown } })?.data?.imageUrl);

    if (typeof src !== "string" || !src.trim()) return undefined;
    if (src.startsWith("http")) return src;
    return `${process.env.NEXT_PUBLIC_IMAGE_URL || ""}${src.replace(
      /^watermarked_images/,
      "profile-pic"
    )}`;
  };

  const handleProfilePictureSelected = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (file.size > 2 * 1024 * 1024 * 1024) {
      toast.error(t("toastImageTooLargeProfile"));
      return;
    }

    setUploadingProfilePicture(true);
    toast.info(t("toastUploadingProfilePic"));
    try {
      const res = await uploadProfilePicture(file);
      const uploadedUrl = resolveProfilePictureUrl(res);
      if (uploadedUrl) {
        setProfile((prev) => ({ ...prev, profilePicture: uploadedUrl }));
        setRawUser((prev) =>
          prev
            ? {
                ...prev,
                profile: {
                  ...(prev.profile && typeof prev.profile === "object"
                    ? (prev.profile as Record<string, unknown>)
                    : {}),
                  profilePicture: uploadedUrl,
                },
              }
            : prev
        );
      } else if (userId) {
        const result = await getuserByid();
        const user = result?.data?.data ?? result?.data;
        const pic = user?.profile?.profilePicture;
        if (typeof pic === "string" && pic.trim()) {
          const normalized = pic.startsWith("http")
            ? pic
            : `${process.env.NEXT_PUBLIC_IMAGE_URL || ""}${pic.replace(
                /^watermarked_images/,
                "profile-pic"
              )}`;
          setProfile((prev) => ({ ...prev, profilePicture: normalized }));
        }
      }
      toast.success(t("toastUploadProfilePicOk"));
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : t("toastUploadProfilePicFail");
      toast.error(msg);
    } finally {
      setUploadingProfilePicture(false);
    }
  };

  const handleGalleryFilesSelected = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    e.target.value = "";
    if (!files.length || !userId) return;

    const tooLarge = files.some((f) => f.size > 2 * 1024 * 1024 * 1024);
    if (tooLarge) {
      toast.error(t("toastImageTooLargeGallery"));
      return;
    }

    setUploadingPhotos(true);
    toast.info(t("toastUploadingPhotos"));
    try {
      await uploadGalleryImages(files);
      toast.success(t("toastUploadGalleryOk"));
      await refreshGallery(userId);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : t("toastUploadGalleryFail");
      toast.error(msg);
    } finally {
      setUploadingPhotos(false);
    }
  };

  const handleDeleteGalleryPhoto = async (imageId: number) => {
    if (!userId) return;
    const confirmed = window.confirm(
      t("confirmDeletePhoto")
    );
    if (!confirmed) return;

    setDeletingPhotoId(imageId);
    try {
      await deleteGalleryImage(imageId);
      toast.success(t("toastDeletePhotoOk"));
      await refreshGallery(userId);
      setViewerIndex((prev) => {
        if (prev === null || prev === 0) return prev;
        const deletedViewerIndex = galleryPhotos.findIndex((p) => p.id === imageId) + 1;
        if (deletedViewerIndex <= 0) return prev;
        if (prev > deletedViewerIndex) return prev - 1;
        if (prev === deletedViewerIndex) return null;
        return prev;
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : t("toastDeletePhotoFail");
      toast.error(msg);
    } finally {
      setDeletingPhotoId(null);
    }
  };

  const buildUpdatePayload = (
    merged: ProfileData
  ): UpdateUserDetailsPayload => ({
    userName: merged.name,
    profile: {
      ...(rawUser?.profile && typeof rawUser.profile === "object"
        ? (rawUser.profile as Record<string, unknown>)
        : {}),
      country: merged.country || undefined,
      city: merged.city || undefined,
      state: merged.state || undefined,
      gender: toGender(merged.gender) || undefined,
      maritalStatus: toMaritalStatus(merged.status) || undefined,
      dateOfBirth: dobToISO(merged.dob),
      motherTongue: merged.motherTongue || undefined,
      caste: merged.caste || undefined,
      subCaste: merged.subCaste || undefined,
      company: merged.company || undefined,
      height: merged.height || undefined,
      education: merged.qualification || undefined,
      religion: toReligion(merged.religion) || undefined,
      profession: merged.profession || undefined,
      diet: merged.diet || undefined,
      smoking: merged.smokingDrinking || undefined,
      drinking: merged.smokingDrinking || undefined,
      bio: merged.aboutMe || undefined,
      hobbies: merged.hobbies
        ? merged.hobbies.split(",").map((s) => s.trim()).filter(Boolean)
        : undefined,
      fatherDetails: merged.fatherOccupation || undefined,
      motherDetails: merged.motherOccupation || undefined,
      siblingsDetails: merged.siblings || undefined,
    },
  });

  const handleSectionSave = async (updated: Partial<ModalProfileData>) => {
    const merged = { ...profile, ...updated };
    setProfile(merged);

    setIsSaving(true);
    toast.info(t("toastSavingProfile"));
    try {
      const payload = buildUpdatePayload(merged);
      const result = await updateUserDetails(payload);
      const code = result?.code ?? result?.status;
      if (code === 200 || code === 201) {
        toast.success(t("toastProfileUpdateOk"));
        setRawUser((prev) =>
          prev
            ? {
                ...prev,
                userName: merged.name,
                profile: {
                  ...(prev.profile && typeof prev.profile === "object"
                    ? (prev.profile as Record<string, unknown>)
                    : {}),
                  ...payload.profile,
                },
              }
            : prev
        );
      } else {
        toast.error(t("toastProfileUpdateFail"));
      }
    } catch {
      toast.error(t("toastProfileUpdateFail"));
    } finally {
      setIsSaving(false);
    }
  };

  const modalData: ModalProfileData = {
    name: profile.name,
    showName: profile.showName,
    height: profile.height,
    gender: profile.gender,
    location: profile.location,
    annualIncome: profile.annualIncome,
    dob: profile.dob,
    status: profile.status,
    religion: profile.religion,
    caste: profile.caste,
    subCaste: profile.subCaste,
    motherTongue: profile.motherTongue,
    qualification: profile.qualification,
    profession: profile.profession,
    company: profile.company,
    diet: profile.diet,
    smokingDrinking: profile.smokingDrinking,
    aboutMe: profile.aboutMe,
    hobbies: profile.hobbies,
    country: profile.country,
    state: profile.state,
    city: profile.city,
    fatherOccupation: profile.fatherOccupation,
    motherOccupation: profile.motherOccupation,
    siblings: profile.siblings,
  };

  const basicDetails: DetailRow[] = [
    { icon: <FiUser />, label: t("rowName"), value: profile.name },
    { icon: <GiBodyHeight />, label: t("rowHeight"), value: profile.height },
    { icon: <IoMaleFemale />, label: t("rowGender"), value: profile.gender },
    { icon: <FiMapPin />, label: t("rowLocation"), value: profile.location },
    {
      icon: <BsCurrencyRupee />,
      label: t("rowAnnualIncome"),
      value: profile.annualIncome,
    },
    { icon: <FiCalendar />, label: t("rowDob"), value: profile.dob },
    { icon: <TbStatusChange />, label: t("rowStatus"), value: profile.status },
  ];

  const religionCommunity: DetailRow[] = [
    {
      icon: <MdOutlineTempleHindu />,
      label: t("rowReligion"),
      value: profile.religion,
    },
    { icon: <HiOutlineUsers />, label: t("rowCaste"), value: profile.caste },
    { icon: <HiOutlineUsers />, label: t("rowSubCaste"), value: profile.subCaste },
    {
      icon: <HiOutlineMicrophone />,
      label: t("rowMotherTongue"),
      value: profile.motherTongue,
    },
  ];

  const educationCareer: DetailRow[] = [
    {
      icon: <FaGraduationCap />,
      label: t("rowQualification"),
      value: profile.qualification,
    },
    { icon: <MdWorkOutline />, label: t("rowProfession"), value: profile.profession },
    { icon: <FaBuilding />, label: t("rowCompany"), value: profile.company },
  ];

  const lifestyle: DetailRow[] = [
    { icon: <FaUtensils />, label: t("rowDiet"), value: profile.diet },
    {
      icon: <FaSmokingBan />,
      label: t("rowSmokingDrinking"),
      value: profile.smokingDrinking,
    },
    { icon: <FaHeart />, label: t("rowHobbies"), value: profile.hobbies },
  ];

  const locationDetails: DetailRow[] = [
    { icon: <FaGlobeAsia />, label: t("rowCountry"), value: profile.country },
    { icon: <FaMapMarkerAlt />, label: t("rowState"), value: profile.state },
    { icon: <FaCity />, label: t("rowCity"), value: profile.city },
  ];

  const familyDetails: DetailRow[] = [
    {
      icon: <RiParentLine />,
      label: t("rowFatherOccupation"),
      value: profile.fatherOccupation,
    },
    {
      icon: <RiParentLine />,
      label: t("rowMotherOccupation"),
      value: profile.motherOccupation,
    },
    { icon: <HiOutlineUsers />, label: t("rowSiblings"), value: profile.siblings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream via-white to-soft-rose/30">
      <div className="max-w-[1560px] w-full lg:w-[90%] lg:py-6 mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mx-auto lg:max-w-none">
          {/* Header */}
          <div className="flex items-center gap-4 py-5 lg:py-6">
            <button
              onClick={() => router.back()}
              className="w-10 h-10 rounded-xl bg-white border border-border-soft shadow-sm flex items-center justify-center hover:bg-soft-rose hover:border-maroon/20 transition-all duration-200"
            >
              <IoChevronBack className="text-xl text-[#2C2C2C]" />
            </button>
            <h1 className="font-playfair text-xl font-semibold text-[#2C2C2C]">
              {t("title")}
            </h1>
          </div>

          {/* Photos Section Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-border-soft shadow-sm p-5 lg:p-6 mb-6">
            <input
              ref={profilePicInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleProfilePictureSelected}
            />

            <p className="text-center text-[22px] font-medium leading-tight text-[#4B5563]">
              {t("photoHero")}
            </p>

            <div className="mt-5 flex justify-center">
              <button
                type="button"
                onClick={openProfilePicturePicker}
                disabled={uploadingProfilePicture}
                className="relative w-40 h-40 rounded-full border-[3px] border-dashed border-[#C8CDD3] bg-[#F8F9FB] overflow-visible flex items-center justify-center disabled:opacity-60"
              >
                <div className="absolute inset-0 rounded-full overflow-hidden">
                  <Image
                    src={profile.profilePicture}
                    alt={t("profilePictureAlt")}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 z-10 w-9 h-9 rounded-full bg-maroon text-white flex items-center justify-center shadow-md border-2 border-white">
                  <FiEdit2 className="text-[15px]" />
                </div>
              </button>
            </div>

            <div className="mt-8 rounded-2xl bg-[#F3F4F6] border border-[#E5E7EB] p-5">
              <h3 className="text-4 text-[#111827] font-semibold mb-3">{t("photoTipsTitle")}</h3>
              <ul className="space-y-2 text-[#4B5563] text-base">
                <li>• {t("photoTips1")}</li>
                <li>• {t("photoTips2")}</li>
                <li>• {t("photoTips3")}</li>
              </ul>
            </div>

            {uploadingProfilePicture ? (
              <p className="mt-4 text-center text-sm text-[#6B6B6B]">{t("uploading")}</p>
            ) : null}
          </div>

          {/* Photos Section Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-border-soft shadow-sm p-5 lg:p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-playfair text-lg font-semibold text-[#2C2C2C]">
                {t("photos")}
              </h2>
              <input
                ref={galleryFileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleGalleryFilesSelected}
              />
              <button
                type="button"
                onClick={openGalleryPicker}
                disabled={uploadingPhotos}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-maroon text-white text-sm font-semibold hover:bg-maroon/90 shadow-sm hover:shadow transition-all duration-200 disabled:opacity-60 disabled:pointer-events-none"
              >
                <span className="text-lg leading-none">+</span>
                {uploadingPhotos ? t("uploading") : t("addPhotos")}
              </button>
            </div>

            {/* Photo Grid */}
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1 -mx-1">
              {/* Profile Picture */}
              <button
                type="button"
                onClick={() => setViewerIndex(0)}
                className="relative w-36 h-36 shrink-0 rounded-xl overflow-hidden cursor-pointer focus:outline-none focus:ring-2 focus:ring-maroon/50 focus:ring-offset-2 transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-md"
              >
                <Image
                  src={profile.profilePicture}
                  alt={profile.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent py-2.5 px-3">
                  <span className="text-xs font-medium text-white">
                    {t("profilePicture")}
                  </span>
                </div>
              </button>

              {/* Gallery photos from API */}
              {galleryPhotos.map((photo, i) => (
                <div
                  key={photo.id}
                  className="relative w-36 h-36 shrink-0 rounded-xl overflow-hidden shadow-md"
                >
                  <button
                    type="button"
                    onClick={() => setViewerIndex(i + 1)}
                    className="absolute inset-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-maroon/50 focus:ring-offset-2 transition-transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Image
                      src={photo.url}
                      alt={t("galleryImageAlt", { number: i + 1 })}
                      fill
                      className="object-cover"
                      sizes="144px"
                      unoptimized
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteGalleryPhoto(photo.id)}
                    disabled={deletingPhotoId === photo.id}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/75 transition-colors disabled:opacity-60"
                    aria-label={t("deleteGalleryAria", { number: i + 1 })}
                  >
                    <FiTrash2 className="text-sm" />
                  </button>
                </div>
              ))}

              {/* Empty placeholder slot */}
              <button
                type="button"
                onClick={openGalleryPicker}
                disabled={uploadingPhotos}
                className="w-36 h-36 shrink-0 rounded-xl border-2 border-dashed border-border-soft bg-soft-rose/30 flex flex-col items-center justify-center gap-1.5 hover:border-maroon/30 hover:bg-soft-rose/50 transition-colors cursor-pointer disabled:opacity-60 disabled:pointer-events-none"
              >
                <BsCamera className="text-2xl text-maroon/40" />
                <span className="text-xs text-[#6B6B6B] font-medium">
                  {uploadingPhotos ? t("uploading") : t("addPhoto")}
                </span>
              </button>
            </div>
          </div>

          {/* Horoscope quick link */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-border-soft shadow-sm p-5 lg:p-6 mb-6">
            <button
              type="button"
              onClick={() => router.push("/settings/horoscope")}
              className="w-full flex items-center justify-between gap-4"
            >
              <div className="text-left">
                <h2 className="font-playfair text-lg font-semibold text-[#2C2C2C]">
                  {t("horoscope")}
                </h2>
                <p className="text-sm text-[#6B6B6B] mt-1">{t("horoscopeCta")}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-soft-rose flex items-center justify-center text-maroon">
                <FiEdit2 className="text-base" />
              </div>
            </button>
          </div>

        {/* Picture Modal Viewer */}
        {viewerIndex !== null && (
          <PictureModalViewer
            images={[profile.profilePicture, ...galleryPhotos.map((p) => p.url)]}
            currentIndex={viewerIndex}
            onClose={() => setViewerIndex(null)}
            canDeleteCurrent={viewerIndex > 0}
            deletingCurrent={
              viewerIndex > 0
                ? deletingPhotoId === galleryPhotos[viewerIndex - 1]?.id
                : false
            }
            onDeleteCurrent={
              viewerIndex > 0
                ? () => {
                    const photo = galleryPhotos[viewerIndex - 1];
                    if (!photo) return;
                    handleDeleteGalleryPhoto(photo.id);
                  }
                : undefined
            }
            onPrev={
              viewerIndex > 0
                ? () => setViewerIndex((i) => (i ?? 0) - 1)
                : undefined
            }
            onNext={
              viewerIndex < galleryPhotos.length
                ? () => setViewerIndex((i) => Math.min((i ?? 0) + 1, galleryPhotos.length))
                : undefined
            }
            onIndexChange={(i) => setViewerIndex(i)}
            labels={[
              t("profilePicture"),
              ...galleryPhotos.map((_, i) =>
                t("galleryLabel", { number: i + 1 })
              ),
            ]}
          />
        )}

        {/* Profile Details Section */}
        <div className="mb-4">
          <h2 className="font-playfair text-lg font-semibold text-[#2C2C2C] mb-1">
            {t("profileDetails")}
          </h2>
          <p className="text-sm text-[#6B6B6B]">
            {t("profileDetailsHint")}
          </p>
        </div>

        {/* About me (top card under Profile Details) */}
        <div className="group bg-white border border-border-soft rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-maroon/10 transition-all duration-200 mb-4 lg:mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-playfair font-semibold text-base text-[#2C2C2C]">{t("aboutMe")}</h3>
            <button
              onClick={() => setEditSection("lifestyle")}
              className="w-9 h-9 rounded-xl bg-soft-rose flex items-center justify-center hover:bg-maroon hover:text-white transition-all duration-200 text-maroon group-hover:scale-105"
            >
              <FiEdit2 className="text-sm" />
            </button>
          </div>
          <p className="text-sm text-[#2C2C2C] leading-relaxed whitespace-pre-wrap">
            {profile.aboutMe || t("aboutMeEmpty")}
          </p>
        </div>

        {/* Section Cards */}
        <div className="space-y-4 pb-12 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0">
          <SectionCard
            title={t("sectionBasic")}
            rows={basicDetails}
            onEdit={() => setEditSection("basic")}
          />
          <SectionCard
            title={t("sectionReligion")}
            rows={religionCommunity}
            onEdit={() => setEditSection("religion")}
          />
          <SectionCard
            title={t("sectionEducation")}
            rows={educationCareer}
            onEdit={() => setEditSection("education")}
          />
          <SectionCard
            title={t("sectionLifestyle")}
            rows={lifestyle}
            onEdit={() => setEditSection("lifestyle")}
          />
          <SectionCard
            title={t("sectionLocation")}
            rows={locationDetails}
            onEdit={() => setEditSection("location")}
          />
          <SectionCard
            title={t("sectionFamily")}
            rows={familyDetails}
            onEdit={() => setEditSection("family")}
          />
        </div>
      </div>

      {/* Edit Section Modal */}
      <EditSectionModal
        isOpen={editSection !== null}
        onClose={() => setEditSection(null)}
        section={editSection || "basic"}
        data={modalData}
        onSave={handleSectionSave}
      />
    </div>
    </div>
  );
};

export default EditProfilePage;
