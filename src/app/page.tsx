"use client";

import { useMemo, useRef, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend, ScatterChart, Scatter, ZAxis,
} from "recharts";
import { parseCustomersCsv, fmtUsd } from "@/lib/parse";
import type { Customer, Tab } from "@/lib/types";

const ACCESS_CODE = "OpsIsAwesome";

export default function HomePage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [csvText, setCsvText] = useState("");
  const [source, setSource] = useState("");
  const [tab, setTab] = useState<Tab>("accounts");

  const accounts = useMemo(() => parseCustomersCsv(csvText), [csvText]);

  if (!loggedIn) return <LoginScreen onUnlock={() => setLoggedIn(true)} />;

  return (
    <main className="min-h-screen bloom">
      <Header tab={tab} onTab={setTab} hasData={accounts.length > 0} />
      <div className="mx-auto max-w-7xl px-8 py-10 space-y-8">
        {csvText === "" ? (
          <UploadZone
            onFile={(text, name) => { setCsvText(text); setSource(name); }}
          />
        ) : (
          <>
            <div className="no-print flex items-end justify-between flex-wrap gap-4">
              <div>
                <p className="text-slate text-xs">Internal · Customer success operator view</p>
                <h1 className="text-teal text-4xl md:text-5xl font-semibold tracking-tight mt-2 leading-tight">
                  {tabTitle(tab)}
                </h1>
                <p className="text-slate text-sm mt-2 tabular">
                  Source: <span className="text-ink font-medium">{source}</span> · {accounts.length} accounts
                </p>
              </div>
              <button
                onClick={() => { setCsvText(""); setSource(""); }}
                className="border border-parchment text-slate hover:text-teal px-4 py-2 text-xs uppercase tracking-[0.18em] rounded-organic"
              >
                Reset / Upload New
              </button>
            </div>

            {tab === "accounts" && <AccountsTab accounts={accounts} />}
            {tab === "renewals" && <RenewalsTab accounts={accounts} />}
            {tab === "health" && <HealthTab accounts={accounts} />}
            {tab === "insights" && <InsightsTab accounts={accounts} />}

            <footer className="pt-8 pb-4 border-t border-parchment flex items-center justify-between text-slate text-xs no-print">
              <span>Helix · Customer success operator view</span>
              <span className="tabular">{accounts.length} accounts loaded</span>
            </footer>
          </>
        )}
      </div>
    </main>
  );
}

function tabTitle(tab: Tab): string {
  switch (tab) {
    case "accounts": return "Customer Health Intelligence";
    case "renewals": return "Renewals & ARR Exposure";
    case "health": return "Health Signals";
    case "insights": return "Insights & Reports";
  }
}

/* ───────────────────────── LOGIN ───────────────────────── */

function LoginScreen({ onUnlock }: { onUnlock: () => void }) {
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (code === ACCESS_CODE) { setErr(""); onUnlock(); }
    else setErr("Incorrect access code.");
  }

  return (
    <main className="min-h-screen bloom flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-cream border border-parchment rounded-bloom shadow-lg p-10">
        <div className="flex items-center gap-3 mb-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Helix" className="h-12 w-12" />
          <div>
            <div className="text-teal text-3xl font-semibold tracking-tight lowercase">helix</div>
            <div className="text-slate text-xs tracking-wide">Customer Health Intelligence</div>
          </div>
        </div>
        <p className="text-slate text-sm mb-6">Enter your access code to continue.</p>
        <form onSubmit={submit} className="space-y-4">
          <input
            type="password"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Access code"
            autoFocus
            className="w-full bg-white border border-parchment rounded-organic text-ink px-4 py-3 text-sm tabular focus:outline-none focus:border-teal"
          />
          {err && <p className="text-ember text-xs">{err}</p>}
          <button
            type="submit"
            className="w-full bg-teal text-cream py-3 text-sm font-medium rounded-organic hover:bg-teal2 transition uppercase tracking-wider"
          >
            Enter
          </button>
        </form>
      </div>
    </main>
  );
}

/* ───────────────────────── UPLOAD ───────────────────────── */

function UploadZone({ onFile }: { onFile: (text: string, name: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);

  async function handleFile(file: File) {
    const text = await file.text();
    onFile(text, file.name);
  }

  return (
    <section
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={async (e) => {
        e.preventDefault();
        setDrag(false);
        const f = e.dataTransfer.files?.[0];
        if (f) await handleFile(f);
      }}
      className={`mt-12 border-2 border-dashed cursor-pointer transition-colors p-20 text-center bg-cream rounded-bloom shadow-sm ${drag ? "border-teal bg-parchment/40" : "border-parchment hover:border-teal"}`}
    >
      <div className="text-teal text-2xl font-semibold tracking-tight">Drop your CS platform export here</div>
      <div className="text-slate text-sm mt-3 uppercase tracking-[0.2em]">.csv files only</div>
      <input
        ref={inputRef}
        type="file"
        accept=".csv,text/csv"
        className="hidden"
        onChange={async (e) => {
          const f = e.target.files?.[0];
          if (f) await handleFile(f);
          e.target.value = "";
        }}
      />
    </section>
  );
}

/* ───────────────────────── HEADER ───────────────────────── */

const TABS: Array<{ key: Tab; label: string }> = [
  { key: "accounts", label: "Accounts" },
  { key: "renewals", label: "Renewals" },
  { key: "health", label: "Health" },
  { key: "insights", label: "Insights" },
];

function Header({ tab, onTab, hasData }: { tab: Tab; onTab: (t: Tab) => void; hasData: boolean }) {
  return (
    <header className="border-b border-parchment no-print">
      <div className="mx-auto max-w-7xl px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Helix" className="h-10 w-10" />
          <div className="flex items-baseline gap-2">
            <span className="text-teal text-2xl font-semibold tracking-tight lowercase">helix</span>
            <span className="text-slate text-xs tracking-wide">Customer Health Intelligence</span>
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-xs uppercase tracking-[0.18em]">
          {TABS.map((t) => {
            const active = t.key === tab;
            return (
              <button
                key={t.key}
                type="button"
                disabled={!hasData}
                onClick={() => onTab(t.key)}
                className={`cursor-pointer transition-colors py-2 border-b-2 ${active ? "text-teal border-teal font-semibold" : "text-slate border-transparent hover:text-teal2"} ${!hasData ? "opacity-40 cursor-not-allowed" : ""}`}
              >
                {t.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

/* ───────────────────────── SHARED UI ───────────────────────── */

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={`bg-cream border border-parchment rounded-bloom shadow-sm p-6 ${className}`}>
      {children}
    </section>
  );
}

function CardTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-teal text-sm font-semibold uppercase tracking-[0.16em] mb-4">{children}</h3>;
}

function Kpi({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-cream border border-parchment rounded-organic p-5 shadow-sm">
      <div className="text-slate text-[10px] uppercase tracking-[0.22em]">{label}</div>
      <div className="text-teal text-3xl font-semibold tabular mt-2">{value}</div>
      {sub && <div className="text-slate text-xs mt-1 tabular">{sub}</div>}
    </div>
  );
}

const CHART_AXIS = { stroke: "#5C6A66", fontSize: 11 };
const CHART_GRID = "rgba(15,76,73,0.10)";
const TOOLTIP_STYLE = {
  background: "#FFFFFF",
  border: "1px solid #EAE2CB",
  borderRadius: 12,
  color: "#1F2A2A",
  fontSize: 12,
};

const STATUS_TINT: Record<Customer["status"], string> = {
  Active: "",
  "At-Risk": "bg-amber/10",
  Churned: "bg-red-100/60",
};

const STATUS_BADGE: Record<Customer["status"], string> = {
  Active: "bg-teal/10 text-teal",
  "At-Risk": "bg-amber/30 text-ember",
  Churned: "bg-red-100 text-red-700",
};

/* ───────────────────────── ACCOUNTS TAB ───────────────────────── */

function AccountsTab({ accounts }: { accounts: Customer[] }) {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("All");
  const [plan, setPlan] = useState("All");
  const [size, setSize] = useState("All");
  const [csm, setCsm] = useState("All");
  const [renewal, setRenewal] = useState("All");
  const [sortKey, setSortKey] = useState<keyof Customer>("mrr");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const totalCustomers = accounts.length;
  const totalMrr = accounts.filter((a) => a.status !== "Churned").reduce((s, a) => s + a.mrr, 0);
  const atRiskMrr = accounts.filter((a) => a.status === "At-Risk").reduce((s, a) => s + a.mrr, 0);
  const avgHealth = accounts.length
    ? accounts.reduce((s, a) => s + healthScore(a), 0) / accounts.length
    : 0;
  const renewQuarter = mostCommonNextQuarter(accounts);
  const renewingThis = accounts.filter((a) => a.renewal_quarter === renewQuarter && a.status !== "Churned").length;

  const plans = ["All", ...uniq(accounts.map((a) => a.plan))];
  const sizes = ["All", ...uniq(accounts.map((a) => a.company_size))];
  const csms = ["All", "Yes", "No"];
  const renewals = ["All", ...uniq(accounts.map((a) => a.renewal_quarter))];

  const filtered = accounts
    .filter((a) => (q ? a.company_name.toLowerCase().includes(q.toLowerCase()) : true))
    .filter((a) => (status === "All" ? true : a.status === status))
    .filter((a) => (plan === "All" ? true : a.plan === plan))
    .filter((a) => (size === "All" ? true : a.company_size === size))
    .filter((a) => (csm === "All" ? true : a.csm_assigned === csm))
    .filter((a) => (renewal === "All" ? true : a.renewal_quarter === renewal))
    .sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      const cmp = typeof av === "number" && typeof bv === "number" ? av - bv : String(av).localeCompare(String(bv));
      return sortDir === "asc" ? cmp : -cmp;
    });

  function toggleSort(k: keyof Customer) {
    if (k === sortKey) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortKey(k); setSortDir("desc"); }
  }

  function Th({ k, label, align = "left" }: { k: keyof Customer; label: string; align?: "left" | "right" }) {
    return (
      <th
        onClick={() => toggleSort(k)}
        className={`text-${align} py-2 pr-4 cursor-pointer hover:text-teal text-slate text-[10px] uppercase tracking-[0.18em] font-semibold`}
      >
        {label}{sortKey === k ? (sortDir === "asc" ? " ↑" : " ↓") : ""}
      </th>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Kpi label="Total Customers" value={String(totalCustomers)} />
        <Kpi label="Total MRR" value={fmtUsd(totalMrr)} sub="active + at-risk" />
        <Kpi label="At-Risk MRR" value={fmtUsd(atRiskMrr)} sub="needs attention" />
        <Kpi label="Avg Health Score" value={`${Math.round(avgHealth)}`} sub="0–100" />
        <Kpi label="Renewing" value={String(renewingThis)} sub={renewQuarter || "this quarter"} />
      </div>

      <Card>
        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-3">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search company…"
            className="bg-white border border-parchment rounded-organic px-3 py-2 text-sm text-ink"
          />
          <Select value={status} onChange={setStatus} options={["All", "Active", "At-Risk", "Churned"]} label="Status" />
          <Select value={plan} onChange={setPlan} options={plans} label="Plan" />
          <Select value={size} onChange={setSize} options={sizes} label="Size" />
          <Select value={csm} onChange={setCsm} options={csms} label="CSM Assigned" />
          <Select value={renewal} onChange={setRenewal} options={renewals} label="Renewal" />
        </div>
        <p className="text-slate text-xs mt-3 tabular">{filtered.length} accounts match</p>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm tabular">
            <thead className="border-b border-parchment">
              <tr>
                <Th k="company_name" label="Company" />
                <Th k="industry" label="Industry" />
                <Th k="company_size" label="Size" />
                <Th k="plan" label="Plan" />
                <Th k="mrr" label="MRR" align="right" />
                <th className="text-right py-2 pr-4 text-slate text-[10px] uppercase tracking-[0.18em] font-semibold">Health</th>
                <Th k="product_usage_score" label="Usage" align="right" />
                <Th k="csm_name" label="CSM" />
                <Th k="renewal_quarter" label="Renewal" />
                <Th k="nps_score" label="NPS" align="right" />
                <Th k="status" label="Status" />
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 200).map((a) => {
                const h = healthScore(a);
                return (
                  <tr key={a.customer_id} className={`border-b border-parchment/60 ${STATUS_TINT[a.status]}`}>
                    <td className="py-2 pr-4 text-ink font-medium">{a.company_name}</td>
                    <td className="py-2 pr-4 text-slate">{a.industry}</td>
                    <td className="py-2 pr-4 text-slate">{a.company_size}</td>
                    <td className="py-2 pr-4 text-slate">{a.plan}</td>
                    <td className="py-2 pr-4 text-right text-ink">{fmtUsd(a.mrr)}</td>
                    <td className={`py-2 pr-4 text-right font-medium ${h < 40 ? "text-red-600" : h < 60 ? "text-ember" : "text-teal"}`}>{Math.round(h)}</td>
                    <td className="py-2 pr-4 text-right text-slate">{a.product_usage_score}</td>
                    <td className="py-2 pr-4 text-slate">{a.csm_name || "—"}</td>
                    <td className="py-2 pr-4 text-slate">{a.renewal_quarter}</td>
                    <td className={`py-2 pr-4 text-right ${a.nps_score < 0 ? "text-red-600" : a.nps_score < 30 ? "text-ember" : "text-teal"}`}>{a.nps_score}</td>
                    <td className="py-2 pr-4">
                      <span className={`text-[10px] uppercase tracking-wide px-2 py-1 rounded ${STATUS_BADGE[a.status]}`}>{a.status}</span>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={11} className="py-4 text-center text-slate">No accounts match these filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {filtered.length > 200 && (
          <p className="text-slate text-xs mt-3">Showing first 200 of {filtered.length}.</p>
        )}
      </Card>
    </div>
  );
}

function Select({ value, onChange, options, label }: { value: string; onChange: (v: string) => void; options: string[]; label: string }) {
  return (
    <div>
      <div className="text-slate text-[10px] uppercase tracking-[0.18em] mb-1">{label}</div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white border border-parchment rounded-organic px-3 py-2 text-sm text-ink"
      >
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

/* ───────────────────────── RENEWALS TAB ───────────────────────── */

function RenewalsTab({ accounts }: { accounts: Customer[] }) {
  const quarters = uniq(accounts.map((a) => a.renewal_quarter)).sort(quarterCompare);

  const byQuarter = quarters.map((q) => {
    const own = accounts.filter((a) => a.renewal_quarter === q && a.status !== "Churned");
    const atRisk = own.filter((a) => a.status === "At-Risk");
    return {
      quarter: q,
      totalMrr: own.reduce((s, a) => s + a.mrr, 0),
      atRiskMrr: atRisk.reduce((s, a) => s + a.mrr, 0),
    };
  });

  // Pick upcoming quarters: prefer Q1-2025/Q2-2025 if present, else first two from sorted list.
  let upcomingQs = ["Q1-2025", "Q2-2025"].filter((q) => quarters.includes(q));
  if (upcomingQs.length === 0) upcomingQs = quarters.slice(0, 2);
  const upcoming = accounts
    .filter((a) => upcomingQs.includes(a.renewal_quarter) && a.status !== "Churned")
    .sort((a, b) => b.mrr - a.mrr);

  const industries = uniq(accounts.map((a) => a.industry));
  const arrAtRisk = industries.map((ind) => {
    const own = accounts.filter((a) => a.industry === ind && (a.status === "At-Risk" || a.status === "Churned"));
    return { industry: ind, mrr: own.reduce((s, a) => s + a.mrr, 0) };
  }).filter((i) => i.mrr > 0).sort((a, b) => b.mrr - a.mrr);

  return (
    <div className="space-y-8">
      <Card>
        <CardTitle>MRR by Renewal Quarter</CardTitle>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={byQuarter}>
            <CartesianGrid stroke={CHART_GRID} />
            <XAxis dataKey="quarter" {...CHART_AXIS} />
            <YAxis {...CHART_AXIS} tickFormatter={(v) => fmtUsd(Number(v))} />
            <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => fmtUsd(v)} cursor={{ fill: "rgba(15,76,73,0.05)" }} />
            <Legend wrapperStyle={{ color: "#5C6A66", fontSize: 12 }} />
            <Bar dataKey="totalMrr" fill="#0F4C49" name="Total MRR" radius={[4, 4, 0, 0]} />
            <Bar dataKey="atRiskMrr" fill="#E0A24A" name="At-Risk MRR" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card>
        <CardTitle>Upcoming Renewals · {upcomingQs.join(" + ")}</CardTitle>
        <div className="overflow-x-auto">
          <table className="w-full text-sm tabular">
            <thead>
              <tr className="text-slate text-[10px] uppercase tracking-[0.18em] border-b border-parchment">
                <th className="text-left py-2 pr-4">Company</th>
                <th className="text-right py-2 pr-4">MRR</th>
                <th className="text-right py-2 pr-4">Health</th>
                <th className="text-right py-2 pr-4">Usage</th>
                <th className="text-left py-2 pr-4">CSM</th>
                <th className="text-left py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {upcoming.slice(0, 30).map((a) => {
                const h = Math.round(healthScore(a));
                return (
                  <tr key={a.customer_id} className={`border-b border-parchment/60 ${STATUS_TINT[a.status]}`}>
                    <td className="py-2 pr-4 text-ink font-medium">{a.company_name}</td>
                    <td className="py-2 pr-4 text-right text-ink">{fmtUsd(a.mrr)}</td>
                    <td className={`py-2 pr-4 text-right ${h < 40 ? "text-red-600" : h < 60 ? "text-ember" : "text-teal"}`}>{h}</td>
                    <td className="py-2 pr-4 text-right text-slate">{a.product_usage_score}</td>
                    <td className="py-2 pr-4 text-slate">{a.csm_name || "—"}</td>
                    <td className="py-2">
                      <span className={`text-[10px] uppercase tracking-wide px-2 py-1 rounded ${STATUS_BADGE[a.status]}`}>{a.status}</span>
                    </td>
                  </tr>
                );
              })}
              {upcoming.length === 0 && (
                <tr><td colSpan={6} className="py-4 text-center text-slate">No upcoming renewals in {upcomingQs.join(", ")}.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <CardTitle>ARR at Risk by Industry</CardTitle>
        <ResponsiveContainer width="100%" height={Math.max(240, arrAtRisk.length * 32)}>
          <BarChart data={arrAtRisk} layout="vertical" margin={{ left: 30 }}>
            <CartesianGrid stroke={CHART_GRID} horizontal={false} />
            <XAxis type="number" {...CHART_AXIS} tickFormatter={(v) => fmtUsd(Number(v))} />
            <YAxis type="category" dataKey="industry" {...CHART_AXIS} width={130} />
            <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => fmtUsd(v)} cursor={{ fill: "rgba(224,162,74,0.08)" }} />
            <Bar dataKey="mrr" fill="#E0A24A" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}

/* ───────────────────────── HEALTH TAB ───────────────────────── */

function HealthTab({ accounts }: { accounts: Customer[] }) {
  const buckets = [
    { range: "0–20", min: 0, max: 20, color: "#DC2626" },
    { range: "20–40", min: 20, max: 40, color: "#EF4444" },
    { range: "40–60", min: 40, max: 60, color: "#E0A24A" },
    { range: "60–80", min: 60, max: 80, color: "#7BA89B" },
    { range: "80–100", min: 80, max: 101, color: "#0F4C49" },
  ];
  const histo = buckets.map((b) => ({
    range: b.range,
    count: accounts.filter((a) => { const h = healthScore(a); return h >= b.min && h < b.max; }).length,
    color: b.color,
  }));

  const scatter = accounts.map((a) => ({
    x: a.product_usage_score,
    y: a.nps_score,
    status: a.status,
    name: a.company_name,
  }));
  const scatterByStatus = {
    Active: scatter.filter((s) => s.status === "Active"),
    "At-Risk": scatter.filter((s) => s.status === "At-Risk"),
    Churned: scatter.filter((s) => s.status === "Churned"),
  };

  const csmYes = accounts.filter((a) => a.csm_assigned === "Yes");
  const csmNo = accounts.filter((a) => a.csm_assigned === "No");
  const csmImpact = [
    {
      group: "CSM Assigned",
      avgHealth: csmYes.length ? csmYes.reduce((s, a) => s + healthScore(a), 0) / csmYes.length : 0,
      churnRate: csmYes.length ? (csmYes.filter((a) => a.status === "Churned").length / csmYes.length) * 100 : 0,
    },
    {
      group: "No CSM",
      avgHealth: csmNo.length ? csmNo.reduce((s, a) => s + healthScore(a), 0) / csmNo.length : 0,
      churnRate: csmNo.length ? (csmNo.filter((a) => a.status === "Churned").length / csmNo.length) * 100 : 0,
    },
  ];

  const lowHealth = accounts
    .map((a) => ({ ...a, _h: healthScore(a) }))
    .filter((a) => a._h < 50)
    .sort((a, b) => b.mrr - a.mrr);

  return (
    <div className="space-y-8">
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardTitle>Health Score Distribution</CardTitle>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={histo}>
              <CartesianGrid stroke={CHART_GRID} />
              <XAxis dataKey="range" {...CHART_AXIS} />
              <YAxis {...CHART_AXIS} />
              <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: "rgba(15,76,73,0.05)" }} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {histo.map((h, i) => (
                  <rect key={i} fill={h.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-3 text-xs text-slate mt-3 flex-wrap">
            {histo.map((h) => (
              <span key={h.range} className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm inline-block" style={{ background: h.color }} /> {h.range}
              </span>
            ))}
          </div>
        </Card>

        <Card>
          <CardTitle>Usage vs NPS</CardTitle>
          <ResponsiveContainer width="100%" height={280}>
            <ScatterChart>
              <CartesianGrid stroke={CHART_GRID} />
              <XAxis type="number" dataKey="x" name="Usage" domain={[0, 100]} {...CHART_AXIS} />
              <YAxis type="number" dataKey="y" name="NPS" domain={[-100, 100]} {...CHART_AXIS} />
              <ZAxis range={[60, 60]} />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                contentStyle={TOOLTIP_STYLE}
                formatter={(v: number, name: string) => [v, name]}
              />
              <Legend wrapperStyle={{ color: "#5C6A66", fontSize: 12 }} />
              <Scatter name="Active" data={scatterByStatus.Active} fill="#0F4C49" />
              <Scatter name="At-Risk" data={scatterByStatus["At-Risk"]} fill="#E0A24A" />
              <Scatter name="Churned" data={scatterByStatus.Churned} fill="#DC2626" />
            </ScatterChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card>
        <CardTitle>CSM Impact</CardTitle>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={csmImpact}>
            <CartesianGrid stroke={CHART_GRID} />
            <XAxis dataKey="group" {...CHART_AXIS} />
            <YAxis {...CHART_AXIS} />
            <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => v.toFixed(1)} cursor={{ fill: "rgba(15,76,73,0.05)" }} />
            <Legend wrapperStyle={{ color: "#5C6A66", fontSize: 12 }} />
            <Bar dataKey="avgHealth" fill="#0F4C49" name="Avg Health" radius={[4, 4, 0, 0]} />
            <Bar dataKey="churnRate" fill="#DC2626" name="Churn Rate %" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <CardTitle>Low Health Alert (score &lt; 50)</CardTitle>
          <span className="bg-red-100 text-red-700 text-xs font-medium px-3 py-1 rounded">{lowHealth.length} accounts</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm tabular">
            <thead>
              <tr className="text-slate text-[10px] uppercase tracking-[0.18em] border-b border-parchment">
                <th className="text-left py-2 pr-4">Company</th>
                <th className="text-right py-2 pr-4">MRR</th>
                <th className="text-right py-2 pr-4">Health</th>
                <th className="text-right py-2 pr-4">Usage</th>
                <th className="text-right py-2 pr-4">Last Login</th>
                <th className="text-left py-2 pr-4">CSM</th>
                <th className="text-left py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {lowHealth.slice(0, 30).map((a) => (
                <tr key={a.customer_id} className={`border-b border-parchment/60 ${STATUS_TINT[a.status]}`}>
                  <td className="py-2 pr-4 text-ink font-medium">{a.company_name}</td>
                  <td className="py-2 pr-4 text-right text-ink">{fmtUsd(a.mrr)}</td>
                  <td className="py-2 pr-4 text-right text-red-600">{Math.round(a._h)}</td>
                  <td className="py-2 pr-4 text-right text-slate">{a.product_usage_score}</td>
                  <td className="py-2 pr-4 text-right text-slate">{a.last_login_days_ago}d</td>
                  <td className="py-2 pr-4 text-slate">{a.csm_name || "—"}</td>
                  <td className="py-2">
                    <span className={`text-[10px] uppercase tracking-wide px-2 py-1 rounded ${STATUS_BADGE[a.status]}`}>{a.status}</span>
                  </td>
                </tr>
              ))}
              {lowHealth.length === 0 && (
                <tr><td colSpan={7} className="py-4 text-center text-slate">No low-health accounts. Healthy book.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

/* ───────────────────────── INSIGHTS TAB ───────────────────────── */

function InsightsTab({ accounts }: { accounts: Customer[] }) {
  const totalMrr = accounts.filter((a) => a.status !== "Churned").reduce((s, a) => s + a.mrr, 0);
  const atRiskMrr = accounts.filter((a) => a.status === "At-Risk").reduce((s, a) => s + a.mrr, 0);
  const atRiskPct = totalMrr ? (atRiskMrr / totalMrr) * 100 : 0;

  const noLogin14 = accounts.filter((a) => a.last_login_days_ago >= 14 && a.status !== "Churned").length;

  const active = accounts.filter((a) => a.status === "Active");
  const atRisk = accounts.filter((a) => a.status === "At-Risk");
  const avgUsageActive = active.length ? active.reduce((s, a) => s + a.product_usage_score, 0) / active.length : 0;
  const avgUsageRisk = atRisk.length ? atRisk.reduce((s, a) => s + a.product_usage_score, 0) / atRisk.length : 0;

  const csmYes = accounts.filter((a) => a.csm_assigned === "Yes");
  const csmNo = accounts.filter((a) => a.csm_assigned === "No");
  const churnYes = csmYes.length ? (csmYes.filter((a) => a.status === "Churned").length / csmYes.length) * 100 : 0;
  const churnNo = csmNo.length ? (csmNo.filter((a) => a.status === "Churned").length / csmNo.length) * 100 : 0;

  const churnedReasons: Record<string, number> = {};
  accounts.filter((a) => a.status === "Churned" && a.churn_reason).forEach((a) => {
    churnedReasons[a.churn_reason] = (churnedReasons[a.churn_reason] || 0) + 1;
  });
  const topReasons = Object.entries(churnedReasons).sort(([, a], [, b]) => b - a).slice(0, 3);

  const churnedAccounts = accounts.filter((a) => a.status === "Churned");
  const month3 = churnedAccounts.filter((a) => a.months_as_customer === 3).length;
  const month12 = churnedAccounts.filter((a) => a.months_as_customer === 12).length;

  const insights: string[] = [];
  insights.push(`At-risk MRR is ${fmtUsd(atRiskMrr)} — ${atRiskPct.toFixed(1)}% of the active book.`);
  insights.push(`${noLogin14} accounts have not logged in for 14+ days (active or at-risk).`);
  insights.push(`Avg usage: Active = ${avgUsageActive.toFixed(0)}, At-Risk = ${avgUsageRisk.toFixed(0)}. Gap = ${(avgUsageActive - avgUsageRisk).toFixed(0)} points.`);
  insights.push(`Churn rate: with CSM = ${churnYes.toFixed(1)}%, without CSM = ${churnNo.toFixed(1)}%.`);
  if (topReasons.length) {
    insights.push(`Top churn reasons: ${topReasons.map(([r, c]) => `${r} (${c})`).join(", ")}.`);
  }
  if (month3 > 0 || month12 > 0) {
    insights.push(`Churn cliffs visible in data: month 3 = ${month3} accounts, month 12 = ${month12} accounts.`);
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardTitle>Auto-Generated Insights</CardTitle>
        <ul className="space-y-3 text-ink">
          {insights.map((line, i) => (
            <li key={i} className="flex gap-3 text-sm leading-relaxed">
              <span className="text-slate tabular">{String(i + 1).padStart(2, "0")}</span>
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <CardTitle>Export</CardTitle>
        <div className="flex gap-3 no-print">
          <button
            onClick={() => window.print()}
            className="bg-teal text-cream px-5 py-2 text-sm font-medium rounded-organic hover:bg-teal2 transition uppercase tracking-wider"
          >
            Export PDF
          </button>
          <button
            onClick={() => alert("PPT export coming soon — use Export PDF for now.")}
            className="border border-parchment text-teal px-5 py-2 text-sm font-medium rounded-organic hover:bg-parchment/40 transition uppercase tracking-wider"
          >
            Export PPT
          </button>
        </div>
        <p className="text-slate text-xs mt-3">PDF export uses your browser print dialog — choose &quot;Save as PDF&quot;.</p>
      </Card>
    </div>
  );
}

/* ───────────────────────── HELPERS ───────────────────────── */

function uniq<T>(arr: T[]): T[] {
  return Array.from(new Set(arr.filter((v) => v !== "" && v != null)));
}

function healthScore(a: Customer): number {
  // Composite 0-100. Weight usage 40%, NPS 30%, login recency 20%, low ticket count 10%.
  const usage = clamp(a.product_usage_score, 0, 100);
  const nps = clamp((a.nps_score + 100) / 2, 0, 100);
  const login = clamp(100 - a.last_login_days_ago * 2, 0, 100);
  const ticket = clamp(100 - a.support_tickets_90d * 5, 0, 100);
  return usage * 0.4 + nps * 0.3 + login * 0.2 + ticket * 0.1;
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

function quarterCompare(a: string, b: string): number {
  // "Q1-2025" sortable
  const pa = parseQuarter(a);
  const pb = parseQuarter(b);
  if (pa.y !== pb.y) return pa.y - pb.y;
  return pa.q - pb.q;
}

function parseQuarter(s: string): { q: number; y: number } {
  const m = /Q(\d)[-\s]?(\d{4})/.exec(s);
  if (!m) return { q: 0, y: 0 };
  return { q: Number(m[1]), y: Number(m[2]) };
}

function mostCommonNextQuarter(accounts: Customer[]): string {
  const counts: Record<string, number> = {};
  accounts.forEach((a) => {
    if (a.renewal_quarter && a.status !== "Churned") {
      counts[a.renewal_quarter] = (counts[a.renewal_quarter] || 0) + 1;
    }
  });
  const sorted = Object.entries(counts).sort(([, a], [, b]) => b - a);
  return sorted[0]?.[0] ?? "";
}
