export interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  marketCap: string;
  bid?: number;
  ask?: number;
  dayHigh?: number;
  dayLow?: number;
  yearHigh?: number;
  yearLow?: number;
  pe?: number;
  eps?: number;
  dividend?: number;
  dividendYield?: number;
  lastUpdated?: string;
}

export interface StockSearchResult {
  symbol: string;
  name: string;
  exchange: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  marketCap: string;
}

class StockAPI {
  // private baseUrl = "/api/stocks";
  private baseUrl = "http://localhost:3000/api/stocks";

  async searchStocks(query: string): Promise<StockSearchResult[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/search?q=${encodeURIComponent(query)}`
      );
      if (!response.ok) {
        throw new Error("Failed to search stocks");
      }
      const data = await response.json();
      return data.stocks || [];
    } catch (error) {
      console.error("Error searching stocks:", error);
      return [];
    }
  }

  async getStockQuote(symbol: string): Promise<StockQuote | null> {
    try {
      const response = await fetch(`${this.baseUrl}/${symbol}`);
      if (!response.ok) {
        throw new Error("Failed to fetch stock quote");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching stock quote:", error);
      return null;
    }
  }

  async getMultipleQuotes(symbols: string[]): Promise<StockQuote[]> {
    try {
      const response = await fetch(`${this.baseUrl}/quote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ symbols }),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch quotes");
      }
      const data = await response.json();
      return data.quotes || [];
    } catch (error) {
      console.error("Error fetching multiple quotes:", error);
      return [];
    }
  }

  // Simulate real-time updates with WebSocket-like behavior
  subscribeToQuotes(
    symbols: string[],
    callback: (quotes: StockQuote[]) => void
  ) {
    const interval = setInterval(async () => {
      const quotes = await this.getMultipleQuotes(symbols);
      callback(quotes);
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }
}

export const stockAPI = new StockAPI();
