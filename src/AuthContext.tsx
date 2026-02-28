import React, {
  createContext,
  useContext,
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

/* -----------------------------
   Context
--------------------------------*/

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}

/* -----------------------------
   Provider
--------------------------------*/

export function AuthProvider({
  config,
  children,
}: React.PropsWithChildren<{ config: AuthProviderConfig }>) {
  const { baseURL, endpoints, onLoginSuccess, onLogout } = config;

  /* -----------------------------
     Lazy Initialization
  --------------------------------*/

  const [authState, setAuthState] = useState<{
    user: User | null;
    loading: boolean;
  }>(() => {
    const stored = localStorage.getItem("afk_user");
    return {
      user: stored ? JSON.parse(stored) : null,
      loading: false,
    };
  });

  /* -----------------------------
     Internal State Helpers
  --------------------------------*/

  function setUser(user: User | null) {
    setAuthState((prev) => ({
      ...prev,
      user,
    }));
  }

  function persistSession(res: StandardAuthResponse) {
    setStoredAccessToken(res.accessToken);
    localStorage.setItem("afk_user", JSON.stringify(res.user));
    setUser(res.user);
  }

  function clearSession() {
    setStoredAccessToken(null);
    localStorage.removeItem("afk_user");
    setUser(null);
  }

  /* -----------------------------
     Auth Methods
  --------------------------------*/

  async function login(email: string, password: string) {
    const url = makeURL(baseURL, endpoints.login);

    const res = await httpJSON<StandardAuthResponse>(url, {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    persistSession(res);
    onLoginSuccess?.();
  }

  async function signup(payload: unknown) {
    const url = makeURL(baseURL, endpoints.signup);

    const res = await httpJSON<StandardAuthResponse>(url, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    persistSession(res);
    onLoginSuccess?.();
  }

  function logout() {
    clearSession();
    onLogout?.();
  }

  function getToken() {
    return getStoredAccessToken();
  }

  /* -----------------------------
     Memoized Context
  --------------------------------*/

  const value = useMemo<AuthContextType>(
    () => ({
      user: authState.user,
      loading: authState.loading,
      login,
      signup,
      logout,
      getToken,
      config,
    }),
    [authState, config],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
