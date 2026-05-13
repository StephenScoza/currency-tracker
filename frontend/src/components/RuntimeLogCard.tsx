import { useEffect, useState } from "react";
import { getRuntimeLogs } from "../services/fxService";
import type { RuntimeLogEntry } from "../types/currency";
import { Icon } from "./Icon";

const formatLogTime = (time?: number) => {
  if (!time) {
    return "--";
  }

  return new Date(time).toLocaleString();
};

const levelLabel = (level?: number) => {
  if (!level) {
    return "log";
  }
  if (level >= 50) {
    return "error";
  }
  if (level >= 40) {
    return "warn";
  }
  if (level >= 30) {
    return "info";
  }
  return "debug";
};

export const RuntimeLogCard = () => {
  const [logs, setLogs] = useState<RuntimeLogEntry[]>([]);

  const loadLogs = async () => {
    setLogs(await getRuntimeLogs(25));
  };

  useEffect(() => {
    void loadLogs();
  }, []);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 text-ink shadow-glow">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-surf p-2 text-mint">
              <Icon name="server" className="h-4 w-4" />
            </span>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slatebrand">Runtime Logs</p>
          </div>
          <h2 className="mt-2 text-xl font-semibold text-ink">Persisted rotating logs</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            Pino JSONL logs stored under the Docker-persisted runtime volume.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void loadLogs()}
          className="rounded-xl border border-slate-200 bg-sand px-4 py-3 text-sm font-semibold text-ink transition hover:border-mint/40 hover:text-mint"
        >
          Refresh logs
        </button>
      </div>

      <div className="mt-5 max-h-96 space-y-2 overflow-auto pr-1">
        {logs.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 px-4 py-5 text-sm text-slate-500">
            No runtime log entries yet.
          </div>
        ) : (
          logs.map((log, index) => (
            <div key={`${log.time ?? "log"}-${index}`} className="rounded-xl border border-slate-200 bg-sand px-4 py-3 text-sm">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <span className="font-semibold text-ink">{log.msg ?? "Log entry"}</span>
                <span className="text-xs uppercase tracking-[0.14em] text-slatebrand">{levelLabel(log.level)}</span>
              </div>
              <div className="mt-1 text-xs text-slate-500">
                {formatLogTime(log.time)}
                {log.req?.method ? ` - ${log.req.method} ${log.req.url ?? ""}` : ""}
                {log.res?.statusCode ? ` - ${log.res.statusCode}` : ""}
                {log.responseTime ? ` - ${Math.round(log.responseTime)}ms` : ""}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};
