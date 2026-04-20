"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import TopBar from "../components/shell/TopBar";
import Sidebar from "../components/shell/Sidebar";
import AuthHydrator from "../components/auth/AuthHydrator";
import { useAuthStore } from "@/store/auth";

const TOKEN_STORAGE_KEY = "omni:token";

export default function OsLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedToken = window.localStorage.getItem(TOKEN_STORAGE_KEY);
    const hasStoredToken = Boolean(storedToken && storedToken.length > 0);

    if (!accessToken && !hasStoredToken) {
      router.replace("/login");
      return;
    }

    setChecked(true);
  }, [accessToken, router]);

  if (!checked) {
    return (
      <div className="omni-shell omni-shell--booting" aria-busy="true" aria-live="polite" />
    );
  }

  return (
    <div className="omni-shell">
      <AuthHydrator />
      <TopBar />
      <Sidebar />
      <main className="omni-main">{children}</main>
    </div>
  );
}
