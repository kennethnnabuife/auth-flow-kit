import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
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
   Types
--------------------------------*/

type AuthState = {
  user: User | null;
  loading: boolean;
};

type AuthAction =
  | { type: "INIT"; payload: User | null }
  | { type: "AUTH_SUCCESS"; payload: User }
  | { type: "LOGOUT" };

/* -----------------------------
   Reducer
--------------------------------*/

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "INIT":
      return { user: action.payload, loading: false };

    case "AUTH_SUCCESS":
      return { ...state, user: action.payload };

    case "LOGOUT":
      return { ...state, user: null };

    default:
      return state;
  }
}

/* -----------------------------
   Context
--------------------------------*/

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
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

  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    loading: true,
  });

  /* -----------------------------
     Initialize from storage
  --------------------------------*/
  useEffect(() => {
    const stored = localStorage.getItem("afk_user");
    const parsed = stored ? JSON.parse(stored) : null;

    dispatch({ type: "INIT", payload: parsed });
  }, []);

  /* -----------------------------
     Shared Auth Handler
  --------------------------------*/
  async function performAuth(
    endpoint: string,
    body: unknown,
  ): Promise<void> {
    const url = makeURL(baseURL, endpoint);

    const res = await httpJSON<StandardAuthResponse>(url, {
      method: "POST",
      body: JSON.stringify(body),
    });

    // persist
    setStoredAccessToken(res.accessToken);
    localStorage.setItem("afk_user", JSON.stringify(res.user));

    dispatch({ type: "AUTH_SUCCESS", payload: res.user });

    onLoginSuccess?.();
  }

  /* -----------------------------
     Public Methods
  --------------------------------*/

  const login: AuthContextType["login"] = (email, password) => {
    return performAuth(endpoints.login, { email, password });
  };

  const signup: AuthContextType["signup"] = (payload) => {
    return performAuth(endpoints.signup, payload);
  };

  const logout = () => {
    setStoredAccessToken(null);
    localStorage.removeItem("afk_user");

    dispatch({ type: "LOGOUT" });

    onLogout?.();
  };

  const getToken = () => getStoredAccessToken();

  /* -----------------------------
     Memoized Context Value
  --------------------------------*/

  const value = useMemo<AuthContextType>(
    () => ({
      user: state.user,
      loading: state.loading,
      login,
      signup,
      logout,
      getToken,
      config,
    }),
    [state, config],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
