import { customAxios } from "@/utils/axios-interceptor";

import { sliderPropaginatedResponse, User } from "../type/type";

export interface FilterProps {
  from: string;
  /** City / area (e.g. from landing hero); also sent in filter body for getAll */
  city?: string;
  ageFrom: number;
  ageTo: number;
  lookingFor: string;
  maritalStatus: string;
  heightFrom: string;
  heightTo: string;
  religion: string;
  /** Comma-separated mother tongue values (e.g. HINDI,TAMIL) */
  motherTongue: string;
  /** Caste label (matches profile.caste) */
  caste: string;
  /** Qualification label (matches profile.education) */
  qualification: string;
}
export const allUser = async (currentPage: number, filter: FilterProps) => {
  try {
    console.log("filter", filter);
    const data = {
      filter: filter,
    };
    const response = await customAxios().post(
      `mmm/user-web/getAll?page=${currentPage}&pageSize=12`,
      data
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};

/**
 * Same `getAll` as the carousel, large page for modal name/ID search.
 * Must send the same `filter` as `allUser` (including `lookingFor` / gender preference);
 * an empty body can make the API return same-gender-only rows, breaking ID search for opposite gender.
 */
export const getAllUsersForSearch = async (
  pageSize: number = 1000,
  filter?: FilterProps
) => {
  try {
    const data = filter ? { filter } : {};
    const response = await customAxios().post(
      `mmm/user-web/getAll?page=1&pageSize=${pageSize}`,
      data
    );
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const toUserFromProfile = (profile: any): User => {
  const now = new Date().toISOString();
  return {
    id: profile?.user?.id ?? profile?.userId ?? profile?.id ?? 0,
    profileId: profile?.registrationId ?? String(profile?.id ?? ""),
    registrationId: profile?.registrationId ?? "",
    userName: profile?.user?.userName ?? [profile?.firstName, profile?.lastName].filter(Boolean).join(" ") ?? "",
    email: profile?.user?.email ?? "",
    password: "",
    phoneNumber: null,
    role: "user",
    createdAt: profile?.createdAt ?? now,
    updatedAt: profile?.updatedAt ?? now,
    isActive: true,
    profile: {
      ...profile,
      id: profile?.id ?? 0,
      userId: profile?.userId ?? profile?.user?.id ?? 0,
      martialStatus: profile?.martialStatus ?? profile?.maritalStatus ?? "",
      children: profile?.childrenStatus ?? "",
    },
    preferences: {
      id: 0,
      userId: profile?.userId ?? profile?.user?.id ?? 0,
      looking_for: "",
      looking_goal: [],
      martialStatus: null,
      preferredPersonality: "",
      preferredGender: null,
      ageRangefrom: null,
      ageRangeTo: null,
      country: null,
      city: null,
      countryCode: null,
      address: null,
      state: null,
      zip: null,
      createdAt: now,
      updatedAt: now,
    },
    posts: [],
    verification: {
      id: 0,
      userId: profile?.userId ?? profile?.user?.id ?? 0,
      emailVerified: false,
      phoneVerified: false,
      isBanned: false,
      banReason: null,
      lastLoginAt: now,
      createdAt: now,
      updatedAt: now,
    },
    engagement: null,
    receivedMessage: [],
    reportedBy: [],
    reportsGiven: [],
    sendMessage: [],
    subscription: null,
    interestGiven: [],
    interestReceived: [],
    followers: [],
    following: [],
  };
};

export const filterProfilesFromAdmin = async (filter: FilterProps): Promise<User[]> => {
  try {
    const params = new URLSearchParams();

    if (filter.ageFrom > 0) params.set("ageFrom", String(filter.ageFrom));
    if (filter.ageTo > 0) params.set("ageTo", String(filter.ageTo));
    if (filter.religion) params.set("religion", filter.religion);
    if (filter.motherTongue) params.set("motherTongue", filter.motherTongue);
    if (filter.from) params.set("country", filter.from);
    if (filter.city) params.set("city", filter.city);
    if (filter.maritalStatus) params.set("maritalStatus", filter.maritalStatus);
    if (filter.caste?.trim()) params.set("caste", filter.caste.trim());
    if (filter.qualification?.trim())
      params.set("education", filter.qualification.trim());
    if (filter.lookingFor && filter.lookingFor !== "All") {
      params.set("gender", filter.lookingFor.toUpperCase());
    }

    const response = await customAxios().get(
      `mmm/user-web/admin/filterdata/profile?${params.toString()}`
    );

    const rows = response?.data?.data;
    if (!Array.isArray(rows)) return [];
    return rows.map(toUserFromProfile);
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getAllFollowingPostSearch = async (
  currentPage: number,
  filter: FilterProps
) => {
  console.log(currentPage, filter);
  try {
    const result = await customAxios().post(`mmm/user-web/getAllfollowing`);
    return result;
  } catch (error) {
    console.log(error);
  }
};

export const getUserById = async (id: number) => {
  try {
    const response = await customAxios().get(`mmm/user-web/getById/${id}`);
    return response;
  } catch (error) {
    console.log(error);
  }
};

interface Prop {
  type: string;
  targetId: number;
}

export const showInterest = async (data: Prop) => {
  try {
    const result = await customAxios().post(`mmm/interaction/r`, data);
    return result;
  } catch (error) {
    console.log(error);
  }
};

export interface CreateInteractionPayload {
  userId: number;
  targetId: number;
  type: "interest" | "ignored";
}

export const createInteraction = async (data: CreateInteractionPayload) => {
  try {
    const result = await customAxios().post(
      `mmm/interaction/create-interaction`,
      data
    );
    return result;
  } catch (error) {
    console.error("Error creating interaction:", error);
    throw error;
  }
};

export const getCarouselData =
  async (): Promise<sliderPropaginatedResponse> => {
    const result = await customAxios().get(`mmm/user-web/sliderUser`);
    return result.data.data;
  };



  
  export interface GalleryResponse {
    id: number;
    userId: number;
    imageUrl: string;
    createdAt: string;
    updatedAt: string;
  }

  /**
   * Gallery photos — GET `{NEXT_PUBLIC_BASE_URL}/mmm/gallery/:userId?type=photo&page=&pageSize=`
   * Example: `https://mmtamil.co.uk/api/mmm/gallery/1023?type=photo&page=1&pageSize=10`
   * `userId` is the profile user id (same as `/search/[userId]`).
   */
  export const getGalleryImages = async (
    userId: number,
    page: number = 1,
    pageSize: number = 10
  ): Promise<GalleryResponse[]> => {
    try {
      const axiosInstance = customAxios();
      const response = await axiosInstance.get(
        `mmm/gallery/${userId}?type=photo&page=${page}&pageSize=${pageSize}`
      );
      const root = response?.data?.data?.data ?? response?.data?.data;
      const gallery = root?.gallery;
      return Array.isArray(gallery) ? gallery : [];
    } catch (error) {
      console.error("Error fetching gallery images:", error);
      throw error;
    }
  };

  /**
   * Same as getGalleryImages but does not throw on 401/403 (viewer not allowed to see gallery yet).
   * Use on other users' profiles to decide blur vs paywall vs grid.
   */
  export const fetchGalleryWithAccess = async (
    userId: number,
    page: number = 1,
    pageSize: number = 40
  ): Promise<{
    photos: GalleryResponse[];
    /** true when API rejects access (typical before profile-view / points) */
    accessDenied: boolean;
  }> => {
    try {
      const axiosInstance = customAxios();
      const response = await axiosInstance.get(
        `mmm/gallery/${userId}?type=photo&page=${page}&pageSize=${pageSize}`
      );
      const root = response?.data?.data?.data ?? response?.data?.data;
      const gallery = root?.gallery;
      const list = Array.isArray(gallery) ? gallery : [];
      return { photos: list, accessDenied: false };
    } catch (error: unknown) {
      const status = (error as { response?: { status?: number } })?.response
        ?.status;
      if (status === 401 || status === 403) {
        return { photos: [], accessDenied: true };
      }
      console.error("Error fetching gallery images:", error);
      throw error;
    }
  };

  /** Spend credits / points to unlock viewing this profile's photos (POST body uses profile id). */
  export const unlockProfileGalleryView = async (profileId: number) => {
    const axiosInstance = customAxios();
    const response = await axiosInstance.post(`mmm/package/profile-view`, {
      profileId,
    });
    return response;
  };

  /**
   * Record / charge package when opening another member's profile (POST mmm/package/contact-view).
   * Backend uses Authorization; collection uses empty body.
   */
  export const postContactView = async () => {
    const axiosInstance = customAxios();
    return axiosInstance.post(`mmm/package/contact-view`, {});
  };
  