/*
  auth-flow-kit — internal HTTP helpers

  This module is intentionally low-level and unopinionated.
  It exists solely to support AuthProvider and auth-related screens.

  Exposed utilities:
  - makeURL              → joins baseURL and endpoint safely
  - getStoredAccessToken → retrieves persisted JWT
  - setStoredAccessToken → persists or clears JWT
  - httpJSON             → fetch wrapper with JSON + auth handling

  ⚠️ Library consumers:
  You should never import or modify this file directly.
*/

export function makeURL(baseURL: string, path: string) {
  const base = baseURL.replace(/\/$/, "");
  const endpoint = path.startsWith("/") ? path : `/${path}`;

  return `${base}${endpoint}`;
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
    if (!token) {
      localStorage.removeItem("afk_access_token");
      return;
    }

    localStorage.setItem("afk_access_token", token);
  } catch {
    // Storage access can fail in restricted environments.
    // This is non-fatal for auth-flow-kit internals.
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
    const accessToken = getStoredAccessToken();
    if (accessToken) {
      baseHeaders["Authorization"] = `Bearer ${accessToken}`;
    }
  }

  const response = await fetch(url, {
    ...opts,
    headers: {
      ...baseHeaders,
      ...(opts.headers || {}),
    },
  });

  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      try {
        const payload = await response.json();
        if (payload?.message) message = payload.message;
      } catch {
        // Ignore invalid JSON error payloads
      }
    }

    if (contentType.includes("text/html")) {
      if (response.status === 404 && url.includes("forgot")) {
        message =
          "The forgot password endpoint you added in config.endpoints.forgot does not exist in your server. Please check and update your config.endpoints.forgot";
      } else {
        message = "Unexpected server error";
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

    throw new Error(message);
  }

  return response.json() as Promise<T>;
}
