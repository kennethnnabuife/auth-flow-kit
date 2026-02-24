"use client";

/*
Protected component

Wraps authenticated content and prevents rendering when unauthenticated.

IMPORTANT:
This component does NOT hard-redirect by default.
Navigation should be handled by the host application (router or state).

If redirectTo is provided AND the host app supports routing,
a redirect will occur.
*/

import React, { useEffect } from "react";
import { useAuth } from "./AuthContext";

type ProtectedProps = {
  children: React.ReactNode;
  redirectTo?: string;
};

export default function Protected({ children, redirectTo }: ProtectedProps) {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user && redirectTo) {
      window.location.href = redirectTo;
    }
  }, [loading, user, redirect]);

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  return <>{children}</>;
}
