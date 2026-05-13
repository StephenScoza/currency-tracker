import { isDiscordConfigured } from "./discordService.js";

const hasConfiguredTwelveDataKey = () => {
  const apiKey = process.env.TWELVE_DATA_API_KEY?.trim();
  return Boolean(apiKey && apiKey !== "replace-with-your-twelve-data-api-key");
};

export const getSystemStatus = () => ({
  service: "currency-tracker-api",
  timestamp: new Date().toISOString(),
  liveFxConfigured: hasConfiguredTwelveDataKey(),
  discordConfigured: isDiscordConfigured(),
  alertPollIntervalMs: Number(process.env.ALERT_POLL_INTERVAL_MS ?? 60_000),
  alertStorageDir: process.env.ALERT_STORAGE_DIR ?? "./runtime",
});
