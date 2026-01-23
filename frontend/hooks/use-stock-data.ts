"use client"

import { useState, useEffect } from "react"
import { stockAPI, type StockQuote } from "@/lib/stock-api"

export function useStockQuote(symbol: string) {
  const [quote, setQuote] = useState<StockQuote | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!symbol) return

    const fetchQuote = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await stockAPI.getStockQuote(symbol)
        setQuote(data)
      } catch (err) {
        setError("Failed to fetch stock data")
      } finally {
        setLoading(false)
      }
    }

    fetchQuote()
  }, [symbol])

  return { quote, loading, error }
}

export function useMultipleQuotes(symbols: string[]) {
  const [quotes, setQuotes] = useState<StockQuote[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!symbols.length) return

    const fetchQuotes = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await stockAPI.getMultipleQuotes(symbols)
        setQuotes(data)
      } catch (err) {
        setError("Failed to fetch stock quotes")
      } finally {
        setLoading(false)
      }
    }

    fetchQuotes()

    // Set up real-time updates
    const unsubscribe = stockAPI.subscribeToQuotes(symbols, (updatedQuotes) => {
      setQuotes(updatedQuotes)
    })

    return unsubscribe
  }, [symbols])

  return { quotes, loading, error }
}

export function useStockSearch() {
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const search = async (query: string) => {
    if (!query.trim()) {
      setResults([])
      return
    }

    setLoading(true)
    setError(null)
    try {
      const data = await stockAPI.searchStocks(query)
      setResults(data)
    } catch (err) {
      setError("Failed to search stocks")
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  return { results, loading, error, search }
}
