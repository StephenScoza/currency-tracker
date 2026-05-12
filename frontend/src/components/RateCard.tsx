import type { FxSnapshot } from "../types/currency";
import { formatPercent, formatRate, formatSignedNumber } from "../utils/formatters";

interface RateCardProps {
  snapshot: FxSnapshot;
  base: string;
  quote: string;
}

export const RateCard = ({ snapshot, base, quote }: RateCardProps) => {
  const positive = snapshot.change.amount >= 0;

  return (
    <section className="rounded-[24px] border border-white/10 bg-slate-950/45 p-6 shadow-glow backdrop-blur">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Current Exchange Rate</p>
          <h2 className="mt-3 text-4xl font-semibold text-white">{formatRate(snapshot.currentRate)}</h2>
          <p className="mt-2 text-sm text-slate-300">1 {base} buys this many {quote}</p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-sm font-medium ${
            positive ? "bg-mint/15 text-mint" : "bg-danger/15 text-danger"
          }`}
        >
          {positive ? "Improving" : "Pulling back"}
        </span>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/8 bg-white/5 p-4">
          <div className="text-sm text-slate-400">Daily Change</div>
          <div className={`mt-2 text-xl font-semibold ${positive ? "text-mint" : "text-danger"}`}>
            {formatSignedNumber(snapshot.change.amount)}
          </div>
        </div>
        <div className="rounded-2xl border border-white/8 bg-white/5 p-4">
          <div className="text-sm text-slate-400">% Change</div>
          <div className={`mt-2 text-xl font-semibold ${positive ? "text-mint" : "text-danger"}`}>
            {formatPercent(snapshot.change.percentage)}
          </div>
        </div>
        <div className="rounded-2xl border border-white/8 bg-white/5 p-4">
          <div className="text-sm text-slate-400">Visible Range</div>
          <div className="mt-2 text-xl font-semibold text-white">
            {formatRate(snapshot.low)} - {formatRate(snapshot.high)}
          </div>
        </div>
      </div>
    </section>
  );
};
