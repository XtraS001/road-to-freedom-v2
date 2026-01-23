import { type NextRequest, NextResponse } from "next/server"

// Mock function to generate realistic stock data
function generateStockData(symbol: string) {
  const basePrice = Math.random() * 500 + 50
  const change = (Math.random() - 0.5) * 20
  const changePercent = (change / basePrice) * 100

  return {
    symbol: symbol.toUpperCase(),
    price: basePrice,
    change,
    changePercent,
    volume: `${(Math.random() * 100 + 5).toFixed(1)}M`,
    marketCap: `${(Math.random() * 2000 + 100).toFixed(0)}B`,
    bid: basePrice - 0.05,
    ask: basePrice + 0.05,
    dayHigh: basePrice + Math.random() * 10,
    dayLow: basePrice - Math.random() * 10,
    yearHigh: basePrice + Math.random() * 50,
    yearLow: basePrice - Math.random() * 30,
    pe: Math.random() * 30 + 10,
    eps: Math.random() * 10 + 1,
    dividend: Math.random() * 5,
    dividendYield: Math.random() * 4,
  }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ symbol: string }> }) {
  const { symbol } = await params;

  if (!symbol) {
    return NextResponse.json({ error: "Symbol is required" }, { status: 400 })
  }

  try {
    // In a real application, you would call an external API like Alpha Vantage, IEX Cloud, or Yahoo Finance
    // For demonstration, we're using mock data
    const stockData = generateStockData(symbol)

    return NextResponse.json(stockData)
  } catch (error) {
    console.error("Error fetching stock data:", error)
    return NextResponse.json({ error: "Failed to fetch stock data" }, { status: 500 })
  }
}
