"use client";

import React from "react";
import { useAuth } from "./AuthContext";

type ProtectedProps = {
  children: React.ReactNode;
  redirectTo?: string;
  fallback?: React.ReactNode;
};

export default function Protected({
  children,
  redirectTo,
  fallback = <div>Loading...</div>,
}: ProtectedProps) {
  const { user, loading } = useAuth();

  // 1️⃣ Loading state
  if (loading) {
    return <>{fallback}</>;
  }

  // 2️⃣ Not authenticated
  if (!user) {
    if (redirectTo && typeof window !== "undefined") {
      window.location.replace(redirectTo);
    }
    return null;
  }

  // 3️⃣ Authorized
  return <>{children}</>;
}
