import Papa from "papaparse";
import type { Customer } from "./types";

export function parseCustomersCsv(text: string): Customer[] {
  if (!text.trim()) return [];
  const result = Papa.parse<Record<string, string>>(text, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim(),
  });
  return result.data
    .filter((r) => r.customer_id)
    .map((r) => {
      const rawStatus = (r.status ?? "Active").trim();
      const status = (["Active", "At-Risk", "Churned"].includes(rawStatus) ? rawStatus : "Active") as Customer["status"];
      return {
        customer_id: r.customer_id ?? "",
        company_name: r.company_name ?? "",
        industry: r.industry ?? "",
        company_size: r.company_size ?? "",
        employees: Number(r.employees) || 0,
        plan: r.plan ?? "",
        contract_type: r.contract_type ?? "",
        mrr: Number(r.mrr) || 0,
        start_date: r.start_date ?? "",
        churn_date: r.churn_date ?? "",
        status,
        csm_assigned: r.csm_assigned ?? "No",
        csm_name: r.csm_name ?? "",
        product_usage_score: Number(r.product_usage_score) || 0,
        support_tickets_90d: Number(r.support_tickets_90d) || 0,
        last_login_days_ago: Number(r.last_login_days_ago) || 0,
        nps_score: Number(r.nps_score) || 0,
        churn_reason: r.churn_reason ?? "",
        months_as_customer: Number(r.months_as_customer) || 0,
        renewal_quarter: r.renewal_quarter ?? "",
      };
    });
}

export function fmtUsd(n: number): string {
  if (!isFinite(n)) return "$0";
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (Math.abs(n) >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${Math.round(n).toLocaleString()}`;
}
