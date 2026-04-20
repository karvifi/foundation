"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  FileText,
  KanbanSquare,
  Brain,
  Users,
  Inbox,
  Calendar,
  Mail,
  MessageSquare,
  Code2,
  BarChart3,
  CreditCard,
  Headphones,
  Settings,
  Layers,
  PanelLeftClose,
  PanelLeftOpen,
  LayoutGrid,
  FileType2,
  Palette,
  Wand2,
  Package,
  Workflow,
} from "lucide-react";

interface NavItem {
  href: string;
  icon: typeof LayoutDashboard;
  label: string;
  badge: string | null;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

const NAV: NavSection[] = [
  {
    label: "Workspace",
    items: [
      { href: "/dashboard", icon: LayoutDashboard, label: "Home",     badge: null },
      { href: "/inbox",     icon: Inbox,           label: "Inbox",    badge: "7"  },
      { href: "/calendar",  icon: Calendar,        label: "Calendar", badge: null },
    ],
  },
  {
    label: "Create",
    items: [
      { href: "/composer", icon: Wand2,         label: "Composer", badge: "NEW" },
      { href: "/canvas",   icon: LayoutGrid,    label: "Canvas",   badge: null },
      { href: "/design",   icon: Palette,       label: "Design",   badge: null },
      { href: "/pdf",      icon: FileType2,     label: "PDF Tools", badge: null },
      { href: "/build",    icon: Layers,        label: "Build",    badge: null },
      { href: "/docs",     icon: FileText,      label: "Docs",     badge: null },
      { href: "/projects", icon: KanbanSquare,  label: "Projects", badge: null },
      { href: "/code",     icon: Code2,         label: "Code IDE", badge: null },
    ],
  },
  {
    label: "Connect",
    items: [
      { href: "/crm",      icon: Users,          label: "CRM",      badge: "2" },
      { href: "/mail",     icon: Mail,           label: "Email",    badge: null },
      { href: "/messages", icon: MessageSquare,  label: "Messages", badge: null },
      { href: "/support",  icon: Headphones,     label: "Support",  badge: "3" },
    ],
  },
  {
    label: "Analyze",
    items: [
      { href: "/analytics", icon: BarChart3,    label: "Analytics", badge: null },
      { href: "/finance",   icon: CreditCard,   label: "Finance",   badge: null },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { href: "/mind",      icon: Brain,     label: "OmniMind",  badge: "AI" },
      { href: "/automation",icon: Workflow,  label: "Automation", badge: null },
      { href: "/packages",  icon: Package,   label: "Packages",   badge: null },
    ],
  },
];

function isItemActive(pathname: string, href: string): boolean {
  if (pathname === href) return true;
  if (href !== "/dashboard" && pathname.startsWith(href)) return true;
  return false;
}

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <nav
      className={`omni-sidebar${collapsed ? " omni-sidebar--collapsed" : ""}`}
      data-collapsed={collapsed ? "true" : "false"}
      style={collapsed ? { width: 56 } : undefined}
    >
      {NAV.map((section) => (
        <div key={section.label} className="omni-sidebar__section">
          {!collapsed && (
            <div className="omni-sidebar__label">{section.label}</div>
          )}
          {section.items.map((item) => {
            const Icon = item.icon;
            const active = isItemActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                aria-label={item.label}
                className={`omni-sidebar__item${active ? " active" : ""}`}
                style={
                  collapsed
                    ? { justifyContent: "center", padding: "8px 0", position: "relative" }
                    : undefined
                }
              >
                <Icon size={15} />
                {!collapsed && item.label}
                {item.badge && !collapsed && (
                  <span
                    className={`omni-sidebar__badge${
                      item.badge === "AI" ? "" : " omni-sidebar__badge--muted"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                {item.badge && collapsed && item.badge !== "AI" && item.badge !== "NEW" && (
                  <span
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      top: 4,
                      right: 8,
                      width: 6,
                      height: 6,
                      borderRadius: 999,
                      background: "var(--accent, #3b82f6)",
                    }}
                  />
                )}
              </Link>
            );
          })}
          <div className="omni-sidebar__divider" />
        </div>
      ))}

      <div className="omni-sidebar__section" style={{ marginTop: "auto" }}>
        <Link
          href="/settings"
          title={collapsed ? "Settings" : undefined}
          aria-label="Settings"
          className={`omni-sidebar__item${pathname.startsWith("/settings") ? " active" : ""}`}
          style={collapsed ? { justifyContent: "center", padding: "8px 0" } : undefined}
        >
          <Settings size={15} />
          {!collapsed && "Settings"}
        </Link>

        <button
          type="button"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-pressed={collapsed}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          onClick={() => setCollapsed((c) => !c)}
          className="omni-sidebar__item"
          style={{
            background: "transparent",
            border: 0,
            cursor: "pointer",
            color: "inherit",
            width: "100%",
            justifyContent: collapsed ? "center" : "flex-start",
            padding: collapsed ? "8px 0" : undefined,
            marginTop: 4,
          }}
        >
          {collapsed ? <PanelLeftOpen size={15} /> : <PanelLeftClose size={15} />}
          {!collapsed && "Collapse"}
        </button>
      </div>
    </nav>
  );
}
