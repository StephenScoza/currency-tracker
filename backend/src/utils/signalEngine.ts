import type { FxPoint, Recommendation, SignalAssessment, TrendDirection } from "../types/fx.js";

const average = (values: number[]) =>
  values.reduce((sum, value) => sum + value, 0) / Math.max(values.length, 1);

const movingAverage = (points: FxPoint[], windowSize: number) =>
  average(points.slice(-windowSize).map((point) => point.rate));

const percentileRank = (points: FxPoint[], currentRate: number) =>
  points.filter((point) => point.rate <= currentRate).length / Math.max(points.length, 1);

const detectTrendDirection = (momentum: number): TrendDirection => {
  if (momentum > 0.012) {
    return "UP";
  }

  if (momentum < -0.012) {
    return "DOWN";
  }

  return "SIDEWAYS";
};

export const buildSignalAssessment = (points: FxPoint[]): SignalAssessment => {
  const currentRate = points[points.length - 1]?.rate ?? 0;
  const shortAverage = movingAverage(points, 7);
  const mediumAverage = movingAverage(points, 30);
  const recentWindow = points.slice(-30);
  const recentHigh = Math.max(...recentWindow.map((point) => point.rate));
  const recentLow = Math.min(...recentWindow.map((point) => point.rate));
  const percentile = percentileRank(recentWindow, currentRate);
  const movingAverageGap = currentRate - mediumAverage;
  const momentum = shortAverage === 0 ? 0 : (shortAverage - mediumAverage) / mediumAverage;
  const trendDirection = detectTrendDirection(momentum);

  let recommendation: Recommendation = "NEUTRAL";
  if (percentile >= 0.75 && movingAverageGap >= 0) {
    recommendation = "GOOD";
  } else if (percentile < 0.4 && movingAverageGap < 0) {
    recommendation = "WAIT";
  }

  const recentRange = Math.max(recentHigh - recentLow, 0.0001);
  const rangePosition = (currentRate - recentLow) / recentRange;
  const confidenceBase =
    Math.abs(percentile - 0.5) * 120 + Math.abs(momentum) * 800 + Math.abs(rangePosition - 0.5) * 35;
  const confidence = Math.min(96, Math.max(52, Math.round(confidenceBase)));

  return {
    recommendation,
    confidence,
    reasoning: [
      percentile >= 0.75
        ? "Current rate sits in the upper quartile of the recent range."
        : percentile < 0.4
          ? "Current rate is below the 40th percentile of the recent range."
          : "Current rate is near the middle of the recent range.",
      movingAverageGap >= 0
        ? "Spot is trading above the 30-day average."
        : "Spot is trading below the 30-day average.",
      trendDirection === "UP"
        ? "Short-term momentum is improving."
        : trendDirection === "DOWN"
          ? "Recent momentum is softening."
          : "Momentum is relatively flat.",
    ].join(" "),
    trendDirection,
    percentile,
    movingAverageGap,
    momentum,
  };
};
