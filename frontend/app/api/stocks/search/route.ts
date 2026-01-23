import { type NextRequest, NextResponse } from "next/server";

// Mock stock data for demonstration - replace with real API integration
const mockStocks = [
  { symbol: "AAPL", name: "Apple Inc.", exchange: "NASDAQ" },
  { symbol: "MSFT", name: "Microsoft Corporation", exchange: "NASDAQ" },
  { symbol: "GOOG", name: "Alphabet Inc.", exchange: "NASDAQ" },
  { symbol: "GOOGL", name: "Alphabet Inc.", exchange: "NASDAQ" },
  { symbol: "GOOGB", name: "Alphabet Inc.", exchange: "NASDAQ" },
  { symbol: "AMZN", name: "Amazon.com Inc.", exchange: "NASDAQ" },
  { symbol: "TSLA", name: "Tesla, Inc.", exchange: "NASDAQ" },
  { symbol: "META", name: "Meta Platforms Inc.", exchange: "NASDAQ" },
  { symbol: "NVDA", name: "NVIDIA Corporation", exchange: "NASDAQ" },
  { symbol: "NFLX", name: "Netflix Inc.", exchange: "NASDAQ" },
  { symbol: "AMD", name: "Advanced Micro Devices Inc.", exchange: "NASDAQ" },
  { symbol: "CRM", name: "Salesforce Inc.", exchange: "NYSE" },
  { symbol: "JNJ", name: "Johnson & Johnson", exchange: "NYSE" },
  { symbol: "PG", name: "Procter & Gamble Co.", exchange: "NYSE" },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.toLowerCase() || "";

  if (!query) {
    return NextResponse.json({ stocks: [] });
  }

  // Filter stocks based on symbol or name
  const filteredStocks = mockStocks.filter(
    (stock) =>
      stock.symbol.toLowerCase().includes(query) ||
      stock.name.toLowerCase().includes(query)
  );

  // Add mock price data
  const stocksWithPrices = filteredStocks.map((stock) => ({
    ...stock,
    price: Math.random() * 500 + 50, // Random price between 50-550
    change: (Math.random() - 0.5) * 20, // Random change between -10 to +10
    changePercent: (Math.random() - 0.5) * 10, // Random percent change
    volume: `${(Math.random() * 100 + 5).toFixed(1)}M`,
    marketCap: `${(Math.random() * 2000 + 100).toFixed(0)}B`,
  }));

  return NextResponse.json({ stocks: stocksWithPrices });
}
