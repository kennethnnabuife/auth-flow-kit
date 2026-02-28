"use client";

import React from "react";
import { useProtected } from "./useProtected";

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
  const { loading, isAuthenticated } = useProtected({ redirectTo });

  if (loading) return <>{fallback}</>;
  if (!isAuthenticated) return null;

  return <>{children}</>;
}
