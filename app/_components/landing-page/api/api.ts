import axios from "axios";
import { toast } from "react-toastify";

interface prop {
    looking_for: string,
    userName: string,
    dateOfBirth: string,
    email: string,
    phoneNumber:string,
    password: string,
    isAggredTandC: boolean
}
export const registerapi = async(data:prop) => {
    try {
        console.log("Data",data)
        const response =  await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}user-web/createUser`,data);
        console.log("Response",response.data);
        
        if(response.data.code === 201 || response.data.code===200) {
            const logdata= {
                email : data.email,
                password : data.password
            }
            const loggedin = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}user-web/login_user`,logdata)
            console.log("User Logged In",loggedin);
            localStorage.setItem("access-token",JSON.stringify(loggedin.data));
        }
        return response;
    } catch (error) {
        console.log(error);
        const errordata : any =error;
        toast.error(errordata.response.data.message)
    }
}