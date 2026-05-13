import { useState } from "react";
import { getAlertDeliveries, refreshLatestRate, sendDiscordTest } from "../services/fxService";
import type { AlertDeliveryLog, FxLatest } from "../types/currency";
import { formatRate } from "../utils/formatters";
import { Icon } from "./Icon";

interface AdminToolsProps {
  pairSymbol: string;
}

export const AdminTools = ({ pairSymbol }: AdminToolsProps) => {
  const [latest, setLatest] = useState<FxLatest | null>(null);
  const [deliveries, setDeliveries] = useState<AlertDeliveryLog[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isTestingDiscord, setIsTestingDiscord] = useState(false);

  const refreshLiveFx = async () => {
    const confirmed = window.confirm(
      "Refresh live FX now? This bypasses the local cache and may spend a Twelve Data API credit.",
    );
    if (!confirmed) {
      return;
    }

    try {
      setIsRefreshing(true);
      setMessage(null);
      const data = await refreshLatestRate(pairSymbol);
      setLatest(data);
      setMessage(`Latest ${data.pair.displayName} refreshed from ${data.source}.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to refresh live FX.");
    } finally {
      setIsRefreshing(false);
    }
  };

  const testDiscord = async () => {
    try {
      setIsTestingDiscord(true);
      setMessage(null);
      await sendDiscordTest(pairSymbol);
      setDeliveries(await getAlertDeliveries(5));
      setMessage("Discord test sent and latest delivery logs refreshed.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to send Discord test.");
    } finally {
      setIsTestingDiscord(false);
    }
  };

  const loadDeliveries = async () => {
    setDeliveries(await getAlertDeliveries(10));
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 text-ink shadow-glow">
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-surf p-2 text-mint">
          <Icon name="spark" className="h-4 w-4" />
        </span>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slatebrand">Admin Tools</p>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <button
          type="button"
          onClick={() => void refreshLiveFx()}
          disabled={isRefreshing}
          className="rounded-xl border border-danger/20 bg-red-50 px-4 py-3 text-left text-sm font-semibold text-danger transition hover:border-danger/40 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isRefreshing ? "Refreshing live FX..." : "Manual live FX refresh"}
          <span className="mt-1 block text-xs font-normal text-slate-600">Bypasses cache; may cost 1 credit.</span>
        </button>
        <button
          type="button"
          onClick={() => void testDiscord()}
          disabled={isTestingDiscord}
          className="rounded-xl border border-mint/20 bg-surf px-4 py-3 text-left text-sm font-semibold text-mint transition hover:border-mint/40 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isTestingDiscord ? "Sending..." : "Send Discord test"}
          <span className="mt-1 block text-xs font-normal text-slate-600">Uses backend webhook config.</span>
        </button>
        <button
          type="button"
          onClick={() => void loadDeliveries()}
          className="rounded-xl border border-slate-200 bg-sand px-4 py-3 text-left text-sm font-semibold text-ink transition hover:border-mint/30"
        >
          Load delivery logs
          <span className="mt-1 block text-xs font-normal text-slate-600">Reads persisted runtime logs.</span>
        </button>
      </div>

      {latest ? (
        <div className="mt-5 rounded-xl border border-slate-200 bg-sand p-4 text-sm">
          <span className="text-slate-500">Latest refreshed rate</span>
          <div className="mt-1 text-2xl font-bold text-ink">{formatRate(latest.rate)}</div>
          <div className="mt-1 text-xs uppercase tracking-[0.16em] text-mint">Source: {latest.source}</div>
        </div>
      ) : null}

      {message ? (
        <div className="mt-4 rounded-xl border border-slate-200 bg-sand px-4 py-3 text-sm text-slate-700">
          {message}
        </div>
      ) : null}

      {deliveries.length > 0 ? (
        <div className="mt-5 space-y-2">
          <div className="text-sm font-semibold text-ink">Recent alert deliveries</div>
          {deliveries.map((delivery) => (
            <div key={delivery.id} className="rounded-xl border border-slate-200 bg-sand px-4 py-3 text-sm">
              <div className="font-medium text-ink">{delivery.message}</div>
              <div className="mt-1 text-xs uppercase tracking-[0.16em] text-mint">
                {delivery.destination} - {delivery.recommendation} - {delivery.confidence}%
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
};
