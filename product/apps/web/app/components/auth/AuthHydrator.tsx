"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth";

const TOKEN_STORAGE_KEY = "omni:token";

export default function AuthHydrator(): null {
  const setAuth = useAuthStore((state) => state.setAuth);
  const refreshAuth = useAuthStore((state) => state.refreshAuth);

  useEffect(() => {
    let cancelled = false;

    const hydrate = async (): Promise<void> => {
      if (typeof window === "undefined") return;

      const storedToken = window.localStorage.getItem(TOKEN_STORAGE_KEY);
      if (storedToken && storedToken.length > 0) {
        setAuth(storedToken);
      }

      try {
        await refreshAuth();
      } catch {
        // Silent refresh failure is non-fatal; route guards handle redirects.
      }

      if (cancelled) return;
    };

    void hydrate();

    return () => {
      cancelled = true;
    };
  }, [setAuth, refreshAuth]);

  return null;
}
