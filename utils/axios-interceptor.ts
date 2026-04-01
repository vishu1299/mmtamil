import axios, { AxiosInstance, AxiosResponse } from "axios";

export const customAxios = () => {
  const tokenString = localStorage.getItem("access-token");
  let token = "";

  try {
    if (tokenString) {
      const parsedToken = JSON.parse(tokenString);
      token = parsedToken?.token?.access?.token || "";
    }
  } catch (error) {
    console.error("Error parsing access token:", error);
  }

  const instance: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: token } : {}), // Add Authorization only if token exists
    },
  });

  instance.interceptors.request.use(
    (config) => {
      if (!config.headers.Authorization && token) {
        config.headers.Authorization = token;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: any) => {
      if (error.response?.status === 401) {
        console.error("Unauthorized access");
        localStorage.clear();
        // Optionally redirect to login page
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

