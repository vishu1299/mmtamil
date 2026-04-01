import axios from "axios";
import { customAxios } from "@/utils/axios-interceptor";

const API_BASE = "https://mmtamil.co.uk/api/mmm/";

export const getStoredUser = () => {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem("access-token");
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    const user =
      parsed?.data?.result ??
      parsed?.result ??
      (parsed?.data && typeof parsed.data === "object" && "id" in parsed.data
        ? parsed.data
        : null) ??
      (parsed?.id ? parsed : null);
    return user;
  } catch {
    return null;
  }
};

const getAuthToken = () => {
  try {
    const stored = localStorage.getItem("access-token");
    if (!stored) return "";
    const parsed = JSON.parse(stored);
    return parsed?.token?.access?.token || "";
  } catch {
    return "";
  }
};

export const getuserByid = async () => {
  const user = getStoredUser();
  if (!user?.id) {
    return undefined;
  }

  const token = getAuthToken();
  const url = `${API_BASE}user-web/getById/${user.id}`;
  const config = {
    headers: token ? { Authorization: token } : {},
  };

  try {
    const result = await axios.get(url, config);
    const response = result?.data;
    // API returns { status, code, message, data: { id, profileId, profile, preferences, ... } }
    const userData = response?.data ?? response?.result ?? response;
    if (!userData) return undefined;
    // Return full user object with profile nested at user.profile
    return { data: userData };
  } catch (error) {
    console.error("getuserByid error:", error);
    throw error;
  }
};

interface Prop {
    images : string[],
    description :string
}
export const createPost = async (data:Prop) => {
    try {
        const formData = new FormData();
        formData.append('description', data.description);
      
        data.images.forEach((photo) => {
          formData.append('images', photo);
        });

        const result = await customAxios().post(`posts/createPost`,formData,{
            headers : {
                'Content-Type' : 'multipart/form-data',
            }
        });
        console.log("Posting...",result);
        return result

    } catch (error) {
        console.log(error);
    }
}

export const updateuserById = async (data:any) => {
    try {
        const response = await customAxios().patch('user-web/updateAllDetail',data);
        return response
    } catch (error) {
        console.log(error);
    }
}

export const deletePostById = async (id:number) => {
    try{
        const resposne = await customAxios().delete(`posts/deletePost/${id}`);
        return resposne;
    }
    catch(error){
        console.log(error);
    }
}

export interface UserGalleryItem {
  id: number;
  imageUrl: string;
  createdAt: string;
}

export const getGalleryByUserId = async (userId: number): Promise<UserGalleryItem[]> => {
  try {
    const response = await customAxios().get(`mmm/gallery/${userId}`);
    const data = response?.data?.data?.data ?? response?.data?.data ?? {};
    return Array.isArray(data?.gallery) ? data.gallery : [];
  } catch (error) {
    console.log("getGalleryByUserId error:", error);
    return [];
  }
};