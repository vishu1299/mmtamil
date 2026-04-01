import { customAxios } from "@/utils/axios-interceptor";

export const peopleFollowing = async () => {
    const token = localStorage.getItem("access-token");
 
    
    if(token){
        const toker = JSON.parse(token);
        try {
            const result = await customAxios().get(`mmm/user-web/getById/${toker.data.result.id}`);
    
            console.log( "PeopleFollowing data", result);
            return result;
        } catch (error) {
            console.error("Error in PeopleFollowing:", error);
        }
    }
    
   
};


export const followUnfollow = async (id:number) =>{
    try {
        const datam = {
            followingId : id,
            status : "FOLLOW"
        }
        const result = await customAxios().post(`mmm/followUnfollow/createOrDelete`,datam)
        return result;
    } catch (error) {
        console.log(error);
    }
}



export const LikeUnlike = async (id:number) => {
    try {
        const data = {
            postId : id,
            status : "LIKE"
        }
        const result = await customAxios().post(`mmm/likeDislike/createOrDelete`,data)
        return result
    } catch (error) {
        console.log(error);
    }
}



export const getAllFollowingPost = async () => {
    try{
        const result = await customAxios().get(`mmm/followUnfollow/getAllFollowing`);
        console.log(result);
        return result;
    }
    catch(error){
        console.log(error);
    }
}