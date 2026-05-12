import { useEffect, useState } from "react";
import type { AlertRule } from "../types/currency";

const buildStorageKey = (pairSymbol: string) => `currency-tracker-alerts:${pairSymbol}`;

interface AlertRuleFormProps {
  pairSymbol: string;
}

export const AlertRuleForm = ({ pairSymbol }: AlertRuleFormProps) => {
  const [targetRate, setTargetRate] = useState("");
  const [alerts, setAlerts] = useState<AlertRule[]>([]);

  useEffect(() => {
    const rawValue = localStorage.getItem(buildStorageKey(pairSymbol));
    if (rawValue) {
      setAlerts(JSON.parse(rawValue) as AlertRule[]);
    }
  }, [pairSymbol]);

  useEffect(() => {
    localStorage.setItem(buildStorageKey(pairSymbol), JSON.stringify(alerts));
  }, [alerts, pairSymbol]);

  const addAlert = () => {
    const parsedRate = Number(targetRate);
    if (!parsedRate) {
      return;
    }

    setAlerts((currentAlerts) => [
      {
        id: crypto.randomUUID(),
        pairSymbol,
        targetRate: parsedRate,
        createdAt: new Date().toISOString(),
      },
      ...currentAlerts,
    ]);
    setTargetRate("");
  };

  const removeAlert = (id: string) => {
    setAlerts((currentAlerts) => currentAlerts.filter((alert) => alert.id !== id));
  };

  return (
    <section className="rounded-[24px] border border-white/10 bg-slate-950/45 p-6 shadow-glow backdrop-blur">
      <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Alert Rules</p>
      <h3 className="mt-2 text-xl font-semibold text-white">Save target-rate reminders</h3>
      <p className="mt-2 text-sm leading-6 text-slate-300">
        UI-only for MVP. Alerts persist in local storage so you can model thresholds like “Notify me when USD/BRL exceeds 5.40”.
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <input
          type="number"
          step="0.01"
          min="0"
          value={targetRate}
          onChange={(event) => setTargetRate(event.target.value)}
          placeholder="Target rate, e.g. 5.40"
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-mint/60"
        />
        <button
          type="button"
          onClick={addAlert}
          className="rounded-2xl bg-white px-5 py-3 font-medium text-slate-950 transition hover:bg-slate-100"
        >
          Add Alert
        </button>
      </div>

      <div className="mt-6 space-y-3">
        {alerts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 px-4 py-5 text-sm text-slate-400">
            No alert rules saved yet.
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <div className="font-medium text-white">Notify when {pairSymbol.toUpperCase()} exceeds {alert.targetRate.toFixed(2)}</div>
                <div className="mt-1 text-sm text-slate-400">
                  Created {new Date(alert.createdAt).toLocaleString()}
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeAlert(alert.id)}
                className="rounded-xl border border-white/10 px-3 py-2 text-sm text-slate-300 transition hover:border-danger/40 hover:text-danger"
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>
    </section>
  );
};
