import { customAxios } from "@/utils/axios-interceptor";

export const getAboutUsData = async () => {
  try {
    const response = await customAxios().get('/aboutus/');
    console.log('Raw API response:', response); // Debug log
    return response.data;
  } catch (error) {
    console.error("Error fetching about us data:", error);
    throw error;
  }
};