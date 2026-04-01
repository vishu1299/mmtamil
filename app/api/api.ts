import { customAxios } from "@/utils/axios-interceptor";

export const getUserById = async (id : number) => {
    try {
        const response = await customAxios().get(`mmm/user-web/getById/${id}`)
        return response;
    } catch (error) {
        console.log(error);
    }
}

// success story
export const getSuccessStories = async () => {
    try {
        const response = await customAxios().get(`mmm/user-web/admin/getStory/all`);
        return response;
    } catch (error: any) {
        console.log(error);
        throw new Error(
            error?.response?.data?.message ||
            "Unable to load success stories. Please check API configuration."
        );
    }
};

// Horoscope APIs
export interface HoroscopeChart {
    rasiChart: string[];
    navamsaChart: string[];
}

/** Get horoscope by horoscope record id (use when you have the horoscope id from backend) */
export const getHoroscopeById = async (id: number) => {
    try {
        const response = await customAxios().get(`mmm/horoscopes/${id}`);
        return response;
    } catch (error: any) {
        if (error?.response?.status === 404) return null;
        console.log(error);
        throw error;
    }
};

/** Get horoscope by user id – use for "my horoscope" or "this user's horoscope" */
export const getHoroscopeByUserId = async (userId: number) => {
    try {
        const response = await customAxios().get(`mmm/horoscopes/${userId}`);
        return response;
    } catch (error: any) {
        if (error?.response?.status === 404) return null;
        console.log(error);
        throw error;
    }
};

export const createHoroscope = async (userId: number, body: HoroscopeChart) => {
    try {
        const response = await customAxios().post(`mmm/horoscopes/${userId}`, body);
        return response;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const updateHoroscope = async (id: number, body: Partial<HoroscopeChart>) => {
    try {
        const response = await customAxios().patch(`mmm/horoscopes/${id}`, body);
        return response;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const deleteHoroscope = async (id: number) => {
    try {
        const response = await customAxios().delete(`mmm/horoscopes/${id}`);
        return response;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const uploadHoroscopeImage = async (userId: number, file: File) => {
    try {
        const formData = new FormData();
        formData.append("file", file, file.name);
        const response = await customAxios().post(`mmm/horoscopes/image/${userId}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const deleteHoroscopeImage = async (id: number) => {
    try {
        const response = await customAxios().delete(`mmm/horoscopes/image/${id}`);
        return response;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

/** Update user profile with horoscopeId so getById returns linked horoscope */
export const updateUserHoroscopeId = async (horoscopeId: string) => {
    try {
        const response = await customAxios().patch("mmm/user-web/updateAllDetail", {
            profile: { horoscopeId },
        });
        return response;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

/** Get pending interest requests (users who showed interest in current user) – for notifications page */
export const getInterestedUser = async (userId: number, page = 1, pageSize = 20) => {
    try {
        const response = await customAxios().get(`mmm/interaction/getInterestedUser/${userId}`, {
            params: { page, pageSize },
        });
        return response;
    } catch (error) {
        console.log(error);
        throw error;
    }
};