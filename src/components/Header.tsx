export function Header() {
  return (
    <header className="border-b border-parchment">
      <div className="mx-auto max-w-7xl px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Helix" className="h-11 w-11 rounded-organic" />
          <div className="flex flex-col">
            <span className="text-teal text-xl font-semibold tracking-tight leading-none">helix</span>
            <span className="text-slate text-[11px] mt-1">People-ops customer success</span>
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm text-slate">
          <span className="text-teal font-medium">Accounts</span>
          <span>Renewals</span>
          <span>Playbooks</span>
          <span>Insights</span>
        </nav>
      </div>
    </header>
  );
}
