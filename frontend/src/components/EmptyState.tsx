import type { ReactNode } from "react";
import { Icon } from "./Icon";

interface EmptyStateProps {
  title: string;
  message: string;
  action?: ReactNode;
  tone?: "neutral" | "danger";
}

export const EmptyState = ({ title, message, action, tone = "neutral" }: EmptyStateProps) => (
  <div
    className={`rounded-2xl border p-6 text-center shadow-glow ${
      tone === "danger" ? "border-danger/30 bg-danger/10" : "border-slate-200 bg-white"
    }`}
  >
    <div
      className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full ${
        tone === "danger" ? "bg-danger/10 text-danger" : "bg-surf text-mint"
      }`}
    >
      <Icon name={tone === "danger" ? "alert" : "spark"} className="h-5 w-5" />
    </div>
    <h2 className="mt-4 text-xl font-semibold text-ink">{title}</h2>
    <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-600">{message}</p>
    {action ? <div className="mt-5">{action}</div> : null}
  </div>
);
