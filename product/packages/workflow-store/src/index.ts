import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { BuildResult } from "@sso/contracts";

const DATA_DIR = join(process.cwd(), ".data");
const WORKFLOWS_FILE = join(DATA_DIR, "workflows.json");

function ensureStore(): void {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  if (!existsSync(WORKFLOWS_FILE)) writeFileSync(WORKFLOWS_FILE, "[]", "utf-8");
}

function loadAll(): BuildResult[] {
  ensureStore();
  try {
    const raw = readFileSync(WORKFLOWS_FILE, "utf-8");
    return JSON.parse(raw) as BuildResult[];
  } catch {
    return [];
  }
}

function saveAll(items: BuildResult[]): void {
  ensureStore();
  writeFileSync(WORKFLOWS_FILE, JSON.stringify(items, null, 2), "utf-8");
}

export function listWorkflows(): BuildResult[] {
  return loadAll();
}

export function getWorkflow(id: string): BuildResult | null {
  return loadAll().find((item) => item.graph.id === id) ?? null;
}

export function upsertWorkflow(result: BuildResult): void {
  const items = loadAll();
  const idx = items.findIndex((item) => item.graph.id === result.graph.id);
  if (idx >= 0) {
    items[idx] = result;
  } else {
    items.unshift(result);
  }
  saveAll(items);
}
