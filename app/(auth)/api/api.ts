import axios, { AxiosResponse } from "axios";

const API_BASE = "https://mmtamil.co.uk/api/mmm/";

export const loginpageapi = async (data: { email: string; password: string }) => {
  try {
    const response = await axios.post(
      `${API_BASE}user-web/login_user`,
      { email: data.email, password: data.password },
      { headers: { "Content-Type": "application/json" } }
    );
    console.log("User Logged In", response);
    localStorage.setItem("access-token", JSON.stringify(response.data));
    return response;
  } catch (error: any) {
    console.error("Login API error:", error?.response?.status, error?.response?.data);
    throw error;
  }
};

/**
 * Google Identity Services credential (JWT) → backend session.
 * Used for both login and OAuth-first registration (backend creates/links user).
 */
export const googleAuthSignIn = async (
  tokenId: string
): Promise<AxiosResponse<unknown>> => {
  const response = await axios.post(
    `${API_BASE}user-web/google-login`,
    { tokenId },
    { headers: { "Content-Type": "application/json" } }
  );
  localStorage.setItem("access-token", JSON.stringify(response.data));
  return response;
};

export const forgotPasswordApi = async (email: string) => {
  try {
    const response = await axios.post(`${API_BASE}user-web/forgot_password`, { email });
    return response;
  } catch (error) {
    console.error("Forgot Password Error:", error);
    throw error;
  }
};
