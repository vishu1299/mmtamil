"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const WelcomeCreditsPopup = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if we're in the browser environment
    if (typeof window !== "undefined") {
      try {
        const token = localStorage.getItem("access-token");
        const isNewUser = localStorage.getItem("isNewUser");

        // Show popup for new users with access token
        if (token && isNewUser === "true") {
          setIsOpen(true);
          localStorage.setItem("isNewUser", "false");
        }
      } catch (error) {
        console.error("Error accessing localStorage:", error);
      }
    }
  }, []);

  if (!isOpen) return null;

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
          <div className="w-16 h-16 relative">
            <Image
              src="/assets/images/credits/credits.webp"
              alt="Credits"
              fill
              className="object-contain"
            />
          </div>

          <h2 className="text-2xl font-semibold text-center">Welcome!</h2>

          <p className="text-center">
            Here are{" "}
            <span className="text-green-500 font-semibold">
              20 free credits
            </span>{" "}
            to get you started.
          </p>

          <p className="text-sm text-gray-600 text-center">
            You&apos;ll need credits to chat with other users of Match Meet &
            Marry.
          </p>
          <Link href="/chat">
            <Button
              onClick={() => setIsOpen(false)}
              className="w-full bg-gradient-to-r from-[#F05A8E] to-[#ED1C24] hover:opacity-90 text-white font-semibold py-3 px-6 rounded-md"
            >
              Find someone to chat
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WelcomeCreditsPopup;
