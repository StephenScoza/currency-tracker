import { randomUUID } from "node:crypto";
import type { AlertDeliveryLog, AlertRule, FxLatest, FxPoint, SignalAssessment } from "../types/fx.js";
import { appendLogLine, readLogLines } from "./fileStore.js";

const DELIVERY_LOG_FILE = "alert-deliveries.log";

const recommendationLabel = (signal: SignalAssessment) =>
  signal.recommendation === "GOOD"
    ? "Good time to convert"
    : signal.recommendation === "WAIT"
      ? "Wait for a better window"
      : "Neutral timing";

const buildDiscordPayload = (
  alert: AlertRule,
  latest: FxLatest,
  signal: SignalAssessment,
  _chartPoints: FxPoint[] = [],
) => ({
  username: "Reaisify",
  embeds: [
    {
      title: `${latest.pair.base}/${latest.pair.quote} opportunity alert`,
      color:
        signal.recommendation === "GOOD"
          ? 0x16a34a
          : signal.recommendation === "NEUTRAL"
            ? 0x64748b
            : 0xef4444,
      description: `**${recommendationLabel(signal)}**\n${signal.reasoning}`,
      fields: [
        { name: "Current rate", value: latest.rate.toFixed(4), inline: true },
        { name: "Target rate", value: alert.targetRate.toFixed(4), inline: true },
        { name: "Confidence", value: `${signal.confidence}%`, inline: true },
        { name: "Recommendation", value: recommendationLabel(signal), inline: true },
        { name: "Trend", value: signal.trendDirection, inline: true },
        { name: "Provider", value: latest.source, inline: true },
      ],
      footer: {
        text: "Reaisify - backend-proxied FX alert",
      },
      timestamp: latest.timestamp,
    },
  ],
});

const buildLogEntry = (
  alert: AlertRule,
  latest: FxLatest,
  signal: SignalAssessment,
  destination: AlertDeliveryLog["destination"],
): AlertDeliveryLog => ({
  id: randomUUID(),
  alertId: alert.id,
  pairSymbol: alert.pairSymbol,
  targetRate: alert.targetRate,
  observedRate: latest.rate,
  recommendation: signal.recommendation,
  confidence: signal.confidence,
  deliveredAt: new Date().toISOString(),
  destination,
  message: `${latest.pair.base}/${latest.pair.quote} reached ${latest.rate.toFixed(4)} against target ${alert.targetRate.toFixed(4)}.`,
});

export const sendOpportunityNotification = async (
  alert: AlertRule,
  latest: FxLatest,
  signal: SignalAssessment,
  chartPoints: FxPoint[] = [],
) => {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL?.trim();
  const destination: AlertDeliveryLog["destination"] = webhookUrl ? "discord" : "log-only";
  const logEntry = buildLogEntry(alert, latest, signal, destination);

  if (webhookUrl) {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(buildDiscordPayload(alert, latest, signal, chartPoints)),
    });

    if (!response.ok) {
      throw new Error(`Discord webhook failed with status ${response.status}`);
    }
  }

  await appendLogLine(DELIVERY_LOG_FILE, JSON.stringify(logEntry));
  return logEntry;
};

export const isDiscordConfigured = () => Boolean(process.env.DISCORD_WEBHOOK_URL?.trim());

export const listDeliveryLogs = async (limit = 25): Promise<AlertDeliveryLog[]> => {
  const lines = await readLogLines(DELIVERY_LOG_FILE, limit);
  return lines.map((line) => JSON.parse(line) as AlertDeliveryLog);
};
