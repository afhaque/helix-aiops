import type { Account } from "@/lib/types";
import { fmtUsd } from "@/lib/parse";

function Kpi({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: boolean }) {
  return (
    <div className={`rounded-bloom p-5 border ${accent ? "bg-teal text-cream border-teal" : "bg-white/60 text-ink border-parchment"}`}>
      <p className={`text-xs ${accent ? "text-cream/70" : "text-slate"}`}>{label}</p>
      <p className="text-3xl font-semibold mt-2 tabular">{value}</p>
      {sub && <p className={`text-xs mt-1 tabular ${accent ? "text-cream/80" : "text-slate"}`}>{sub}</p>}
    </div>
  );
}

export function KpiGrid({ accounts }: { accounts: Account[] }) {
  const totalArr = accounts.reduce((s, a) => s + a.arr_usd, 0);
  const atRisk = accounts.filter((a) => a.risk_flag === "red");
  const atRiskArr = atRisk.reduce((s, a) => s + a.arr_usd, 0);
  const avgHealth = accounts.length === 0 ? 0 : Math.round(accounts.reduce((s, a) => s + a.health_score, 0) / accounts.length);
  const avgNps = accounts.length === 0 ? 0 : (accounts.reduce((s, a) => s + a.nps, 0) / accounts.length).toFixed(1);

  return (
    <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Kpi accent label="Book ARR" value={fmtUsd(totalArr)} sub={`${accounts.length} accounts`} />
      <Kpi label="At-risk ARR" value={fmtUsd(atRiskArr)} sub={`${atRisk.length} red accounts`} />
      <Kpi label="Avg Health" value={`${avgHealth}`} sub="0–100 composite" />
      <Kpi label="Avg NPS" value={`${avgNps}`} sub="last survey wave" />
    </section>
  );
}
