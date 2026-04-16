"use client";

import { useMemo, useRef, useState } from "react";
import { parseCustomersCsv } from "@/lib/parse";
import { HelixDashboard } from "@/components/HelixDashboard";
import { ShareModal } from "@/components/ShareModal";

const ACCESS_CODE = "OpsIsAwesome";

export default function HomePage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [csvText, setCsvText] = useState("");
  const [source, setSource] = useState("");

  const [shareBusy, setShareBusy] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  const customers = useMemo(() => parseCustomersCsv(csvText), [csvText]);

  async function handleShare() {
    if (!csvText) return;
    setShareBusy(true);
    setShareError(null);
    try {
      const res = await fetch("/api/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csv_text: csvText, name: source || "Untitled" }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `HTTP ${res.status}`);
      }
      const { id } = (await res.json()) as { id: string };
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      setShareUrl(`${origin}/s/${id}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setShareError(message);
    } finally {
      setShareBusy(false);
    }
  }

  if (!loggedIn) return <LoginScreen onUnlock={() => setLoggedIn(true)} />;

  if (csvText === "") {
    return (
      <main className="min-h-screen bloom">
        <SimpleHeader />
        <div className="mx-auto max-w-7xl px-8 py-10">
          <UploadZone
            onFile={(text, name) => {
              setCsvText(text);
              setSource(name);
            }}
          />
        </div>
      </main>
    );
  }

  return (
    <>
      <HelixDashboard
        customers={customers}
        fileName={source}
        shared={false}
        onReset={() => {
          setCsvText("");
          setSource("");
          setShareUrl(null);
          setShareError(null);
        }}
        onShare={handleShare}
        shareBusy={shareBusy}
        shareError={shareError}
      />
      {shareUrl && <ShareModal url={shareUrl} onClose={() => setShareUrl(null)} />}
    </>
  );
}

/* ───────────────────────── LOGIN ───────────────────────── */

function LoginScreen({ onUnlock }: { onUnlock: () => void }) {
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (code === ACCESS_CODE) { setErr(""); onUnlock(); }
    else setErr("Incorrect access code.");
  }

  return (
    <main className="min-h-screen bloom flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-cream border border-parchment rounded-bloom shadow-lg p-10">
        <div className="flex items-center gap-3 mb-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Helix" className="h-12 w-12" />
          <div>
            <div className="text-teal text-3xl font-semibold tracking-tight lowercase">helix</div>
            <div className="text-slate text-xs tracking-wide">Customer Health Intelligence</div>
          </div>
        </div>
        <p className="text-slate text-sm mb-6">Enter your access code to continue.</p>
        <form onSubmit={submit} className="space-y-4">
          <input
            type="password"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Access code"
            autoFocus
            className="w-full bg-white border border-parchment rounded-organic text-ink px-4 py-3 text-sm tabular focus:outline-none focus:border-teal"
          />
          {err && <p className="text-ember text-xs">{err}</p>}
          <button
            type="submit"
            className="w-full bg-teal text-cream py-3 text-sm font-medium rounded-organic hover:bg-teal2 transition uppercase tracking-wider"
          >
            Enter
          </button>
        </form>
      </div>
    </main>
  );
}

/* ───────────────────────── UPLOAD ───────────────────────── */

function SimpleHeader() {
  return (
    <header className="border-b border-parchment no-print">
      <div className="mx-auto max-w-7xl px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Helix" className="h-10 w-10" />
          <div className="flex items-baseline gap-2">
            <span className="text-teal text-2xl font-semibold tracking-tight lowercase">helix</span>
            <span className="text-slate text-xs tracking-wide">Customer Health Intelligence</span>
          </div>
        </div>
      </div>
    </header>
  );
}

function UploadZone({ onFile }: { onFile: (text: string, name: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);

  async function handleFile(file: File) {
    const text = await file.text();
    onFile(text, file.name);
  }

  return (
    <section
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={async (e) => {
        e.preventDefault();
        setDrag(false);
        const f = e.dataTransfer.files?.[0];
        if (f) await handleFile(f);
      }}
      className={`mt-12 border-2 border-dashed cursor-pointer transition-colors p-20 text-center bg-cream rounded-bloom shadow-sm ${drag ? "border-teal bg-parchment/40" : "border-parchment hover:border-teal"}`}
    >
      <div className="text-teal text-2xl font-semibold tracking-tight">Drop your CS platform export here</div>
      <div className="text-slate text-sm mt-3 uppercase tracking-[0.2em]">.csv files only</div>
      <input
        ref={inputRef}
        type="file"
        accept=".csv,text/csv"
        className="hidden"
        onChange={async (e) => {
          const f = e.target.files?.[0];
          if (f) await handleFile(f);
          e.target.value = "";
        }}
      />
    </section>
  );
}
