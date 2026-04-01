import { customAxios } from "@/utils/axios-interceptor";


export const postPayment = async (data: any): Promise<any | null> => {
  try {
    const response = await customAxios().post("mmm/payment/createpayment", data);
    console.log("Payment successfully processed:", response.data);
    return response.data;
  } catch (error) {
      console.log(error)
  }
};

export interface PaymentTransaction {
  id: number;
  transactionID: string;
  userId: number;
  amount: string;
  coins: number;
  status: "SUCCESSFULL" | "FAILED" | "PENDING";
  initiatedDate: string; 
  updatedAt: string;
}
