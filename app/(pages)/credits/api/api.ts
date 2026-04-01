import { customAxios } from "@/utils/axios-interceptor";

export const getAllPackage = async () => {
  try {
    const result = await customAxios().get(`mmm/package/getallpackages`);
    return result;
  } catch (error) {
    console.log(error);
  }
};

export type PayPalOrderCurrency = "USD" | "LKR" | "INR" | "EUR";

export const createPayPalOrder = async (
  packageId: number,
  currency: PayPalOrderCurrency = "USD"
) => {
  return customAxios().post(`mmm/paypal-gateway/create-order`, {
    packageId,
    currency,
  });
};

export const getPayPalOrder = async (orderId: string) => {
  return customAxios().get(`mmm/paypal-gateway/order/${encodeURIComponent(orderId)}`);
};
