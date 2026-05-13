import { useEffect, useMemo, useState } from "react";
import { getFxDashboardData } from "../services/fxService";
import type { FxDashboardData, TimeRange } from "../types/currency";

export const useExchangeRates = (pairSymbol: string, range: TimeRange) => {
  const [series, setSeries] = useState<FxDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isActive = true;

    const load = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const nextSeries = await getFxDashboardData(pairSymbol, range);
        if (isActive) {
          setSeries(nextSeries);
        }
      } catch (loadError) {
        if (isActive) {
          setError(loadError instanceof Error ? loadError.message : "Failed to load exchange rates.");
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => {
      isActive = false;
    };
  }, [pairSymbol, range, reloadKey]);

  const filteredPoints = useMemo(() => {
    if (!series) {
      return [];
    }

    return series.history.points;
  }, [series]);

  return {
    series,
    filteredPoints,
    isLoading,
    error,
    retry: () => setReloadKey((currentKey) => currentKey + 1),
  };
};
