import { cookies } from "next/headers";

import type { ApiEnvelope, User } from "./types";

const DEFAULT_API_URL = "http://127.0.0.1:8000/api/v1";
const TOKEN_COOKIE = "ceylon_ads_token";

export function getLaravelApiUrl() {
  return process.env.LARAVEL_API_URL ?? DEFAULT_API_URL;
}

export async function laravelFetch<T>(
  path: string,
  init?: RequestInit & { token?: string | null }
) {
  const headers = new Headers(init?.headers);
  headers.set("Accept", "application/json");

  if (init?.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (init?.token) {
    headers.set("Authorization", `Bearer ${init.token}`);
  }

  const response = await fetch(`${getLaravelApiUrl()}${path}`, {
    ...init,
    headers,
    cache: init?.cache ?? "no-store",
  });

  const payload = (await response.json().catch(() => null)) as ApiEnvelope<T> | null;

  if (!response.ok || !payload?.success) {
    const message =
      payload && "message" in payload && payload.message
        ? payload.message
        : "Request failed";

    throw new Error(message);
  }

  return payload.data;
}

export async function getServerToken() {
  const cookieStore = await cookies();
  return cookieStore.get(TOKEN_COOKIE)?.value ?? null;
}

export async function getCurrentUser() {
  const token = await getServerToken();
  if (!token) {
    return null;
  }

  try {
    return await laravelFetch<User>("/auth/me", { token });
  } catch {
    return null;
  }
}

export { TOKEN_COOKIE };
