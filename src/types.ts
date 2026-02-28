/*
This file contains all the TypeScript types used by auth-flow-kit.
These types help developers get:
- autocomplete in their editor
- clear error messages
- correct function arguments
- a clear idea of what data the library expects

WHY THIS FILE IS IMPORTANT:
If this file was removed, developers using your package would:
- lose autocomplete suggestions
- lose TypeScript safety
- see "any" everywhere
- not know the shape of the user object
- not know which endpoints to provide
- be more likely to make mistakes
 */

export type User = {
  id: string | number;
  name: string;
  email: string;
  role?: string;
};

export type StandardAuthResponse = {
  accessToken: string;
  refreshToken?: string;
  user: User;
};

export type EndpointsConfig = {
  login: string;
  signup: string;
  forgot: string;
};

export type AuthProviderConfig = {
  baseURL: string;
  endpoints: EndpointsConfig;
  onLoginSuccess?: () => void;
  onLogout?: () => void;
};

export type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (payload: {
    name: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => void;
  getToken: () => string | null;
  config: AuthProviderConfig;
};
