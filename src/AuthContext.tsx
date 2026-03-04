/*
Developers using this library should wrap their app with:
  <AuthProvider config={...}>
    <App />
  </AuthProvider>

Then they can access auth anywhere with:
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

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}

export function AuthProvider({
  config,
  children,
}: React.PropsWithChildren<{ config: AuthProviderConfig }>) {
  const { baseURL, endpoints, onLoginSuccess, onLogout } = config;

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const getToken = () => getStoredAccessToken();

  // -----------------------
  // Local persistence helpers
  // -----------------------

  const storeSession = (res: StandardAuthResponse) => {
    setStoredAccessToken(res.accessToken);
    localStorage.setItem("afk_user", JSON.stringify(res.user));
    setUser(res.user);
  };

  const clearSession = () => {
    setStoredAccessToken(null);
    localStorage.removeItem("afk_user");
    setUser(null);
  };

  // -----------------------
  // Restore user on load
  // -----------------------

  useEffect(() => {
    const stored = localStorage.getItem("afk_user");

    if (stored) {
      try {
        const parsed: User = JSON.parse(stored);
        setUser(parsed);
      } catch {
        localStorage.removeItem("afk_user");
      }
    }

    setLoading(false);
  }, []);

  // -----------------------
  // Auth actions
  // -----------------------

  const login: AuthContextType["login"] = async (email, password) => {
    const url = makeURL(baseURL, endpoints.login);

    const response = await httpJSON<StandardAuthResponse>(url, {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    storeSession(response);

    if (onLoginSuccess) {
      onLoginSuccess();
    }
  };

  const signup: AuthContextType["signup"] = async (payload) => {
    const url = makeURL(baseURL, endpoints.signup);

    const response = await httpJSON<StandardAuthResponse>(url, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    storeSession(response);

    if (onLoginSuccess) {
      onLoginSuccess();
    }
  };

  const logout = () => {
    clearSession();

    if (onLogout) {
      onLogout();
    }
  };

  // -----------------------
  // Context value
  // -----------------------

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
