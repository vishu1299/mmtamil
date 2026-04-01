"use client";

import type { ReactNode } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";

type Props = { children: ReactNode };

/**
 * Wraps registration routes so Google Identity Services works on signup.
 * If NEXT_PUBLIC_GOOGLE_CLIENT_ID is missing, children still render (email signup only).
 */
export function LoginStepGoogleProvider({ children }: Props) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";
  if (!clientId) {
    return <>{children}</>;
  }
  return <GoogleOAuthProvider clientId={clientId}>{children}</GoogleOAuthProvider>;
}
