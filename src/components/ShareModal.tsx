"use client";

import { useEffect, useState } from "react";

export function ShareModal({
  url,
  onClose,
}: {
  url: string;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const input = document.getElementById("helix-share-url") as HTMLInputElement | null;
      if (input) {
        input.select();
        document.execCommand?.("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 backdrop-blur-sm px-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-cream border-2 border-teal rounded-bloom shadow-xl p-8"
      >
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h2
              id="share-modal-title"
              className="text-teal text-2xl font-semibold tracking-tight"
            >
              Dashboard shared
            </h2>
            <p className="text-slate text-xs mt-2 uppercase tracking-[0.2em]">
              Anyone with this link can view this dashboard
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-slate hover:text-teal text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="flex items-stretch gap-2">
          <input
            id="helix-share-url"
            readOnly
            value={url}
            onFocus={(e) => e.currentTarget.select()}
            className="flex-1 min-w-0 bg-white border border-parchment rounded-organic px-3 py-2 text-sm text-ink tabular focus:outline-none focus:border-teal"
          />
          <button
            onClick={handleCopy}
            className="bg-amber text-ink px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] rounded-organic hover:bg-ember hover:text-cream transition whitespace-nowrap"
          >
            {copied ? "Copied!" : "Copy Link"}
          </button>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={onClose}
            className="border border-parchment text-slate hover:text-teal px-5 py-2 text-xs uppercase tracking-[0.18em] rounded-organic"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
