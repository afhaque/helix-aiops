"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import type { Account } from "@/lib/types";

const QUARTERS = ["Q1-2026", "Q2-2026", "Q3-2026", "Q4-2026"];

export function RenewalsChart({ accounts }: { accounts: Account[] }) {
  const data = QUARTERS.map((q) => {
    const subset = accounts.filter((a) => a.renewal_quarter === q);
    const green = subset.filter((a) => a.risk_flag === "green").reduce((s, a) => s + a.arr_usd, 0);
    const yellow = subset.filter((a) => a.risk_flag === "yellow").reduce((s, a) => s + a.arr_usd, 0);
    const red = subset.filter((a) => a.risk_flag === "red").reduce((s, a) => s + a.arr_usd, 0);
    return { q, green, yellow, red };
  });

  return (
    <section className="rounded-bloom bg-white/60 border border-parchment p-6">
      <div className="flex items-baseline justify-between mb-4">
        <h3 className="text-teal text-base font-semibold">Renewal ARR by Quarter</h3>
        <span className="text-slate text-xs">Stacked by health flag</span>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
            <CartesianGrid stroke="rgba(31,42,42,0.08)" vertical={false} />
            <XAxis dataKey="q" stroke="#5C6A66" tick={{ fill: "#5C6A66", fontSize: 11 }} />
            <YAxis stroke="#5C6A66" tick={{ fill: "#5C6A66", fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
            <Tooltip
              cursor={{ fill: "rgba(15,76,73,0.05)" }}
              contentStyle={{ background: "#F5F0E1", border: "1px solid #EAE2CB", borderRadius: 14, fontSize: 12, color: "#1F2A2A" }}
              formatter={(value: number) => `$${value.toLocaleString()}`}
            />
            <Legend wrapperStyle={{ fontSize: 11, color: "#5C6A66" }} />
            <Bar dataKey="green" stackId="a" fill="#176E69" name="Healthy" />
            <Bar dataKey="yellow" stackId="a" fill="#E0A24A" name="Watch" />
            <Bar dataKey="red" stackId="a" fill="#C97B2A" name="At risk" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
