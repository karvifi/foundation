"use client";

import { useState, useMemo } from "react";
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  DollarSign,
  Percent,
  Hash,
  Paintbrush,
  Grid3x3,
  Rows,
  Columns,
  Trash2,
  Plus,
  Snowflake,
  Filter,
  ArrowUpDown,
  Sparkles,
  Save,
  Share2,
  Download,
  ChevronDown,
  Search,
  Undo2,
  Redo2,
  Printer,
  Type,
  Palette,
  Merge,
  MoreHorizontal,
  Clock,
  Users,
  MessageSquare,
  Zap,
  TrendingUp,
  Info,
  X,
} from "lucide-react";

const COLS = 20;
const ROWS = 50;
const COL_LETTERS = Array.from({ length: COLS }, (_, i) => String.fromCharCode(65 + i));

type SheetKey = "q1" | "contacts" | "inventory" | "budget" | "team";

const SHEETS: { key: SheetKey; name: string; color: string }[] = [
  { key: "q1", name: "Q1 Revenue", color: "#6366F1" },
  { key: "contacts", name: "Contacts", color: "#10B981" },
  { key: "inventory", name: "Inventory", color: "#F59E0B" },
  { key: "budget", name: "Budget", color: "#EF4444" },
  { key: "team", name: "Team", color: "#8B5CF6" },
];

type CellData = { value: string; formula?: string; bold?: boolean; bg?: string; color?: string };

function buildQ1Data(): Record<string, CellData> {
  const d: Record<string, CellData> = {};
  const headers = ["Month", "Region", "Product", "Units Sold", "Unit Price", "Revenue", "Cost", "Profit", "Margin %", "Rep"];
  headers.forEach((h, i) => {
    d[`${COL_LETTERS[i]}1`] = { value: h, bold: true, bg: "#1A1A24", color: "#A5B4FC" };
  });
  const months = ["January", "February", "March"];
  const regions = ["North America", "EMEA", "APAC", "LATAM"];
  const products = ["Orbit Pro", "Orbit Lite", "Orbit Enterprise", "Orbit Cloud"];
  const reps = ["S. Chen", "M. Kowalski", "A. Patel", "J. Fitzgerald", "R. Okafor", "L. Haruki", "D. Silva"];
  let r = 2;
  for (let m = 0; m < months.length; m++) {
    for (let rg = 0; rg < regions.length; rg++) {
      for (let p = 0; p < 3; p++) {
        const units = 120 + ((r * 37) % 880);
        const price = [249, 99, 1499, 599][p % 4];
        const revenue = units * price;
        const cost = Math.floor(revenue * 0.42);
        const profit = revenue - cost;
        const margin = ((profit / revenue) * 100).toFixed(1);
        d[`A${r}`] = { value: months[m] };
        d[`B${r}`] = { value: regions[rg] };
        d[`C${r}`] = { value: products[p] };
        d[`D${r}`] = { value: units.toLocaleString() };
        d[`E${r}`] = { value: `$${price.toLocaleString()}` };
        d[`F${r}`] = { value: `$${revenue.toLocaleString()}`, formula: `=D${r}*E${r}` };
        d[`G${r}`] = { value: `$${cost.toLocaleString()}` };
        d[`H${r}`] = { value: `$${profit.toLocaleString()}`, formula: `=F${r}-G${r}` };
        d[`I${r}`] = { value: `${margin}%`, formula: `=H${r}/F${r}` };
        d[`J${r}`] = { value: reps[(r + p) % reps.length] };
        r++;
      }
    }
  }
  d[`A${r + 1}`] = { value: "TOTAL", bold: true, bg: "#1F1B3A", color: "#A5B4FC" };
  d[`F${r + 1}`] = { value: "$4,827,310", bold: true, formula: "=SUM(F2:F37)", bg: "#1F1B3A", color: "#6366F1" };
  d[`H${r + 1}`] = { value: "$2,914,006", bold: true, formula: "=SUM(H2:H37)", bg: "#1F1B3A", color: "#10B981" };
  d[`I${r + 1}`] = { value: "60.4%", bold: true, formula: "=AVERAGE(I2:I37)", bg: "#1F1B3A", color: "#F59E0B" };
  return d;
}

function buildContactsData(): Record<string, CellData> {
  const d: Record<string, CellData> = {};
  const h = ["Name", "Company", "Email", "Phone", "Title", "Status", "Last Contact", "LTV"];
  h.forEach((x, i) => (d[`${COL_LETTERS[i]}1`] = { value: x, bold: true, bg: "#1A1A24", color: "#A5B4FC" }));
  const names = ["Sarah Chen", "Marcus Kowalski", "Aditi Patel", "James Fitzgerald", "Reni Okafor", "Lena Haruki", "Diego Silva", "Noor Rahman", "Finn Walsh", "Yuki Tanaka"];
  const companies = ["Nimbus Labs", "Helix Ventures", "Forge & Co", "Meridian Group", "Cobalt Studio", "Arcane Systems"];
  const statuses = ["Hot Lead", "Customer", "Prospect", "Churned", "Negotiating"];
  for (let r = 2; r < 40; r++) {
    const n = names[r % names.length];
    d[`A${r}`] = { value: n };
    d[`B${r}`] = { value: companies[r % companies.length] };
    d[`C${r}`] = { value: `${n.split(" ")[0].toLowerCase()}@${companies[r % companies.length].split(" ")[0].toLowerCase()}.com` };
    d[`D${r}`] = { value: `+1 (555) ${String(100 + r).slice(-3)}-${String(1000 + r * 7).slice(-4)}` };
    d[`E${r}`] = { value: ["VP Sales", "CEO", "CTO", "Head of Ops", "Director"][r % 5] };
    d[`F${r}`] = { value: statuses[r % 5] };
    d[`G${r}`] = { value: `${2 + (r % 28)} days ago` };
    d[`H${r}`] = { value: `$${(12000 + r * 347).toLocaleString()}` };
  }
  return d;
}

function buildInventoryData(): Record<string, CellData> {
  const d: Record<string, CellData> = {};
  ["SKU", "Product", "Warehouse", "On Hand", "Reserved", "Available", "Reorder At", "Status"].forEach(
    (x, i) => (d[`${COL_LETTERS[i]}1`] = { value: x, bold: true, bg: "#1A1A24", color: "#A5B4FC" })
  );
  for (let r = 2; r < 35; r++) {
    const hand = 50 + ((r * 41) % 900);
    const res = Math.floor(hand * 0.15);
    d[`A${r}`] = { value: `ORB-${1000 + r}` };
    d[`B${r}`] = { value: ["Orbit Pro", "Orbit Lite", "Orbit Cloud", "Accessory Kit"][r % 4] };
    d[`C${r}`] = { value: ["SF-01", "NYC-02", "AMS-03", "SIN-04"][r % 4] };
    d[`D${r}`] = { value: hand.toString() };
    d[`E${r}`] = { value: res.toString() };
    d[`F${r}`] = { value: (hand - res).toString(), formula: `=D${r}-E${r}` };
    d[`G${r}`] = { value: "100" };
    d[`H${r}`] = { value: hand - res < 100 ? "Reorder" : "OK", color: hand - res < 100 ? "#EF4444" : "#10B981" };
  }
  return d;
}

function buildBudgetData(): Record<string, CellData> {
  const d: Record<string, CellData> = {};
  ["Department", "Q1 Budget", "Q1 Spend", "Variance", "Q2 Forecast", "Owner"].forEach(
    (x, i) => (d[`${COL_LETTERS[i]}1`] = { value: x, bold: true, bg: "#1A1A24", color: "#A5B4FC" })
  );
  const depts = ["Engineering", "Sales", "Marketing", "Customer Success", "Operations", "Finance", "People", "Legal", "R&D"];
  for (let r = 2; r < 2 + depts.length; r++) {
    const budget = 50000 + ((r * 43717) % 450000);
    const spend = Math.floor(budget * 0.82);
    d[`A${r}`] = { value: depts[r - 2] };
    d[`B${r}`] = { value: `$${budget.toLocaleString()}` };
    d[`C${r}`] = { value: `$${spend.toLocaleString()}` };
    d[`D${r}`] = { value: `$${(budget - spend).toLocaleString()}`, formula: `=B${r}-C${r}`, color: budget - spend < 0 ? "#EF4444" : "#10B981" };
    d[`E${r}`] = { value: `$${Math.floor(budget * 1.08).toLocaleString()}` };
    d[`F${r}`] = { value: ["S. Chen", "M. Kowalski", "A. Patel"][r % 3] };
  }
  return d;
}

function buildTeamData(): Record<string, CellData> {
  const d: Record<string, CellData> = {};
  ["Name", "Role", "Team", "Location", "Start Date", "Manager"].forEach(
    (x, i) => (d[`${COL_LETTERS[i]}1`] = { value: x, bold: true, bg: "#1A1A24", color: "#A5B4FC" })
  );
  const team = [
    ["Sarah Chen", "VP Engineering", "Platform", "San Francisco", "2021-03-15", "CEO"],
    ["Marcus Kowalski", "Staff Engineer", "Platform", "Berlin", "2022-01-10", "S. Chen"],
    ["Aditi Patel", "Senior Designer", "Design", "London", "2023-06-01", "CEO"],
    ["James Fitzgerald", "Sales Director", "Revenue", "New York", "2020-11-20", "CEO"],
    ["Reni Okafor", "AE", "Revenue", "Lagos", "2024-02-14", "J. Fitzgerald"],
    ["Lena Haruki", "PM", "Product", "Tokyo", "2023-09-03", "CEO"],
    ["Diego Silva", "Engineer", "Platform", "Sao Paulo", "2024-05-22", "M. Kowalski"],
  ];
  team.forEach((row, i) => {
    row.forEach((c, j) => (d[`${COL_LETTERS[j]}${i + 2}`] = { value: c }));
  });
  return d;
}

export default function SheetsPage() {
  const [activeSheet, setActiveSheet] = useState<SheetKey>("q1");
  const [selected, setSelected] = useState<string>("F2");
  const [aiOpen, setAiOpen] = useState(true);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; cell: string } | null>(null);
  const [zoom, setZoom] = useState(100);
  const [activeFormat, setActiveFormat] = useState<string[]>([]);

  const dataByKey = useMemo<Record<SheetKey, Record<string, CellData>>>(
    () => ({
      q1: buildQ1Data(),
      contacts: buildContactsData(),
      inventory: buildInventoryData(),
      budget: buildBudgetData(),
      team: buildTeamData(),
    }),
    []
  );
  const data = dataByKey[activeSheet];
  const selectedCell = data[selected];

  const toggleFormat = (f: string) => {
    setActiveFormat((prev) => (prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]));
  };

  const currentSheet = SHEETS.find((s) => s.key === activeSheet)!;

  return (
    <div className="flex h-screen w-full flex-col bg-[#0A0A0F] text-neutral-200" onClick={() => setContextMenu(null)}>
      <div className="flex items-center justify-between border-b border-white/5 bg-[#0D0D14] px-4 py-2">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-[#6366F1] to-[#4F46E5] shadow-lg shadow-[#6366F1]/20">
            <Grid3x3 className="h-4 w-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-white">
              OmniOS Sheets
              <span className="text-neutral-500">/</span>
              <span className="text-neutral-400">FY26 Revenue Workbook</span>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-neutral-500">
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Last saved 2 min ago</span>
              <span className="flex items-center gap-1"><Users className="h-3 w-3" /> 3 editors</span>
              <span className="text-neutral-600">847 rows &middot; 20 cols</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 rounded-md border border-white/5 bg-white/5 px-3 py-1.5 text-xs text-neutral-300 hover:bg-white/10">
            <MessageSquare className="h-3.5 w-3.5" /> Comments
          </button>
          <button className="flex items-center gap-1.5 rounded-md border border-white/5 bg-white/5 px-3 py-1.5 text-xs text-neutral-300 hover:bg-white/10">
            <Share2 className="h-3.5 w-3.5" /> Share
          </button>
          <button className="flex items-center gap-1.5 rounded-md bg-gradient-to-b from-[#6366F1] to-[#4F46E5] px-3 py-1.5 text-xs font-medium text-white shadow-lg shadow-[#6366F1]/20 hover:from-[#7375F3]">
            <Save className="h-3.5 w-3.5" /> Save
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4 border-b border-white/5 bg-[#0B0B12] px-4 py-1.5 text-xs text-neutral-400">
        {["File", "Edit", "View", "Insert", "Format", "Data", "Tools", "Extensions", "Help"].map((m) => (
          <button key={m} className="rounded px-1.5 py-0.5 hover:bg-white/5 hover:text-white">{m}</button>
        ))}
        <div className="ml-auto flex items-center gap-1">
          <button className="rounded p-1 hover:bg-white/5"><Undo2 className="h-3.5 w-3.5" /></button>
          <button className="rounded p-1 hover:bg-white/5"><Redo2 className="h-3.5 w-3.5" /></button>
          <button className="rounded p-1 hover:bg-white/5"><Printer className="h-3.5 w-3.5" /></button>
          <button className="rounded p-1 hover:bg-white/5"><Download className="h-3.5 w-3.5" /></button>
        </div>
      </div>

      <div className="flex items-center gap-1 border-b border-white/5 bg-[#0D0D14] px-3 py-1.5">
        <ToolbarGroup>
          <ToolButton icon={<Search className="h-3.5 w-3.5" />} label="Find" />
          <select value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="rounded border border-white/5 bg-[#13131C] px-2 py-1 text-[11px] text-neutral-300 outline-none">
            {[50, 75, 100, 125, 150].map((z) => <option key={z} value={z}>{z}%</option>)}
          </select>
        </ToolbarGroup>
        <Divider />
        <ToolbarGroup>
          <ToolButton icon={<DollarSign className="h-3.5 w-3.5" />} label="Currency" />
          <ToolButton icon={<Percent className="h-3.5 w-3.5" />} label="Percent" />
          <ToolButton icon={<Hash className="h-3.5 w-3.5" />} label="Number" />
        </ToolbarGroup>
        <Divider />
        <ToolbarGroup>
          <ToolButton icon={<Type className="h-3.5 w-3.5" />} label="Font" />
          <ToolButton icon={<Bold className="h-3.5 w-3.5" />} label="Bold" active={activeFormat.includes("bold")} onClick={() => toggleFormat("bold")} />
          <ToolButton icon={<Italic className="h-3.5 w-3.5" />} label="Italic" active={activeFormat.includes("italic")} onClick={() => toggleFormat("italic")} />
          <ToolButton icon={<Underline className="h-3.5 w-3.5" />} label="Underline" active={activeFormat.includes("underline")} onClick={() => toggleFormat("underline")} />
          <ToolButton icon={<Palette className="h-3.5 w-3.5" />} label="Text color" />
          <ToolButton icon={<Paintbrush className="h-3.5 w-3.5" />} label="Fill" />
        </ToolbarGroup>
        <Divider />
        <ToolbarGroup>
          <ToolButton icon={<AlignLeft className="h-3.5 w-3.5" />} label="Left" />
          <ToolButton icon={<AlignCenter className="h-3.5 w-3.5" />} label="Center" />
          <ToolButton icon={<AlignRight className="h-3.5 w-3.5" />} label="Right" />
        </ToolbarGroup>
        <Divider />
        <ToolbarGroup>
          <ToolButton icon={<Merge className="h-3.5 w-3.5" />} label="Merge cells" />
          <ToolButton icon={<Grid3x3 className="h-3.5 w-3.5" />} label="Borders" />
          <ToolButton icon={<Snowflake className="h-3.5 w-3.5" />} label="Freeze" active />
        </ToolbarGroup>
        <Divider />
        <ToolbarGroup>
          <ToolButton icon={<Rows className="h-3.5 w-3.5" />} label="Insert row" />
          <ToolButton icon={<Columns className="h-3.5 w-3.5" />} label="Insert col" />
          <ToolButton icon={<Plus className="h-3.5 w-3.5" />} label="Insert" />
          <ToolButton icon={<Trash2 className="h-3.5 w-3.5" />} label="Delete" />
        </ToolbarGroup>
        <Divider />
        <ToolbarGroup>
          <ToolButton icon={<Filter className="h-3.5 w-3.5" />} label="Filter" />
          <ToolButton icon={<ArrowUpDown className="h-3.5 w-3.5" />} label="Sort" />
        </ToolbarGroup>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => setAiOpen((v) => !v)}
            className={`flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[11px] font-medium transition ${
              aiOpen ? "border-[#6366F1]/40 bg-[#6366F1]/15 text-[#A5B4FC]" : "border-white/5 bg-white/5 text-neutral-300 hover:bg-white/10"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" /> OmniMind AI
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 border-b border-white/5 bg-[#0B0B12] px-3 py-1.5 text-xs">
        <div className="flex w-20 items-center justify-between rounded border border-white/5 bg-[#13131C] px-2 py-1 font-mono text-[11px] text-neutral-300">
          <span>{selected}</span>
          <ChevronDown className="h-3 w-3 text-neutral-500" />
        </div>
        <div className="flex h-7 w-7 items-center justify-center rounded border border-white/5 bg-[#13131C] text-neutral-500">
          <span className="font-mono text-[13px] italic">fx</span>
        </div>
        <div className="flex-1 rounded border border-white/5 bg-[#13131C] px-2.5 py-1 font-mono text-[11.5px]">
          {selectedCell?.formula ? (
            <span className="text-[#A5B4FC]">{selectedCell.formula}</span>
          ) : selectedCell?.value ? (
            <span className="text-neutral-300">{selectedCell.value}</span>
          ) : (
            <span className="text-neutral-600">Empty cell</span>
          )}
        </div>
      </div>

      <div className="flex min-h-0 flex-1">
        <div className="flex-1 overflow-auto">
          <div className="relative" style={{ fontSize: `${zoom / 100}rem` }}>
            <table className="border-separate border-spacing-0 text-[11.5px]">
              <thead className="sticky top-0 z-20">
                <tr>
                  <th className="sticky left-0 z-30 h-7 w-10 border-b border-r border-white/5 bg-[#0D0D14]"></th>
                  {COL_LETTERS.map((c) => (
                    <th key={c} className="group relative h-7 min-w-[110px] border-b border-r border-white/5 bg-[#0D0D14] px-2 text-left text-[10.5px] font-medium uppercase tracking-wider text-neutral-500">
                      <div className="flex items-center justify-between">
                        <span>{c}</span>
                        <MoreHorizontal className="h-3 w-3 opacity-0 group-hover:opacity-100" />
                      </div>
                      <div className="absolute right-0 top-0 h-full w-1 cursor-col-resize bg-transparent hover:bg-[#6366F1]/40" />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: ROWS }, (_, rIdx) => {
                  const r = rIdx + 1;
                  const isHeader = r === 1;
                  return (
                    <tr key={r}>
                      <td className={`sticky left-0 z-10 h-7 w-10 border-b border-r border-white/5 bg-[#0D0D14] px-2 text-right text-[10.5px] font-medium text-neutral-500 ${isHeader ? "border-b-[#6366F1]/30" : ""}`}>
                        {r}
                      </td>
                      {COL_LETTERS.map((c) => {
                        const key = `${c}${r}`;
                        const cell = data[key];
                        const isSel = selected === key;
                        return (
                          <td
                            key={key}
                            onClick={() => setSelected(key)}
                            onContextMenu={(e) => {
                              e.preventDefault();
                              setSelected(key);
                              setContextMenu({ x: e.clientX, y: e.clientY, cell: key });
                            }}
                            className={`relative h-7 min-w-[110px] cursor-cell truncate border-b border-r border-white/5 px-2 ${
                              isSel ? "z-10 outline outline-2 -outline-offset-2 outline-[#6366F1]" : ""
                            } ${isHeader ? "border-b-[#6366F1]/30" : ""}`}
                            style={{
                              backgroundColor: cell?.bg || (isHeader ? "#0F0F17" : "transparent"),
                              color: cell?.color || "#D4D4D8",
                              fontWeight: cell?.bold ? 600 : 400,
                            }}
                          >
                            {cell?.value || ""}
                            {isSel && <div className="pointer-events-none absolute -bottom-1 -right-1 h-2 w-2 rounded-[1px] bg-[#6366F1] shadow-[0_0_0_2px_#0A0A0F]" />}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="pointer-events-none fixed bottom-20 left-1/2 -translate-x-1/2 rounded-full border border-white/5 bg-black/60 px-3 py-1 text-[10.5px] text-neutral-500 backdrop-blur">
              Tip: right-click any cell for actions
            </div>
          </div>
        </div>

        {aiOpen && (
          <aside className="flex w-80 flex-col border-l border-white/5 bg-[#0B0B12]">
            <div className="flex items-center justify-between border-b border-white/5 px-3 py-2.5">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded bg-gradient-to-br from-[#6366F1] to-[#8B5CF6]">
                  <Sparkles className="h-3.5 w-3.5 text-white" />
                </div>
                <div>
                  <div className="text-[12px] font-medium text-white">OmniMind AI</div>
                  <div className="text-[10px] text-neutral-500">Analyzing {currentSheet.name}</div>
                </div>
              </div>
              <button onClick={() => setAiOpen(false)} className="rounded p-1 text-neutral-500 hover:bg-white/5 hover:text-white">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto p-3">
              <div className="rounded-lg border border-[#6366F1]/20 bg-gradient-to-br from-[#6366F1]/10 to-transparent p-3">
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#A5B4FC]">
                  <TrendingUp className="h-3 w-3" /> Key insight
                </div>
                <p className="mt-1.5 text-[12px] leading-relaxed text-neutral-300">
                  Q1 revenue hit <span className="font-semibold text-white">$4.83M</span>, 14% above target. APAC outperformed with 22% growth QoQ.
                </p>
              </div>

              <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-neutral-400">
                  <Zap className="h-3 w-3 text-[#F59E0B]" /> Anomaly
                </div>
                <p className="mt-1.5 text-[12px] leading-relaxed text-neutral-400">
                  <span className="text-white">Orbit Lite &middot; LATAM</span> margin dropped to 38% — 22 points below the product average.
                </p>
              </div>

              <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
                <div className="text-[11px] font-medium text-neutral-400">Top rep</div>
                <p className="mt-1.5 text-[12px] text-neutral-300">
                  <span className="font-semibold text-white">S. Chen</span> closed $812K across 14 deals — 2.3x team median.
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="text-[10px] font-medium uppercase tracking-wider text-neutral-600">Suggested actions</div>
                {[
                  "Create pivot by Region x Product",
                  "Forecast Q2 from linear trend",
                  "Flag cells where Margin % < 40",
                  "Chart revenue by month",
                ].map((s) => (
                  <button key={s} className="flex w-full items-center justify-between rounded-md border border-white/5 bg-white/[0.02] px-2.5 py-1.5 text-left text-[11.5px] text-neutral-300 hover:border-[#6366F1]/30 hover:bg-[#6366F1]/5">
                    {s}
                    <Sparkles className="h-3 w-3 text-[#6366F1]" />
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-white/5 p-3">
              <div className="rounded-lg border border-white/5 bg-[#13131C] p-2">
                <input placeholder="Ask AI about this data..." className="w-full bg-transparent text-[12px] text-white placeholder-neutral-600 outline-none" />
                <div className="mt-1.5 flex items-center justify-between">
                  <span className="text-[10px] text-neutral-600">Context: {selected} &middot; {currentSheet.name}</span>
                  <button className="rounded bg-[#6366F1] p-1 text-white hover:bg-[#7375F3]">
                    <Sparkles className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>

      <div className="border-t border-white/5 bg-[#0D0D14]">
        <div className="flex items-center gap-1 overflow-x-auto px-3 py-1.5">
          <button className="flex h-7 w-7 items-center justify-center rounded text-neutral-500 hover:bg-white/5 hover:text-white">
            <Plus className="h-3.5 w-3.5" />
          </button>
          {SHEETS.map((s) => {
            const active = s.key === activeSheet;
            return (
              <button
                key={s.key}
                onClick={() => setActiveSheet(s.key)}
                className={`group flex items-center gap-2 rounded-t-md px-3 py-1.5 text-[11.5px] transition ${
                  active ? "bg-[#0A0A0F] text-white shadow-[inset_0_2px_0_0_currentColor]" : "text-neutral-500 hover:bg-white/5 hover:text-neutral-300"
                }`}
                style={active ? { color: s.color } : undefined}
              >
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: s.color }} />
                <span className={active ? "text-white" : ""}>{s.name}</span>
                {active && <ChevronDown className="h-3 w-3 text-neutral-500 opacity-0 transition group-hover:opacity-100" />}
              </button>
            );
          })}
        </div>
        <div className="flex items-center justify-between border-t border-white/5 px-3 py-1 text-[10.5px] text-neutral-500">
          <div className="flex items-center gap-3">
            <span>Selected: <span className="font-mono text-neutral-300">{selected}</span></span>
            <span>Sum: <span className="text-neutral-300">$4,827,310</span></span>
            <span>Avg: <span className="text-neutral-300">$134,092</span></span>
            <span>Count: <span className="text-neutral-300">36</span></span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1"><Info className="h-3 w-3" /> Synced to OmniOS Cloud</span>
            <span className="text-neutral-600">v42 &middot; autosave on</span>
          </div>
        </div>
      </div>

      {contextMenu && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{ top: contextMenu.y, left: contextMenu.x }}
          className="fixed z-50 w-56 rounded-lg border border-white/10 bg-[#13131C] py-1 text-[12px] text-neutral-300 shadow-2xl shadow-black/60 backdrop-blur"
        >
          <div className="border-b border-white/5 px-3 py-1.5 text-[10px] uppercase tracking-wider text-neutral-500">
            Cell {contextMenu.cell}
          </div>
          {[["Cut", "Ctrl+X"], ["Copy", "Ctrl+C"], ["Paste", "Ctrl+V"], ["Paste special", "Ctrl+Shift+V"]].map(([l, k]) => (
            <button key={l} className="flex w-full items-center justify-between px-3 py-1.5 hover:bg-white/5">
              <span>{l}</span>
              <span className="text-neutral-600">{k}</span>
            </button>
          ))}
          <div className="my-1 h-px bg-white/5" />
          {["Insert row above", "Insert row below", "Insert column left", "Insert column right", "Delete row", "Delete column"].map((l) => (
            <button key={l} className="flex w-full items-center px-3 py-1.5 hover:bg-white/5">{l}</button>
          ))}
          <div className="my-1 h-px bg-white/5" />
          <button className="flex w-full items-center gap-2 px-3 py-1.5 text-[#A5B4FC] hover:bg-[#6366F1]/10">
            <Sparkles className="h-3 w-3" /> Ask OmniMind about this cell
          </button>
        </div>
      )}
    </div>
  );
}

function ToolbarGroup({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center gap-0.5">{children}</div>;
}

function Divider() {
  return <div className="mx-1 h-5 w-px bg-white/5" />;
}

function ToolButton({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`flex h-7 w-7 items-center justify-center rounded-md transition ${
        active ? "bg-[#6366F1]/15 text-[#A5B4FC] ring-1 ring-inset ring-[#6366F1]/30" : "text-neutral-400 hover:bg-white/5 hover:text-white"
      }`}
    >
      {icon}
    </button>
  );
}
