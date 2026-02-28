"use client";

import { useEffect } from "react";
import { useAuth } from "./AuthContext";

type UseProtectedOptions = {
  redirectTo?: string;
};

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
}
