import type { SignalAssessment } from "../types/currency";
import { Icon } from "./Icon";
import { InfoPopover } from "./InfoPopover";

interface SignalCardProps {
  signal: SignalAssessment;
}

const palette = {
  GOOD: "bg-surf text-mint border-mint/25",
  NEUTRAL: "bg-sand text-slatebrand border-slate-200",
  WAIT: "bg-red-50 text-danger border-danger/25",
};

export const SignalCard = ({ signal }: SignalCardProps) => (
  <section className="max-w-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 text-ink shadow-glow">
    <div className="flex min-w-0 flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-surf p-2 text-mint">
            <Icon name="spark" className="h-4 w-4" />
          </span>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slatebrand">Signal Engine</p>
          <InfoPopover label="Explain signal engine" title="How the signal works">
            Reaisify compares the current rate to recent averages, range percentile, and momentum to estimate timing quality.
          </InfoPopover>
        </div>
        <div className="mt-3 flex min-w-0 flex-col items-start gap-3 sm:flex-row sm:items-center">
          <span className={`rounded-full border px-3 py-1 text-sm font-semibold ${palette[signal.recommendation]}`}>
            {signal.recommendation === "GOOD"
              ? "Good time to convert"
              : signal.recommendation === "WAIT"
                ? "Wait for a better window"
                : "Neutral timing"}
          </span>
          <span className="text-sm text-slate-600">{signal.trendDirection} trend</span>
        </div>
      </div>

      <div className="w-full min-w-0 rounded-xl border border-slate-200 bg-sand p-4 md:w-auto md:min-w-40">
        <div className="text-sm text-slate-500">Confidence</div>
        <div className="mt-2 text-3xl font-bold text-ink">{signal.confidence}%</div>
      </div>
    </div>

    <p className="mt-5 text-sm leading-6 text-slate-600">{signal.reasoning}</p>

    <div className="mt-6 grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-3">
      <div className="min-w-0 rounded-xl border border-slate-200 bg-sand p-4">
        <div className="text-sm text-slate-500">Percentile</div>
        <div className="mt-2 text-xl font-semibold text-ink">{Math.round(signal.percentile * 100)}th</div>
      </div>
      <div className="min-w-0 rounded-xl border border-slate-200 bg-sand p-4">
        <div className="text-sm text-slate-500">30D Gap</div>
        <div className="mt-2 text-xl font-semibold text-ink">{signal.movingAverageGap.toFixed(4)}</div>
      </div>
      <div className="min-w-0 rounded-xl border border-slate-200 bg-sand p-4">
        <div className="text-sm text-slate-500">Momentum</div>
        <div className="mt-2 text-xl font-semibold text-ink">{(signal.momentum * 100).toFixed(2)}%</div>
      </div>
    </div>
  </section>
);
