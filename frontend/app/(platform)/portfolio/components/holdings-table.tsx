"use client";

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, MoreHorizontal, Loader2, RefreshCw } from "lucide-react"
import { clientRestClient } from "@/lib/backend/clientClient"
import { stockAPI, StockQuote } from "@/lib/stock-api"
import { PortfolioItemDto } from "@/models/backend"
import { toast } from "sonner"

interface UIHolding extends PortfolioItemDto {
  name: string
  currentPrice: number
  marketValue: number
  dayChange: number
  dayChangePercent: number
  totalReturn: number
  totalReturnPercent: number
}

export function HoldingsTable() {
  const [holdings, setHoldings] = useState<UIHolding[]>([])
  const [loading, setLoading] = useState(true)
  const [portfolioId, setPortfolioId] = useState<number | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)

      // 1. Get Default Portfolio
      let pId = portfolioId;
      if (!pId) {
        try {
          const defaultPortfolio = await clientRestClient.getDefaultPortfolio();
          pId = defaultPortfolio.id;
        } catch (e) {
          // Fallback: try getting all and picking first
          const portfolios = await clientRestClient.getUserPortfolio();
          if (portfolios.length > 0) {
            pId = portfolios[0].id;
          }
        }
      }

      if (!pId) {
        setLoading(false);
        return; // No portfolio found
      }
      setPortfolioId(pId);

      // 2. Get Portfolio Items
      const items = await clientRestClient.getPortfolioItems(pId);

      // 3. Get Market Data
      const symbols = items.map(item => item.stockSymbol);
      let quotes: StockQuote[] = [];
      if (symbols.length > 0) {
        quotes = await stockAPI.getMultipleQuotes(symbols);
      }

      // 4. Merge Data
      const enrichedHoldings: UIHolding[] = items.map(item => {
        const quote = quotes.find(q => q.symbol === item.stockSymbol);
        // const currentPrice = item.currentQuote || quote?.price ||  0; // Fallback to last known quote
        const currentPrice = item.currentQuote || 0; // Fallback to last known quote
        const marketValue = currentPrice * item.quantity;
        const totalReturn = marketValue - (item.averageCost * item.quantity);
        const totalReturnPercent = item.averageCost > 0 ? (totalReturn / (item.averageCost * item.quantity)) * 100 : 0;

        // Name is not in PortfolioItemDto, maybe search result or quote has it
        // StockAPI quote doesn't strictly have 'name' in interface but search result does. 
        // We might just use symbol if name unavailable.
        const name = item.stockSymbol;

        return {
          ...item,
          name,
          currentPrice,
          marketValue,
          dayChange: quote?.change || 0,
          dayChangePercent: quote?.changePercent || 0,
          totalReturn,
          totalReturnPercent
        };
      });

      setHoldings(enrichedHoldings);

    } catch (error) {
      console.error("Failed to fetch holdings:", error)
      toast.error("Failed to load holdings")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Holdings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Holdings</CardTitle>
        <Button variant="ghost" size="icon" onClick={fetchData}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {holdings.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No holdings found in this portfolio.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Symbol</th>
                  <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Shares</th>
                  <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Avg Cost</th>
                  <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Current Price</th>
                  <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Market Value</th>
                  <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Day Change</th>
                  <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Total Return</th>
                  <th className="text-center py-3 px-2 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {holdings.map((holding) => (
                  <tr key={holding.id} className="border-b hover:bg-muted/50">
                    <td className="py-4 px-2">
                      <div>
                        <div className="font-semibold">{holding.stockSymbol}</div>
                        {/* <div className="text-sm text-muted-foreground truncate max-w-32">{holding.name}</div> */}
                      </div>
                    </td>
                    <td className="text-right py-4 px-2 font-medium">{holding.quantity}</td>
                    <td className="text-right py-4 px-2">${holding.averageCost.toFixed(2)}</td>
                    <td className="text-right py-4 px-2 font-medium">${holding.currentPrice.toFixed(2)}</td>
                    <td className="text-right py-4 px-2 font-semibold">${holding.marketValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td className="text-right py-4 px-2">
                      <div className="flex flex-col items-end">
                        <span
                          className={`text-sm font-medium ${holding.dayChange >= 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          {holding.dayChange >= 0 ? "+" : ""}${holding.dayChange.toFixed(2)}
                        </span>
                        <div
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${holding.dayChangePercent >= 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                            }`}
                        >
                          {holding.dayChangePercent >= 0 ? (
                            <TrendingUp className="h-3 w-3 mr-1" />
                          ) : (
                            <TrendingDown className="h-3 w-3 mr-1" />
                          )}
                          {holding.dayChangePercent.toFixed(2)}%
                        </div>
                      </div>
                    </td>
                    <td className="text-right py-4 px-2">
                      <div className="flex flex-col items-end">
                        <span
                          className={`text-sm font-medium ${holding.totalReturn >= 0 ? "text-green-600" : "text-red-600"
                            }`}
                        >
                          {holding.totalReturn >= 0 ? "+" : ""}${holding.totalReturn.toFixed(2)}
                        </span>
                        <span
                          className={`text-xs ${holding.totalReturnPercent >= 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          {holding.totalReturnPercent >= 0 ? "+" : ""}
                          {holding.totalReturnPercent.toFixed(2)}%
                        </span>
                      </div>
                    </td>
                    <td className="text-center py-4 px-2">
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-6 pt-4 border-t">
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium">Total Portfolio Value:</span>
            <span className="text-lg font-bold">
              ${holdings.reduce((sum, holding) => sum + holding.marketValue, 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

