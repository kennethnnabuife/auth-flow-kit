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
  const [loading, setLoading] = useState<boolean>(true);

  const getToken = () => {
    return getStoredAccessToken();
  };

  const persistUser = (user: User) => {
    localStorage.setItem("afk_user", JSON.stringify(user));
    setUser(user);
  };

  const storeAuth = (res: StandardAuthResponse) => {
    setStoredAccessToken(res.accessToken);
    persistUser(res.user);
  };

  const restoreUser = () => {
    const stored = localStorage.getItem("afk_user");

    if (!stored) return;

    try {
      const parsed = JSON.parse(stored);
      setUser(parsed);
    } catch {
      localStorage.removeItem("afk_user");
    }
  };

  useEffect(() => {
    restoreUser();
    setLoading(false);
  }, []);

  const login: AuthContextType["login"] = async (email, password) => {
    const url = makeURL(baseURL, endpoints.login);

    const response = await httpJSON<StandardAuthResponse>(url, {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
    });

    storeAuth(response);

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

    storeAuth(response);

    if (onLoginSuccess) {
      onLoginSuccess();
    }
  };

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
