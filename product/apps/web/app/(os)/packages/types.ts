import type { ComponentType } from "react";
import type { LucideProps } from "lucide-react";

export type PackageKind = "engine" | "connector" | "surface" | "agent" | "compound" | "app" | "policy";
export type TrustLevel = "first_party" | "verified_partner" | "community_verified" | "community" | "ai_generated";
export type SortOption = "popular" | "recent" | "stars";

export type LucideIcon = ComponentType<LucideProps>;

export interface OmniPackage {
  id: string;
  key: string;
  name: string;
  description: string;
  kind: PackageKind;
  trustLevel: TrustLevel;
  version: string;
  author: string;
  downloads: number;
  stars: number;
  tags: string[];
  color: string;
  icon: LucideIcon;
  featured?: boolean;
}

export interface FilterState {
  kinds: Set<PackageKind>;
  trustLevels: Set<TrustLevel>;
  tags: Set<string>;
  sort: SortOption;
}
