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

const STORAGE_USER_KEY = "afk_user";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}

export function AuthProvider({
  config,
  children,
}: PropsWithChildren<{ config: AuthProviderConfig }>) {
  const { baseURL, endpoints, onLoginSuccess, onLogout } = config;

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const getToken = () => getStoredAccessToken();

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_USER_KEY);
    if (raw) {
      setUser(JSON.parse(raw));
    }
    setLoading(false);
  }, []);

  const handlers = {
    applyAuth(res: StandardAuthResponse) {
      setStoredAccessToken(res.accessToken);
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(res.user));
      setUser(res.user);
      onLoginSuccess?.();
    },

    clearAuth() {
      setStoredAccessToken(null);
      localStorage.removeItem(STORAGE_USER_KEY);
      setUser(null);
      onLogout?.();
    },
  };

  const login: AuthContextType["login"] = async (email, password) => {
    const res = await httpJSON<StandardAuthResponse>(
      makeURL(baseURL, endpoints.login),
      {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }
    );

    handlers.applyAuth(res);
  };

  const signup: AuthContextType["signup"] = async (payload) => {
    const res = await httpJSON<StandardAuthResponse>(
      makeURL(baseURL, endpoints.signup),
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );

    handlers.applyAuth(res);
  };

  const logout = () => {
    handlers.clearAuth();
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
