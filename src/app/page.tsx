"use client";

import { useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { UploadCard } from "@/components/UploadCard";
import { KpiGrid } from "@/components/KpiGrid";
import { HealthChart } from "@/components/HealthChart";
import { RenewalsChart } from "@/components/RenewalsChart";
import { AccountTable } from "@/components/AccountTable";
import { parseAccountsCsv } from "@/lib/parse";
import { SAMPLE_CSV } from "@/lib/sample";

export default function HomePage() {
  const [csvText, setCsvText] = useState<string>(SAMPLE_CSV);
  const [source, setSource] = useState<string>("sample_accounts.csv (embedded)");
  const accounts = useMemo(() => parseAccountsCsv(csvText), [csvText]);

  return (
    <main className="min-h-screen bloom">
      <Header />
      <div className="mx-auto max-w-7xl px-8 py-10 space-y-8">
        <div>
          <p className="text-slate text-xs">Spring 2026 / Customer success</p>
          <h1 className="text-teal text-4xl md:text-5xl font-semibold tracking-tight mt-2 leading-tight">
            Healthy customers, growing books.
          </h1>
          <p className="text-slate text-base mt-3 max-w-2xl leading-relaxed">
            Helix helps people-ops platforms run a calm, opinionated customer success motion —
            book health, renewal coverage, and at-risk surfacing in one warm view.
          </p>
        </div>

        <UploadCard
          source={source}
          onLoadSample={() => {
            setCsvText(SAMPLE_CSV);
            setSource("sample_accounts.csv (embedded)");
          }}
          onFile={(text, name) => {
            setCsvText(text);
            setSource(name);
          }}
        />

        <KpiGrid accounts={accounts} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <HealthChart accounts={accounts} />
          <RenewalsChart accounts={accounts} />
        </div>

        <AccountTable accounts={accounts} />

        <footer className="pt-8 pb-4 border-t border-parchment flex items-center justify-between text-slate text-xs">
          <span>Helix / AIOPS Unit 3 demo</span>
          <span className="tabular">{accounts.length} accounts loaded</span>
        </footer>
      </div>
    </main>
  );
}
