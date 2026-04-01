import { customAxios } from "@/utils/axios-interceptor";




export interface MessageData {
    id: number;
    senderId: number;
    receiverId: number;
    subject: string;
    body: string;
    deleted: boolean;
    starred: boolean;
    createdAt: string;
    updatedAt: string;
    attachment: any[]; 
    attachedfile: string;
    
    receiver: {
      id: number;
      profileId: string;
      userName: string;
      email: string;
      password: string;
      phoneNumber?: string | null;
      role: string;
      createdAt: string;
      updatedAt: string;
      isActive: boolean;
      profileViews: number;
      engagementScore: number;
      isPremium: boolean;
      profile?: { profilePicture?: string };
    };
    sender: {
      id: number;
      profileId: string;
      userName: string;
      email: string;
      password: string;
      phoneNumber?: string | null;
      role: string;
      createdAt: string;
      updatedAt: string;
      isActive: boolean;
      profileViews: number;
      engagementScore: number;
      isPremium: boolean;
      profile: {
        profilePicture: string;
      };
    };
  }


  export interface UserProfile {
    id: number;
    userId: number;
    gender: string;
    dateOfBirth: string;
    profilePicture: string;
    bio: string;
    interests: any[];
    languagesSpoken: any[];
    traits: any[];
    movies: any[];
    music: any[];
    personality: string | null;
    country: string | null;
    city: string | null;
    field_of_work: string | null;
    understand_english: string;
    credits: number;
    religion: string;
    martialStatus: string;
    children: string;
    isAggredTandC: boolean;
    createdAt: string;
    updatedAt: string;
  }
  
  export const myProfilePic = async () => {
    const token = localStorage.getItem("access-token");
    
    
    if(token){
        const toker = JSON.parse(token);
        try {
            const result = await customAxios().get(`mmm/user-web/getById/${toker.data.result.id}`);
    
         
            return result;
        } catch (error) {
            console.error("Error in myProfilePic:", error);
        }
    }

   
};

function toMessageArray(payload: any): MessageData[] {
  if (Array.isArray(payload)) return payload;
  const inner = payload?.data;
  return Array.isArray(inner) ? inner : [];
}

export const getMessageChat = async (): Promise<MessageData[]> => {
  try {
    const { data } = await customAxios().get("mmm/message/outbox");
    return toMessageArray(data?.data ?? data) ?? [];
  } catch (error) {
    console.error("Error fetching messages:", error);
    return [];
  }
};

export const receivedMessage = async (): Promise<MessageData[]> => {
  try {
    const { data } = await customAxios().get("mmm/message/inbox");
    return toMessageArray(data?.data ?? data) ?? [];
  } catch (error) {
    console.error("Error fetching messages:", error);
    return [];
  }
}

  


  export const updateStarredMessage = async (messageId: string, isStarred: boolean) => {
    try {
      const { data } = await customAxios().patch(`mmm/message/updateMessage/${messageId}`, { starred: isStarred });
  
      return data;
    } catch (error) {
      console.error("Error updating starred status:", error);
      throw error;
    }
  };
  export const updatetrasshedMessage = async (messageId: string, isDeleted: boolean) => {
    try {
      const { data } = await customAxios().patch(`mmm/message/updateMessage/${messageId}`, { deleted: isDeleted });
  
      return data;
    } catch (error) {
      console.error("Error updating starred status:", error);
      throw error;
    }
  };
  
  export const starTrashstarred = async (): Promise<MessageData[]> => {
    try {
      const { data } = await customAxios().get("mmm/message/starTrash/starred");
      return toMessageArray(data?.data ?? data) ?? [];
    } catch (error) {
      console.error("Error fetching messages:", error);
      return [];
    }
  }

  export const deleteMessage = async (messageId: string): Promise<void> => {
    try {
      await customAxios().delete(`mmm/message/deleteMessage/${messageId}`);
    } catch (error) {
      console.error("Error deleting message:", error);
      throw error; 
    }
  };


  
  


export const trashMessage = async (): Promise<MessageData[]> => {
  try {
    const { data } = await customAxios().get("mmm/message/starTrash/trashed");
    return toMessageArray(data?.data ?? data) ?? [];
  } catch (error) {
    console.error("Error fetching trash messages:", error);
    return [];
  }
};


