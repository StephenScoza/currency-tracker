import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import pino from "pino";
import { pinoHttp } from "pino-http";
import { logDirectory, logLevel, logRetentionCount, logRotationSize } from "../config/fxConfig.js";

const logsDir = path.resolve(logDirectory());
const logFile = path.join(logsDir, "reaisify.log");

const transport = pino.transport({
  target: "pino-roll",
  options: {
    file: logFile,
    frequency: "daily",
    size: logRotationSize(),
    mkdir: true,
    extension: ".jsonl",
    symlink: true,
    limit: {
      count: logRetentionCount(),
      removeOtherLogFiles: true,
    },
  },
});

export const logger = pino(
  {
    level: logLevel(),
    base: {
      service: "reaisify-api",
    },
  },
  transport,
);

export const requestLogger = pinoHttp({
  logger,
  customProps: () => ({
    component: "http",
  }),
});

export const getRecentLogLines = async (limit = 100) => {
  const entries = await readdir(logsDir).catch(() => []);
  const logFiles = entries
    .filter((entry) => entry !== "current.log" && (entry.endsWith(".jsonl") || entry.endsWith(".log")))
    .sort()
    .reverse();

  const lines: string[] = [];
  for (const fileName of logFiles) {
    const raw = await readFile(path.join(logsDir, fileName), "utf8").catch(() => "");
    lines.push(...raw.split("\n").filter(Boolean).reverse());
    if (lines.length >= limit) {
      break;
    }
  }

  return lines.slice(0, limit);
};
