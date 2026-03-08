/*
Usage:

<AuthProvider config={...}>
  <App />
</AuthProvider>

Anywhere in the app:

const { user, login, logout, getToken } = useAuth();
*/

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AuthContextType,
  AuthProviderConfig,
  StandardAuthResponse,
  User,
} from "./types";

import {
  httpJSON,
  makeURL,
  setStoredAccessToken,
  getStoredAccessToken,
} from "./http";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Hook wrapper for consuming the auth context
 */
export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);

  if (ctx === undefined) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return ctx;
}

export function AuthProvider({
  config,
  children,
}: React.PropsWithChildren<{ config: AuthProviderConfig }>) {
  const { baseURL, endpoints, onLoginSuccess, onLogout } = config;

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * Access token accessor
   */
  const getToken = () => {
    return getStoredAccessToken();
  };

  /**
   * Restore persisted user session on initial mount
   */
  useEffect(() => {
    const stored = localStorage.getItem("afk_user");

    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed);
      } catch {
        localStorage.removeItem("afk_user");
      }
    }

    setLoading(false);
  }, []);

  /**
   * LOGIN
   */
  const login: AuthContextType["login"] = async (email, password) => {
    const url = makeURL(baseURL, endpoints.login);

    const response = await httpJSON<StandardAuthResponse>(url, {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    // Persist token
    setStoredAccessToken(response.accessToken);

    // Persist user session
    localStorage.setItem("afk_user", JSON.stringify(response.user));

    setUser(response.user);

    if (onLoginSuccess) {
      onLoginSuccess();
    }
  };

  /**
   * SIGNUP
   */
  const signup: AuthContextType["signup"] = async (payload) => {
    const url = makeURL(baseURL, endpoints.signup);

    const response = await httpJSON<StandardAuthResponse>(url, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    setStoredAccessToken(response.accessToken);
    localStorage.setItem("afk_user", JSON.stringify(response.user));

    setUser(response.user);

    if (onLoginSuccess) {
      onLoginSuccess();
    }
  };

  /**
   * LOGOUT
   */
  const logout = () => {
    setStoredAccessToken(null);
    localStorage.removeItem("afk_user");

    setUser(null);

    if (onLogout) {
      onLogout();
    }
  };

  const value = useMemo<AuthContextType>(() => {
    return {
      user,
      loading,
      login,
      signup,
      logout,
      getToken,
      config,
    };
  }, [user, loading, config]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
