import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { FxPoint } from "../types/currency";
import { formatDate, formatRate } from "../utils/formatters";

interface ExchangeChartProps {
  points: FxPoint[];
  title?: string;
}

export const ExchangeChart = ({ points, title = "USD/BRL rate path" }: ExchangeChartProps) => (
  <section className="rounded-[24px] border border-white/10 bg-slate-950/45 p-6 shadow-glow backdrop-blur">
    <div className="mb-6 flex items-center justify-between gap-4">
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Historical Trend</p>
        <h3 className="mt-2 text-xl font-semibold text-white">{title}</h3>
      </div>
      <div className="text-sm text-slate-400">Responsive, range-aware view</div>
    </div>

    <div className="h-80 w-full">
      <ResponsiveContainer>
        <AreaChart data={points}>
          <defs>
            <linearGradient id="rateFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8ff0c8" stopOpacity={0.45} />
              <stop offset="100%" stopColor="#8ff0c8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            stroke="#94a3b8"
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            domain={["dataMin - 0.05", "dataMax + 0.05"]}
            tickFormatter={formatRate}
            stroke="#94a3b8"
            tickLine={false}
            axisLine={false}
            width={70}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#081722",
              borderRadius: "16px",
              border: "1px solid rgba(255,255,255,0.10)",
              color: "#e2e8f0",
            }}
            formatter={(value: number) => [formatRate(value), "Rate"]}
            labelFormatter={(label) => formatDate(String(label))}
          />
          <Area
            type="monotone"
            dataKey="rate"
            stroke="#8ff0c8"
            strokeWidth={3}
            fill="url(#rateFill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </section>
);
