import type { SignalAssessment } from "../types/currency";

interface SignalCardProps {
  signal: SignalAssessment;
}

const palette = {
  GOOD: "bg-mint/15 text-mint border-mint/25",
  NEUTRAL: "bg-sunrise/15 text-sunrise border-sunrise/25",
  WAIT: "bg-danger/15 text-danger border-danger/25",
};

export const SignalCard = ({ signal }: SignalCardProps) => (
  <section className="rounded-[24px] border border-white/10 bg-slate-950/45 p-6 shadow-glow backdrop-blur">
    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Signal Engine</p>
        <div className="mt-3 flex items-center gap-3">
          <span className={`rounded-full border px-3 py-1 text-sm font-semibold ${palette[signal.recommendation]}`}>
            {signal.recommendation === "GOOD"
              ? "Good time to convert"
              : signal.recommendation === "WAIT"
                ? "Wait for a better window"
                : "Neutral timing"}
          </span>
          <span className="text-sm text-slate-300">{signal.trendDirection} trend</span>
        </div>
      </div>

      <div className="min-w-40 rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="text-sm text-slate-400">Confidence</div>
        <div className="mt-2 text-3xl font-semibold text-white">{signal.confidence}%</div>
      </div>
    </div>

    <p className="mt-5 text-sm leading-6 text-slate-300">{signal.reasoning}</p>

    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div className="rounded-2xl border border-white/8 bg-white/5 p-4">
        <div className="text-sm text-slate-400">Percentile</div>
        <div className="mt-2 text-xl font-semibold text-white">{Math.round(signal.percentile * 100)}th</div>
      </div>
      <div className="rounded-2xl border border-white/8 bg-white/5 p-4">
        <div className="text-sm text-slate-400">30D Gap</div>
        <div className="mt-2 text-xl font-semibold text-white">{signal.movingAverageGap.toFixed(4)}</div>
      </div>
      <div className="rounded-2xl border border-white/8 bg-white/5 p-4">
        <div className="text-sm text-slate-400">Momentum</div>
        <div className="mt-2 text-xl font-semibold text-white">{(signal.momentum * 100).toFixed(2)}%</div>
      </div>
    </div>
  </section>
);
