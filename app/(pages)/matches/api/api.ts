import { customAxios } from "@/utils/axios-interceptor";



const calculateAge = (dob: string) => {
  if (!dob) return 0;
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
};



export interface GetAcceptedMatchesResponse {
  data: any[];
  totalPages?: number;
  currentPage?: number;
}

/** Get interaction user list (interest) – returns both accepted and pending; split by interestAccepted */
export const getInteractionUserInterest = async (
  page: number = 1
): Promise<{ data: any[]; totalPages: number; currentPage: number }> => {
  try {
    const response = await customAxios().get(
      `mmm/interaction/getInteractionUser/interest?page=${page}`
    );
    const payload = response?.data?.data ?? response?.data;
    const arr = Array.isArray(payload) ? payload : payload?.data ?? [];
    const totalPages = payload?.totalPages ?? 1;
    const currentPage = payload?.currentPage ?? page;
    return { data: arr, totalPages, currentPage };
  } catch (error) {
    console.error("Error fetching interaction user interest:", error);
    return { data: [], totalPages: 1, currentPage: 1 };
  }
};

/** Alias for backward compatibility */
export const getPendingMatches = getInteractionUserInterest;

/** Accept a pending request – PATCH updateInteraction with interestAccepted: true */
export const updateInteraction = async (interactionId: number) => {
  const response = await customAxios().patch(
    `mmm/interaction/updateInteraction/${interactionId}`,
    { type: "interest", interestAccepted: true }
  );
  return response;
};

/** Reject a pending request – DELETE deleteInteraction */
export const deleteInteraction = async (interactionId: number) => {
  const response = await customAxios().delete(
    `mmm/interaction/deleteInteraction/${interactionId}`
  );
  return response;
};

/** Get users who sent interest to current user (for Pending Requests tab). Response: data.data[], totalPages */
export const getPendingRequestsList = async (
  currentUserId: number,
  page: number = 1
): Promise<{ data: any[]; totalPages: number; currentPage: number }> => {
  try {
    const response = await customAxios().get(
      `mmm/interaction/getInterestedUser/${currentUserId}`,
      { params: { page } }
    );
    const payload = response?.data?.data ?? response?.data;
    const arr = Array.isArray(payload) ? payload : payload?.data ?? [];
    const totalPages = payload?.totalPages ?? 1;
    const currentPage = payload?.currentPage ?? page;
    return { data: arr, totalPages, currentPage };
  } catch (error) {
    console.error("Error fetching pending requests:", error);
    return { data: [], totalPages: 1, currentPage: 1 };
  }
};

export const getAllUsersPage = async (
  page: number = 1,
  pageSize: number = 100
): Promise<{ data: any[]; totalPages: number; currentPage: number }> => {
  try {
    const response = await customAxios().post(
      `mmm/user-web/getAll?page=${page}&pageSize=${pageSize}`,
      {}
    );
    const payload = response?.data?.data ?? response?.data;
    const arr = Array.isArray(payload?.data) ? payload.data : [];
    return {
      data: arr,
      totalPages: payload?.totalPages ?? 1,
      currentPage: payload?.currentPage ?? page,
    };
  } catch (error) {
    console.error("Error fetching all users:", error);
    return { data: [], totalPages: 1, currentPage: page };
  }
};

export const createInteraction = async (
  userId: number,
  targetId: number,
  type: "interest" | "ignored"
) => {
  const response = await customAxios().post(
    `mmm/interaction/create-interaction`,
    { userId, targetId, type }
  );
  return response;
};

// export const getPendingRequests = async (
//   userId: number,
//   page: number = 1,
//   pageSize: number = 20
// ): Promise<GetAcceptedMatchesResponse> => {
//   try {
//     const response = await customAxios().get(
//       `mmm/interaction/getInterestedUser/${userId}?page=${page}&pageSize=${pageSize}`
//     );

//     const rawData = response?.data?.data ?? response?.data;
//     const items = rawData?.data ?? rawData ?? [];

//     const pendingOnly = items.filter(
//       (item: any) => item?.interestAccepted === false
//     );

    

//     return {
//       data,
//       totalPages: rawData?.totalPages ?? 1,
//       currentPage: rawData?.currentPage ?? page,
//     };
//   } catch (error) {
//     console.error("Error fetching pending requests:", error);
//     return { data: [] };
//   }
// };
