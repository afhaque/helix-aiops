import Papa from "papaparse";
import type { Account } from "./types";

export function parseAccountsCsv(text: string): Account[] {
  const result = Papa.parse<Record<string, string>>(text, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim()
  });
  return result.data
    .filter((r) => r.account_id)
    .map((r) => {
      const flag = (r.risk_flag || "green").toLowerCase() as Account["risk_flag"];
      return {
        account_id: r.account_id,
        company_name: r.company_name,
        industry: r.industry,
        employees: Number(r.employees) || 0,
        arr_usd: Number(r.arr_usd) || 0,
        csm_owner: r.csm_owner,
        health_score: Number(r.health_score) || 0,
        engagement_score: Number(r.engagement_score) || 0,
        last_login_days_ago: Number(r.last_login_days_ago) || 0,
        renewal_quarter: r.renewal_quarter,
        nps: Number(r.nps) || 0,
        risk_flag: (["green", "yellow", "red"] as const).includes(flag) ? flag : "green",
        onboarding_status: r.onboarding_status,
        seats_active: Number(r.seats_active) || 0,
        seats_total: Number(r.seats_total) || 0
      };
    });
}

export function fmtUsd(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toLocaleString()}`;
}
