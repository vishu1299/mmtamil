"use client";
import React, { useState, useRef, useEffect } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import Link from "next/link";
import { z } from "zod";
import { toast } from "react-toastify";
import { otpapi, verifyOtpPassword, resetPassword } from "../api/api";
import { useRouter } from "next/navigation";

const OTP_EXPIRY_SECONDS = 4 * 60; // 4 minutes
const OTP_LENGTH = 6;

const formSchema = z
  .object({
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [showOtpSection, setShowOtpSection] = useState(false);
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpDigits, setOtpDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const otpRefs = useRef<(HTMLInputElement | null)[]>(Array(OTP_LENGTH).fill(null));

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    if (value && !/^\d$/.test(value)) return;

    const newDigits = [...otpDigits];
    newDigits[index] = value;
    setOtpDigits(newDigits);
    setOtp(newDigits.join(""));

    if (value && index < OTP_LENGTH - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pastedData) return;

    const newDigits = [...otpDigits];
    for (let i = 0; i < pastedData.length; i++) {
      newDigits[i] = pastedData[i];
    }
    setOtpDigits(newDigits);
    setOtp(newDigits.join(""));

    const focusIndex = Math.min(pastedData.length, OTP_LENGTH - 1);
    otpRefs.current[focusIndex]?.focus();
  };
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailerror, setEmailError] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [otpExpiry, setOtpExpiry] = useState(OTP_EXPIRY_SECONDS);
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!showOtpSection || showPasswordSection) return;
    const interval = setInterval(() => {
      setOtpExpiry((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [showOtpSection, showPasswordSection]);

  useEffect(() => {
    if (showOtpSection && !showPasswordSection) {
      setOtpExpiry(OTP_EXPIRY_SECONDS);
    }
  }, [showOtpSection, showPasswordSection]);

  const fetch = async (email: string) => {
    try {
      const data = { email };
      const result = await otpapi(data, setEmailError);
      console.log("OTP API Response:", result.data);
      if (result.data.code === 201 || result.data.code === 200) {
        setShowOtpSection(true);
        toast.success("OTP sent successfully!");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    }
  };

  const handleVerificationOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await verifyOtpPassword({
        email,
        otp,
      });

      if (result?.data?.code === 200 || result?.data?.code === 201) {
        console.log("result", result);
        setResetToken(result.data.data.token);
        setShowPasswordSection(true);
        toast.success("OTP verified successfully!");
      } else {
        toast.error("Invalid OTP");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Invalid OTP");
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = formSchema.safeParse({ newPassword, confirmPassword });

    if (!result.success) {
      const formattedErrors = result.error.flatten().fieldErrors;
      toast.error("Password must be at least 8 characters");
      setErrors(
        Object.fromEntries(
          Object.entries(formattedErrors).map(([key, value]) => [
            key,
            value?.[0] || "",
          ])
        )
      );
      return;
    }

    try {
      const resetResult = await resetPassword({
        resetToken,
        newPassword,
      });

      if (resetResult?.data?.code === 200 || resetResult?.data?.code === 201) {
        toast.success("Password updated successfully!");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        toast.error("Unexpected response from server");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to reset password";
      toast.error(errorMessage);
    }
  };

  const handleSendOtp = (e: any) => {
    e.preventDefault();
    if (email) {
      fetch(email);
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-2xl border border-[#EADDDD]">
      {!showOtpSection ? (
        <div>
          <h2 className="font-playfair text-2xl font-bold text-center text-[#8D1B3D] mb-3">
            Forgot your password?
          </h2>
          <p className="text-[#6B6B6B] text-sm text-center mb-8">
            Enter your email address and we&apos;ll send you an OTP to reset your
            password.
          </p>
          <form onSubmit={handleSendOtp}>
            <div className="mb-5">
              <label
                htmlFor="email"
                className="block text-[#2C2C2C] text-sm font-medium mb-1.5"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                placeholder="you@example.com"
                className="w-full px-4 py-3 border border-[#EADDDD] rounded-xl text-sm text-[#2C2C2C] placeholder:text-[#6B6B6B] focus:outline-none focus:border-[#8D1B3D] focus:ring-2 focus:ring-[#8D1B3D]/10 hover:border-[#8D1B3D]/30 transition-all duration-200"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {emailerror && (
                <p className="text-red-600 text-xs mt-1.5">{emailerror}</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-[#8D1B3D] hover:bg-[#6B1530] text-white font-semibold py-3 rounded-xl transition-all duration-200 active:scale-[0.98]"
            >
              Send OTP
            </button>
            <div className="mt-5 text-center">
              <Link
                href="/login"
                className="text-sm text-[#8D1B3D] font-medium hover:text-[#6B1530] hover:underline transition-all duration-200"
              >
                Back to Login
              </Link>
            </div>
          </form>
        </div>
      ) : !showPasswordSection ? (
        <div className="w-full max-w-md">
          {/* Logo - Figma: centered at top */}
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center gap-1">
              <span className="bg-[#8D1B3D] text-white px-3 py-1 rounded text-lg font-semibold">
                மாங்கல்யம்
              </span>
              <span className="text-[#2C2C2C] text-lg font-semibold">
                தமிழ்
              </span>
            </div>
            <p className="text-[#9CA3AF] text-xs uppercase tracking-wider mt-1">
              MARRIAGE INFO SERVICE
            </p>
          </div>

          <h2 className="text-[#2C2C2C] text-xl font-bold mb-6 text-left">
            Enter OTP
          </h2>

          <form onSubmit={handleVerificationOtp}>
            <div className="flex gap-3 mb-4">
              {otpDigits.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { otpRefs.current[index] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  placeholder="0"
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  onPaste={index === 0 ? handleOtpPaste : undefined}
                  className="w-14 h-14 text-center text-xl font-semibold bg-[#F5F5F5] border border-[#E5E7EB] rounded-lg text-[#2C2C2C] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#8D1B3D] focus:ring-2 focus:ring-[#8D1B3D]/20 transition-all"
                />
              ))}
            </div>

            <p className="text-[#6B6B6B] text-sm mb-6 text-left">
              OTP has been sent to {email}
            </p>

            <button
              type="submit"
              disabled={otpExpiry <= 0}
              className="w-full bg-[#800000] hover:bg-[#6B1530] disabled:bg-[#9CA3AF] disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-lg transition-all duration-200 active:scale-[0.98]"
            >
              Verify
            </button>

            <p className="text-[#6B6B6B] text-sm mt-4 text-left">
              Expires in{" "}
              <span className="font-medium">
                {String(Math.floor(otpExpiry / 60)).padStart(2, "0")}:
                {String(otpExpiry % 60).padStart(2, "0")}
              </span>
            </p>

            <button
              type="button"
              className="mt-6 text-sm text-[#8D1B3D] font-medium hover:text-[#6B1530] hover:underline transition-colors"
              onClick={() => setShowOtpSection(false)}
            >
              Back to email entry
            </button>
          </form>
        </div>
      ) : (
        <div>
          <h2 className="font-playfair text-2xl font-bold text-center text-[#8D1B3D] mb-3">
            Reset your password
          </h2>
          <p className="text-[#6B6B6B] text-sm text-center mb-8">
            Create a new secure password
          </p>
          <form onSubmit={handleResetPassword}>
            <div className="mb-5">
              <label
                htmlFor="newPassword"
                className="block text-[#2C2C2C] text-sm font-medium mb-1.5"
              >
                New Password
              </label>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  id="newPassword"
                  placeholder="New Password"
                  className="w-full px-4 py-3 pr-11 border border-[#EADDDD] rounded-xl text-sm text-[#2C2C2C] placeholder:text-[#6B6B6B] focus:outline-none focus:border-[#8D1B3D] focus:ring-2 focus:ring-[#8D1B3D]/10 hover:border-[#8D1B3D]/30 transition-all duration-200"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B6B6B] hover:text-[#8D1B3D] transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-600 text-xs mt-1.5">
                  {errors.password}
                </p>
              )}
            </div>
            <div className="mb-6">
              <label
                htmlFor="confirmPassword"
                className="block text-[#2C2C2C] text-sm font-medium mb-1.5"
              >
                Confirm Password
              </label>
              <div className="relative group">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  placeholder="Confirm Password"
                  className="w-full px-4 py-3 pr-11 border border-[#EADDDD] rounded-xl text-sm text-[#2C2C2C] placeholder:text-[#6B6B6B] focus:outline-none focus:border-[#8D1B3D] focus:ring-2 focus:ring-[#8D1B3D]/10 hover:border-[#8D1B3D]/30 transition-all duration-200"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B6B6B] hover:text-[#8D1B3D] transition-colors"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOffIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-600 text-xs mt-1.5">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-[#8D1B3D] hover:bg-[#6B1530] text-white font-semibold py-3 rounded-xl transition-all duration-200 active:scale-[0.98]"
            >
              Reset Password
            </button>
            <div className="mt-5 text-center">
              <button
                type="button"
                className="text-sm text-[#8D1B3D] font-medium hover:text-[#6B1530] hover:underline transition-all duration-200"
                onClick={() => {
                  setShowPasswordSection(false);
                  setShowOtpSection(false);
                }}
              >
                Start Over
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
