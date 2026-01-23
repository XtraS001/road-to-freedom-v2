// hooks/use-portfolio-stocks.ts
"use client";

import { useEffect, useState } from "react";
import { clientRestClient } from "@/lib/backend/clientClient";
import { PortfolioItemDto, StockDto } from "@/models/backend";

export function usePortfolioStocks(filterSymbol: string) {
    const [stocks, setStocks] = useState<StockDto[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPortfolioStocks = async () => {
            setLoading(true);
            try {
                // Get user's default portfolio
                const portfolio = await clientRestClient.getDefaultPortfolio();

                if (!portfolio) {
                    setStocks([]);
                    setError(null);
                    setLoading(false);
                    return;
                }

                // Get portfolio items from the default portfolio
                const allItems = await clientRestClient.getPortfolioItems(portfolio.id);

                // Convert portfolio items to StockDto format
                const stocksMap = new Map<string, StockDto>();

                allItems.forEach((item: PortfolioItemDto) => {
                    if (!stocksMap.has(item.stockSymbol)) {
                        // Create a StockDto from PortfolioItemDto
                        const stockDto: StockDto = {
                            id: item.id, // Using item id as stock id (may need adjustment)
                            symbol: item.stockSymbol,
                            name: item.stockSymbol, // Portfolio items don't have name, using symbol
                            currentQuote: item.currentQuote,
                            exchange: "", // Portfolio items don't have exchange info
                            watchlistIds: [], // Portfolio items don't have watchlist info
                        };
                        stocksMap.set(item.stockSymbol, stockDto);
                    }
                });

                let stocksList = Array.from(stocksMap.values());

                // Filter by symbol if provided
                if (filterSymbol && filterSymbol.trim() !== "") {
                    const upperFilter = filterSymbol.toUpperCase();
                    stocksList = stocksList.filter((stock) =>
                        stock.symbol.toUpperCase().includes(upperFilter)
                    );
                }

                setStocks(stocksList);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch portfolio stocks:", err);
                setError("Failed to fetch portfolio stocks");
                setStocks(null);
            } finally {
                setLoading(false);
            }
        };

        fetchPortfolioStocks();
    }, [filterSymbol]);

    return { stocks, loading, error };
}