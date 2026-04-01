"use client";
import React, { useEffect, useState } from "react";

import MainPage from "./main";

interface ParamsType {
  searchDetails: string;
}
const Page = ({ params }: { params: Promise<ParamsType> }) => {
  const [resolvedParams, setResolvedParams] = useState<ParamsType | null>(null);

  useEffect(() => {
    const unwrapParams = async () => {
      try {
        const unwrapped = await params;
        setResolvedParams(unwrapped);
      } catch (error) {
        console.error("Error unwrapping params:", error);
      }
    };

    unwrapParams();
  }, [params]);

  const userId = resolvedParams?.searchDetails
    ? Number(resolvedParams.searchDetails)
    : null;

  return <>{userId && !isNaN(userId) && <MainPage id={userId} />}</>;
};

export default Page;
