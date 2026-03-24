/*
 Internal HTTP helpers used by auth-flow-kit.

 Responsibilities:
  - makeURL: combine baseURL + endpoint safely
  - getStoredAccessToken: read JWT from localStorage
  - setStoredAccessToken: persist/remove JWT
  - httpJSON: JSON fetch wrapper with optional auth

 These utilities are used internally by AuthProvider
 and the auth screens. Consumers of the library should
 not import or modify this file directly.

 The goal is to keep networking behaviour predictable
 and consistent with common Redux Toolkit-style auth flows.
*/

const ACCESS_TOKEN_KEY = "afk_access_token";

export function makeURL(baseURL: string, path: string) {
  const normalizedBase = baseURL.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
}

export function getStoredAccessToken(): string | null {
  try {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    return token;
  } catch {
    return null;
  }
}

export function setStoredAccessToken(token: string | null) {
  try {
    if (token !== null) {
      localStorage.setItem(ACCESS_TOKEN_KEY, token);
      return;
    }

    localStorage.removeItem(ACCESS_TOKEN_KEY);
  } catch {
    // ignore storage failures (Safari private mode etc.)
  }
}

export async function httpJSON<T>(
  url: string,
  opts: RequestInit = {},
  withAuth = false,
): Promise<T> {
  const baseHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (withAuth) {
    const token = getStoredAccessToken();
    if (token) {
      baseHeaders["Authorization"] = `Bearer ${token}`;
    }
  }

  const requestHeaders = {
    ...baseHeaders,
    ...(opts.headers ?? {}),
  };

  const response = await fetch(url, {
    ...opts,
    headers: requestHeaders,
  });

  if (!response.ok) {
    let errorMessage = `Request failed (${response.status})`;
    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      try {
        const body = await response.json();
        if (body?.message) {
          errorMessage = body.message;
        }
      } catch {
        // ignore malformed JSON
      }
    }

    if (contentType.includes("text/html")) {
      const forgotEndpoint = url.includes("forgot");

      if (response.status === 404 && forgotEndpoint) {
        errorMessage =
          "The forgot password endpoint you added in config.endpoints.forgot does not exist in your server. Please check and update your config.endpoints.forgot";
      } else {
        errorMessage = "Unexpected server error";
      }
    }

    if (response.status === 404 && url.includes("forgot")) {
      console.error(
        `[auth-flow-kit] Password reset endpoint not found.

Expected a POST route matching:
  ${url}

Fix this by either:
- Adding the route on your backend, or
- Updating config.endpoints.forgot`,
      );
    }

    throw new Error(errorMessage);
  }

  return response.json() as Promise<T>;
}
