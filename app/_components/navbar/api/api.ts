import { customAxios } from "@/utils/axios-interceptor";

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
