import { cookies } from "next/headers";

import type { ApiEnvelope, User } from "./types";

const DEFAULT_API_URL = "http://127.0.0.1:8000/api/v1";
const DEFAULT_ADMIN_API_URL = "http://127.0.0.1:8000/api/admin/v1";
const TOKEN_COOKIE = "ceylon_ads_token";
const ADMIN_TOKEN_COOKIE = "ceylon_ads_admin_token";

export function getLaravelApiUrl() {
  return process.env.LARAVEL_API_URL ?? DEFAULT_API_URL;
}

export function getLaravelAdminApiUrl() {
  return process.env.LARAVEL_ADMIN_API_URL ?? DEFAULT_ADMIN_API_URL;
}

type LaravelFetchOptions = RequestInit & {
  token?: string | null;
  baseUrl?: string;
};

export async function laravelFetch<T>(
  path: string,
  init?: LaravelFetchOptions
) {
  const headers = new Headers(init?.headers);

  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  const baseUrl = init?.baseUrl ?? getLaravelApiUrl();
  const isFormData = typeof FormData !== "undefined" && init?.body instanceof FormData;

  if (init?.body && !isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (init?.token) {
    headers.set("Authorization", `Bearer ${init.token}`);
  }

  const response = await fetch(`${baseUrl}${path}`, {
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

    const error = new Error(message) as Error & { status?: number; errors?: unknown };
    error.status = response.status;
    if (payload && "errors" in payload) {
      error.errors = (payload as { errors?: unknown }).errors;
    }
    throw error;
  }

  return payload.data;
}

export async function laravelAdminFetch<T>(path: string, init?: LaravelFetchOptions) {
  return laravelFetch<T>(path, { ...init, baseUrl: getLaravelAdminApiUrl() });
}

export async function getServerToken() {
  const cookieStore = await cookies();
  return cookieStore.get(TOKEN_COOKIE)?.value ?? null;
}

export async function getServerAdminToken() {
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_TOKEN_COOKIE)?.value ?? null;
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

export async function getCurrentAdmin() {
  const token = await getServerAdminToken();
  if (!token) {
    return null;
  }

  try {
    return await laravelAdminFetch<{ id: string; username: string; role: string; activeState: boolean }>(
      "/auth/me",
      { token }
    );
  } catch {
    return null;
  }
}

export { TOKEN_COOKIE, ADMIN_TOKEN_COOKIE };
