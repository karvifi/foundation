"use client";

import { useState, useMemo } from "react";
import {
  Search, Filter, Package, Download, Star, Check, Loader2,
} from "lucide-react";

import { PACKAGES } from "./data";
import type {
  PackageKind,
  TrustLevel,
  SortOption,
  OmniPackage,
  FilterState,
} from "./types";

const KIND_COLORS: Record<PackageKind, string> = {
  engine: "from-indigo-500/90 to-indigo-600/90 text-indigo-100",
  connector: "from-emerald-500/90 to-emerald-600/90 text-emerald-100",
  surface: "from-pink-500/90 to-pink-600/90 text-pink-100",
  agent: "from-purple-500/90 to-purple-600/90 text-purple-100",
  compound: "from-amber-500/90 to-amber-600/90 text-amber-100",
  app: "from-blue-500/90 to-blue-600/90 text-blue-100",
  policy: "from-red-500/90 to-red-600/90 text-red-100",
};

const KIND_ACCENT: Record<PackageKind, string> = {
  engine: "bg-indigo-500/15 border-indigo-500/30",
  connector: "bg-emerald-500/15 border-emerald-500/30",
  surface: "bg-pink-500/15 border-pink-500/30",
  agent: "bg-purple-500/15 border-purple-500/30",
  compound: "bg-amber-500/15 border-amber-500/30",
  app: "bg-blue-500/15 border-blue-500/30",
  policy: "bg-red-500/15 border-red-500/30",
};

export default function PackagesPage() {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    kinds: new Set(),
    trustLevels: new Set(),
    tags: new Set(),
    sort: "popular",
  });
  const [installing, setInstalling] = useState<Set<string>>(new Set());
  const [installed, setInstalled] = useState<Set<string>>(
    new Set(["1", "2", "3", "4", "5", "11"])
  );

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    PACKAGES.forEach((pkg) => pkg.tags.forEach((t) => tags.add(t)));
    return Array.from(tags).sort().slice(0, 8);
  }, []);

  const filtered = useMemo(() => {
    let result = PACKAGES.filter((pkg) => {
      const matchesSearch =
        search === "" ||
        pkg.name.toLowerCase().includes(search.toLowerCase()) ||
        pkg.description.toLowerCase().includes(search.toLowerCase()) ||
        pkg.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));

      const matchesKind =
        filters.kinds.size === 0 || filters.kinds.has(pkg.kind);
      const matchesTrust =
        filters.trustLevels.size === 0 || filters.trustLevels.has(pkg.trustLevel);
      const matchesTags =
        filters.tags.size === 0 ||
        pkg.tags.some((t) => filters.tags.has(t));

      return matchesSearch && matchesKind && matchesTrust && matchesTags;
    });

    result.sort((a, b) => {
      if (filters.sort === "popular") return b.downloads - a.downloads;
      if (filters.sort === "stars") return b.stars - a.stars;
      return 0;
    });

    return result;
  }, [search, filters]);

  const featured = useMemo(() => filtered.filter((p) => p.featured), [filtered]);
  const engines = useMemo(() => filtered.filter((p) => p.kind === "engine"), [filtered]);
  const connectors = useMemo(() => filtered.filter((p) => p.kind === "connector"), [filtered]);
  const agents = useMemo(() => filtered.filter((p) => p.kind === "agent"), [filtered]);
  const surfaces = useMemo(() => filtered.filter((p) => p.kind === "surface"), [filtered]);
  const apps = useMemo(() => filtered.filter((p) => p.kind === "app"), [filtered]);

  const handleInstall = async (id: string) => {
    setInstalling((prev) => new Set([...prev, id]));
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setInstalling((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    setInstalled((prev) => new Set([...prev, id]));
  };

  const toggleKind = (kind: PackageKind) => {
    setFilters((prev) => {
      const kinds = new Set(prev.kinds);
      if (kinds.has(kind)) kinds.delete(kind);
      else kinds.add(kind);
      return { ...prev, kinds };
    });
  };

  const toggleTrust = (level: TrustLevel) => {
    setFilters((prev) => {
      const trustLevels = new Set(prev.trustLevels);
      if (trustLevels.has(level)) trustLevels.delete(level);
      else trustLevels.add(level);
      return { ...prev, trustLevels };
    });
  };

  const toggleTag = (tag: string) => {
    setFilters((prev) => {
      const tags = new Set(prev.tags);
      if (tags.has(tag)) tags.delete(tag);
      else tags.add(tag);
      return { ...prev, tags };
    });
  };

  const clearFilters = () => {
    setFilters({
      kinds: new Set(),
      trustLevels: new Set(),
      tags: new Set(),
      sort: "popular",
    });
  };

  return (
    <div className="flex h-screen bg-[#0A0A0F]">
      <aside className="w-56 border-r border-[#1a1a26] bg-[#0A0A0F] p-6 overflow-y-auto">
        <div className="mb-8">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#9ca3af] mb-4">
            Kind
          </h3>
          <div className="space-y-3">
            {(["engine", "connector", "agent", "surface", "app"] as PackageKind[]).map((kind) => (
              <label key={kind} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.kinds.has(kind)}
                  onChange={() => toggleKind(kind)}
                  className="w-4 h-4 rounded bg-[#13131C] border border-[#2a2a38] checked:bg-indigo-600 checked:border-indigo-600 cursor-pointer"
                />
                <span className="text-sm text-[#d4d4d8] capitalize group-hover:text-white transition">
                  {kind === "engine" && "Engines"}
                  {kind === "connector" && "Connectors"}
                  {kind === "agent" && "AI Agents"}
                  {kind === "surface" && "Surfaces"}
                  {kind === "app" && "Apps"}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#9ca3af] mb-4">
            Trust Level
          </h3>
          <div className="space-y-3">
            {(["first_party", "verified_partner", "community_verified", "community"] as TrustLevel[]).map((level) => (
              <label key={level} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.trustLevels.has(level)}
                  onChange={() => toggleTrust(level)}
                  className="w-4 h-4 rounded bg-[#13131C] border border-[#2a2a38] checked:bg-indigo-600 checked:border-indigo-600 cursor-pointer"
                />
                <span className="text-sm text-[#d4d4d8] group-hover:text-white transition">
                  {level === "first_party" && "OmniOS"}
                  {level === "verified_partner" && "Verified"}
                  {level === "community_verified" && "Community ✓"}
                  {level === "community" && "Community"}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#9ca3af] mb-4">
            Tags
          </h3>
          <div className="space-y-2">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                  filters.tags.has(tag)
                    ? "bg-indigo-600/30 text-indigo-300 border border-indigo-500/50"
                    : "bg-[#13131C] text-[#d4d4d8] border border-[#2a2a38] hover:border-[#3a3a48]"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#9ca3af] mb-4">
            Sort
          </h3>
          <div className="space-y-2">
            {(["popular", "stars", "recent"] as SortOption[]).map((option) => (
              <button
                key={option}
                onClick={() => setFilters((prev) => ({ ...prev, sort: option }))}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                  filters.sort === option
                    ? "bg-indigo-600/30 text-indigo-300 border border-indigo-500/50"
                    : "bg-[#13131C] text-[#d4d4d8] border border-[#2a2a38] hover:border-[#3a3a48]"
                }`}
              >
                {option === "popular" && "Most Popular"}
                {option === "stars" && "Most Stars"}
                {option === "recent" && "Recent"}
              </button>
            ))}
          </div>
        </div>

        {(filters.kinds.size > 0 || filters.trustLevels.size > 0 || filters.tags.size > 0) && (
          <button
            onClick={clearFilters}
            className="w-full px-3 py-2 rounded-lg text-sm bg-red-600/20 text-red-400 border border-red-500/30 hover:bg-red-600/30 transition"
          >
            Clear Filters
          </button>
        )}
      </aside>

      <main className="flex-1 overflow-y-auto bg-[#0A0A0F]">
        <div className="sticky top-0 z-40 bg-[#0A0A0F]/95 backdrop-blur border-b border-[#1a1a26] px-8 py-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-4">
              <h1 className="text-2xl font-bold text-white mb-1">Package Registry</h1>
              <p className="text-sm text-[#9ca3af]">
                400+ packages · 2.4M total installs · 847 AI-generated · 23 verified partners
              </p>
            </div>

            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
                <input
                  type="text"
                  placeholder="Search 400+ packages..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-[#13131C] border border-[#2a2a38] rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-[#6b7280] focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition"
                />
              </div>
              <button className="px-4 py-2.5 bg-[#13131C] border border-[#2a2a38] rounded-lg text-[#d4d4d8] hover:border-[#3a3a48] transition flex items-center gap-2">
                <Filter className="w-4 h-4" />
                <span className="text-sm">Filter</span>
              </button>
            </div>
          </div>
        </div>

        <div className="px-8 py-8">
          <div className="max-w-6xl mx-auto">
            {featured.length > 0 && (
              <div className="mb-12">
                <h2 className="text-lg font-semibold text-white mb-6">Featured</h2>
                <div className="grid grid-cols-2 gap-6">
                  {featured.map((pkg) => (
                    <PackageCard
                      key={pkg.id}
                      pkg={pkg}
                      isInstalling={installing.has(pkg.id)}
                      isInstalled={installed.has(pkg.id)}
                      onInstall={() => handleInstall(pkg.id)}
                      featured
                    />
                  ))}
                </div>
              </div>
            )}

            {engines.length > 0 && (
              <Section title="Engines" packages={engines} installing={installing} installed={installed} onInstall={handleInstall} />
            )}
            {connectors.length > 0 && (
              <Section title="Connectors" packages={connectors} installing={installing} installed={installed} onInstall={handleInstall} />
            )}
            {agents.length > 0 && (
              <Section title="AI Agents" packages={agents} installing={installing} installed={installed} onInstall={handleInstall} />
            )}
            {surfaces.length > 0 && (
              <Section title="Surfaces" packages={surfaces} installing={installing} installed={installed} onInstall={handleInstall} />
            )}
            {apps.length > 0 && (
              <Section title="Applications" packages={apps} installing={installing} installed={installed} onInstall={handleInstall} />
            )}

            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Package className="w-12 h-12 text-[#4b5563] mb-4" />
                <h3 className="text-lg font-semibold text-[#d4d4d8] mb-2">No packages found</h3>
                <p className="text-sm text-[#9ca3af]">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

interface SectionProps {
  title: string;
  packages: OmniPackage[];
  installing: Set<string>;
  installed: Set<string>;
  onInstall: (id: string) => void;
}

function Section({ title, packages, installing, installed, onInstall }: SectionProps) {
  return (
    <div className="mb-12">
      <h2 className="text-lg font-semibold text-white mb-6">{title}</h2>
      <div className="grid grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <PackageCard
            key={pkg.id}
            pkg={pkg}
            isInstalling={installing.has(pkg.id)}
            isInstalled={installed.has(pkg.id)}
            onInstall={() => onInstall(pkg.id)}
          />
        ))}
      </div>
    </div>
  );
}

interface CardProps {
  pkg: OmniPackage;
  isInstalling: boolean;
  isInstalled: boolean;
  onInstall: () => void;
  featured?: boolean;
}

function PackageCard({ pkg, isInstalling, isInstalled, onInstall }: CardProps) {
  const accentClass = KIND_ACCENT[pkg.kind];
  const colorClass = KIND_COLORS[pkg.kind];
  const Icon = pkg.icon;

  const trustBadgeColor: Record<TrustLevel, { bg: string; text: string }> = {
    first_party: { bg: "bg-indigo-600/30", text: "text-indigo-300" },
    verified_partner: { bg: "bg-emerald-600/30", text: "text-emerald-300" },
    community_verified: { bg: "bg-amber-600/30", text: "text-amber-300" },
    community: { bg: "bg-gray-600/30", text: "text-gray-300" },
    ai_generated: { bg: "bg-purple-600/30", text: "text-purple-300" },
  };

  const trustLabel: Record<TrustLevel, string> = {
    first_party: "OmniOS",
    verified_partner: "Verified",
    community_verified: "Community ✓",
    community: "Community",
    ai_generated: "AI Generated",
  };

  const trust = trustBadgeColor[pkg.trustLevel];

  return (
    <div className="group relative rounded-xl bg-[#13131C] border border-[#2a2a38] overflow-hidden transition-all hover:border-[#3a3a48] hover:shadow-lg hover:shadow-indigo-600/10">
      <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${colorClass.split(" ")[0]}`} />

      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colorClass} flex items-center justify-center`}>
            <Icon className="w-5 h-5" />
          </div>
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium uppercase tracking-wide ${accentClass} border`}>
            {pkg.kind}
          </span>
        </div>

        <h3 className="font-semibold text-white mb-1 text-sm group-hover:text-indigo-300 transition">
          {pkg.name}
        </h3>
        <p className="text-xs text-[#9ca3af] line-clamp-2 mb-4">{pkg.description}</p>

        <div className="flex items-center gap-1.5 mb-4">
          <span className={`px-2 py-1 rounded text-xs font-medium ${trust.bg} ${trust.text}`}>
            {trustLabel[pkg.trustLevel]}
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs text-[#6b7280] mb-4 border-t border-[#1f1f2e] pt-3">
          <span>v{pkg.version}</span>
          <span className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5" />
            {(pkg.stars / 1000).toFixed(1)}k
          </span>
          <span className="flex items-center gap-1">
            <Download className="w-3.5 h-3.5" />
            {(pkg.downloads / 1000).toFixed(0)}k
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {pkg.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 rounded text-xs bg-[#1f1f2e] text-[#9ca3af] border border-[#2a2a38]"
            >
              {tag}
            </span>
          ))}
        </div>

        <button
          onClick={onInstall}
          disabled={isInstalling || isInstalled}
          className={`w-full px-4 py-2.5 rounded-lg font-medium text-sm transition flex items-center justify-center gap-2 ${
            isInstalled
              ? "bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 cursor-default"
              : isInstalling
              ? "bg-indigo-600/30 text-indigo-300 border border-indigo-500/30"
              : "bg-indigo-600 text-indigo-100 border border-indigo-600 hover:bg-indigo-700 hover:border-indigo-700"
          }`}
        >
          {isInstalled ? (
            <>
              <Check className="w-4 h-4" />
              Installed
            </>
          ) : isInstalling ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Installing
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              Install
            </>
          )}
        </button>
      </div>
    </div>
  );
}
