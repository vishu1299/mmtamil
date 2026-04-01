import axios from "axios";
import { customAxios } from "@/utils/axios-interceptor";
import { googleAuthSignIn } from "@/app/(auth)/api/api";
import { RegistrationData } from "../context/registration-context";

export interface CreateUserPayload {
  data: RegistrationData;
  photos: File[];
  horoscope?: {
    rasiChart: string[];
    navamsaChart: string[];
  };
}

const formatTimeTo12h = (time24: string): string => {
  if (!time24) return "";
  if (time24.includes("AM") || time24.includes("PM")) return time24;
  const [hourStr, minuteStr] = time24.split(":");
  let hour = parseInt(hourStr, 10);
  const minute = minuteStr || "00";
  const period = hour >= 12 ? "PM" : "AM";
  if (hour === 0) hour = 12;
  else if (hour > 12) hour -= 12;
  return `${hour}:${minute} ${period}`;
};

const formatHeight = (height: string): string => {
  if (!height) return "";
  if (height.includes("ft")) return height;
  const match = height.match(/(\d+)'(\d+)"/);
  if (match) {
    return `${match[1]}ft ${match[2]}in`;
  }
  return height;
};

/** OAuth signup / sign-in: same `google-login` endpoint as email flow; stores access token. */
export const signUpWithGoogleCredential = async (tokenId: string) => {
  return googleAuthSignIn(tokenId);
};

export const createUser = async ({ data, photos, horoscope }: CreateUserPayload) => {
  const formData = new FormData();

  formData.append("email", data.email);
  formData.append("phoneNumber", data.phoneNumber);
  formData.append("password", data.password);
  formData.append("dateOfBirth", data.dateOfBirth);
  formData.append("profileFor", data.profileFor);
  formData.append("iAm", data.iAm);
  formData.append("firstName", data.firstName);
  formData.append("lastName", data.lastName);
  formData.append("nativeCountry", data.nativeCountry);
  formData.append("citizenship", data.citizenship);
  formData.append("country", data.country);
  formData.append("height", formatHeight(data.height));
  formData.append("religion", data.religion);
  formData.append("maritalStatus", data.maritalStatus);
  formData.append("education", data.education);
  formData.append("profession", data.profession);
  formData.append("fatherDetails", data.fatherDetails);
  formData.append("birthTime", formatTimeTo12h(data.birthTime));

  if (data.caste) formData.append("caste", data.caste);
  if (data.subCaste) formData.append("subCaste", data.subCaste);
  if (data.zodiac) formData.append("zodiac", data.zodiac);
  if (data.star) formData.append("star", data.star);

  photos.forEach((file) => {
    formData.append("photos", file, file.name);
  });

  if (horoscope) {
    formData.append("horoscope", JSON.stringify(horoscope));
  }

  // Debug: log all form entries
  const debugEntries: Record<string, string> = {};
  formData.forEach((value, key) => {
    if (value instanceof File) {
      debugEntries[key] = `[File: ${value.name}, ${value.size} bytes, ${value.type}]`;
    } else {
      debugEntries[key] = value as string;
    }
  });
  console.log("createUser FormData:", debugEntries);

  try {
    const response = await axios.post(
      "https://mmtamil.co.uk/api/mmm/user-web/createUser",
      formData
    );
    return response.data;
  } catch (error: any) {
    console.error("createUser API error status:", error?.response?.status);
    console.error("createUser API error data:", error?.response?.data);
    console.error("createUser API error headers:", error?.response?.headers);
    throw error;
  }
};

export const updateUser = async (id: number, data: any) => {
  const token = JSON.parse(localStorage.getItem("access-token") ?? "{}");

  if (!token?.token?.access?.token) {
    console.error("No valid access token found.");
    return;
  }

  try {
    if (data.profile?.profilePicture?.startsWith("blob:")) {
      console.error("Error: Cannot send a blob URL to the backend.");
      return;
    }

    const response = await customAxios().patch(
      `mmm/user-web/updateAllDetail`,
      data,
      { headers: { Authorization: token.token.access.token } }
    );

    return response;
  } catch (error) {
    console.error("Error updating user:", error);
  }
};
