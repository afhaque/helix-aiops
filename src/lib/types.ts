export type Account = {
  account_id: string;
  company_name: string;
  industry: string;
  employees: number;
  arr_usd: number;
  csm_owner: string;
  health_score: number;
  engagement_score: number;
  last_login_days_ago: number;
  renewal_quarter: string;
  nps: number;
  risk_flag: "green" | "yellow" | "red";
  onboarding_status: string;
  seats_active: number;
  seats_total: number;
};

export const RISK_TONE: Record<Account["risk_flag"], { bg: string; fg: string; label: string }> = {
  green: { bg: "bg-leaf/30", fg: "text-teal", label: "Healthy" },
  yellow: { bg: "bg-amber/30", fg: "text-ember", label: "Watch" },
  red: { bg: "bg-ember/25", fg: "text-ember", label: "At risk" }
};
