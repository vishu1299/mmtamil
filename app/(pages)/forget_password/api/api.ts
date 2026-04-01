import axios from "axios";

const API_BASE = "https://mmtamil.co.uk/api/mmm/";

const getAuthHeaders = () => {
  try {
    const tokenString = localStorage.getItem("access-token");
    if (!tokenString) return {};
    const parsed = JSON.parse(tokenString);
    const token = parsed?.token?.access?.token || parsed?.access?.token;
    return token ? { Authorization: token } : {};
  } catch {
    return {};
  }
};

export const otpapi = async (
  data: { email: string },
  setEmailError?: React.Dispatch<React.SetStateAction<string>>
) => {
  try {
    const result = await axios.post(`${API_BASE}otp/sendOtp`, data, {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    });
    if (setEmailError) setEmailError("");
    return result;
  } catch (error: any) {
    console.log(error);
    if (setEmailError) {
      setEmailError(error.response?.data?.message || "Failed to send OTP");
    }
    throw error;
  }
};

export const verifyOtpPassword = async (data: { email: string; otp: string }) => {
  try {
    const result = await axios.post(
      `${API_BASE}otp/verify-otp`,
      { email: data.email, otp: data.otp },
      {
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
      }
    );
    return result;
  } catch (error: any) {
    console.log(error);
    throw error;
  }
};

export const resetPassword = async (data: {
  resetToken: string;
  newPassword: string;
}) => {
  try {
    const result = await axios.post(`${API_BASE}otp/reset`, data, {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    });
    return result;
  } catch (error) {
    throw error;
  }
};