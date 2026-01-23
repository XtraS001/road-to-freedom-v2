from fastapi import APIRouter, HTTPException
from .models import Item

import yfinance as yf
import pandas as pd
from yahooquery import search
import time



router = APIRouter()
fake_db = {}


# Testing
@router.get("/stocks/all")
def get_all_stocks():
    str1 = "Data Got!"
    return str1

# Update Stock price
@router.post("/update-stocks")
def get_latest_prices(symbols: list[str]) -> dict:
    try:
        data = yf.download(
            tickers=symbols,
            period="1d",
            interval="1m",
            group_by="ticker",
            threads=True,
            progress=False,
            auto_adjust=True
        )

        prices = {}

        for symbol in symbols:
            try:
                if isinstance(data.columns, pd.MultiIndex):
                    last_price = data[symbol]["Close"].dropna().iloc[-1]
                else:
                    # Happens if only one symbol is fetched
                    last_price = data["Close"].dropna().iloc[-1]

                prices[symbol] = round(float(last_price), 2)
            except Exception:
                prices[symbol] = None
                # prices[symbol] = "Price not available"
        
        print(prices)
        return prices

    except Exception as e:
        return {"error": str(e)}
    
# Get Stocks Details
@router.post("/create-stocks")
def get_latest_prices(symbols: list[str]) -> dict:
    try:
        data = yf.download(
            tickers=symbols,
            period="1d",
            interval="1m",
            group_by="ticker",
            threads=True,
            progress=False,
            auto_adjust=True
        )

        results = {}

        for symbol in symbols:
            try:
                # Get stock name using yf.Ticker
                ticker = yf.Ticker(symbol)
                info = ticker.info
                name = info.get("longName") or info.get("shortName") or "Name not available"

                # Get price from downloaded data
                if isinstance(data.columns, pd.MultiIndex):
                    last_price = data[symbol]["Close"].dropna().iloc[-1]
                else:
                    last_price = data["Close"].dropna().iloc[-1]

                results[symbol] = {
                    "name": name,
                    "price": round(float(last_price), 2)
                }
            except Exception:
                results[symbol] = {
                    "name": "Name not available",
                    "price": "Price not available"
                }

        return results

    except Exception as e:
        return {"error": str(e)}
    
# @router.get("/stocks/symbols/{name}")
# def get_stocks_symbols(name: str):
#     results = search(name)

#     us_stocks = []
#     for item in results["quotes"]:
#         print(f"{item['shortname, N/A' ] or item.get('longname') or item.get('symbol')} → {item['symbol'], item['exchange']}")
        
#         if item["exchange"] in ["NYQ", "NMS", "DJI", "ASE", "NGM"]:
#             us_stocks.append(item)
#     # return results["quotes"]
#     return us_stocks

# updated version:
@router.get("/stocks/symbols/{name}")
def get_stocks_symbols(name: str):
    # start = time.perf_counter()
    results = search(name)

    us_stocks = []
    for item in results.get("quotes", []):
        display_name = item.get("shortname") or item.get("longname") or item.get("symbol")
        symbol = item.get("symbol", "N/A")
        exchange = item.get("exchange", "N/A")

        # print(f"{display_name} → ({symbol}, {exchange})")

        if exchange in ["NYQ", "NMS", "DJI", "ASE", "NGM"]: 

            #  --- yf ticker to get stock price --- 
            data = yf.download(
                tickers=symbol,
                period="1d",
                interval="1m",
                progress=False,
                threads=True,
                auto_adjust=True

            )
            price = None

            if not data.empty:
                last_price = data["Close"].dropna().iloc[-1]
                price = round(float(last_price.iloc[0]), 2)

            us_stocks.append({
                "name": display_name,
                "symbol": symbol,
                "exchange": exchange
                ,"currentQuote": price
            })

    # duration = time.perf_counter() - start
    # print(f"/get stock price controller took {duration:.6f} seconds")
    return us_stocks


@router.get("/stock/{symbol}")
def get_stock_price(symbol: str) -> dict:
    try:
        data = yf.download(
            tickers=symbol,
            period="1d",
            interval="1m",
            progress=False,
            threads=True,
            auto_adjust=True
        )

        if data.empty:
            return { "symbol": symbol, "price": None }

        last_price = data["Close"].dropna().iloc[-1]
        return { "symbol": symbol, "price": round(float(last_price.iloc[0]), 2) }

    except Exception as e:
        return { "error": str(e) }


# Stock Exchange List:
# NGM: NasdaqGM
# ASE: NYSE American

# Use yf to search with stock symbols. Super fast, return price also super fast
# use yahooquery to search with name, return price slow