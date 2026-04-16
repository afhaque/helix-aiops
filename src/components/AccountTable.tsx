import type { Account } from "@/lib/types";
import { RISK_TONE } from "@/lib/types";
import { fmtUsd } from "@/lib/parse";

function Pill({ flag }: { flag: Account["risk_flag"] }) {
  const t = RISK_TONE[flag];
  return <span className={`text-[11px] px-2.5 py-1 rounded-full ${t.bg} ${t.fg} font-medium`}>{t.label}</span>;
}

function SeatBar({ active, total }: { active: number; total: number }) {
  const pct = total === 0 ? 0 : Math.round((active / total) * 100);
  return (
    <div className="flex items-center gap-2">
      <div className="w-20 h-1.5 bg-parchment rounded-full overflow-hidden">
        <div className="h-full bg-teal" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-slate tabular">{pct}%</span>
    </div>
  );
}

export function AccountTable({ accounts }: { accounts: Account[] }) {
  // Sort: red first, then by ARR desc — at-risk accounts to the top.
  const order = { red: 0, yellow: 1, green: 2 } as const;
  const sorted = [...accounts]
    .sort((a, b) => order[a.risk_flag] - order[b.risk_flag] || b.arr_usd - a.arr_usd)
    .slice(0, 14);

  return (
    <section className="rounded-bloom bg-white/60 border border-parchment overflow-hidden">
      <div className="px-6 py-4 border-b border-parchment flex items-baseline justify-between">
        <h3 className="text-teal text-base font-semibold">Account Watchlist</h3>
        <span className="text-slate text-xs">At-risk surfaced first</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-slate text-xs">
            <tr className="border-b border-parchment">
              <th className="text-left px-6 py-3 font-medium">Company</th>
              <th className="text-left px-6 py-3 font-medium">Industry</th>
              <th className="text-left px-6 py-3 font-medium">CSM</th>
              <th className="text-right px-6 py-3 font-medium">ARR</th>
              <th className="text-right px-6 py-3 font-medium">Health</th>
              <th className="text-left px-6 py-3 font-medium">Seat usage</th>
              <th className="text-left px-6 py-3 font-medium">Renewal</th>
              <th className="text-left px-6 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((a) => (
              <tr key={a.account_id} className="border-b border-parchment/60 hover:bg-parchment/30">
                <td className="px-6 py-3 text-ink font-medium">{a.company_name}</td>
                <td className="px-6 py-3 text-slate">{a.industry}</td>
                <td className="px-6 py-3 text-slate">{a.csm_owner}</td>
                <td className="px-6 py-3 text-right tabular text-ink">{fmtUsd(a.arr_usd)}</td>
                <td className="px-6 py-3 text-right tabular text-ink">{a.health_score}</td>
                <td className="px-6 py-3"><SeatBar active={a.seats_active} total={a.seats_total} /></td>
                <td className="px-6 py-3 text-slate">{a.renewal_quarter}</td>
                <td className="px-6 py-3"><Pill flag={a.risk_flag} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
