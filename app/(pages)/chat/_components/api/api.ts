

import { customAxios } from "@/utils/axios-interceptor";




export interface Message {
  receiverId: number;
  body: string;
  attachments?: File[];
}

export const sendMessage = async (data: Message) => {
    try {
      const formData = new FormData();
      formData.append("receiverId", String(data.receiverId));
      formData.append("body", data.body);
  
      if (data.attachments?.length) {
        data.attachments.forEach((file) => {
          formData.append("attachments", file); 
        });
      }
  
      console.log("FormData being sent:");
      // for (let pair of formData.entries()) {
      //   console.log(`${pair[0]}:`, pair[1]);
      // }
  
      const response = await customAxios().post("/mmm/message/sendMessage", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      console.log("Response:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error sending message:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Failed to send message");
    }
  };
  