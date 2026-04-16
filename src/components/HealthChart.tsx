"use client";

import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";
import type { Account } from "@/lib/types";

const FLAG_COLOR: Record<Account["risk_flag"], string> = {
  green: "#176E69",
  yellow: "#E0A24A",
  red: "#C97B2A"
};

export function HealthChart({ accounts }: { accounts: Account[] }) {
  const data = accounts.map((a) => ({
    x: a.engagement_score,
    y: a.health_score,
    z: Math.max(40, Math.sqrt(a.arr_usd) * 1.2),
    flag: a.risk_flag,
    name: a.company_name,
    arr: a.arr_usd
  }));

  return (
    <section className="rounded-bloom bg-white/60 border border-parchment p-6">
      <div className="flex items-baseline justify-between mb-4">
        <h3 className="text-teal text-base font-semibold">Health vs Engagement</h3>
        <span className="text-slate text-xs">Bubble size = ARR</span>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
            <CartesianGrid stroke="rgba(31,42,42,0.08)" />
            <XAxis type="number" dataKey="x" name="Engagement" stroke="#5C6A66" tick={{ fill: "#5C6A66", fontSize: 11 }} domain={[0, 100]} label={{ value: "Engagement", position: "insideBottom", offset: -2, fill: "#5C6A66", fontSize: 11 }} />
            <YAxis type="number" dataKey="y" name="Health" stroke="#5C6A66" tick={{ fill: "#5C6A66", fontSize: 11 }} domain={[0, 100]} label={{ value: "Health", angle: -90, position: "insideLeft", fill: "#5C6A66", fontSize: 11 }} />
            <ZAxis type="number" dataKey="z" range={[40, 360]} />
            <Tooltip
              cursor={{ stroke: "rgba(15,76,73,0.2)" }}
              contentStyle={{ background: "#F5F0E1", border: "1px solid #EAE2CB", borderRadius: 14, fontSize: 12, color: "#1F2A2A" }}
              formatter={(value: number, key: string, ctx: { payload: { name: string; arr: number } }) => {
                if (key === "x") return [`${value}`, "Engagement"];
                if (key === "y") return [`${value}`, "Health"];
                if (key === "z") return [`$${ctx.payload.arr.toLocaleString()}`, "ARR"];
                return [value, key];
              }}
              labelFormatter={(_, items) => items?.[0]?.payload?.name ?? ""}
            />
            <Scatter data={data}>
              {data.map((d, i) => (
                <Cell key={i} fill={FLAG_COLOR[d.flag as Account["risk_flag"]]} fillOpacity={0.78} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
