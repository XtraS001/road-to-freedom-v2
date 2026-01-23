"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TrendingUp, TrendingDown, Loader2, Search } from "lucide-react";
import Calendar22 from "@/components/calendar-22";

import { clientRestClient } from "@/lib/backend/clientClient";
import { StockDto, BuyTradeRequest, SellTradeRequest } from "@/models/backend";
import { useStockSearch } from "@/hooks/use-stock-search";
import { usePortfolioStocks } from "@/hooks/use-portfolio-stocks";
import { OrderSummary } from "./order-summary";

interface TradeFormProps {
  type: "buy" | "sell";
  onSuccess: () => void;
}

export function TradeForm({ type, onSuccess }: TradeFormProps) {
  const [symbol, setSymbol] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [transactionFee, setTransactionFee] = useState("0.00");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectedStock, setSelectedStock] = useState<StockDto | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Use different hooks based on trade type
  // For buy: use regular stock search
  // For sell: use portfolio stocks
  const { stock: buySearchResults, loading: isBuySearching } = useStockSearch(
    type === "buy" ? searchQuery : ""
  );

  const { stocks: sellPortfolioStocks, loading: isSellSearching } =
    usePortfolioStocks(type === "sell" ? searchQuery : "");

  // Determine which results to use based on type
  const searchResults = type === "buy" ? buySearchResults : sellPortfolioStocks;
  const isSearching = type === "buy" ? isBuySearching : isSellSearching;

  const handleStockSelect = (stock: StockDto) => {
    setSymbol(stock.symbol);
    setSearchQuery(stock.symbol);
    setPrice(stock.currentQuote.toFixed(2));
    setSelectedStock(stock);
    setShowSearchResults(false);
  };

  const handleSubmit = async () => {
    if (!selectedStock) {
      console.error("No stock selected");
      return;
    }

    try {
      const stockDto: StockDto = {
        id: selectedStock.id,
        symbol: selectedStock.symbol,
        name: selectedStock.name,
        currentQuote: selectedStock.currentQuote,
        exchange: selectedStock.exchange,
        watchlistIds: selectedStock.watchlistIds,
      };

      const finalDate = date || new Date();

      if (type === "buy") {
        // Create buy trade request
        const buyRequest: BuyTradeRequest = {
          stockSymbol: selectedStock.symbol,
          buyPrice: Number.parseFloat(price),
          quantity: Number.parseInt(quantity),
          buyDate: finalDate,
          stockDto: stockDto,
        };

        await clientRestClient.createBuyTrade(buyRequest);
        console.log(
          `[v0] Buy trade submitted successfully: ${quantity} ${symbol} @ ${price} on ${finalDate}`
        );
      } else {
        // Create sell trade request
        const sellRequest: SellTradeRequest = {
          stockSymbol: selectedStock.symbol,
          sellPrice: Number.parseFloat(price),
          quantity: Number.parseInt(quantity),
          sellDate: finalDate,
          stockDto: stockDto,
        };

        await clientRestClient.createSellTrade(sellRequest);

        console.log(
          `[v0] Sell trade submitted successfully: ${quantity} ${symbol} @ ${price} on ${finalDate}`
        );
      }

      onSuccess();
    } catch (error) {
      // console.error("Failed to submit trade:", error);
      console.log("Failed to submit trade:", error instanceof Error ? error.message : error);
    }
  };

  // Calculate change percent safely (mock calculation if not provided by backend directly for display)
  const getDisplayStock = (stock: StockDto) => {
    return {
      ...stock,
      changePercent: Math.random() * 5 - 2.5, // Mock data as per previous version
    };
  };

  // Helper to ensure we have a stock for display (either selected or from search if matched exactly)
  const displayStock = selectedStock ? getDisplayStock(selectedStock) : null;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor={`${type}-symbol`}>Stock Symbol</Label>
        <Popover open={showSearchResults} onOpenChange={setShowSearchResults}>
          <PopoverTrigger asChild>
            <div className="relative">
              <Input
                id={`${type}-symbol`}
                placeholder="Search stock symbol or name..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value.toUpperCase());
                  setSymbol("");
                  setSelectedStock(null);
                }}
                className="pr-10"
              />
              {isSearching && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
              )}
              {!isSearching && searchQuery && (
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              )}
            </div>
          </PopoverTrigger>
          <PopoverContent
            className="w-[var(--radix-popover-trigger-width)] p-0"
            align="start"
          >
            {searchResults && searchResults.length > 0 ? (
              <div className="max-h-[300px] overflow-y-auto">
                {searchResults.map((stock) => {
                  const display = getDisplayStock(stock);
                  return (
                    <button
                      key={stock.symbol}
                      onClick={() => handleStockSelect(stock)}
                      className="w-full text-left px-4 py-3 hover:bg-accent transition-colors border-b last:border-b-0"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-semibold">{stock.symbol}</div>
                          <div className="text-sm text-muted-foreground truncate">
                            {stock.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {stock.exchange}
                          </div>
                        </div>
                        <div className="text-right ml-2">
                          <div className="font-semibold">
                            ${stock.currentQuote.toFixed(2)}
                          </div>
                          <div
                            className={`text-sm ${
                              display.changePercent >= 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {display.changePercent >= 0 ? "+" : ""}
                            {display.changePercent.toFixed(2)}%
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="px-4 py-3 text-sm text-muted-foreground text-center">
                No stocks found
              </div>
            )}
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${type}-quantity`}>Quantity</Label>
        <Input
          id={`${type}-quantity`}
          type="number"
          placeholder="Number of shares"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${type}-price`}>Price</Label>
        <Input
          id={`${type}-price`}
          type="number"
          step="0.01"
          placeholder="0.00"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${type}-fee`}>Transaction Fee</Label>
        <Input
          id={`${type}-fee`}
          type="number"
          step="0.01"
          placeholder="0.00"
          value={transactionFee}
          onChange={(e) => setTransactionFee(e.target.value)}
        />
      </div>

      <div>
        <Calendar22 onSelect={setDate} />
      </div>
      {/* For future use */}
      {/* {displayStock && (
                <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                            <span className="font-semibold">{displayStock.symbol}</span>
                            <Badge variant={displayStock.changePercent >= 0 ? "default" : "destructive"}>
                                {displayStock.changePercent >= 0 ? (
                                    <TrendingUp className="h-3 w-3 mr-1" />
                                ) : (
                                    <TrendingDown className="h-3 w-3 mr-1" />
                                )}
                                {displayStock.changePercent.toFixed(2)}%
                            </Badge>
                        </div>
                        <span className="text-lg font-bold">${displayStock.currentQuote.toFixed(2)}</span>
                    </div> */}
      {/* Mock additional data presentation since StockDto is limited */}
      {/* <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                            <span className="text-muted-foreground">Volume: </span>
                            <span className="font-medium">N/A</span>
                        </div>
                    </div>
                    {type === "sell" && (
                        <div className="text-sm text-muted-foreground mt-2">Available to sell: 100 shares</div>
                    )}
                </div>
            )} */}

      {quantity && symbol && price && (
        <OrderSummary
          quantity={quantity}
          price={price}
          transactionFee={transactionFee}
          isSell={type === "sell"}
        />
      )}

      <Button
        onClick={handleSubmit}
        className={`w-full ${
          type === "buy"
            ? "bg-green-600 hover:bg-green-700"
            : "bg-red-600 hover:bg-red-700"
        }`}
        disabled={!symbol || !quantity || !price}
      >
        Place {type === "buy" ? "Buy" : "Sell"} Order
      </Button>
    </div>
  );
}
