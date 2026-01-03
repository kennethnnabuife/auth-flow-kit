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
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

export function AuthProvider({
  config,
  children,
}: React.PropsWithChildren<{ config: AuthProviderConfig }>) {
  const { baseURL, endpoints, onLoginSuccess, onLogout } = config;

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const getToken = () => getStoredAccessToken();

  // Restore user from localStorage on app load
  useEffect(() => {
    const savedUser = localStorage.getItem("afk_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // LOGIN
  const login: AuthContextType["login"] = async (email, password) => {
    const url = makeURL(baseURL, endpoints.login);

    const res = await httpJSON<StandardAuthResponse>(url, {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    // store token + user
    setStoredAccessToken(res.accessToken);
    localStorage.setItem("afk_user", JSON.stringify(res.user));

    setUser(res.user);

    if (onLoginSuccess) onLoginSuccess();
  };

  // SIGNUP
  const signup: AuthContextType["signup"] = async (payload) => {
    const url = makeURL(baseURL, endpoints.signup);

    const res = await httpJSON<StandardAuthResponse>(url, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    setStoredAccessToken(res.accessToken);
    localStorage.setItem("afk_user", JSON.stringify(res.user));

    setUser(res.user);

    if (onLoginSuccess) onLoginSuccess();
  };

  // LOGOUT
  const logout = () => {
    setStoredAccessToken(null);
    localStorage.removeItem("afk_user");
    setUser(null);

    if (onLogout) onLogout();
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
