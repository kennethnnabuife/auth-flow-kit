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
