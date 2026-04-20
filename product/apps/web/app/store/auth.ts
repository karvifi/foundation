import { create } from "zustand";

interface AuthState {
  accessToken: string | null;
  userId: string | null;
  orgId: string | null;
  workspaceId: string | null;
  role: string | null;
}

interface AuthActions {
  setAuth: (token: string) => void;
  clearAuth: () => void;
  refreshAuth: () => Promise<boolean>;
}

function parseJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = parts[1]!.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(payload)) as Record<string, unknown>;
  } catch {
    return null;
  }
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  accessToken: null,
  userId: null,
  orgId: null,
  workspaceId: null,
  role: null,

  setAuth(token: string) {
    const payload = parseJwtPayload(token);
    set({
      accessToken: token,
      userId: typeof payload?.["sub"] === "string" ? payload["sub"] : null,
      orgId: typeof payload?.["orgId"] === "string" ? payload["orgId"] : null,
      workspaceId: typeof payload?.["workspaceId"] === "string" ? payload["workspaceId"] : null,
      role: typeof payload?.["role"] === "string" ? payload["role"] : null,
    });
    if (typeof window !== "undefined") {
      localStorage.setItem("omni:token", token);
    }
  },

  clearAuth() {
    set({ accessToken: null, userId: null, orgId: null, workspaceId: null, role: null });
    if (typeof window !== "undefined") {
      localStorage.removeItem("omni:token");
    }
  },

  async refreshAuth(): Promise<boolean> {
    try {
      const res = await fetch(`/api/auth/refresh`, { method: "POST", credentials: "include" });
      if (!res.ok) return false;
      const data = (await res.json()) as { accessToken?: string };
      if (!data.accessToken) return false;
      const payload = parseJwtPayload(data.accessToken);
      set({
        accessToken: data.accessToken,
        userId: typeof payload?.["sub"] === "string" ? payload["sub"] : null,
        orgId: typeof payload?.["orgId"] === "string" ? payload["orgId"] : null,
        workspaceId: typeof payload?.["workspaceId"] === "string" ? payload["workspaceId"] : null,
        role: typeof payload?.["role"] === "string" ? payload["role"] : null,
      });
      if (typeof window !== "undefined") {
        localStorage.setItem("omni:token", data.accessToken);
      }
      return true;
    } catch {
      return false;
    }
  },
}));
