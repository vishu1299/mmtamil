"use client"
import React, { useState } from "react";
import { z } from "zod";
import { changeEmail, sendOtp } from "../api/api";
import { toast, ToastContainer } from "react-toastify";

const emailSchema = z
  .string()
  .email("Please enter a valid email address")
  .min(5)
  .max(50);
const otpSchema = z
  .string()
  .length(6)
  .regex(/^\d{6}$/, "OTP must contain only numbers");

const EditEmailForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ email?: string; otp?: string }>({});

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setOtpSent(false);
    const validation = emailSchema.safeParse(e.target.value);
    setError((prev) => ({
      ...prev,
      email: validation.success
        ? undefined
        : validation.error.errors[0].message,
    }));
  };

  const handleGenerateOtp = async () => {
    if (!emailSchema.safeParse(email).success) {
      setError((prev) => ({
        ...prev,
        email: "Please enter a valid email before generating OTP",
      }));
      return;
    }
    try {
      const result = await sendOtp(email);
      if (result.code === 200 || result.code === 201) {
        setOtpSent(true);
        toast.success("OTP sent successfully");
      } else {
        toast.error("Something went wrong");
      }
    } catch {
      toast.error("Failed to send OTP. Try again.");
    }
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setOtp(e.target.value);

  const handleChangeEmail = async () => {
    if (!otpSchema.safeParse(otp).success) {
      setError((prev) => ({ ...prev, otp: "Please enter a valid OTP" }));
      return;
    }
    try {
      setLoading(true);
      await changeEmail(otp);
      toast.success("Email updated successfully");
      setEmail("");
      setOtp("");
      setOtpSent(false);
    } catch {
      toast.error("Failed to update email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="bg-[#fafafa] lg:w-96 md:w-72 border-gray-300 shadow-sm p-6 rounded-md">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Change Email
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleChangeEmail();
          }}
          className="space-y-4"
        >
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-600"
            >
              New Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Enter new email"
              className="block w-full px-4 py-2 border rounded-md focus:ring-pink-500 focus:border-pink-500"
            />
            {error.email && (
              <p className="text-red-500 text-sm mt-1">{error.email}</p>
            )}
          </div>

          {!otpSent ? (
            <button
              type="button"
              onClick={handleGenerateOtp}
              className="w-full py-2 bg-pink-500 text-white font-medium rounded-md hover:bg-pink-600 transition"
            >
              Change Email
            </button>
          ) : (
            <div>
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-gray-600"
              >
                Enter OTP
              </label>
              <input
                id="otp"
                type="text"
                value={otp}
                onChange={handleOtpChange}
                placeholder="Enter OTP"
                className="block w-full px-4 py-2 border rounded-md focus:ring-pink-500 focus:border-pink-500"
              />
              {error.otp && (
                <p className="text-red-500 text-sm mt-1">{error.otp}</p>
              )}
            </div>
          )}

          {otpSent && (
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 text-white font-medium rounded-md transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {loading ? "Updating..." : "Verify & Change Email"}
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default EditEmailForm;
