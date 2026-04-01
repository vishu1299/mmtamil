"use client";
import React, { useState } from "react";
import { BiShow, BiHide } from "react-icons/bi";
import { z } from "zod";
import { changepassword } from "../api/api";
import { toast, ToastContainer } from "react-toastify";

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current Password is required"),
    newPassword: z
      .string()
      .min(8, "New Password must be at least 8 characters long")
      .regex(/[A-Z]/, "New Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "New Password must contain at least one lowercase letter")
      .regex(/\d/, "New Password must contain at least one digit")
      .regex(
        /[!@#$%^&*]/,
        "New Password must contain at least one special character"
      ),
    repeatPassword: z.string().min(1, "Repeat Password is required"),
  })
  .refine((data) => data.newPassword === data.repeatPassword, {
    message: "Passwords do not match",
    path: ["repeatPassword"],
  });

const EditPasswordForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    repeatPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));

    try {
      passwordSchema.parse({
        ...formData,
        [id]: value,
      });
      setErrors((prev) => ({ ...prev, [id]: "" }));
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldError = err.errors.find((error) => error.path[0] === id);
        setErrors((prev) => ({
          ...prev,
          [id]: fieldError ? fieldError.message : "",
        }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      passwordSchema.parse(formData);
      setErrors({});

      // Call API
      await changepassword(formData.currentPassword, formData.newPassword);

      setMessage({ text: "Password changed successfully!", type: "success" });
      toast.success("Password has been change successfully!");
      setFormData({ currentPassword: "", newPassword: "", repeatPassword: "" });
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        err.errors.forEach((error) => {
          if (error.path[0]) {
            newErrors[error.path[0] as string] = error.message;
          }
        });
        setErrors(newErrors);
      } else {
        setMessage({
          text: "Failed to change password. Please try again.",
          type: "error",
        });
        toast.error("Failed to change password. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="lg:w-96 md:w-72 border shadow-sm bg-[#fafafa]">
        <form onSubmit={handleSubmit}>
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg font-semibold">Change Password</h2>
            <a
              href="/settings"
              className="text-sm border py-2 px-4 rounded hover:bg-black hover:text-white transition-colors"
            >
              Cancel
            </a>
          </div>

          <div className="px-8 py-8 space-y-6">
            {message && (
              <p
                className={`text-sm p-2 rounded ${
                  message.type === "success"
                    ? "bg-green-200 text-green-700"
                    : "bg-red-200 text-red-700"
                }`}
              >
                {message.text}
              </p>
            )}

            <div>
              <label
                htmlFor="currentPassword"
                className="block mb-2 text-sm font-medium text-gray-600"
              >
                Current Password:
              </label>
              <div className="relative">
                <input
                  id="currentPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Current Password"
                  className="w-full px-4 py-3 border rounded-md focus:outline-none focus:border-gray-400"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <BiShow size={24} /> : <BiHide size={24} />}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="text-red-500 text-sm">{errors.currentPassword}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="newPassword"
                className="block mb-2 text-sm font-medium text-gray-600"
              >
                New Password:
              </label>
              <div className="relative">
                <input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter New Password (8+char)"
                  className="w-full px-4 py-3 border rounded-md focus:outline-none focus:border-gray-400"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                >
                  {showNewPassword ? (
                    <BiShow size={24} />
                  ) : (
                    <BiHide size={24} />
                  )}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-red-500 text-sm">{errors.newPassword}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="repeatPassword"
                className="block mb-2 text-sm font-medium text-gray-600"
              >
                Repeat New Password:
              </label>
              <div className="relative">
                <input
                  id="repeatPassword"
                  type={showRepeatPassword ? "text" : "password"}
                  placeholder="Repeat New Password"
                  className="w-full px-4 py-3 border rounded-md focus:outline-none focus:border-gray-400"
                  value={formData.repeatPassword}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                >
                  {showRepeatPassword ? (
                    <BiShow size={24} />
                  ) : (
                    <BiHide size={24} />
                  )}
                </button>
              </div>
              {errors.repeatPassword && (
                <p className="text-red-500 text-sm">{errors.repeatPassword}</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                className="w-full py-3 bg-pink-500 text-white font-medium rounded-md shadow hover:bg-pink-600 transition disabled:bg-gray-400"
                disabled={loading}
              >
                {loading ? "Changing..." : "Change Password"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPasswordForm;
