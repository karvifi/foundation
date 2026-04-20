"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  Sparkles,
  Settings,
  HelpCircle,
  Command,
  LogOut,
  ChevronDown,
  User,
} from "lucide-react";
import OmniBar from "../omnibar/OmniBar";
import { CommandPalette } from "../ui/CommandPalette";
import { useAuthStore } from "@/store/auth";
import "./TopBar.css";

const AVATAR_FALLBACK = "K";

type NotifTone = "red" | "green" | "blue";

interface NotifItem {
  id: string;
  title: string;
  sub: string;
  read: boolean;
  tone: NotifTone;
}

const NOTIFICATIONS: NotifItem[] = [
  { id: "n1", title: "Automation 'Lead scoring' failed on node 3", sub: "5min ago", read: false, tone: "red" },
  { id: "n2", title: "Invoice INV-0089 paid $8,400",                sub: "2h ago",   read: false, tone: "green" },
  { id: "n3", title: "TechCorp deal moved to Negotiation",          sub: "3h ago",   read: false, tone: "blue" },
];

const WORKSPACES: Array<{ id: string; name: string }> = [
  { id: "personal", name: "Personal" },
  { id: "acme",     name: "Acme Corp" },
  { id: "side",     name: "Side Project" },
];

function resolveAvatarInitial(userId: string | null): string {
  if (!userId || userId.length === 0) return AVATAR_FALLBACK;
  const firstChar = userId.trim().charAt(0);
  return firstChar.length > 0 ? firstChar.toUpperCase() : AVATAR_FALLBACK;
}

export default function TopBar() {
  const router = useRouter();
  const userId = useAuthStore((state) => state.userId);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const [omniOpen, setOmniOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifs, setNotifs] = useState(NOTIFICATIONS);
  const [workspaceId, setWorkspaceId] = useState<string>(WORKSPACES[0].id);
  const [intentQuery, setIntentQuery] = useState<string>("");
  const [intentFocused, setIntentFocused] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const notifRef = useRef<HTMLDivElement | null>(null);
  const intentRef = useRef<HTMLInputElement | null>(null);

  const unreadCount = notifs.filter((n) => !n.read).length;
  const avatarInitial = resolveAvatarInitial(userId);

  useEffect(() => {
    const handleGlobalKey = (event: KeyboardEvent): void => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        intentRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleGlobalKey);
    return () => document.removeEventListener("keydown", handleGlobalKey);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const handlePointerDown = (event: MouseEvent): void => {
      if (!menuRef.current) return;
      if (menuRef.current.contains(event.target as Node)) return;
      setMenuOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!notifOpen) return;
    const handlePointerDown = (event: MouseEvent): void => {
      if (!notifRef.current) return;
      if (notifRef.current.contains(event.target as Node)) return;
      setNotifOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") setNotifOpen(false);
    };
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [notifOpen]);

  const handleIntentKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === "Enter" && intentQuery.trim()) {
      router.push(`/composer?q=${encodeURIComponent(intentQuery)}`);
      setIntentQuery("");
    }
  };

  const handleIntentClick = (): void => {
    router.push("/composer");
  };

  const handleLogout = (): void => {
    setMenuOpen(false);
    clearAuth();
    router.push("/login");
  };

  return (
    <>
      <header className="omni-topbar">
        <div className="omni-topbar__left">
          <a href="/" className="omni-topbar__logo">
            <div className="omni-topbar__logo-icon">O</div>
            OmniOS
          </a>
          <button
            className="omni-topbar__badge"
            onClick={() => router.push("/changelog")}
            title="What's new"
          >
            <span className="omni-topbar__badge-dot" />
            NEW
          </button>
        </div>

        <div className="omni-topbar__center">
          <div className={`omni-intent-bar ${intentFocused ? "omni-intent-bar--focused" : ""}`}>
            <Sparkles
              size={14}
              className="omni-intent-bar__sparkle"
              style={{ color: "#A78BFA" }}
            />
            <input
              ref={intentRef}
              type="text"
              className="omni-intent-bar__input"
              placeholder="Build, automate, or ask anything..."
              value={intentQuery}
              onChange={(e) => setIntentQuery(e.target.value)}
              onKeyDown={handleIntentKeyDown}
              onFocus={() => setIntentFocused(true)}
              onBlur={() => setIntentFocused(false)}
              onClick={handleIntentClick}
            />
            <span className="omni-intent-bar__hint">
              <Command size={10} style={{ display: "inline-block" }} /> K
            </span>
          </div>
        </div>

        <div className="omni-topbar__actions">
          <div className="notif-bell-wrapper" ref={notifRef}>
            <button
              className="omni-topbar__btn"
              title="Notifications"
              onClick={() => setNotifOpen((o) => !o)}
            >
              <Bell size={15} />
              {unreadCount > 0 && <span className="notif-badge" />}
            </button>
            {notifOpen && (
              <div className="notif-panel">
                <div className="notif-panel__header">
                  <span>Notifications {unreadCount > 0 && <span style={{ color: "var(--accent)", fontWeight: 700 }}>({unreadCount})</span>}</span>
                  <button
                    className="btn btn-ghost btn-sm"
                    style={{ fontSize: 11, color: "var(--text-muted)" }}
                    onClick={() => setNotifs((prev) => prev.map((n) => ({ ...n, read: true })))}
                  >
                    Mark all read
                  </button>
                </div>
                {notifs.map((n) => (
                  <div
                    key={n.id}
                    className={`notif-item${!n.read ? " notif-item--unread" : ""}`}
                    onClick={() => setNotifs((prev) => prev.map((m) => m.id === n.id ? { ...m, read: true } : m))}
                  >
                    <span
                      className={`notif-dot${n.read ? " notif-dot--read" : ""}`}
                      style={{
                        background: n.read
                          ? undefined
                          : n.tone === "red"
                          ? "#ef4444"
                          : n.tone === "green"
                          ? "#22c55e"
                          : "#3b82f6",
                      }}
                    />
                    <div className="notif-item__body">
                      <div className="notif-item__title">{n.title}</div>
                      <div className="notif-item__sub">{n.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button className="omni-topbar__btn" title="Help" onClick={() => router.push("/support")}>
            <HelpCircle size={15} />
          </button>
          <button className="omni-topbar__btn" title="Settings" onClick={() => router.push("/settings")}>
            <Settings size={15} />
          </button>

          <div className="omni-topbar__user" ref={menuRef}>
            <button
              type="button"
              className="omni-topbar__user-trigger"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              aria-label="Account menu"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <div className="omni-topbar__avatar" title="Your account">
                {avatarInitial}
              </div>
              <ChevronDown size={12} />
            </button>

            {menuOpen && (
              <div className="omni-topbar__menu" role="menu">
                <div className="omni-topbar__menu-id" title={userId ?? ""}>
                  {userId ?? "Signed in"}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    textTransform: "uppercase",
                    letterSpacing: 0.6,
                    color: "var(--text-muted)",
                    padding: "6px 12px 4px",
                  }}
                >
                  Workspace
                </div>
                {WORKSPACES.map((ws) => {
                  const active = ws.id === workspaceId;
                  return (
                    <button
                      key={ws.id}
                      type="button"
                      role="menuitemradio"
                      aria-checked={active}
                      className="omni-topbar__menu-item"
                      onClick={() => setWorkspaceId(ws.id)}
                    >
                      <span
                        style={{
                          width: 14,
                          display: "inline-flex",
                          justifyContent: "center",
                          color: "var(--accent)",
                        }}
                      >
                        {active ? "✓" : ""}
                      </span>
                      <span>{ws.name}</span>
                    </button>
                  );
                })}
                <div
                  style={{
                    height: 1,
                    background: "var(--border)",
                    margin: "6px 0",
                  }}
                />
                <button
                  type="button"
                  role="menuitem"
                  className="omni-topbar__menu-item"
                  onClick={() => { setMenuOpen(false); router.push("/settings"); }}
                >
                  <User size={13} />
                  <span>Profile</span>
                </button>
                <button
                  type="button"
                  role="menuitem"
                  className="omni-topbar__menu-item"
                  onClick={() => { setMenuOpen(false); router.push("/settings"); }}
                >
                  <Settings size={13} />
                  <span>Settings</span>
                </button>
                <button
                  type="button"
                  role="menuitem"
                  className="omni-topbar__menu-item"
                  onClick={() => { setMenuOpen(false); router.push("/support"); }}
                >
                  <HelpCircle size={13} />
                  <span>Help</span>
                </button>
                <button
                  type="button"
                  role="menuitem"
                  className="omni-topbar__menu-item"
                  onClick={handleLogout}
                >
                  <LogOut size={13} />
                  <span>Sign out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {omniOpen && <OmniBar onClose={() => setOmniOpen(false)} />}
      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} />
    </>
  );
}
