// ─── Client-side session management (localStorage) ────────────────────────────
// This is a lightweight session store. In production you would use
// server-side cookies / JWT. This keeps things simple for the mock layer.

import { AuthUser } from "./api";

const SESSION_KEY = "ecs_session";

export function saveSession(user: AuthUser): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function getSession(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
}
