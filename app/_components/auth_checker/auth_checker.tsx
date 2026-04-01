"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthChecker({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access-token");
    if (!token) {
      router.push("/");
    } 
  }, []);


  return <>{children}</>;
}
