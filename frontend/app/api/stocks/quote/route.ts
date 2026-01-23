import { type NextRequest, NextResponse } from "next/server"

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "http://localhost:8080",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: CORS_HEADERS })
}

export async function POST(request: NextRequest) {
  try {
    const { symbols } = await request.json()

    if (!symbols || !Array.isArray(symbols)) {
      return NextResponse.json(
        { error: "Symbols array is required" },
        { status: 400, headers: CORS_HEADERS }
      )
    }

    // Generate mock data for multiple symbols
    const quotes = symbols.map((symbol) => {
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
        lastUpdated: new Date().toISOString(),
      }
    })

    return NextResponse.json(
      { quotes },
      { headers: CORS_HEADERS }
    )
  } catch (error) {
    console.error("Error fetching quotes:", error)
    return NextResponse.json(
      { error: "Failed to fetch quotes" },
      { status: 500, headers: CORS_HEADERS }
    )
  }
}
