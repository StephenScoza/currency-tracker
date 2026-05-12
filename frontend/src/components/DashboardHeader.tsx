import type { CurrencyPair } from "../types/currency";

interface DashboardHeaderProps {
  pair: CurrencyPair;
  updatedAt: string;
  source?: string;
}

export const DashboardHeader = ({ pair, updatedAt, source }: DashboardHeaderProps) => (
  <header className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/8 p-6 shadow-glow backdrop-blur xl:p-8">
    <div className="absolute inset-0 bg-grid-fade bg-[size:22px_22px] opacity-10" />
    <div className="absolute -right-16 top-0 h-44 w-44 rounded-full bg-mint/20 blur-3xl" />
    <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-2xl">
        <p className="mb-3 inline-flex rounded-full border border-mint/30 bg-mint/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-mint">
          Decision support for FX timing
        </p>
        <h1 className="font-display text-4xl font-semibold tracking-tight text-white md:text-5xl">
          Currency Tracker
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 md:text-base">
          Monitor {pair.base} to {pair.quote} trends, quantify momentum, and decide when a transfer into Brazil looks attractive.
        </p>
      </div>
      <div className="rounded-2xl border border-white/10 bg-slate-950/35 px-4 py-3 text-sm text-slate-300">
        <div className="font-medium text-white">{pair.displayName}</div>
        <div className="mt-1">{pair.base}/{pair.quote} • Updated {new Date(updatedAt).toLocaleString()}</div>
        {source ? <div className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-400">Source: {source}</div> : null}
      </div>
    </div>
  </header>
);
