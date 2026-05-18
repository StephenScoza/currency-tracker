import { useEffect, useState } from "react";
import { getSystemStatus } from "../services/fxService";
import type { SystemStatus } from "../types/currency";
import { Icon } from "./Icon";

const providerLabels: Record<string, string> = {
  "awesomeapi": "AwesomeAPI",
  "bcb-ptax": "BCB PTAX",
  "currency-api": "Fawaz Currency API",
  "exchange-rate-api": "ExchangeRate-API",
  "frankfurter": "Frankfurter",
  "fxapi-app": "fxapi.app",
  "mock": "Mock fallback",
  "twelve-data": "Twelve Data",
};

const ProviderList = ({ title, providers }: { title: string; providers: string[] }) => (
  <div className="rounded-xl border border-slate-200 bg-sand p-4">
    <div className="font-semibold text-ink">{title}</div>
    <div className="mt-3 flex flex-wrap gap-2">
      {providers.map((provider, index) => (
        <span
          key={`${title}-${provider}`}
          className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600"
        >
          {index + 1}. {providerLabels[provider] ?? provider}
        </span>
      ))}
    </div>
  </div>
);

export const ProviderPriorityCard = () => {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    const loadStatus = async () => {
      try {
        const data = await getSystemStatus();
        if (isActive) {
          setStatus(data);
          setError(null);
        }
      } catch (loadError) {
        if (isActive) {
          setError(loadError instanceof Error ? loadError.message : "Unable to load provider priorities.");
        }
      }
    };

    void loadStatus();

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 text-ink shadow-glow">
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-surf p-2 text-mint">
          <Icon name="server" className="h-4 w-4" />
        </span>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slatebrand">Provider Strategy</p>
      </div>
      <h2 className="mt-4 text-xl font-semibold text-ink">Runtime provider order</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
        This reflects the backend config currently serving the app, including Docker environment overrides.
      </p>

      {error ? (
        <div className="mt-4 rounded-xl border border-danger/20 bg-red-50 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      ) : null}

      {status ? (
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <ProviderList title="Latest rates" providers={status.latestProviderPriority} />
          <ProviderList title="Historical charts" providers={status.historyProviderPriority} />
        </div>
      ) : (
        <div className="mt-5 rounded-xl border border-slate-200 bg-sand px-4 py-5 text-sm text-slate-500">
          Loading provider order...
        </div>
      )}
    </section>
  );
};
