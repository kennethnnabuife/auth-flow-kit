"use client";

<<<<<<< HEAD
import { useEffect } from "react";
import { useAuth } from "./AuthContext";
=======
import React from "react";
import { useProtected } from "./useProtected";
>>>>>>> 15a5247305f90e9cbcb1eb5d0d5886df66a7469e

type UseProtectedOptions = {
  redirectTo?: string;
  fallback?: React.ReactNode;
};

<<<<<<< HEAD
export function useProtected({ redirectTo }: UseProtectedOptions) {
  const { user, loading } = useAuth();

  const isAuthenticated = !!user;
  const isReady = !loading;

  useEffect(() => {
    if (isReady && !isAuthenticated && redirectTo) {
      window.location.replace(redirectTo);
    }
  }, [isReady, isAuthenticated, redirectTo]);

  return {
    loading,
    isAuthenticated,
  };
=======
export default function Protected({
  children,
  redirectTo,
  fallback = <div>Loading...</div>,
}: ProtectedProps) {
  const { loading, isAuthenticated } = useProtected({ redirectTo });

  if (loading) return <>{fallback}</>;
  if (!isAuthenticated) return null;

  return <>{children}</>;
>>>>>>> 15a5247305f90e9cbcb1eb5d0d5886df66a7469e
}
