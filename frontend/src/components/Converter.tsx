import { useMemo, useState } from "react";
import type { CurrencyPair } from "../types/currency";
import { formatCurrency, formatRate } from "../utils/formatters";

interface ConverterProps {
  pair: CurrencyPair;
  rate: number;
}

export const Converter = ({ pair, rate }: ConverterProps) => {
  const [usdAmount, setUsdAmount] = useState(1000);

  const convertedAmount = useMemo(() => usdAmount * rate, [rate, usdAmount]);

  return (
    <section className="rounded-[24px] border border-white/10 bg-slate-950/45 p-6 shadow-glow backdrop-blur">
      <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Conversion Calculator</p>
      <h3 className="mt-2 text-xl font-semibold text-white">Estimate your transfer outcome</h3>

      <div className="mt-6 grid gap-4 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:items-end">
        <label className="block">
          <span className="mb-2 block text-sm text-slate-300">{pair.base} amount</span>
          <input
            type="number"
            min="0"
            value={usdAmount}
            onChange={(event) => setUsdAmount(Number(event.target.value))}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-lg text-white outline-none transition placeholder:text-slate-500 focus:border-mint/60"
            placeholder="Enter USD amount"
          />
        </label>
        <div className="pb-3 text-center text-sm text-slate-400">@ {formatRate(rate)}</div>
        <div className="rounded-2xl border border-mint/25 bg-mint/10 p-4">
          <div className="text-sm text-slate-300">{pair.quote} equivalent</div>
          <div className="mt-2 text-3xl font-semibold text-white">
            {formatCurrency(convertedAmount, pair.quote, "pt-BR")}
          </div>
        </div>
      </div>
    </section>
  );
};
