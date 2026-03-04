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

/* -------------------------------------------------------
   Context
------------------------------------------------------- */

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* -------------------------------------------------------
   Hook
------------------------------------------------------- */

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};

/* -------------------------------------------------------
   Provider
------------------------------------------------------- */

type Props = PropsWithChildren<{
  config: AuthProviderConfig;
}>;

export function AuthProvider({ config, children }: Props) {
  const { baseURL, endpoints, onLoginSuccess, onLogout } = config;

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const getToken = () => getStoredAccessToken();

  /* Restore session from localStorage on startup */
  useEffect(() => {
    const stored = localStorage.getItem("afk_user");

    if (stored) {
      setUser(JSON.parse(stored));
    }

    setLoading(false);
  }, []);

  /* ---------------------------
     LOGIN
  --------------------------- */

  const login: AuthContextType["login"] = async (email, password) => {
    const url = makeURL(baseURL, endpoints.login);

    const response = await httpJSON<StandardAuthResponse>(url, {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    setStoredAccessToken(response.accessToken);
    localStorage.setItem("afk_user", JSON.stringify(response.user));
    setUser(response.user);

    onLoginSuccess?.();
  };

  /* ---------------------------
     SIGNUP
  --------------------------- */

  const signup: AuthContextType["signup"] = async (payload) => {
    const url = makeURL(baseURL, endpoints.signup);

    const response = await httpJSON<StandardAuthResponse>(url, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    setStoredAccessToken(response.accessToken);
    localStorage.setItem("afk_user", JSON.stringify(response.user));
    setUser(response.user);

    onLoginSuccess?.();
  };

  /* ---------------------------
     LOGOUT
  --------------------------- */

  const logout = () => {
    setStoredAccessToken(null);
    localStorage.removeItem("afk_user");
    setUser(null);

    onLogout?.();
  };

  /* ---------------------------
     Context value
  --------------------------- */

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
    [user, loading, config],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
