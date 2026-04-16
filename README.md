# Helix

> HR & people-ops customer success platform — built for the AIOPS Unit 3 demo.

Helix turns a CSV of customer accounts into a calm, opinionated CS dashboard: book ARR, at-risk ARR, renewal coverage by quarter, a health-vs-engagement bubble plot, and a watchlist that surfaces red accounts first. The visual language is warm cream, deep forest teal, and amber accent — feels like a beloved internal tool, not a Salesforce clone.

## Concept

- **Company**: Helix — customer success software for HR / people-ops vendors managing book-of-business risk.
- **Theme**: Cream background, teal primary, amber accent dot, organic rounded shapes, soft serifs allowed for headings.
- **Demo data**: 25 accounts across Hospitality, Manufacturing, Logistics, Financial Services, Education, Healthcare, Retail, etc.

## Stack

- Next.js 15 (App Router) + React 19
- TypeScript + Tailwind CSS 3
- Recharts for visualization (scatter + stacked bar)
- PapaParse for CSV ingestion
- Bun as the package manager / runtime

## Run locally

```bash
cd Unit3/apps/helix
bun install
bun run dev
# open http://localhost:3000
```

The app loads the embedded sample CSV automatically. Click **Upload CSV** to swap in your own — schema must match `sample-data/sample_accounts.csv`.

## CSV schema

| Column | Type | Notes |
|---|---|---|
| `account_id` | string | Unique identifier |
| `company_name` | string | Customer org |
| `industry` | string | Hospitality, Manufacturing, etc |
| `employees` | number | Headcount |
| `arr_usd` | number | Annual recurring revenue |
| `csm_owner` | string | Assigned CSM |
| `health_score` | number | 0–100 composite |
| `engagement_score` | number | 0–100 product engagement |
| `last_login_days_ago` | number | Recency signal |
| `renewal_quarter` | string | Q1-2026 / Q2-2026 / etc |
| `nps` | number | 0–10 |
| `risk_flag` | enum | green / yellow / red |
| `onboarding_status` | string | Complete / In Progress |
| `seats_active` | number | Active seats |
| `seats_total` | number | Provisioned seats |

## Files

- `src/app/page.tsx` — main dashboard
- `src/components/` — Header, UploadCard, KpiGrid, HealthChart, RenewalsChart, AccountTable
- `src/lib/parse.ts` — CSV parsing + formatters
- `src/lib/sample.ts` — embedded sample data
- `sample-data/sample_accounts.csv` — the source-of-truth CSV

Built for AIOPS Unit 3 — *AI Coding: From Operator to Builder*.
