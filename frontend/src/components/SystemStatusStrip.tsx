import { useEffect, useState } from "react";
import { getSystemStatus } from "../services/fxService";
import type { SystemStatus } from "../types/currency";
import { Icon } from "./Icon";

const formatDuration = (milliseconds?: number) => {
  if (!milliseconds) {
    return "--";
  }

  const minutes = Math.round(milliseconds / 60_000);
  if (minutes < 60) {
    return `${minutes}m`;
  }

  const hours = Math.round(minutes / 60);
  return `${hours}h`;
};

export const SystemStatusStrip = () => {
  const [status, setStatus] = useState<SystemStatus | null>(null);

  useEffect(() => {
    let isActive = true;

    const loadStatus = async () => {
      try {
        const data = await getSystemStatus();
        if (isActive) {
          setStatus(data);
        }
      } catch {
        if (isActive) {
          setStatus(null);
        }
      }
    };

    void loadStatus();
    const handle = window.setInterval(() => void loadStatus(), 60_000);

    return () => {
      isActive = false;
      window.clearInterval(handle);
    };
  }, []);

  const items = [
    { label: "Live FX", active: status?.liveFxConfigured, icon: "globe" as const },
    { label: "Discord", active: status?.discordConfigured, icon: "bell" as const },
    { label: "Disk Cache", active: status?.fxCachePersistence, icon: "cache" as const },
    { label: "Latest TTL", value: formatDuration(status?.latestCacheTtlMs), icon: "clock" as const },
    { label: "Scheduler", value: formatDuration(status?.alertPollIntervalMs), icon: "shield" as const },
  ];

  return (
    <section className="grid min-w-0 gap-3 rounded-2xl border border-slate-200 bg-white p-3 text-ink shadow-glow md:grid-cols-5">
      {items.map((item) => (
        <div key={item.label} className="min-w-0 rounded-xl border border-slate-200 bg-sand px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-white p-1.5 text-mint">
              <Icon name={item.icon} className="h-3.5 w-3.5" />
            </span>
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slatebrand">{item.label}</div>
          </div>
          <div className="mt-1 flex items-center gap-2 text-sm font-semibold">
            {"active" in item ? (
              <>
                <span className={`h-2.5 w-2.5 rounded-full ${item.active ? "bg-mint" : "bg-danger"}`} />
                {item.active ? "Connected" : "Needs setup"}
              </>
            ) : (
              item.value
            )}
          </div>
        </div>
      ))}
    </section>
  );
};
