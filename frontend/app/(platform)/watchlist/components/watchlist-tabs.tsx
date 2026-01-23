"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  Star,
  TrendingUp,
  TrendingDown,
  X,
  Edit2,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { AddStockDialog } from "@/components/add-stock-dialog";
import { CreateWatchlistDialog } from "@/components/create-watchlist-dialog";
import { clientRestClient } from "@/lib/backend/clientClient";
import { stockAPI, StockQuote } from "@/lib/stock-api";
import { WatchlistDto, StockDto, CreateStockRequest } from "@/models/backend";
import { toast } from "sonner";

interface UIStock extends StockDto {
  change: number;
  changePercent: number;
  volume: string;
  marketCap: string;
  price: number; // Use this for display instead of currentQuote to ensure freshness
}

interface UIWatchlist {
  id: number;
  name: string;
  stocks: UIStock[];
}

export function WatchlistTabs() {
  const [watchlists, setWatchlists] = useState<UIWatchlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddStock, setShowAddStock] = useState(false);
  const [showCreateWatchlist, setShowCreateWatchlist] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const fetchData = async () => {
    try {
      setLoading(true);
      const watchlistsData = await clientRestClient.getWatchlists();

      const enrichedWatchlists: UIWatchlist[] = [];

      for (const w of watchlistsData) {
        const stocks = await clientRestClient.getStocksByWatchlistId(w.id);

        // Fetch rich market data for these stocks
        const symbols = stocks.map((s) => s.symbol);
        let quotes: StockQuote[] = [];
        if (symbols.length > 0) {
          quotes = await stockAPI.getMultipleQuotes(symbols);
        }

        const enrichedStocks: UIStock[] = stocks.map((stock) => {
          const quote = quotes.find((q) => q.symbol === stock.symbol);
          return {
            ...stock,
            // price: quote?.price || stock.currentQuote,
            price: stock.currentQuote || quote?.price,
            change: quote?.change || 0,
            changePercent: quote?.changePercent || 0,
            volume: quote?.volume || "N/A",
            marketCap: quote?.marketCap || "N/A",
          };
        });

        enrichedWatchlists.push({
          id: w.id,
          name: w.name,
          stocks: enrichedStocks,
        });
      }

      setWatchlists(enrichedWatchlists);
    } catch (error) {
      console.error("Failed to fetch watchlists:", error);
      toast.error("Error", {
        description: "Failed to load watchlists via backend API.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const removeStockFromWatchlist = async (
    watchlistId: number,
    stockId: number
  ) => {
    try {
      await clientRestClient.removeStockFromWatchlist(watchlistId, stockId);
      toast.success("Success", { description: "Stock removed from watchlist" });
      fetchData(); // Refresh data
    } catch (error) {
      console.error("Failed to remove stock:", error);
      toast.error("Error", {
        description: "Failed to remove stock",
      });
    }
  };

  const addStockToWatchlist = async (watchlistId: number, stockData: any) => {
    try {
      // Construct CreateStockRequest from the search result (market data)
      const createStockRequest: CreateStockRequest = {
        symbol: stockData.symbol,
        name: stockData.name,
        currentQuote: stockData.price,
        exchange: stockData.exchange,
        watchlistId: watchlistId,
      };

      await clientRestClient.createStock(createStockRequest);
      toast.success("Success", { description: "Stock added to watchlist" });
      fetchData();
    } catch (error) {
      console.error("Failed to add stock:", error);
      toast.error("Error", {
        description: "Failed to add stock",
      });
    }
  };

  const createWatchlist = async (name: string) => {
    try {
      const newWatchlist: WatchlistDto = {
        id: 0,
        name: name,
        userDto: { id: 0, email: "" }, // Dummy user, backend should handle context
        stockIds: [],
      };
      await clientRestClient.createWatchlist(newWatchlist);
      toast.success("Success", { description: "Watchlist created" });
      fetchData();
    } catch (error) {
      console.error("Failed to create watchlist:", error);
      toast.error("Error", {
        description: "Failed to create watchlist",
      });
    }
  };

  const filteredStocks = (stocks: UIStock[]) => {
    if (!searchTerm) return stocks;
    return stocks.filter(
      (stock) =>
        stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : watchlists.length - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev < watchlists.length - 1 ? prev + 1 : 0));
  };

  const currentWatchlist = watchlists[currentIndex];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search stocks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </div>

        <div className="flex space-x-2">
          {currentWatchlist && (
            <Button onClick={() => setShowAddStock(true)} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Stock
            </Button>
          )}
          <Button
            onClick={() => setShowCreateWatchlist(true)}
            variant="outline"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Watchlist
          </Button>
        </div>
      </div>

      {!currentWatchlist ? (
        <div className="text-center py-12 border rounded-lg bg-card">
          <h3 className="text-lg font-semibold mb-2">No Watchlists Found</h3>
          <p className="text-muted-foreground mb-4">
            Create a watchlist to start tracking stocks.
          </p>
          <Button onClick={() => setShowCreateWatchlist(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Watchlist
          </Button>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between bg-card border rounded-lg p-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={goToPrevious}
              disabled={watchlists.length <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5" />
                <span className="text-lg font-semibold">
                  {currentWatchlist?.name}
                </span>
                <Badge variant="secondary">
                  {currentWatchlist?.stocks.length || 0}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                {currentIndex + 1} of {watchlists.length}
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={goToNext}
              disabled={watchlists.length <= 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Star className="h-5 w-5" />
                  <span>{currentWatchlist?.name}</span>
                </CardTitle>
                <Button variant="ghost" size="sm">
                  <Edit2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {!currentWatchlist || currentWatchlist.stocks.length === 0 ? (
                <div className="text-center py-12">
                  <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No stocks in this watchlist
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Add stocks to start monitoring their performance
                  </p>
                  <Button onClick={() => setShowAddStock(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Stock
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                          Symbol
                        </th>
                        <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">
                          Price
                        </th>
                        <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">
                          Change
                        </th>
                        <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">
                          Volume
                        </th>
                        <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">
                          Market Cap
                        </th>
                        <th className="text-center py-3 px-2 text-sm font-medium text-muted-foreground">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStocks(currentWatchlist.stocks).map((stock) => (
                        <tr
                          key={stock.id || stock.symbol}
                          className="border-b hover:bg-muted/50"
                        >
                          <td className="py-4 px-2">
                            <div>
                              <div className="font-semibold">
                                {stock.symbol}
                              </div>
                              <div className="text-sm text-muted-foreground truncate max-w-40">
                                {stock.name}
                              </div>
                            </div>
                          </td>
                          <td className="text-right py-4 px-2 font-semibold">
                            ${stock.price?.toFixed(2) ?? "N/A"}
                          </td>
                          <td className="text-right py-4 px-2">
                            <div className="flex flex-col items-end">
                              <span
                                className={`text-sm font-medium ${
                                  stock.change >= 0
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {stock.change >= 0 ? "+" : ""}$
                                {stock.change?.toFixed(2) ?? "0.00"}
                              </span>
                              <Badge
                                variant={
                                  stock.changePercent >= 0
                                    ? "default"
                                    : "destructive"
                                }
                                // className="text-xs"
                                className={`text-xs ${
                                  stock.changePercent >= 0
                                    ? "bg-green-600"
                                    : "bg-red-600"
                                }`}
                              >
                                {stock.changePercent >= 0 ? (
                                  <TrendingUp className="h-3 w-3 mr-1" />
                                ) : (
                                  <TrendingDown className="h-3 w-3 mr-1" />
                                )}
                                {stock.changePercent?.toFixed(2) ?? "0.00"}%
                              </Badge>
                            </div>
                          </td>
                          <td className="text-right py-4 px-2 text-sm">
                            {stock.volume}
                          </td>
                          <td className="text-right py-4 px-2 text-sm">
                            {stock.marketCap}
                          </td>
                          <td className="text-center py-4 px-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                removeStockFromWatchlist(
                                  currentWatchlist.id,
                                  stock.id
                                )
                              }
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      <AddStockDialog
        open={showAddStock}
        onOpenChange={setShowAddStock}
        onAddStock={(stockData) =>
          addStockToWatchlist(currentWatchlist?.id || 0, stockData)
        }
        watchlistId={currentWatchlist?.id.toString() || ""}
      />

      <CreateWatchlistDialog
        open={showCreateWatchlist}
        onOpenChange={setShowCreateWatchlist}
        onCreateWatchlist={createWatchlist}
      />
    </div>
  );
}
