export type Customer = {
  customer_id: string;
  company_name: string;
  industry: string;
  company_size: string;
  employees: number;
  plan: string;
  contract_type: string;
  mrr: number;
  start_date: string;
  churn_date: string;
  status: "Active" | "At-Risk" | "Churned";
  csm_assigned: string;
  csm_name: string;
  product_usage_score: number;
  support_tickets_90d: number;
  last_login_days_ago: number;
  nps_score: number;
  churn_reason: string;
  months_as_customer: number;
  renewal_quarter: string;
};

export type Tab = "accounts" | "renewals" | "health" | "insights";
