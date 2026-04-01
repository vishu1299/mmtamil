import { customAxios } from "@/utils/axios-interceptor";

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
      `mmm/gallery/${userId}?type=photo&page=${page}&pageSize=${pageSize}`
    );
    console.log("response",response)
    return response.data.data.data.gallery;
  } catch (error) {
    console.error("Error fetching gallery images:", error);
    throw error;
  }
};
