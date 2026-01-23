from fastapi import FastAPI
from .routes import router
from pydantic import BaseModel
from typing import List
import yfinance as yf

app = FastAPI()
app.include_router(router)




# Define the request body model
# class StockRequest(BaseModel):
#     symbols: List[str]

# @app.post("/stocks/")
# def get_current_prices(request: StockRequest):
#     results = {}

#     for symbol in request.symbols:
#         try:
#             stock = yf.Ticker(symbol)
#             price = stock.fast_info.get("last_price")

#             if price is not None:
#                 results[symbol] = price
#             else:
#                 results[symbol] = "Price not available"
#         except Exception as e:
#             results[symbol] = f"Error: {str(e)}"
    
#     return results

