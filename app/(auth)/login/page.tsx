"use client";
import React, { Suspense, useState, useEffect } from "react";
import Login from "./_components/login";
import { GoogleOAuthProvider } from "@react-oauth/google";
import LoadingPage from "@/app/loadingPage";

const Page = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
      <div>
        <Suspense fallback={<LoadingPage />}>
          <Login />
        </Suspense>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Page;
