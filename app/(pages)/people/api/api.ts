import { customAxios } from "@/utils/axios-interceptor";

export interface profile {
  id: number;
  userId: number;
  gender: string;
  dateOfBirth: string;
  profilePicture: string;
  posts: string[];
  bio: string;
  interests: string[];
  languagesSpoken: string[];
  traits: string[];
  movies: string[];
  music: string[];
  personality: string;
  country: string;
  city: string;
  field_of_work: string;
  understand_english: string;
  credits: number;
  religion: string;
  maritalStatus: string;
  childrenStatus: string;
  isAggredTandC: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Preferences {
  preferredGender: string;
  ageRange: [number, number];
  interests: string[];
  languagesSpoken: string[];
  country: string;
  city: string;
  relationshipStatus: string;
  childrenPreference: string;
  religion: string;
  looking_for: string;
}

export interface PeopleResponse {
  id: number;
  profileId: string;
  userName: string;
  email: string;
  password: string;
  phoneNumber: string | null;
  role: string;
  gallery: string[];
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  isDeleted: boolean;
  profileViews: number;
  engagementScore: number;
  isPremium: boolean;
  profile: profile;
  preferences: Preferences;
}

export const randomPeople = async (): Promise<PeopleResponse[]> => {
  try {
    const axiosInstance = customAxios();
    const response = await axiosInstance.get("mmm/user-web/getPeople");
    console.log("response to get random people", response);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching people:", error);
    throw error;
  }
};

// Gallery Images API

export interface GalleryResponse {
  id: number;
  userId: number;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export const getGalleryImages = async (
  userId: string | number,
  page: number = 1,
  pageSize: number = 10
): Promise<GalleryResponse[]> => {
  try {
    const axiosInstance = customAxios();
    const response = await axiosInstance.get(
      `/mmm/gallery/${userId}?type=photo&page=${page}&pageSize=${pageSize}`
    );
    console.log("response", response);
    return response.data.data.data.gallery;
  } catch (error) {
    console.error("Error fetching gallery images:", error);
    throw error;
  }
};

// Post Images API
export interface PostImageResponse {
  id: number;
  userId: number;
  imageUrl: string;
  caption: string;
  createdAt: string;
  updatedAt: string;
}

export const getPostImages = async (
  userId: number,
  page: number = 1,
  pageSize: number = 10
): Promise<PostImageResponse[]> => {
  try {
    const axiosInstance = customAxios();
    const response = await axiosInstance.get(
      `/mmm/posts/${userId}/images?page=${page}&pageSize=${pageSize}`
    );
    console.log(" list of posts", response.data.data.posts);
    return response.data.data.posts;
  } catch (error) {
    console.error("Error fetching post images:", error);
    throw error;
  }
};
