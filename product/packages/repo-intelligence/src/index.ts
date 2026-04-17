import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, extname, join } from "node:path";
import type {
  CloneCapability,
  CloneCodeSignature,
  CloneIngestionBrief,
  CloneRepoPattern,
  CloneTemplateSnippet,
} from "@sso/contracts";

interface RepoReport {
  repo: string;
  url: string;
  status: string;
  copied_count: number;
}

interface SourceScanBudget {
  maxFiles: number;
  lineLimit: number;
}

type ScanMode = "sample" | "deep";

export interface RepoCatalogItem {
  slug: string;
  url: string;
  status: "extracted" | "clone_failed" | "unknown";
  copiedCount: number;
  filesInClone: number;
  tags: string[];
}

export interface RepoCatalog {
  generatedAt: string;
  totalRepos: number;
  extractedRepos: number;
  cloneFailedRepos: number;
  items: RepoCatalogItem[];
}

const TAG_RULES: Array<{ key: string; tags: string[] }> = [
  { key: "n8n", tags: ["automation", "workflow", "nodes"] },
  { key: "dify", tags: ["ai", "workflow", "agents"] },
  { key: "flowise", tags: ["ai", "graph", "agents"] },
  { key: "langflow", tags: ["ai", "graph", "agents"] },
  { key: "comfyui", tags: ["media", "ai", "graph"] },
  { key: "activepieces", tags: ["automation", "workflow", "integrations"] },
  { key: "windmill", tags: ["automation", "scripting"] },
  { key: "pipedream", tags: ["automation", "integrations"] },
  { key: "trigger.dev", tags: ["automation", "jobs", "durable"] },
  { key: "airflow", tags: ["data", "orchestration"] },
  { key: "prefect", tags: ["data", "orchestration"] },
  { key: "temporal", tags: ["workflow", "durable", "orchestration"] },
  { key: "inngest", tags: ["events", "workflow"] },
  { key: "playwright", tags: ["browser", "automation", "testing"] },
  { key: "puppeteer", tags: ["browser", "automation"] },
  { key: "crawlee", tags: ["scraping", "automation"] },
  { key: "hubspot", tags: ["crm", "sales"] },
  { key: "notion", tags: ["docs", "knowledge"] },
  { key: "jira", tags: ["project", "tickets"] },
  { key: "linear", tags: ["project", "tickets"] },
  { key: "airtable", tags: ["database", "ops"] },
  { key: "slack", tags: ["chat", "collaboration"] },
  { key: "next.js", tags: ["frontend", "webapp"] },
  { key: "hono", tags: ["backend", "api"] },
  { key: "drizzle", tags: ["database", "orm"] },
  { key: "supabase", tags: ["database", "auth", "storage"] },
  { key: "xyflow", tags: ["canvas", "graph", "ui"] },
  { key: "openclaw", tags: ["agents", "automation", "ai"] },
  { key: "nemoclaw", tags: ["agents", "ai", "research"] },
  { key: "paperclip", tags: ["ui", "design", "compiler"] }
];

const SKIP_DIRS = new Set([
  ".git",
  "node_modules",
  "dist",
  "build",
  ".next",
  ".turbo",
  "coverage",
  "target",
  "vendor",
]);

const SOURCE_EXTENSIONS = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".py",
  ".go",
  ".rs",
  ".java",
  ".md",
  ".json",
  ".yaml",
  ".yml",
]);

const FRAMEWORK_DEPENDENCY_HINTS = [
  "next",
  "react",
  "hono",
  "fastify",
  "express",
  "drizzle-orm",
  "prisma",
  "@nestjs/core",
  "fastapi",
  "langchain",
  "langgraph",
  "comfyui",
  "dify",
  "n8n",
  "xyflow",
  "tiptap",
  "univer",
  "yjs",
  "hocuspocus",
  "supabase",
  "playwright",
  "openai",
  "anthropic",
];

const DEFAULT_SIGNATURE_SCAN_BUDGET: SourceScanBudget = {
  maxFiles: 3600,
  lineLimit: 320,
};

const DEFAULT_TEMPLATE_SCAN_BUDGET: SourceScanBudget = {
  maxFiles: 3600,
  lineLimit: 64,
};

const SAMPLE_SIGNATURE_SCAN_BUDGET: SourceScanBudget = {
  maxFiles: 540,
  lineLimit: 260,
};

const SAMPLE_TEMPLATE_SCAN_BUDGET: SourceScanBudget = {
  maxFiles: 720,
  lineLimit: 44,
};

function signatureBudget(mode: ScanMode): SourceScanBudget {
  return mode === "deep" ? DEFAULT_SIGNATURE_SCAN_BUDGET : SAMPLE_SIGNATURE_SCAN_BUDGET;
}

function templateBudget(mode: ScanMode): SourceScanBudget {
  return mode === "deep" ? DEFAULT_TEMPLATE_SCAN_BUDGET : SAMPLE_TEMPLATE_SCAN_BUDGET;
}

function toRelativeClonePath(filePath: string, clonePath: string): string {
  const normalizedClone = clonePath.replace(/\\/g, "/");
  const normalizedFile = filePath.replace(/\\/g, "/");
  return normalizedFile.startsWith(`${normalizedClone}/`)
    ? normalizedFile.slice(normalizedClone.length + 1)
    : normalizedFile;
}

function listCloneSourceFiles(clonePath: string, limit = 8000): string[] {
  const files: string[] = [];
  const stack = [clonePath];
  while (stack.length > 0 && files.length < limit) {
    const current = stack.pop() as string;
    let entries: string[] = [];
    try {
      entries = readdirSync(current);
    } catch {
      continue;
    }
    for (const entry of entries) {
      if (files.length >= limit) break;
      const full = join(current, entry);
      let info;
      try {
        info = statSync(full);
      } catch {
        continue;
      }
      if (info.isDirectory()) {
        if (SKIP_DIRS.has(entry.toLowerCase())) continue;
        stack.push(full);
      } else if (SOURCE_EXTENSIONS.has(extname(entry).toLowerCase())) {
        files.push(full);
      }
    }
  }
  return files;
}

function detectSignatureTags(signature: string): string[] {
  const lower = signature.toLowerCase();
  const tags = new Set<string>();
  if (lower.includes("app.get") || lower.includes("app.post") || lower.includes("router.")) tags.add("api");
  if (lower.includes("workflow") || lower.includes("graph")) tags.add("workflow");
  if (lower.includes("adapter") || lower.includes("connector")) tags.add("integration");
  if (lower.includes("surface") || lower.includes("panel") || lower.includes("canvas")) tags.add("ui");
  if (lower.includes("policy") || lower.includes("approval") || lower.includes("audit")) tags.add("governance");
  if (lower.includes("prompt") || lower.includes("llm") || lower.includes("agent")) tags.add("ai");
  if (lower.includes("db") || lower.includes("table") || lower.includes("query")) tags.add("data");
  if (tags.size === 0) tags.add("general");
  return Array.from(tags);
}

function mineSignaturesInFile(slug: string, filePath: string, clonePath: string, lineLimit = 280): CloneCodeSignature[] {
  const signatures: CloneCodeSignature[] = [];
  let content = "";
  try {
    content = readFileSync(filePath, "utf-8");
  } catch {
    return signatures;
  }
  const rel = toRelativeClonePath(filePath, clonePath);
  const lines = content.split(/\r?\n/).slice(0, lineLimit);

  const pushSignature = (
    index: number,
    kind: CloneCodeSignature["kind"],
    symbol: string,
    signature: string,
  ) => {
    signatures.push({
      id: `sig_${slug.replace(/[^a-z0-9]+/gi, "_")}_${rel.replace(/[^a-z0-9]+/gi, "_")}_${index}`.toLowerCase(),
      slug,
      file: rel,
      line: index + 1,
      kind,
      symbol,
      signature: signature.trim().slice(0, 180),
      tags: detectSignatureTags(signature),
    });
  };

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index]?.trim() ?? "";
    if (!line) continue;

    const routeMatch = line.match(/(?:app|router)\.(get|post|put|patch|delete)\(\s*["'`][^"'`]+["'`]/i);
    if (routeMatch) {
      pushSignature(index, "route", routeMatch[1].toUpperCase(), line);
      continue;
    }

    const functionMatch = line.match(/^export\s+(?:async\s+)?function\s+([A-Za-z0-9_]+)/);
    if (functionMatch) {
      pushSignature(index, "function", functionMatch[1], line);
      continue;
    }

    const constFunctionMatch = line.match(/^export\s+const\s+([A-Za-z0-9_]+)\s*=\s*(?:async\s*)?\(/);
    if (constFunctionMatch) {
      pushSignature(index, "function", constFunctionMatch[1], line);
      continue;
    }

    const classMatch = line.match(/^export\s+class\s+([A-Za-z0-9_]+)/);
    if (classMatch) {
      pushSignature(index, "class", classMatch[1], line);
      continue;
    }

    const componentMatch = line.match(/^export\s+default\s+function\s+([A-Za-z0-9_]+)/);
    if (componentMatch) {
      pushSignature(index, "component", componentMatch[1], line);
      continue;
    }

    const typeMatch = line.match(/^export\s+(?:type|interface)\s+([A-Za-z0-9_]+)/);
    if (typeMatch) {
      pushSignature(index, "type", typeMatch[1], line);
      continue;
    }

    if (/workflow|graph\s*[:=]/i.test(line) && /\{|\[/.test(line)) {
      pushSignature(index, "workflow", "workflow", line);
    }
  }

  return signatures;
}

function parseRepoSlugFromSafeName(folderName: string): string {
  if (folderName.includes("__")) {
    const [owner, repo] = folderName.split("__");
    if (owner && repo) return `${owner}/${repo}`;
  }
  return folderName;
}

function discoverReportRowsFromDirectories(intakeBase: string): RepoReport[] {
  const candidates: Array<{ base: string; status: "extracted" | "clone_failed" }> = [
    { base: join(intakeBase, "_clones"), status: "extracted" },
    { base: join(intakeBase, "extracted"), status: "extracted" },
  ];
  const seen = new Set<string>();
  const rows: RepoReport[] = [];

  for (const candidate of candidates) {
    if (!existsSync(candidate.base)) continue;
    let entries: string[] = [];
    try {
      entries = readdirSync(candidate.base);
    } catch {
      continue;
    }

    for (const entry of entries) {
      const full = join(candidate.base, entry);
      let info;
      try {
        info = statSync(full);
      } catch {
        continue;
      }
      if (!info.isDirectory()) continue;
      const slug = parseRepoSlugFromSafeName(entry);
      if (seen.has(slug)) continue;
      seen.add(slug);
      rows.push({
        repo: slug,
        url: `https://github.com/${slug}`,
        status: candidate.status,
        copied_count: countFilesSafe(full),
      });
    }
  }

  return rows;
}

function languageFromPath(path: string): string {
  const ext = extname(path).toLowerCase();
  if (!ext) return "text";
  if (ext === ".ts" || ext === ".tsx") return "typescript";
  if (ext === ".js" || ext === ".jsx") return "javascript";
  if (ext === ".py") return "python";
  if (ext === ".go") return "go";
  if (ext === ".rs") return "rust";
  if (ext === ".java") return "java";
  if (ext === ".json") return "json";
  if (ext === ".yaml" || ext === ".yml") return "yaml";
  if (ext === ".md") return "markdown";
  return ext.slice(1);
}

function templatePriority(path: string): number {
  const lower = path.toLowerCase();
  let score = 0;
  if (lower.endsWith("package.json")) score += 20;
  if (lower.includes("src/")) score += 8;
  if (lower.includes("api") || lower.includes("route")) score += 8;
  if (lower.includes("workflow") || lower.includes("graph")) score += 7;
  if (lower.includes("adapter") || lower.includes("connector")) score += 6;
  if (lower.includes("engine") || lower.includes("surface") || lower.includes("policy")) score += 6;
  if (lower.includes("readme")) score += 4;
  return score;
}

function summarizeTemplate(path: string): string {
  const lower = path.toLowerCase();
  if (lower.endsWith("package.json")) return "Dependency and script contract";
  if (lower.includes("route") || lower.includes("api")) return "API route/handler template";
  if (lower.includes("workflow") || lower.includes("graph")) return "Workflow graph structure template";
  if (lower.includes("adapter") || lower.includes("connector")) return "Connector adapter contract template";
  if (lower.includes("engine")) return "Domain engine structure template";
  if (lower.includes("surface") || lower.includes("panel")) return "Surface compiler/panel template";
  return "Reusable source template";
}

function frameworkHintsFromDependencies(dependencies: string[]): string[] {
  const depSet = new Set(dependencies.map((dep) => dep.toLowerCase()));
  return FRAMEWORK_DEPENDENCY_HINTS.filter((hint) => depSet.has(hint));
}

function slugToTags(slug: string): string[] {
  const lower = slug.toLowerCase();
  const tags = new Set<string>();
  for (const rule of TAG_RULES) {
    if (lower.includes(rule.key)) {
      rule.tags.forEach((tag) => tags.add(tag));
    }
  }
  if (tags.size === 0) {
    tags.add("general");
  }
  return Array.from(tags);
}

function countFilesSafe(path: string): number {
  try {
    let count = 0;
    const stack = [path];
    while (stack.length > 0) {
      const current = stack.pop() as string;
      for (const entry of readdirSync(current)) {
        const full = join(current, entry);
        const info = statSync(full);
        if (info.isDirectory()) stack.push(full);
        else count += 1;
      }
    }
    return count;
  } catch {
    return 0;
  }
}

function findRepoIntakeBase(root: string): string | null {
  let current = root;
  for (let i = 0; i < 8; i += 1) {
    const candidate = join(current, "repo_intake");
    if (existsSync(candidate)) {
      return candidate;
    }
    const next = dirname(current);
    if (next === current) break;
    current = next;
  }
  return null;
}

function resolveClonePathFromSlug(root: string, slug: string): string | null {
  const intakeBase = findRepoIntakeBase(root);
  if (!intakeBase) return null;
  const cloneSafe = slug.replace("/", "__");
  const candidates = [
    join(intakeBase, "_clones", cloneSafe),
    join(intakeBase, "extracted", cloneSafe),
  ];
  for (const candidate of candidates) {
    if (existsSync(candidate)) return candidate;
  }
  return null;
}

export function buildRepoCatalog(root = process.cwd()): RepoCatalog {
  const intakeBase = findRepoIntakeBase(root);
  if (!intakeBase) {
    return {
      generatedAt: new Date().toISOString(),
      totalRepos: 0,
      extractedRepos: 0,
      cloneFailedRepos: 0,
      items: []
    };
  }

  const reportsDir = join(intakeBase, "reports");
  const clonesDir = join(intakeBase, "_clones");

  const reportFiles = existsSync(reportsDir)
    ? readdirSync(reportsDir).filter((name) => name.endsWith(".json"))
    : [];

  const reportRows: RepoReport[] = reportFiles
    .map((fileName) => {
      const fullPath = join(reportsDir, fileName);
      try {
        return JSON.parse(readFileSync(fullPath, "utf-8")) as RepoReport;
      } catch {
        return null;
      }
    })
    .filter((item): item is RepoReport => item !== null);

  // Fallback: if reports are missing or stale, discover cloned/extracted repos directly.
  const discoveredRows = discoverReportRowsFromDirectories(intakeBase);
  const byRepo = new Map<string, RepoReport>();
  for (const row of reportRows) byRepo.set(row.repo, row);
  for (const row of discoveredRows) {
    if (!byRepo.has(row.repo)) byRepo.set(row.repo, row);
  }

  const items: RepoCatalogItem[] = Array.from(byRepo.values()).map((report) => {
    const cloneSafe = report.repo.replace("/", "__");
    const clonePath = existsSync(join(clonesDir, cloneSafe))
      ? join(clonesDir, cloneSafe)
      : join(intakeBase, "extracted", cloneSafe);
    const filesInClone = existsSync(clonePath) ? countFilesSafe(clonePath) : 0;

    return {
      slug: report.repo,
      url: report.url,
      status: report.status === "extracted" || report.status === "clone_failed" ? report.status : "unknown",
      copiedCount: report.copied_count ?? 0,
      filesInClone,
      tags: slugToTags(report.repo)
    };
  });

  const extractedRepos = items.filter((i) => i.status === "extracted").length;
  const cloneFailedRepos = items.filter((i) => i.status === "clone_failed").length;

  return {
    generatedAt: new Date().toISOString(),
    totalRepos: items.length,
    extractedRepos,
    cloneFailedRepos,
    items
  };
}

export function selectReposForPrompt(prompt: string, root = process.cwd(), limit = 10): RepoCatalogItem[] {
  const lower = prompt.toLowerCase();
  const terms = lower.split(/[^a-z0-9]+/).filter(Boolean);
  const catalog = buildRepoCatalog(root);

  const scored = catalog.items
    .map((item) => {
      let score = item.filesInClone > 0 ? 3 : 0;
      if (item.status === "extracted") score += 2;
      for (const tag of item.tags) {
        if (terms.includes(tag)) score += 4;
        if (lower.includes(tag)) score += 2;
      }
      if (lower.includes(item.slug.split("/")[0].toLowerCase())) score += 5;
      if (lower.includes(item.slug.split("/")[1].toLowerCase())) score += 6;
      return { item, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.item);

  return scored;
}

export function selectCorpusRepos(root = process.cwd(), limit = 120): RepoCatalogItem[] {
  return buildRepoCatalog(root)
    .items
    .filter((item) => item.status === "extracted")
    .sort((a, b) => b.filesInClone - a.filesInClone || b.copiedCount - a.copiedCount)
    .slice(0, limit);
}

function titleCase(input: string): string {
  return input
    .split(/[^a-z0-9]+/i)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

export function buildCloneCapabilityCatalog(root = process.cwd(), limit = 24): CloneCapability[] {
  const catalog = buildRepoCatalog(root);
  const extracted = catalog.items.filter((item) => item.status === "extracted");
  const byTag = new Map<string, { repos: Set<string>; score: number }>();

  for (const repo of extracted) {
    for (const tag of repo.tags) {
      if (tag === "general") continue;
      const existing = byTag.get(tag) ?? { repos: new Set<string>(), score: 0 };
      existing.repos.add(repo.slug);
      existing.score += Math.max(1, Math.floor(repo.filesInClone / 200)) + Math.max(1, Math.floor(repo.copiedCount / 50));
      byTag.set(tag, existing);
    }
  }

  const capabilities: CloneCapability[] = Array.from(byTag.entries())
    .map(([tag, state]) => {
      const topRepos = Array.from(state.repos).slice(0, 5);
      const name = `${titleCase(tag)} Capability`;
      const confidence = Math.min(0.98, 0.55 + state.score / 100);
      return {
        id: `cap_${tag.replace(/[^a-z0-9]+/gi, "_").toLowerCase()}`,
        name,
        summary: `Reusable ${tag} patterns extracted from cloned repositories.`,
        tags: [tag],
        sourceRepos: topRepos,
        confidence: Number(confidence.toFixed(2)),
        examplePrompt: `Include ${tag} automations and operational patterns from the absorbed repo library.`,
      };
    })
    .sort((a, b) => b.confidence - a.confidence || b.sourceRepos.length - a.sourceRepos.length)
    .slice(0, limit);

  return capabilities;
}

export function augmentPromptWithCapabilities(
  prompt: string,
  capabilityIds: string[],
  root = process.cwd(),
): { augmentedPrompt: string; selected: CloneCapability[] } {
  const capabilities = buildCloneCapabilityCatalog(root, 40);
  const selected = capabilities.filter((capability) => capabilityIds.includes(capability.id));
  if (selected.length === 0) {
    return { augmentedPrompt: prompt, selected: [] };
  }

  const tagSet = new Set<string>();
  const repoSet = new Set<string>();
  for (const capability of selected) {
    capability.tags.forEach((tag) => tagSet.add(tag));
    capability.sourceRepos.forEach((repo) => repoSet.add(repo));
  }

  const suffix = [
    `Absorb cloned-repo capabilities: ${Array.from(tagSet).join(", ")}.`,
    `Reference implementation patterns from: ${Array.from(repoSet).slice(0, 8).join(", ")}.`,
    `Mirror proven contracts such as: ${Array.from(repoSet).slice(0, 3)
      .map((slug) => extractCloneCodeSignatures(slug, root, 4).map((sig) => `${sig.kind}:${sig.symbol}`).join(", "))
      .filter((item) => item.length > 0)
      .join(" | ") || "core adapters, routes, and workflow handlers"}.`,
    "Use these as architecture patterns only, then generate first-party product behavior and naming.",
  ].join(" ");

  return {
    augmentedPrompt: `${prompt.trim()} ${suffix}`.trim(),
    selected,
  };
}

export function extractCloneCodeSignatures(
  slug: string,
  root = process.cwd(),
  limit = 60,
  mode: ScanMode = "sample",
): CloneCodeSignature[] {
  const clonePath = resolveClonePathFromSlug(root, slug);
  if (!clonePath) return [];

  const budget = signatureBudget(mode);
  const files = listCloneSourceFiles(clonePath, budget.maxFiles);
  const signatures: CloneCodeSignature[] = [];
  for (const filePath of files) {
    if (signatures.length >= limit) break;
    const mined = mineSignaturesInFile(slug, filePath, clonePath, budget.lineLimit);
    for (const signature of mined) {
      signatures.push(signature);
      if (signatures.length >= limit) break;
    }
  }

  return signatures;
}

export function extractCloneTemplateSnippets(
  slug: string,
  root = process.cwd(),
  limit = 18,
  mode: ScanMode = "sample",
): CloneTemplateSnippet[] {
  const clonePath = resolveClonePathFromSlug(root, slug);
  if (!clonePath) return [];

  const budget = templateBudget(mode);
  const files = listCloneSourceFiles(clonePath, budget.maxFiles)
    .map((file) => ({ file, rel: toRelativeClonePath(file, clonePath), score: templatePriority(toRelativeClonePath(file, clonePath)) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit * 2);

  const snippets: CloneTemplateSnippet[] = [];
  for (const entry of files) {
    if (snippets.length >= limit) break;
    let content = "";
    try {
      content = readFileSync(entry.file, "utf-8");
    } catch {
      continue;
    }
    const compact = content
      .split(/\r?\n/)
      .slice(0, budget.lineLimit)
      .join("\n")
      .slice(0, 1200)
      .trim();
    if (!compact) continue;

    snippets.push({
      id: `tpl_${slug.replace(/[^a-z0-9]+/gi, "_")}_${entry.rel.replace(/[^a-z0-9]+/gi, "_")}`.toLowerCase(),
      slug,
      file: entry.rel,
      language: languageFromPath(entry.rel),
      summary: summarizeTemplate(entry.rel),
      snippet: compact,
    });
  }

  return snippets;
}

export function extractCloneRepoPattern(slug: string, root = process.cwd(), mode: ScanMode = "sample"): CloneRepoPattern | null {
  const clonePath = resolveClonePathFromSlug(root, slug);
  if (!clonePath) return null;

  const packageJsonPath = join(clonePath, "package.json");
  const readmeCandidates = ["README.md", "readme.md", "Readme.md"];

  let manifestName: string | undefined;
  const scripts: string[] = [];
  const dependencies = new Set<string>();
  const keywords = new Set<string>();

  if (existsSync(packageJsonPath)) {
    try {
      const pkg = JSON.parse(readFileSync(packageJsonPath, "utf-8")) as {
        name?: string;
        scripts?: Record<string, string>;
        dependencies?: Record<string, string>;
        devDependencies?: Record<string, string>;
        keywords?: string[];
      };
      manifestName = pkg.name;
      Object.keys(pkg.scripts ?? {}).slice(0, 12).forEach((key) => scripts.push(key));
      Object.keys(pkg.dependencies ?? {}).forEach((dep) => dependencies.add(dep));
      Object.keys(pkg.devDependencies ?? {}).forEach((dep) => dependencies.add(dep));
      (pkg.keywords ?? []).forEach((keyword) => keywords.add(keyword));
    } catch {
      // Ignore parse issues for malformed manifests.
    }
  }

  let readmeHighlights: string[] = [];
  for (const candidate of readmeCandidates) {
    const readmePath = join(clonePath, candidate);
    if (!existsSync(readmePath)) continue;
    const lines = readFileSync(readmePath, "utf-8")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0 && line.length < 120)
      .filter((line) => line.startsWith("#") || line.startsWith("-") || line.startsWith("*"));
    readmeHighlights = lines.slice(0, 12);
    break;
  }

  const sampleSignatures = extractCloneCodeSignatures(slug, root, 12, mode);
  const sampleTemplates = extractCloneTemplateSnippets(slug, root, 6, mode);
  const frameworks = frameworkHintsFromDependencies(Array.from(dependencies));

  const entrypoints = [
    "src/index.ts",
    "src/main.ts",
    "src/app.ts",
    "app/page.tsx",
    "apps/api/src/index.ts",
    "packages/api/src/index.ts",
  ]
    .filter((candidate) => existsSync(join(clonePath, candidate)))
    .slice(0, 6);

  return {
    slug,
    manifestName,
    scripts,
    dependencies: Array.from(dependencies).slice(0, 40),
    keywords: Array.from(keywords).slice(0, 20),
    readmeHighlights,
    frameworks,
    entrypoints,
    signatureCount: sampleSignatures.length,
    templateCount: sampleTemplates.length,
    sampleSignatures,
    sampleTemplates,
  };
}

export function buildCloneRepoPatternCatalog(root = process.cwd(), limit = 30, mode: ScanMode = "sample"): CloneRepoPattern[] {
  const extracted = selectCorpusRepos(root, limit);

  const patterns: CloneRepoPattern[] = [];
  for (const repo of extracted) {
    const pattern = extractCloneRepoPattern(repo.slug, root, mode);
    if (pattern) patterns.push(pattern);
  }
  return patterns;
}

export function buildCloneIngestionBrief(root = process.cwd()): CloneIngestionBrief {
  const repoCatalog = buildRepoCatalog(root);
  const capabilityCatalog = buildCloneCapabilityCatalog(root, 40);
  const extractedRepoCount = repoCatalog.items.filter((item) => item.status === "extracted").length;

  const tagCounts = new Map<string, number>();
  for (const capability of capabilityCatalog) {
    for (const tag of capability.tags) {
      tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
    }
  }
  const topTags = Array.from(tagCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([tag]) => tag);

  const topPatterns = buildCloneRepoPatternCatalog(root, 80, "sample");
  const signatureCount = topPatterns.reduce((sum, pattern) => sum + pattern.signatureCount, 0);
  const templateCount = topPatterns.reduce((sum, pattern) => sum + pattern.templateCount, 0);

  return {
    generatedAt: new Date().toISOString(),
    extractedRepoCount,
    capabilityCount: capabilityCatalog.length,
    topTags,
    signatureCount,
    templateCount,
    synthesisDirectives: [
      "Use clone-derived capabilities as architecture patterns, not branding or visual identity.",
      "Prioritize reusable workflow, orchestration, and connector patterns found across multiple repos.",
      "Borrow concrete code signatures and template skeletons from clone repos, then rewrite into first-party modules.",
      "Compose a first-party product surface with provider-agnostic contracts and governance gates.",
    ],
  };
}
