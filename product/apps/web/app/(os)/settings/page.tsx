"use client";

import { useState } from "react";
import {
  Settings as SettingsIcon,
  Building2,
  Users,
  Shield,
  Bell,
  Key,
  Palette,
  AlertTriangle,
  Upload,
  Mail,
  Plus,
  Copy,
  Trash2,
  Check,
  X,
  Monitor,
  Sun,
  Moon,
  Download,
  ArrowRightLeft,
  Link2,
  ShieldCheck,
  Webhook,
  RefreshCw,
  ExternalLink,
  Search,
} from "lucide-react";

const BG = "#0A0A0F";
const PRIMARY = "#6366F1";
const PANEL = "#12121A";
const BORDER = "#1F1F2C";
const TEXT = "#E5E7EB";
const MUTED = "#8B8B9A";
const SUBTLE = "#5A5A6A";

type SectionId =
  | "general"
  | "members"
  | "security"
  | "integrations"
  | "notifications"
  | "api-keys"
  | "appearance"
  | "danger";

interface NavItem {
  id: SectionId;
  label: string;
  icon: typeof Building2;
  danger?: boolean;
}

const NAV: NavItem[] = [
  { id: "general", label: "General", icon: Building2 },
  { id: "members", label: "Members", icon: Users },
  { id: "security", label: "Security", icon: Shield },
  { id: "integrations", label: "Integrations", icon: Link2 },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "api-keys", label: "API Keys", icon: Key },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "danger", label: "Danger Zone", icon: AlertTriangle, danger: true },
];

type Role = "Owner" | "Admin" | "Member" | "Guest";

interface Member {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
}

interface Invite {
  id: string;
  email: string;
  role: Role;
  sentAt: string;
}

interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  scopes: string[];
  created: string;
  lastUsed: string;
}

const ACCENTS = [
  { name: "Indigo", value: "#6366F1" },
  { name: "Violet", value: "#8B5CF6" },
  { name: "Emerald", value: "#10B981" },
  { name: "Rose", value: "#F43F5E" },
  { name: "Amber", value: "#F59E0B" },
  { name: "Sky", value: "#0EA5E9" },
];

export default function SettingsPage() {
  const [active, setActive] = useState<SectionId>("general");

  const [wsName, setWsName] = useState("Acme Studio");
  const [wsSlug, setWsSlug] = useState("acme-studio");
  const [timezone, setTimezone] = useState("America/New_York");
  const [language, setLanguage] = useState("en-US");

  const [members, setMembers] = useState<Member[]>([
    { id: "1", name: "Karti Vance", email: "karti@acme.co", role: "Owner", avatar: "KV" },
    { id: "2", name: "Sofia Reyes", email: "sofia@acme.co", role: "Admin", avatar: "SR" },
    { id: "3", name: "Jun Park", email: "jun@acme.co", role: "Member", avatar: "JP" },
    { id: "4", name: "Mara Khoury", email: "mara@acme.co", role: "Member", avatar: "MK" },
    { id: "5", name: "Ext. Contractor", email: "guest@outside.io", role: "Guest", avatar: "EC" },
  ]);
  const [invites, setInvites] = useState<Invite[]>([
    { id: "i1", email: "devon@acme.co", role: "Member", sentAt: "2d ago" },
    { id: "i2", email: "priya@acme.co", role: "Admin", sentAt: "5h ago" },
  ]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<Role>("Member");

  const [enforce2FA, setEnforce2FA] = useState(true);
  const [ssoProvider, setSsoProvider] = useState<"none" | "saml" | "oidc">("saml");
  const [sessionTimeout, setSessionTimeout] = useState("8h");
  const [ipAllowlist, setIpAllowlist] = useState("10.0.0.0/8\n192.168.1.0/24");

  const [integrationSearch, setIntegrationSearch] = useState("");
  const [connectedApps, setConnectedApps] = useState([
    { id: "hubspot", name: "HubSpot CRM", color: "#FF7A59", lastSync: "2m ago", live: false },
    { id: "slack-h", name: "Slack", color: "#4A154B", lastSync: "Live", live: true },
    { id: "gmail", name: "Gmail", color: "#EA4335", lastSync: "4m ago", live: false },
    { id: "stripe-h", name: "Stripe", color: "#635BFF", lastSync: "1m ago", live: false },
    { id: "snowflake", name: "Snowflake", color: "#29B5E8", lastSync: "30m ago", live: false },
    { id: "gsheets", name: "Google Sheets", color: "#0F9D58", lastSync: "8m ago", live: false },
  ]);
  const availableApps = [
    { id: "salesforce", name: "Salesforce", category: "CRM", color: "#00A1E0" },
    { id: "zendesk", name: "Zendesk", category: "Support", color: "#03363D" },
    { id: "notion", name: "Notion", category: "Docs", color: "#FFFFFF" },
    { id: "airtable", name: "Airtable", category: "Database", color: "#FCB400" },
    { id: "github-h", name: "GitHub", category: "Dev", color: "#6E7681" },
    { id: "linear-h", name: "Linear", category: "PM", color: "#5E6AD2" },
    { id: "jira", name: "Jira", category: "PM", color: "#0052CC" },
    { id: "docusign", name: "DocuSign", category: "Legal", color: "#FFCC22" },
    { id: "quickbooks", name: "QuickBooks", category: "Finance", color: "#2CA01C" },
    { id: "xero", name: "Xero", category: "Finance", color: "#13B5EA" },
    { id: "twilio", name: "Twilio", category: "Comms", color: "#F22F46" },
    { id: "mailchimp", name: "Mailchimp", category: "Marketing", color: "#FFE01B" },
    { id: "intercom", name: "Intercom", category: "Support", color: "#1F8DED" },
    { id: "pipedrive", name: "Pipedrive", category: "CRM", color: "#1A1A1A" },
    { id: "freshdesk", name: "Freshdesk", category: "Support", color: "#25C16F" },
    { id: "monday", name: "Monday", category: "PM", color: "#FF3D57" },
    { id: "asana", name: "Asana", category: "PM", color: "#F06A6A" },
    { id: "webflow", name: "Webflow", category: "Web", color: "#4353FF" },
  ];
  const [omniApiKey] = useState("oms_live_7Ka9_••••••••••••••••3xR2");
  const [webhookSecret] = useState("whsec_2bC1_••••••••••••••••8nF7");
  const webhookEndpoints = [
    { path: "/api/webhooks/hubspot", events: 847 },
    { path: "/api/webhooks/stripe", events: 2341 },
  ];

  const disconnectApp = (id: string) => {
    setConnectedApps((prev) => prev.filter((a) => a.id !== id));
  };

  const filteredAvailable = availableApps.filter(
    (a) =>
      a.name.toLowerCase().includes(integrationSearch.toLowerCase()) ||
      a.category.toLowerCase().includes(integrationSearch.toLowerCase()),
  );

  const [notifs, setNotifs] = useState({
    mentionsEmail: true,
    mentionsPush: true,
    commentsEmail: true,
    commentsPush: false,
    invitesEmail: true,
    billingEmail: true,
    securityEmail: true,
    securityPush: true,
    digestWeekly: true,
    productUpdates: false,
  });

  const [keys, setKeys] = useState<ApiKey[]>([
    { id: "k1", name: "Production CI", prefix: "sk_live_7a9f", scopes: ["read", "write"], created: "Mar 12, 2026", lastUsed: "2h ago" },
    { id: "k2", name: "Staging bot", prefix: "sk_live_2bc1", scopes: ["read"], created: "Feb 2, 2026", lastUsed: "1d ago" },
  ]);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyScopes, setNewKeyScopes] = useState<string[]>(["read"]);
  const [revealedKey, setRevealedKey] = useState<string | null>(null);

  const [theme, setTheme] = useState<"dark" | "light" | "system">("dark");
  const [accent, setAccent] = useState(PRIMARY);
  const [density, setDensity] = useState<"compact" | "comfortable" | "spacious">("comfortable");

  const [confirmDelete, setConfirmDelete] = useState("");

  const updateMemberRole = (id: string, role: Role) => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, role } : m)));
  };

  const removeMember = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const sendInvite = () => {
    if (!inviteEmail.trim()) return;
    setInvites((prev) => [
      ...prev,
      { id: `i${Date.now()}`, email: inviteEmail.trim(), role: inviteRole, sentAt: "just now" },
    ]);
    setInviteEmail("");
  };

  const toggleScope = (scope: string) => {
    setNewKeyScopes((prev) => (prev.includes(scope) ? prev.filter((s) => s !== scope) : [...prev, scope]));
  };

  const createKey = () => {
    if (!newKeyName.trim() || newKeyScopes.length === 0) return;
    const id = `k${Date.now()}`;
    setKeys((prev) => [
      { id, name: newKeyName.trim(), prefix: `sk_live_${id.slice(-4)}`, scopes: newKeyScopes, created: "just now", lastUsed: "never" },
      ...prev,
    ]);
    setRevealedKey(`sk_live_${id}_${Math.random().toString(36).slice(2, 18)}`);
    setNewKeyName("");
    setNewKeyScopes(["read"]);
  };

  const revokeKey = (id: string) => {
    setKeys((prev) => prev.filter((k) => k.id !== id));
  };

  return (
    <div style={{ background: BG, color: TEXT, minHeight: "100vh", fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", minHeight: "100vh" }}>
        <aside style={{ borderRight: `1px solid ${BORDER}`, padding: "32px 16px", background: "#0C0C14" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 12px 24px", borderBottom: `1px solid ${BORDER}`, marginBottom: 16 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: `linear-gradient(135deg, ${accent}, #8B5CF6)`, display: "grid", placeItems: "center" }}>
              <SettingsIcon size={16} color="white" />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Workspace</div>
              <div style={{ fontSize: 11, color: MUTED }}>Settings</div>
            </div>
          </div>
          <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {NAV.map((item) => {
              const Icon = item.icon;
              const isActive = active === item.id;
              const color = item.danger ? "#F43F5E" : TEXT;
              return (
                <button
                  key={item.id}
                  onClick={() => setActive(item.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "9px 12px",
                    borderRadius: 8,
                    border: "none",
                    background: isActive ? `${accent}1A` : "transparent",
                    color: isActive ? accent : color,
                    fontSize: 13,
                    fontWeight: isActive ? 600 : 500,
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 120ms ease",
                  }}
                >
                  <Icon size={15} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </aside>

        <main style={{ padding: "48px 56px", maxWidth: 960, width: "100%" }}>
          {active === "general" && (
            <Section title="General" subtitle="Basic workspace information and regional preferences.">
              <Field label="Workspace avatar">
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ width: 72, height: 72, borderRadius: 16, background: `linear-gradient(135deg, ${accent}, #8B5CF6)`, display: "grid", placeItems: "center", fontSize: 24, fontWeight: 700 }}>
                    {wsName.slice(0, 2).toUpperCase()}
                  </div>
                  <button style={uploadBtn}>
                    <Upload size={14} /> Upload image
                  </button>
                  <span style={{ fontSize: 12, color: MUTED }}>PNG or JPG, up to 2MB</span>
                </div>
              </Field>

              <Field label="Workspace name">
                <input value={wsName} onChange={(e) => setWsName(e.target.value)} style={inputStyle} />
              </Field>

              <Field label="Workspace slug" hint="Used in URLs. Lowercase letters, numbers, and hyphens only.">
                <div style={{ display: "flex", alignItems: "center", background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 8 }}>
                  <span style={{ padding: "10px 12px", color: MUTED, fontSize: 13, borderRight: `1px solid ${BORDER}` }}>app.acme.co/</span>
                  <input value={wsSlug} onChange={(e) => setWsSlug(e.target.value)} style={{ ...inputStyle, border: "none", background: "transparent", flex: 1 }} />
                </div>
              </Field>

              <Field label="Timezone">
                <select value={timezone} onChange={(e) => setTimezone(e.target.value)} style={inputStyle}>
                  <option value="America/New_York">America/New_York (EST)</option>
                  <option value="America/Los_Angeles">America/Los_Angeles (PST)</option>
                  <option value="Europe/London">Europe/London (GMT)</option>
                  <option value="Europe/Berlin">Europe/Berlin (CET)</option>
                  <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
                  <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                </select>
              </Field>

              <Field label="Language">
                <select value={language} onChange={(e) => setLanguage(e.target.value)} style={inputStyle}>
                  <option value="en-US">English (US)</option>
                  <option value="en-GB">English (UK)</option>
                  <option value="es-ES">Español</option>
                  <option value="fr-FR">Français</option>
                  <option value="de-DE">Deutsch</option>
                  <option value="ja-JP">日本語</option>
                </select>
              </Field>

              <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                <button style={primaryBtn(accent)}>Save changes</button>
                <button style={ghostBtn}>Cancel</button>
              </div>
            </Section>
          )}

          {active === "members" && (
            <Section title="Members" subtitle="Invite teammates and manage their roles.">
              <div style={{ ...card, padding: 20, marginBottom: 24 }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Invite by email</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <div style={{ flex: 1, display: "flex", alignItems: "center", background: BG, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "0 12px" }}>
                    <Mail size={14} color={MUTED} />
                    <input
                      placeholder="teammate@company.com"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      style={{ ...inputStyle, border: "none", background: "transparent", flex: 1 }}
                    />
                  </div>
                  <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value as Role)} style={{ ...inputStyle, width: 140 }}>
                    <option>Admin</option>
                    <option>Member</option>
                    <option>Guest</option>
                  </select>
                  <button onClick={sendInvite} style={primaryBtn(accent)}>
                    <Plus size={14} /> Invite
                  </button>
                </div>
              </div>

              <div style={{ fontSize: 12, fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>
                Active members ({members.length})
              </div>
              <div style={card}>
                {members.map((m, idx) => (
                  <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", borderBottom: idx < members.length - 1 ? `1px solid ${BORDER}` : "none" }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg, ${accent}, #8B5CF6)`, display: "grid", placeItems: "center", fontSize: 12, fontWeight: 700 }}>
                      {m.avatar}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{m.name}</div>
                      <div style={{ fontSize: 12, color: MUTED }}>{m.email}</div>
                    </div>
                    <select
                      value={m.role}
                      disabled={m.role === "Owner"}
                      onChange={(e) => updateMemberRole(m.id, e.target.value as Role)}
                      style={{ ...inputStyle, width: 120, opacity: m.role === "Owner" ? 0.6 : 1 }}
                    >
                      <option>Owner</option>
                      <option>Admin</option>
                      <option>Member</option>
                      <option>Guest</option>
                    </select>
                    {m.role !== "Owner" && (
                      <button onClick={() => removeMember(m.id)} style={iconBtn}>
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div style={{ fontSize: 12, fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: "0.05em", margin: "28px 0 10px" }}>
                Pending invites ({invites.length})
              </div>
              <div style={card}>
                {invites.length === 0 && <div style={{ padding: 20, color: MUTED, fontSize: 13 }}>No pending invites.</div>}
                {invites.map((inv, idx) => (
                  <div key={inv.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", borderBottom: idx < invites.length - 1 ? `1px solid ${BORDER}` : "none" }}>
                    <Mail size={16} color={MUTED} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{inv.email}</div>
                      <div style={{ fontSize: 11, color: MUTED }}>Sent {inv.sentAt} · {inv.role}</div>
                    </div>
                    <button style={ghostBtn}>Resend</button>
                    <button onClick={() => setInvites((p) => p.filter((i) => i.id !== inv.id))} style={iconBtn}>
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {active === "security" && (
            <Section title="Security" subtitle="Authentication, access, and session policies.">
              <Toggle
                label="Enforce two-factor authentication"
                desc="Require every member to enable 2FA to access this workspace."
                checked={enforce2FA}
                onChange={setEnforce2FA}
                accent={accent}
              />

              <Field label="Single sign-on (SSO)" hint="Connect your identity provider to manage access centrally.">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                  {(["none", "saml", "oidc"] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setSsoProvider(p)}
                      style={{
                        padding: "14px 16px",
                        borderRadius: 10,
                        border: `1px solid ${ssoProvider === p ? accent : BORDER}`,
                        background: ssoProvider === p ? `${accent}14` : PANEL,
                        color: TEXT,
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: "pointer",
                        textAlign: "left",
                      }}
                    >
                      <div style={{ textTransform: "uppercase", fontSize: 11, color: MUTED, marginBottom: 4 }}>
                        {p === "none" ? "Disabled" : p === "saml" ? "SAML 2.0" : "OIDC"}
                      </div>
                      <div>{p === "none" ? "No SSO" : p === "saml" ? "Enterprise SAML" : "OpenID Connect"}</div>
                    </button>
                  ))}
                </div>
              </Field>

              {ssoProvider !== "none" && (
                <Field label={ssoProvider === "saml" ? "SAML metadata URL" : "OIDC issuer URL"}>
                  <input placeholder="https://idp.example.com/metadata" style={inputStyle} />
                </Field>
              )}

              <Field label="Session timeout" hint="How long members stay signed in without activity.">
                <select value={sessionTimeout} onChange={(e) => setSessionTimeout(e.target.value)} style={inputStyle}>
                  <option value="1h">1 hour</option>
                  <option value="4h">4 hours</option>
                  <option value="8h">8 hours</option>
                  <option value="24h">24 hours</option>
                  <option value="7d">7 days</option>
                  <option value="30d">30 days</option>
                </select>
              </Field>

              <Field label="IP allowlist" hint="One CIDR block per line. Leave blank to allow all IPs.">
                <textarea
                  value={ipAllowlist}
                  onChange={(e) => setIpAllowlist(e.target.value)}
                  rows={5}
                  style={{ ...inputStyle, fontFamily: "ui-monospace, monospace", resize: "vertical" }}
                />
              </Field>

              <button style={primaryBtn(accent)}>Save security settings</button>
            </Section>
          )}

          {active === "integrations" && (
            <Section title="Integrations Hub" subtitle="OAuth credential vault for every tool your team connects.">
              <div style={{ fontSize: 11, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>
                Connected apps ({connectedApps.length})
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12, marginBottom: 28 }}>
                {connectedApps.map((app) => (
                  <div key={app.id} style={{ ...card, padding: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: app.color, display: "grid", placeItems: "center", fontSize: 14, fontWeight: 700, color: app.color === "#FFFFFF" || app.color === "#FFE01B" || app.color === "#FCB400" ? "#000" : "#fff", flexShrink: 0 }}>
                        {app.name.slice(0, 1)}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <div style={{ fontSize: 13, fontWeight: 600 }}>{app.name}</div>
                          <Check size={12} color="#10B981" />
                        </div>
                        <div style={{ fontSize: 11, color: MUTED, marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}>
                          {app.live && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981", boxShadow: "0 0 6px #10B981" }} />}
                          Last sync: {app.lastSync}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
                      <button onClick={() => disconnectApp(app.id)} style={{ ...ghostBtn, padding: "6px 10px", fontSize: 11, flex: 1, justifyContent: "center" }}>
                        Disconnect
                      </button>
                      <button style={{ ...ghostBtn, padding: "6px 10px", fontSize: 11, flex: 1, justifyContent: "center" }}>
                        <RefreshCw size={11} /> Reconfigure
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ fontSize: 11, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>
                Available integrations
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "0 12px", marginBottom: 14 }}>
                <Search size={14} color={MUTED} />
                <input
                  placeholder="Search 200+ integrations…"
                  value={integrationSearch}
                  onChange={(e) => setIntegrationSearch(e.target.value)}
                  style={{ ...inputStyle, border: "none", background: "transparent", flex: 1 }}
                />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 28 }}>
                {filteredAvailable.map((app) => (
                  <div key={app.id} style={{ ...card, padding: 14, display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: app.color, display: "grid", placeItems: "center", fontSize: 12, fontWeight: 700, color: app.color === "#FFFFFF" || app.color === "#FFE01B" || app.color === "#FCB400" ? "#000" : "#fff", flexShrink: 0 }}>
                      {app.name.slice(0, 1)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{app.name}</div>
                      <div style={{ fontSize: 10, color: SUBTLE, textTransform: "uppercase", letterSpacing: "0.04em" }}>{app.category}</div>
                    </div>
                    <button style={{ padding: "5px 10px", borderRadius: 6, border: `1px solid ${accent}`, background: "transparent", color: accent, fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
                      Connect
                    </button>
                  </div>
                ))}
                {filteredAvailable.length === 0 && (
                  <div style={{ gridColumn: "1 / -1", padding: 20, textAlign: "center", color: MUTED, fontSize: 12 }}>
                    No integrations match "{integrationSearch}".
                  </div>
                )}
              </div>

              <div style={{ fontSize: 11, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>
                Credential vault
              </div>
              <div style={{ ...card, padding: 18, marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 14 }}>
                  <ShieldCheck size={20} color="#10B981" style={{ flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Zero-knowledge architecture</div>
                    <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: MUTED, lineHeight: 1.7 }}>
                      <li>All OAuth tokens are encrypted at rest with AES-256-GCM</li>
                      <li>Tokens refresh automatically before expiry</li>
                      <li>OmniOS never stores plaintext credentials</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div style={{ ...card, padding: 18, marginBottom: 28 }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>Manage API Keys</div>
                {[
                  { label: "OmniOS API key", value: omniApiKey, icon: Key },
                  { label: "Webhook secret", value: webhookSecret, icon: ShieldCheck },
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: idx === 0 ? `1px solid ${BORDER}` : "none" }}>
                      <Icon size={14} color={MUTED} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, fontWeight: 600 }}>{item.label}</div>
                        <div style={{ fontSize: 11, color: MUTED, fontFamily: "ui-monospace, monospace", marginTop: 2 }}>{item.value}</div>
                      </div>
                      <button style={iconBtn} title="Copy">
                        <Copy size={13} />
                      </button>
                      <button style={{ ...ghostBtn, padding: "6px 10px", fontSize: 11 }}>
                        <RefreshCw size={11} /> Regenerate
                      </button>
                    </div>
                  );
                })}
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Webhook endpoints
                </div>
                <button style={{ ...ghostBtn, padding: "6px 10px", fontSize: 11 }}>
                  <Plus size={11} /> Add webhook
                </button>
              </div>
              <div style={card}>
                {webhookEndpoints.map((wh, idx) => (
                  <div key={wh.path} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", borderBottom: idx < webhookEndpoints.length - 1 ? `1px solid ${BORDER}` : "none" }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: `${accent}1A`, display: "grid", placeItems: "center", flexShrink: 0 }}>
                      <Webhook size={14} color={accent} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontFamily: "ui-monospace, monospace", display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 4, background: "#10B98122", color: "#10B981", fontWeight: 700 }}>POST</span>
                        {wh.path}
                      </div>
                      <div style={{ fontSize: 11, color: MUTED, marginTop: 3 }}>{wh.events.toLocaleString()} events received</div>
                    </div>
                    <button style={iconBtn} title="View deliveries">
                      <ExternalLink size={13} />
                    </button>
                    <button style={{ ...iconBtn, color: "#F43F5E" }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {active === "notifications" && (
            <Section title="Notifications" subtitle="Fine-tune what reaches your inbox and devices.">
              <NotifGroup title="Mentions & replies">
                <Toggle label="Email me on @mentions" checked={notifs.mentionsEmail} onChange={(v) => setNotifs({ ...notifs, mentionsEmail: v })} accent={accent} />
                <Toggle label="Push on @mentions" checked={notifs.mentionsPush} onChange={(v) => setNotifs({ ...notifs, mentionsPush: v })} accent={accent} />
                <Toggle label="Email me on comment replies" checked={notifs.commentsEmail} onChange={(v) => setNotifs({ ...notifs, commentsEmail: v })} accent={accent} />
                <Toggle label="Push on comment replies" checked={notifs.commentsPush} onChange={(v) => setNotifs({ ...notifs, commentsPush: v })} accent={accent} />
              </NotifGroup>

              <NotifGroup title="Workspace activity">
                <Toggle label="New member invites" checked={notifs.invitesEmail} onChange={(v) => setNotifs({ ...notifs, invitesEmail: v })} accent={accent} />
                <Toggle label="Billing and invoice updates" checked={notifs.billingEmail} onChange={(v) => setNotifs({ ...notifs, billingEmail: v })} accent={accent} />
              </NotifGroup>

              <NotifGroup title="Security">
                <Toggle label="Security alerts (email)" checked={notifs.securityEmail} onChange={(v) => setNotifs({ ...notifs, securityEmail: v })} accent={accent} />
                <Toggle label="Security alerts (push)" checked={notifs.securityPush} onChange={(v) => setNotifs({ ...notifs, securityPush: v })} accent={accent} />
              </NotifGroup>

              <NotifGroup title="Product & marketing">
                <Toggle label="Weekly digest email" checked={notifs.digestWeekly} onChange={(v) => setNotifs({ ...notifs, digestWeekly: v })} accent={accent} />
                <Toggle label="Product updates and announcements" checked={notifs.productUpdates} onChange={(v) => setNotifs({ ...notifs, productUpdates: v })} accent={accent} />
              </NotifGroup>
            </Section>
          )}

          {active === "api-keys" && (
            <Section title="API Keys" subtitle="Programmatic access to your workspace. Keep these secret.">
              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
                <button onClick={() => setShowKeyModal(true)} style={primaryBtn(accent)}>
                  <Plus size={14} /> New API key
                </button>
              </div>

              <div style={card}>
                {keys.map((k, idx) => (
                  <div key={k.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px", borderBottom: idx < keys.length - 1 ? `1px solid ${BORDER}` : "none" }}>
                    <Key size={16} color={MUTED} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{k.name}</div>
                      <div style={{ fontSize: 12, color: MUTED, fontFamily: "ui-monospace, monospace", marginTop: 2 }}>
                        {k.prefix}••••••••••••••••
                      </div>
                      <div style={{ fontSize: 11, color: SUBTLE, marginTop: 4 }}>
                        Created {k.created} · Last used {k.lastUsed} · Scopes: {k.scopes.join(", ")}
                      </div>
                    </div>
                    <button onClick={() => navigator.clipboard?.writeText(k.prefix)} style={iconBtn} title="Copy prefix">
                      <Copy size={14} />
                    </button>
                    <button onClick={() => revokeKey(k.id)} style={{ ...iconBtn, color: "#F43F5E" }} title="Revoke">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                {keys.length === 0 && <div style={{ padding: 24, color: MUTED, fontSize: 13, textAlign: "center" }}>No API keys yet.</div>}
              </div>

              {showKeyModal && (
                <Modal onClose={() => { setShowKeyModal(false); setRevealedKey(null); }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, marginBottom: 6 }}>Create API key</h3>
                  <p style={{ fontSize: 13, color: MUTED, marginTop: 0, marginBottom: 20 }}>
                    Name this key and select its scopes. You can revoke it anytime.
                  </p>

                  {revealedKey ? (
                    <div>
                      <div style={{ fontSize: 12, color: "#F59E0B", marginBottom: 10 }}>
                        Copy this key now. You won't see it again.
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: 12, background: BG, border: `1px solid ${BORDER}`, borderRadius: 8, marginBottom: 16 }}>
                        <code style={{ flex: 1, fontSize: 12, fontFamily: "ui-monospace, monospace", wordBreak: "break-all" }}>{revealedKey}</code>
                        <button onClick={() => navigator.clipboard?.writeText(revealedKey)} style={iconBtn}>
                          <Copy size={14} />
                        </button>
                      </div>
                      <button onClick={() => { setShowKeyModal(false); setRevealedKey(null); }} style={primaryBtn(accent)}>Done</button>
                    </div>
                  ) : (
                    <>
                      <Field label="Key name">
                        <input value={newKeyName} onChange={(e) => setNewKeyName(e.target.value)} placeholder="e.g. Production API" style={inputStyle} />
                      </Field>
                      <Field label="Scopes">
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                          {[
                            { id: "read", label: "read", desc: "Read workspace data" },
                            { id: "write", label: "write", desc: "Create and update resources" },
                            { id: "admin", label: "admin", desc: "Manage members and settings" },
                            { id: "billing", label: "billing", desc: "Access billing and invoices" },
                          ].map((s) => (
                            <label key={s.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: 10, borderRadius: 8, border: `1px solid ${BORDER}`, background: PANEL, cursor: "pointer" }}>
                              <input type="checkbox" checked={newKeyScopes.includes(s.id)} onChange={() => toggleScope(s.id)} style={{ accentColor: accent }} />
                              <div>
                                <div style={{ fontSize: 13, fontWeight: 600 }}>{s.label}</div>
                                <div style={{ fontSize: 11, color: MUTED }}>{s.desc}</div>
                              </div>
                            </label>
                          ))}
                        </div>
                      </Field>
                      <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                        <button onClick={createKey} style={primaryBtn(accent)}>Create key</button>
                        <button onClick={() => setShowKeyModal(false)} style={ghostBtn}>Cancel</button>
                      </div>
                    </>
                  )}
                </Modal>
              )}
            </Section>
          )}

          {active === "appearance" && (
            <Section title="Appearance" subtitle="Personalize how the workspace looks to you.">
              <Field label="Theme">
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                  {([
                    { id: "dark", label: "Dark", icon: Moon },
                    { id: "light", label: "Light", icon: Sun },
                    { id: "system", label: "System", icon: Monitor },
                  ] as const).map((t) => {
                    const Icon = t.icon;
                    return (
                      <button
                        key={t.id}
                        onClick={() => setTheme(t.id)}
                        style={{
                          padding: "18px 14px",
                          borderRadius: 10,
                          border: `1px solid ${theme === t.id ? accent : BORDER}`,
                          background: theme === t.id ? `${accent}14` : PANEL,
                          color: TEXT,
                          cursor: "pointer",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 8,
                          fontSize: 13,
                          fontWeight: 600,
                        }}
                      >
                        <Icon size={18} color={theme === t.id ? accent : MUTED} />
                        {t.label}
                      </button>
                    );
                  })}
                </div>
              </Field>

              <Field label="Accent color">
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {ACCENTS.map((a) => (
                    <button
                      key={a.value}
                      onClick={() => setAccent(a.value)}
                      title={a.name}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        background: a.value,
                        border: accent === a.value ? `3px solid ${TEXT}` : `3px solid transparent`,
                        cursor: "pointer",
                        display: "grid",
                        placeItems: "center",
                      }}
                    >
                      {accent === a.value && <Check size={16} color="white" />}
                    </button>
                  ))}
                </div>
              </Field>

              <Field label="Sidebar density">
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                  {(["compact", "comfortable", "spacious"] as const).map((d) => (
                    <button
                      key={d}
                      onClick={() => setDensity(d)}
                      style={{
                        padding: "14px 12px",
                        borderRadius: 10,
                        border: `1px solid ${density === d ? accent : BORDER}`,
                        background: density === d ? `${accent}14` : PANEL,
                        color: TEXT,
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: "pointer",
                        textTransform: "capitalize",
                      }}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </Field>
            </Section>
          )}

          {active === "danger" && (
            <Section title="Danger Zone" subtitle="Irreversible and destructive operations.">
              <div style={{ ...card, padding: 20, borderColor: "#F43F5E33" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>Export all workspace data</div>
                    <div style={{ fontSize: 12, color: MUTED, marginTop: 4 }}>Download a ZIP archive of all documents, members, and settings.</div>
                  </div>
                  <button style={ghostBtn}>
                    <Download size={14} /> Export
                  </button>
                </div>
              </div>

              <div style={{ ...card, padding: 20, borderColor: "#F43F5E33", marginTop: 14 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>Transfer ownership</div>
                    <div style={{ fontSize: 12, color: MUTED, marginTop: 4 }}>Hand over this workspace to another admin. You'll be demoted to admin.</div>
                  </div>
                  <button style={ghostBtn}>
                    <ArrowRightLeft size={14} /> Transfer
                  </button>
                </div>
              </div>

              <div style={{ ...card, padding: 20, borderColor: "#F43F5E66", marginTop: 14, background: "#F43F5E0A" }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#F43F5E" }}>Delete this workspace</div>
                <div style={{ fontSize: 12, color: MUTED, marginTop: 4, marginBottom: 14 }}>
                  Permanently remove the workspace, all members, and all data. This cannot be undone.
                </div>
                <div style={{ fontSize: 12, color: MUTED, marginBottom: 8 }}>
                  Type <code style={{ background: BG, padding: "2px 6px", borderRadius: 4, color: TEXT }}>{wsSlug}</code> to confirm.
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <input
                    value={confirmDelete}
                    onChange={(e) => setConfirmDelete(e.target.value)}
                    placeholder={wsSlug}
                    style={{ ...inputStyle, flex: 1, maxWidth: 320 }}
                  />
                  <button
                    disabled={confirmDelete !== wsSlug}
                    style={{
                      padding: "10px 16px",
                      borderRadius: 8,
                      border: "none",
                      background: confirmDelete === wsSlug ? "#F43F5E" : `${BORDER}`,
                      color: confirmDelete === wsSlug ? "white" : MUTED,
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: confirmDelete === wsSlug ? "pointer" : "not-allowed",
                    }}
                  >
                    Delete workspace
                  </button>
                </div>
              </div>
            </Section>
          )}
        </main>
      </div>
    </div>
  );
}

interface SectionProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

function Section({ title, subtitle, children }: SectionProps) {
  return (
    <div>
      <div style={{ marginBottom: 32, paddingBottom: 20, borderBottom: `1px solid ${BORDER}` }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, letterSpacing: "-0.02em" }}>{title}</h1>
        <p style={{ fontSize: 13, color: MUTED, margin: 0, marginTop: 6 }}>{subtitle}</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>{children}</div>
    </div>
  );
}

interface FieldProps {
  label: string;
  hint?: string;
  children: React.ReactNode;
}

function Field({ label, hint, children }: FieldProps) {
  return (
    <div>
      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>{label}</div>
      {children}
      {hint && <div style={{ fontSize: 11, color: MUTED, marginTop: 6 }}>{hint}</div>}
    </div>
  );
}

interface ToggleProps {
  label: string;
  desc?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  accent: string;
}

function Toggle({ label, desc, checked, onChange, accent }: ToggleProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, padding: "14px 0", borderBottom: `1px solid ${BORDER}` }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600 }}>{label}</div>
        {desc && <div style={{ fontSize: 12, color: MUTED, marginTop: 3 }}>{desc}</div>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        style={{
          width: 40,
          height: 22,
          borderRadius: 999,
          border: "none",
          background: checked ? accent : "#2A2A3A",
          position: "relative",
          cursor: "pointer",
          transition: "background 140ms ease",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            position: "absolute",
            top: 2,
            left: checked ? 20 : 2,
            width: 18,
            height: 18,
            borderRadius: "50%",
            background: "white",
            transition: "left 140ms ease",
          }}
        />
      </button>
    </div>
  );
}

interface NotifGroupProps {
  title: string;
  children: React.ReactNode;
}

function NotifGroup({ title, children }: NotifGroupProps) {
  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{title}</div>
      <div style={card}>
        <div style={{ padding: "0 18px" }}>{children}</div>
      </div>
    </div>
  );
}

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
}

function Modal({ onClose, children }: ModalProps) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(6px)",
        display: "grid",
        placeItems: "center",
        zIndex: 50,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "90%",
          maxWidth: 480,
          background: PANEL,
          border: `1px solid ${BORDER}`,
          borderRadius: 14,
          padding: 24,
          boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
        }}
      >
        {children}
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  background: PANEL,
  border: `1px solid ${BORDER}`,
  borderRadius: 8,
  color: TEXT,
  fontSize: 13,
  outline: "none",
  fontFamily: "inherit",
};

const card: React.CSSProperties = {
  background: PANEL,
  border: `1px solid ${BORDER}`,
  borderRadius: 12,
  overflow: "hidden",
};

const primaryBtn = (accent: string): React.CSSProperties => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "10px 16px",
  background: accent,
  border: "none",
  borderRadius: 8,
  color: "white",
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer",
  boxShadow: `0 4px 16px ${accent}40`,
});

const ghostBtn: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "10px 16px",
  background: "transparent",
  border: `1px solid ${BORDER}`,
  borderRadius: 8,
  color: TEXT,
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer",
};

const uploadBtn: React.CSSProperties = {
  ...ghostBtn,
  background: PANEL,
};

const iconBtn: React.CSSProperties = {
  width: 32,
  height: 32,
  display: "grid",
  placeItems: "center",
  background: "transparent",
  border: `1px solid ${BORDER}`,
  borderRadius: 8,
  color: MUTED,
  cursor: "pointer",
};
