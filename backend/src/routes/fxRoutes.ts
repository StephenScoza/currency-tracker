import { Router } from "express";
import { getHistoricalRates, getLatestRate, getSignal, refreshLatestRate } from "../services/fxService.js";
import type { TimeRange } from "../types/fx.js";

export const fxRoutes = Router();

fxRoutes.get("/:pairSymbol/latest", async (request, response) => {
  try {
    const pairSymbol = request.params.pairSymbol.toLowerCase();
    const data =
      request.query.refresh === "true"
        ? await refreshLatestRate(pairSymbol)
        : await getLatestRate(pairSymbol);
    response.json({ data });
  } catch (error) {
    response.status(500).json({
      error: error instanceof Error ? error.message : "Failed to load latest FX rate.",
    });
  }
});

fxRoutes.get("/:pairSymbol/history", async (request, response) => {
  try {
    const pairSymbol = request.params.pairSymbol.toLowerCase();
    const range = (request.query.range ?? "30D") as TimeRange;
    const allowedRanges: TimeRange[] = ["7D", "30D", "90D", "1Y"];

    if (!allowedRanges.includes(range)) {
      response.status(400).json({
        error: `Range must be one of ${allowedRanges.join(", ")}.`,
      });
      return;
    }

    const data = await getHistoricalRates(pairSymbol, range);
    response.json({ data });
  } catch (error) {
    response.status(500).json({
      error: error instanceof Error ? error.message : "Failed to load FX history.",
    });
  }
});

fxRoutes.get("/:pairSymbol/signal", async (request, response) => {
  try {
    const pairSymbol = request.params.pairSymbol.toLowerCase();
    const data = await getSignal(pairSymbol);
    response.json({ data });
  } catch (error) {
    response.status(500).json({
      error: error instanceof Error ? error.message : "Failed to calculate FX signal.",
    });
  }
});
