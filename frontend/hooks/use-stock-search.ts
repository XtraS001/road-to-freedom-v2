// // hooks/use-stock-search.ts
"use client";

import { useEffect, useState } from "react";
import { clientRestClient } from "@/lib/backend/clientClient";
import { StockDto } from "@/models/backend";

export function useStockSearch(symbol: string) {
  const [stock, setStock] = useState<StockDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!symbol) {
      setStock([]);
      setError(null);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await clientRestClient.searchStocks(symbol);

        if (!res || res.length === 0) {
          setStock([]);
          setError("Stock not found");
          return;
        }

        setStock(
          res.map((stock) => ({
            ...stock,
            price: Number(stock.currentQuote),
          }))
        );
      } catch {
        setStock([]);
        setError("Failed to fetch stock data");
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [symbol]);

  return { stock, loading, error };
}
