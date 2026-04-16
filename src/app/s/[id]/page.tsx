"use client";

import { use, useEffect, useMemo, useState } from "react";
import { parseCustomersCsv } from "@/lib/parse";
import { HelixDashboard } from "@/components/HelixDashboard";

type ShareResponse = {
  csv_text: string;
  name: string;
  created_at?: string | null;
};

export default function SharedDashboardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [data, setData] = useState<ShareResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/share/${id}`, { cache: "no-store" });
        if (!res.ok) {
          if (res.status === 404) throw new Error("Dashboard not found");
          throw new Error(`Failed to load (HTTP ${res.status}).`);
        }
        const body = (await res.json()) as ShareResponse;
        if (!cancelled) setData(body);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const customers = useMemo(
    () => (data ? parseCustomersCsv(data.csv_text) : []),
    [data]
  );

  if (loading) {
    return (
      <main className="min-h-screen bloom flex items-center justify-center">
        <div className="text-slate text-sm uppercase tracking-[0.24em]">Loading shared dashboard…</div>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="min-h-screen bloom flex items-center justify-center px-6">
        <div className="w-full max-w-md bg-cream border border-parchment rounded-bloom shadow-lg p-10 text-center">
          <div className="text-teal text-xl font-semibold tracking-tight mb-3">Dashboard not found</div>
          <p className="text-slate text-sm">{error || "Unknown error"}</p>
        </div>
      </main>
    );
  }

  return (
    <HelixDashboard
      customers={customers}
      fileName={data.name || "Untitled"}
      shared
      sharedAt={data.created_at ?? null}
    />
  );
}
