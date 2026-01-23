"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Search, TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import { useStockSearch } from "@/hooks/use-stock-search";
import { StockDto } from "@/models/backend";

interface AddStockDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddStock: (stockData: any) => void;
  watchlistId: string;
}

export function AddStockDialog({
  open,
  onOpenChange,
  onAddStock,
  watchlistId,
}: AddStockDialogProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Use the stock search hook with debounced search
  const { stock: searchResults, loading, error } = useStockSearch(searchTerm);

  const handleAddStock = (stock: StockDto) => {
    onAddStock(stock);
    onOpenChange(false);
    setSearchTerm("");
  };

  // Helper to calculate mock change percent for display
  const getDisplayStock = (stock: StockDto) => {
    return {
      ...stock,
      changePercent: Math.random() * 5 - 2.5, // Mock data for display
    };
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Stock to Watchlist</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="search">Search for stocks</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="search"
                placeholder="Enter symbol or company name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-10"
              />
              {loading && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
              )}
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}

          {searchResults && searchResults.length > 0 && (
            <div className="space-y-2 max-h-80 overflow-y-auto">
              <h4 className="font-semibold text-sm text-muted-foreground">
                Search Results
              </h4>
              {searchResults.map((stock) => {
                const displayStock = getDisplayStock(stock);
                return (
                  <div
                    key={stock.symbol}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold">{stock.symbol}</div>
                          <div className="text-sm text-muted-foreground">
                            {stock.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {stock.exchange}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">
                            ${stock.currentQuote.toFixed(2)}
                          </div>
                          <Badge
                            variant={
                              displayStock.changePercent >= 0 ? "default" : "destructive"
                            }
                            className="text-xs"
                          >
                            {displayStock.changePercent >= 0 ? (
                              <TrendingUp className="h-3 w-3 mr-1" />
                            ) : (
                              <TrendingDown className="h-3 w-3 mr-1" />
                            )}
                            {displayStock.changePercent.toFixed(2)}%
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleAddStock(stock)}
                      className="ml-4"
                    >
                      Add
                    </Button>
                  </div>
                );
              })}
            </div>
          )}

          {searchTerm && searchResults?.length === 0 && !loading && (
            <div className="text-center py-8 text-muted-foreground">
              No stocks found for "{searchTerm}"
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
