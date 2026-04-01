"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";


const EmailConfirmationPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const token = localStorage.getItem("access-token");
        const isNewUser = localStorage.getItem("isNewUser");
        const email = localStorage.getItem("user-email");
        
        if (token && isNewUser === "true") {
          setIsOpen(true);
          localStorage.setItem("isNewUser", "false");
        }

        if (email) {
          setUserEmail(email);
          setIsOpen(true);
        }
      } catch (error) {
        console.error("Error accessing localStorage:", error);
      }
    }
  }, []);

  if (!isOpen) return null;

  const handleGoToInbox = () => {
    // Open email client or redirect to email provider
    window.open(`mailto:${userEmail}`, '_blank');
    setIsOpen(false);
  };

  const handleChangeEmail = () => {
    // Implement your email change logic here
    setIsOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 relative">
        {/* Close button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Content */}
        <div className="flex flex-col items-center gap-4">
          {/* Profile Images Row */}
          <div className="flex -space-x-2 overflow-hidden mb-4">
            {[1, 2, 3, 4, 5].map((index) => (
              <div key={index} className="w-12 h-12 rounded-full border-2 border-orange-400 overflow-hidden">
                <Image
                  src={`/assets/images/profiles/profile${index}.webp`}
                  alt={`Profile ${index}`}
                  width={48}
                  height={48}
                  className="object-cover"
                />
              </div>
            ))}
          </div>

          <h2 className="text-xl font-semibold text-center">Joe, Confirm Your Email</h2>

          <p className="text-center text-gray-600">
            to get more attention from members! ⭐
          </p>

          <p className="text-sm text-gray-500 text-center">
            It will boost your profile ranking.
          </p>

          <p className="text-sm text-gray-700 text-center">
            Open the email we&apos;ve sent you at:<br />
            <span className="font-medium">{userEmail}</span>
          </p>

          <Button
            onClick={handleGoToInbox}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-md"
          >
            Go to Inbox
          </Button>

          <button
            onClick={handleChangeEmail}
            className="text-gray-600 hover:text-gray-800 text-sm"
          >
            Change Email
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailConfirmationPopup;