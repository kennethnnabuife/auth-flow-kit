"use client";

/*
Protected component

Wraps authenticated routes and automatically redirects unauthenticated users.

The `redirectTo` prop allows consumers of the library to define their own
authentication entry point (e.g. /login, /signin, /auth/login) without
modifying internal library code.

This improves flexibility while preserving backward compatibility🙂.
 */

import React, { useEffect } from "react";
import { useAuth } from "./AuthContext";

type ProtectedProps = {
  children: React.ReactNode;
  redirectTo?: string;
};

export default function Protected({
  children,
  redirectTo = "/login",
}: ProtectedProps) {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = redirectTo;
    }
  }, [loading, user, redirectTo]);

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  return <>{children}</>;
}
