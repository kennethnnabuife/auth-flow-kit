import { useMemo, useState } from "react";
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

const STORAGE_KEY = "afk_user";

export function useProvideAuth(
  config: AuthProviderConfig,
): AuthContextType {
  const { baseURL, endpoints, onLoginSuccess, onLogout } = config;

  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  const loading = false;

  async function requestAuth(
    endpoint: string,
    payload: unknown,
  ): Promise<User> {
    const url = makeURL(baseURL, endpoint);

    const res = await httpJSON<StandardAuthResponse>(url, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    setStoredAccessToken(res.accessToken);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(res.user));
    setUser(res.user);

    return res.user;
  }

  async function login(email: string, password: string) {
    await requestAuth(endpoints.login, { email, password });
    onLoginSuccess?.();
  }

  async function signup(payload: unknown) {
    await requestAuth(endpoints.signup, payload);
    onLoginSuccess?.();
  }

  function logout() {
    setStoredAccessToken(null);
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
    onLogout?.();
  }

  function getToken() {
    return getStoredAccessToken();
  }

  return useMemo(
    () => ({
      user,
      loading,
      login,
      signup,
      logout,
      getToken,
      config,
    }),
    [user, config],
  );
}
