/*
  Internal HTTP helpers for auth-flow-kit.

  Responsibilities:
    • Construct safe URLs (makeURL)
    • Persist access token (get/set)
    • Perform JSON requests with optional auth (httpJSON)

  ⚠️ Library users should NOT import this directly.
  Used internally by AuthProvider + auth UI.

  Design goals:
    - predictable
    - minimal
    - RTK-style familiarity
*/

export function makeURL(baseURL: string, path: string) {
  const cleanedBase = baseURL.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${cleanedBase}${normalizedPath}`;
}

export function getStoredAccessToken(): string | null {
  try {
    const token = localStorage.getItem("afk_access_token");
    return token;
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
    // Swallow storage issues (e.g. private mode)
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

  const response = await fetch(url, {
    ...opts,
    headers: {
      ...baseHeaders,
      ...(opts.headers ?? {}),
    },
  });

  if (!response.ok) {
    const contentType = response.headers.get("content-type") ?? "";
    let errorMessage = `Request failed (${response.status})`;

    // JSON error handling
    if (contentType.includes("application/json")) {
      try {
        const payload = await response.json();
        if (payload?.message) {
          errorMessage = payload.message;
        }
      } catch {
        // ignore malformed JSON
      }
    }

    // HTML fallback (common in Express)
    if (contentType.includes("text/html")) {
      if (response.status === 404 && url.includes("forgot")) {
        errorMessage =
          "The forgot password endpoint you added in config.endpoints.forgot does not exist in your server. Please check and update your config.endpoints.forgot";
      } else {
        errorMessage = "Unexpected server error";
      }
    }

    // Dev hint for common misconfig
    if (response.status === 404 && url.includes("forgot")) {
      console.error(
        `[auth-flow-kit] Password reset endpoint not found.

Expected POST route:
  ${url}

Fix by:
  • Adding the endpoint on your backend
  • OR updating config.endpoints.forgot`,
      );
    }

    throw new Error(errorMessage);
  }

  return response.json() as Promise<T>;
}
