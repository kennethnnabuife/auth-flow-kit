import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  PropsWithChildren,
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

const USER_KEY = "afk_user";

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (ctx === null) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}

export function AuthProvider({
  config,
  children,
}: PropsWithChildren<{ config: AuthProviderConfig }>) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const { baseURL, endpoints, onLoginSuccess, onLogout } = config;

  const getToken = () => getStoredAccessToken();

  // Initial restore
  useEffect(() => {
    const stored = localStorage.getItem(USER_KEY);
    if (stored !== null) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem(USER_KEY);
      }
    }
    setLoading(false);
  }, []);

  const handleAuthSuccess = (res: StandardAuthResponse) => {
    setStoredAccessToken(res.accessToken);
    localStorage.setItem(USER_KEY, JSON.stringify(res.user));
    setUser(res.user);

    if (onLoginSuccess) {
      onLoginSuccess();
    }
  };

  const login: AuthContextType["login"] = async (email, password) => {
    const response = await httpJSON<StandardAuthResponse>(
      makeURL(baseURL, endpoints.login),
      {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }
    );

    handleAuthSuccess(response);
  };

  const signup: AuthContextType["signup"] = async (payload) => {
    const response = await httpJSON<StandardAuthResponse>(
      makeURL(baseURL, endpoints.signup),
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );

    handleAuthSuccess(response);
  };

  const logout = () => {
    setStoredAccessToken(null);
    localStorage.removeItem(USER_KEY);
    setUser(null);

    if (onLogout) {
      onLogout();
    }
  };

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      loading,
      login,
      signup,
      logout,
      getToken,
      config,
    }),
    [user, loading, config]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
