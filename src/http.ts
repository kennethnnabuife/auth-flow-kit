/*
 This file contains the low-level HTTP utilities used internally by
 auth-flow-kit to communicate with the backend.

 It provides:
  - makeURL: safely joins baseURL + endpoint path
  - getStoredAccessToken: reads the JWT from localStorage
  - setStoredAccessToken: stores/removes the JWT
  - httpJSON: wrapper around fetch with JSON + optional auth header

 NOTES FOR DEVELOPERS USING THE LIBRARY:
 You do NOT need to import or modify anything in this file.
 It is an internal helper used by the AuthProvider and auth screens.

 This keeps the library lightweight, predictable,
 and familiar to developers used to Redux Toolkit-style authentication.
*/

export function makeURL(baseURL: string, path: string) {
  const base = baseURL.replace(/\/$/, "");
  const suffix = path.startsWith("/") ? path : `/${path}`;

  return `${base}${suffix}`;
}

export function getStoredAccessToken(): string | null {
  try {
    return localStorage.getItem("afk_access_token");
  } catch {
    return null;
  }
}

export function setStoredAccessToken(token: string | null) {
  try {
    if (token) {
      localStorage.setItem("afk_access_token", token);
      return;
    }

    localStorage.removeItem("afk_access_token");
  } catch {
    // Storage may be unavailable (private mode, browser restrictions, etc.)
  }
}

export async function httpJSON<T>(
  url: string,
  opts: RequestInit = {},
  withAuth = false,
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (withAuth) {
    const storedToken = getStoredAccessToken();
    if (storedToken) {
      headers["Authorization"] = `Bearer ${storedToken}`;
    }
  }

  const res = await fetch(url, {
    ...opts,
    headers: {
      ...headers,
      ...(opts.headers || {}),
    },
  });

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    const contentType = res.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      try {
        const body = await res.json();
        if (body?.message) {
          message = body.message;
        }
      } catch {
        // ignore malformed JSON responses
      }
    }

    if (contentType.includes("text/html")) {
      if (res.status === 404 && url.includes("forgot")) {
        message =
          "The forgot password endpoint you added in config.endpoints.forgot does not exist in your server. Please check and update your config.endpoints.forgot";
      } else {
        message = "Unexpected server error";
      }
    }

    if (res.status === 404 && url.includes("forgot")) {
      console.error(
        `[auth-flow-kit] Password reset endpoint not found.

        Expected a POST route matching:
          ${url}

        Fix this by either:
        - Adding the route on your backend, or
        - Updating config.endpoints.forgot`,
      );
    }

    throw new Error(message);
  }

  return res.json() as Promise<T>;
}
