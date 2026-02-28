import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
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

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({
  config,
  children,
}: React.PropsWithChildren<{ config: AuthProviderConfig }>) {
  const { baseURL, endpoints, onLoginSuccess, onLogout } = config;

  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("afk_user");
    return stored ? JSON.parse(stored) : null;
  });

  const [loading, setLoading] = useState(true);

  const getToken = useCallback(() => {
    return getStoredAccessToken();
  }, []);

  // Centralized success handler (used by login + signup)
  const handleAuthSuccess = useCallback(
    (res: StandardAuthResponse) => {
      setStoredAccessToken(res.accessToken);
      localStorage.setItem("afk_user", JSON.stringify(res.user));
      setUser(res.user);

      onLoginSuccess?.();
    },
    [onLoginSuccess],
  );

  // Generic auth request helper
  const authenticate = useCallback(
    async (endpoint: string, body: unknown) => {
      const url = makeURL(baseURL, endpoint);

      const response = await httpJSON<StandardAuthResponse>(url, {
        method: "POST",
        body: JSON.stringify(body),
      });

      handleAuthSuccess(response);
    },
    [baseURL, handleAuthSuccess],
  );

  const login: AuthContextType["login"] = useCallback(
    async (email, password) => {
      await authenticate(endpoints.login, { email, password });
    },
    [authenticate, endpoints.login],
  );

  const signup: AuthContextType["signup"] = useCallback(
    async (payload) => {
      await authenticate(endpoints.signup, payload);
    },
    [authenticate, endpoints.signup],
  );

  const logout = useCallback(() => {
    setStoredAccessToken(null);
    localStorage.removeItem("afk_user");
    setUser(null);

    onLogout?.();
  }, [onLogout]);

  // Simulate hydration complete
  useEffect(() => {
    setLoading(false);
  }, []);

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
    [user, loading, login, signup, logout, getToken, config],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
