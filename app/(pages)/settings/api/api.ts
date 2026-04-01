import { customAxios } from "@/utils/axios-interceptor";


export const sendOtp = async (email: string) => {
    try {
      
      const response = await customAxios().post("user-web/daakOtp", {
        email, 
      });
  
      return response.data;
    } catch (error) {
      console.error("Error updating email:", error);
      throw error;
    }
  };
export const changeEmail = async (otp: string) => {
  try {
    
    const response = await customAxios().patch("mmm/user-web/updatedaak", {
      otp, 
    });

    return response.data;
  } catch (error) {
    console.error("Error updating email:", error);
    throw error;
  }
};

export const changepassword = async (oldPassword:string, newPassword:string) => {
    try {
        const response = await customAxios().patch("mmm/user-web/updatelock", {
            oldPassword: oldPassword,
            newPassword: newPassword
        });

        return response.data; 
    } catch (error) {
        console.error("Error changing password:", error);
        throw error; 
    }
};


/** Permanently delete account - DELETE user-web/delete-user/:id */
export const deleteAccount = async (userId: number) => {
  try {
    console.log("userId", userId);
    const response = await customAxios().delete(
      `mmm/user-web/delete-user/${userId}`
    );
    if (response?.data?.success) {
      return { success: true, data: response.data };
    }
    return { success: false, error: "Failed to delete account" };
  } catch (error: any) {
    if (error?.response?.status === 400) {
      return { success: false, error: "Invalid request" };
    }
    throw error;
  }
};

/** Temporarily deactivate account - uses separate endpoint when available */
export const deactivateAccount = async (userId: number) => {
  try {
    const response = await customAxios().patch(
      `mmm/user-web/deactivate/${userId}`
    );
    if (response?.data?.success) {
      return { success: true, data: response.data };
    }
    return { success: false, error: "Failed to deactivate" };
  } catch (error: any) {
    if (error?.response?.status === 400) {
      return { success: false, error: "Invalid request" };
    }
    throw error;
  }
};

/** Update user profile details - PATCH mmm/user-web/updateAllDetail */
export interface UpdateUserDetailsPayload {
  userName?: string;
  email?: string;
  phoneNumber?: string;
  profile?: {
    appLanguage?: string;
    country?: string;
    city?: string;
    gender?: string;
    maritalStatus?: string;
    childrenStatus?: string;
    dateOfBirth?: string;
    state?: string;
    motherTongue?: string;
    fatherDetails?: string;
    motherDetails?: string;
    caste?: string;
    subCaste?: string;
    company?: string;
    height?: string;
    bio?: string;
    education?: string;
    religion?: string;
    profession?: string;
    diet?: string;
    smoking?: string;
    drinking?: string;
    hobbies?: string[];
    siblingsDetails?: string;
    [key: string]: unknown;
  };
}

export const updateUserDetails = async (payload: UpdateUserDetailsPayload) => {
  try {
    const response = await customAxios().patch(
      "mmm/user-web/updateAllDetail",
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Error updating user details:", error);
    throw error;
  }
};

/** Gallery item from API */
export interface GalleryItem {
  id: number;
  imageUrl: string;
  createdAt: string;
}

/** Get user gallery photos - GET mmm/gallery/:userId */
export const getGallery = async (userId: number) => {
  try {
    const response = await customAxios().get(`mmm/gallery/${userId}`);
    const data = response?.data?.data?.data ?? response?.data?.data;
    const gallery: GalleryItem[] = data?.gallery ?? [];
    return { gallery, profilePicture: data?.profile?.profilePicture };
  } catch (error) {
    console.error("Error fetching gallery:", error);
    return { gallery: [], profilePicture: undefined };
  }
};

/**
 * Upload gallery photos — POST multipart `gallery/upload` with field `images` (same as profile upload flow).
 */
export const uploadGalleryImages = async (files: File[]) => {
  if (!files.length) {
    throw new Error("No files selected");
  }
  const formData = new FormData();
  files.forEach((file) => formData.append("images", file));

  const tokenString = localStorage.getItem("access-token");
  if (!tokenString) {
    throw new Error("Not authenticated");
  }
  let auth: string;
  try {
    const parsed = JSON.parse(tokenString);
    auth = parsed?.token?.access?.token;
  } catch {
    throw new Error("Invalid session");
  }
  if (!auth) {
    throw new Error("Invalid session");
  }

  const base = (process.env.NEXT_PUBLIC_BASE_URL || "").replace(/\/$/, "");
  const url = `${base}/mmm/gallery/upload`;

  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: auth },
    body: formData,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      (data as { message?: string })?.message || "Upload failed"
    );
  }
  return data;
};

/**
 * Upload or update profile picture — POST multipart `mmm/uploads/profile-picture`
 * with field name `profile-pic`.
 */
export const uploadProfilePicture = async (file: File) => {
  if (!file) {
    throw new Error("No file selected");
  }

  const formData = new FormData();
  formData.append("profile-pic", file);

  const tokenString = localStorage.getItem("access-token");
  if (!tokenString) {
    throw new Error("Not authenticated");
  }

  let auth: string;
  try {
    const parsed = JSON.parse(tokenString);
    auth = parsed?.token?.access?.token;
  } catch {
    throw new Error("Invalid session");
  }
  if (!auth) {
    throw new Error("Invalid session");
  }

  const base = (process.env.NEXT_PUBLIC_BASE_URL || "").replace(/\/$/, "");
  const url = `${base}/mmm/uploads/profile-picture`;

  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: auth },
    body: formData,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      (data as { message?: string })?.message || "Profile picture upload failed"
    );
  }
  return data;
};

/** Delete one gallery image by id - DELETE mmm/gallery/deleteGallaryImage/:id */
export const deleteGalleryImage = async (imageId: number) => {
  const response = await customAxios().delete(
    `mmm/gallery/deleteGallaryImage/${imageId}`
  );
  return response.data;
};