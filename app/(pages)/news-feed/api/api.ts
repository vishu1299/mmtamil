import { customAxios } from "@/utils/axios-interceptor";

export const allPosts = async (currentPage:number) => {
    try {
        const result = await customAxios().get(`mmm/posts/postExcludeUser?page=${currentPage}&pageSize=5`);
        console.log(result);
        return result
    } catch (error) {
        console.log(error);
        
    }
}



export const postcomment = async (data:{id:number,description:string}) => {
    try {
        const datam = {
            postId : data.id,
            description : data.description
        }
        const result = await customAxios().post(`mmm/Comment/createorUpdateComment`,datam)
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


export const getAllFollowingPost = async (currentPage:number) => {
    try{
        const result = await customAxios().get(`mmm/followUnfollow/getAllFollowing?page=${currentPage}&pageSize=5`);
        console.log(result);
        return result;
    }
    catch(error){
        console.log(error);
    }
}


export const reportPost = async ({id,reason,message,email}:{id:number,reason:string,message:string,email:string}) => {
    try{
        const data = {
            postId : id,
            reason : reason,
            message : message,
            replyemail  : email
        }
        
        const result = await customAxios().post(`mmm/postReport/cOrupostReport`,data)
        return result;
    }
    catch(error){
        console.log(error);
    }
}