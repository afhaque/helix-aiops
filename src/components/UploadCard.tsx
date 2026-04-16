"use client";

import { useRef } from "react";

type Props = {
  onFile: (text: string, name: string) => void;
  onLoadSample: () => void;
  source: string;
};

export function UploadCard({ onFile, onLoadSample, source }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <section className="rounded-bloom bg-white/60 border border-parchment p-6 shadow-sm">
      <div className="flex items-start justify-between gap-6 flex-wrap">
        <div>
          <p className="text-slate text-xs">Data source</p>
          <h2 className="text-teal text-xl font-semibold mt-1">Upload your account list</h2>
          <p className="text-slate text-sm mt-2 max-w-md leading-relaxed">
            Drop in a CSV of customers — health score, engagement, seats, renewal quarter. Helix
            renders book-of-business health, at-risk renewals, and CSM workload in one view.
          </p>
          <p className="text-slate text-xs mt-3 tabular dot-amber">Active: <span className="text-teal font-medium">{source}</span></p>
        </div>
        <div className="flex flex-col gap-2 shrink-0">
          <button
            onClick={() => inputRef.current?.click()}
            className="bg-teal text-cream px-5 py-2.5 rounded-organic text-sm font-medium hover:bg-teal2 transition"
          >
            Upload CSV
          </button>
          <button
            onClick={onLoadSample}
            className="border border-teal text-teal px-5 py-2.5 rounded-organic text-sm font-medium hover:bg-leaf/20 transition"
          >
            Load Sample
          </button>
          <input
            ref={inputRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              const text = await f.text();
              onFile(text, f.name);
              e.target.value = "";
            }}
          />
        </div>
      </div>
    </section>
  );
}
