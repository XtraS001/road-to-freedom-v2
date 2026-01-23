"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, DollarSign, Loader2 } from "lucide-react"
import { useStockQuote } from "@/hooks/use-stock-data"

export function TradeDialog() {
  const [open, setOpen] = useState(false)
  const [symbol, setSymbol] = useState("")
  const [quantity, setQuantity] = useState("")
  const [price, setPrice] = useState("")
  const [orderType, setOrderType] = useState("market")
  const [transactionFee, setTransactionFee] = useState("0.00")

  const { quote: stockData, loading: stockLoading, error: stockError } = useStockQuote(symbol)

  const handleSubmit = (action: "buy" | "sell") => {
    console.log("[v0] Trade submitted:", {
      action,
      symbol,
      quantity,
      price,
      orderType,
      transactionFee,
      stockData,
    })
    // Here you would integrate with your Spring Boot backend
    setOpen(false)
    // Reset form
    setSymbol("")
    setQuantity("")
    setPrice("")
    setOrderType("market")
    setTransactionFee("0.00")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <DollarSign className="h-4 w-4 mr-2" />
          Trade
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5" />
            <span>Place Trade Order</span>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="buy" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="buy" className="text-green-600">
              Buy
            </TabsTrigger>
            <TabsTrigger value="sell" className="text-red-600">
              Sell
            </TabsTrigger>
          </TabsList>

          <TabsContent value="buy" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="symbol">Stock Symbol</Label>
                <Input
                  id="symbol"
                  placeholder="e.g., AAPL"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  placeholder="Number of shares"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
            </div>

            {symbol && (
              <div className="bg-muted/50 rounded-lg p-4">
                {stockLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    <span>Loading stock data...</span>
                  </div>
                ) : stockError ? (
                  <div className="text-center py-4 text-red-600">Failed to load stock data</div>
                ) : stockData ? (
                  <>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold">{stockData.symbol}</span>
                        <Badge variant={stockData.changePercent >= 0 ? "default" : "destructive"}>
                          {stockData.changePercent >= 0 ? (
                            <TrendingUp className="h-3 w-3 mr-1" />
                          ) : (
                            <TrendingDown className="h-3 w-3 mr-1" />
                          )}
                          {stockData.changePercent.toFixed(2)}%
                        </Badge>
                      </div>
                      <span className="text-lg font-bold">${stockData.price.toFixed(2)}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Bid: </span>
                        <span className="font-medium">${stockData.bid?.toFixed(2) || "N/A"}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Ask: </span>
                        <span className="font-medium">${stockData.ask?.toFixed(2) || "N/A"}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Volume: </span>
                        <span className="font-medium">{stockData.volume}</span>
                      </div>
                    </div>
                  </>
                ) : null}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="order-type">Order Type</Label>
                <Select value={orderType} onValueChange={setOrderType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="market">Market Order</SelectItem>
                    <SelectItem value="limit">Limit Order</SelectItem>
                    <SelectItem value="stop">Stop Order</SelectItem>
                    <SelectItem value="stop-limit">Stop Limit</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {orderType !== "market" && (
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fee">Transaction Fee</Label>
              <Input
                id="fee"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={transactionFee}
                onChange={(e) => setTransactionFee(e.target.value)}
              />
            </div>

            {quantity && symbol && stockData && (
              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Order Summary</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Shares:</span>
                    <span>{quantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Price per share:</span>
                    <span>${orderType === "market" ? stockData.price.toFixed(2) : price || "0.00"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>
                      $
                      {(
                        Number.parseFloat(quantity || "0") *
                        (orderType === "market" ? stockData.price : Number.parseFloat(price || "0"))
                      ).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Transaction Fee:</span>
                    <span>${transactionFee}</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t pt-1">
                    <span>Total:</span>
                    <span>
                      $
                      {(
                        Number.parseFloat(quantity || "0") *
                          (orderType === "market" ? stockData.price : Number.parseFloat(price || "0")) +
                        Number.parseFloat(transactionFee || "0")
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <Button
              onClick={() => handleSubmit("buy")}
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={!symbol || !quantity || stockLoading}
            >
              Place Buy Order
            </Button>
          </TabsContent>

          <TabsContent value="sell" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sell-symbol">Stock Symbol</Label>
                <Input
                  id="sell-symbol"
                  placeholder="e.g., AAPL"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sell-quantity">Quantity</Label>
                <Input
                  id="sell-quantity"
                  type="number"
                  placeholder="Number of shares"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
            </div>

            {symbol && stockData && (
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold">{stockData.symbol}</span>
                    <Badge variant={stockData.changePercent >= 0 ? "default" : "destructive"}>
                      {stockData.changePercent >= 0 ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      )}
                      {stockData.changePercent.toFixed(2)}%
                    </Badge>
                  </div>
                  <span className="text-lg font-bold">${stockData.price.toFixed(2)}</span>
                </div>
                <div className="text-sm text-muted-foreground">Available to sell: 100 shares</div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sell-order-type">Order Type</Label>
                <Select value={orderType} onValueChange={setOrderType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="market">Market Order</SelectItem>
                    <SelectItem value="limit">Limit Order</SelectItem>
                    <SelectItem value="stop">Stop Order</SelectItem>
                    <SelectItem value="stop-limit">Stop Limit</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {orderType !== "market" && (
                <div className="space-y-2">
                  <Label htmlFor="sell-price">Price</Label>
                  <Input
                    id="sell-price"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="sell-fee">Transaction Fee</Label>
              <Input
                id="sell-fee"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={transactionFee}
                onChange={(e) => setTransactionFee(e.target.value)}
              />
            </div>

            <Button
              onClick={() => handleSubmit("sell")}
              className="w-full bg-red-600 hover:bg-red-700"
              disabled={!symbol || !quantity || stockLoading}
            >
              Place Sell Order
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

// Latest version
// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Badge } from "@/components/ui/badge"
// import { TrendingUp, TrendingDown, DollarSign, Loader2 } from "lucide-react"
// import { useStockQuote } from "@/hooks/use-stock-data"
// import Calendar22 from "./calendar-22"

// export function TradeDialog() {
//   const [open, setOpen] = useState(false)
//   const [symbol, setSymbol] = useState("")
//   const [quantity, setQuantity] = useState("")
//   const [price, setPrice] = useState("")
//   const [transactionFee, setTransactionFee] = useState("0.00")
//   const [activeTab, setActiveTab] = useState<"buy" | "sell">("buy")

//   const { quote: stockData, loading: stockLoading, error: stockError } = useStockQuote(symbol)

//   const handleSubmit = (action: "buy" | "sell") => {
//     console.log("[v0] Trade submitted:", {
//       action,
//       symbol,
//       quantity,
//       price,
//       transactionFee,
//       stockData,
//     })
//     // Here you would integrate with your Spring Boot backend
//     setOpen(false)
//     // Reset form
//     setSymbol("")
//     setQuantity("")
//     setPrice("")
//     setTransactionFee("0.00")
//   }

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button className="bg-blue-600 hover:bg-blue-700">
//           <DollarSign className="h-4 w-4 mr-2" />
//           Trade
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle className="flex items-center space-x-2">
//             <DollarSign className="h-5 w-5" />
//             <span>Place Trade Order</span>
//           </DialogTitle>
//         </DialogHeader>

//         <Tabs defaultValue="buy" className="w-full" onValueChange={(value) => setActiveTab(value as "buy" | "sell")}>
//           <TabsList className="grid w-full grid-cols-2">
//             <TabsTrigger value="buy" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
//               Buy
//             </TabsTrigger>
//             <TabsTrigger value="sell" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
//               Sell
//             </TabsTrigger>
//           </TabsList>

//           <TabsContent value="buy" className="space-y-4">
//             <div className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="symbol">Stock Symbol</Label>
//                 <Input
//                   id="symbol"
//                   placeholder="e.g., AAPL"
//                   value={symbol}
//                   onChange={(e) => setSymbol(e.target.value.toUpperCase())}
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="quantity">Quantity</Label>
//                 <Input
//                   id="quantity"
//                   type="number"
//                   placeholder="Number of shares"
//                   value={quantity}
//                   onChange={(e) => setQuantity(e.target.value)}
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="price">Price</Label>
//                 <Input
//                   id="price"
//                   type="number"
//                   step="0.01"
//                   placeholder="0.00"
//                   value={price}
//                   onChange={(e) => setPrice(e.target.value)}
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="fee">Transaction Fee</Label>
//                 <Input
//                   id="fee"
//                   type="number"
//                   step="0.01"
//                   placeholder="0.00"
//                   value={transactionFee}
//                   onChange={(e) => setTransactionFee(e.target.value)}
//                 />
//               </div>
//               <div>
//                 <Calendar22 />
//               </div>
//             </div>

//             {symbol && (
//               <div className="bg-muted/50 rounded-lg p-4">
//                 {stockLoading ? (
//                   <div className="flex items-center justify-center py-4">
//                     <Loader2 className="h-6 w-6 animate-spin mr-2" />
//                     <span>Loading stock data...</span>
//                   </div>
//                 ) : stockError ? (
//                   <div className="text-center py-4 text-red-600">Failed to load stock data</div>
//                 ) : stockData ? (
//                   <>
//                     <div className="flex items-center justify-between mb-2">
//                       <div className="flex items-center space-x-2">
//                         <span className="font-semibold">{stockData.symbol}</span>
//                         <Badge variant={stockData.changePercent >= 0 ? "default" : "destructive"}>
//                           {stockData.changePercent >= 0 ? (
//                             <TrendingUp className="h-3 w-3 mr-1" />
//                           ) : (
//                             <TrendingDown className="h-3 w-3 mr-1" />
//                           )}
//                           {stockData.changePercent.toFixed(2)}%
//                         </Badge>
//                       </div>
//                       <span className="text-lg font-bold">${stockData.price.toFixed(2)}</span>
//                     </div>
//                     <div className="grid grid-cols-3 gap-4 text-sm">
//                       <div>
//                         <span className="text-muted-foreground">Bid: </span>
//                         <span className="font-medium">${stockData.bid?.toFixed(2) || "N/A"}</span>
//                       </div>
//                       <div>
//                         <span className="text-muted-foreground">Ask: </span>
//                         <span className="font-medium">${stockData.ask?.toFixed(2) || "N/A"}</span>
//                       </div>
//                       <div>
//                         <span className="text-muted-foreground">Volume: </span>
//                         <span className="font-medium">{stockData.volume}</span>
//                       </div>
//                     </div>
//                   </>
//                 ) : null}
//               </div>
//             )}

//             {quantity && symbol && price && (
//               <div className="bg-muted/50 rounded-lg p-4">
//                 <h4 className="font-semibold mb-2">Order Summary</h4>
//                 <div className="space-y-1 text-sm">
//                   <div className="flex justify-between">
//                     <span>Shares:</span>
//                     <span>{quantity}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span>Price per share:</span>
//                     <span>${price || "0.00"}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span>Subtotal:</span>
//                     <span>${(Number.parseFloat(quantity || "0") * Number.parseFloat(price || "0")).toFixed(2)}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span>Transaction Fee:</span>
//                     <span>${transactionFee}</span>
//                   </div>
//                   <div className="flex justify-between font-semibold border-t pt-1">
//                     <span>Total:</span>
//                     <span>
//                       $
//                       {(
//                         Number.parseFloat(quantity || "0") * Number.parseFloat(price || "0") +
//                         Number.parseFloat(transactionFee || "0")
//                       ).toFixed(2)}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             )}

//             <Button
//               onClick={() => handleSubmit("buy")}
//               className="w-full bg-green-600 hover:bg-green-700"
//               disabled={!symbol || !quantity || !price || stockLoading}
//             >
//               Place Buy Order
//             </Button>
//           </TabsContent>

//           <TabsContent value="sell" className="space-y-4">
//             <div className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="sell-symbol">Stock Symbol</Label>
//                 <Input
//                   id="sell-symbol"
//                   placeholder="e.g., AAPL"
//                   value={symbol}
//                   onChange={(e) => setSymbol(e.target.value.toUpperCase())}
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="sell-quantity">Quantity</Label>
//                 <Input
//                   id="sell-quantity"
//                   type="number"
//                   placeholder="Number of shares"
//                   value={quantity}
//                   onChange={(e) => setQuantity(e.target.value)}
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="sell-price">Price</Label>
//                 <Input
//                   id="sell-price"
//                   type="number"
//                   step="0.01"
//                   placeholder="0.00"
//                   value={price}
//                   onChange={(e) => setPrice(e.target.value)}
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="sell-fee">Transaction Fee</Label>
//                 <Input
//                   id="sell-fee"
//                   type="number"
//                   step="0.01"
//                   placeholder="0.00"
//                   value={transactionFee}
//                   onChange={(e) => setTransactionFee(e.target.value)}
//                 />
//               </div>
//             </div>

//             {symbol && stockData && (
//               <div className="bg-muted/50 rounded-lg p-4">
//                 <div className="flex items-center justify-between mb-2">
//                   <div className="flex items-center space-x-2">
//                     <span className="font-semibold">{stockData.symbol}</span>
//                     <Badge variant={stockData.changePercent >= 0 ? "default" : "destructive"}>
//                       {stockData.changePercent >= 0 ? (
//                         <TrendingUp className="h-3 w-3 mr-1" />
//                       ) : (
//                         <TrendingDown className="h-3 w-3 mr-1" />
//                       )}
//                       {stockData.changePercent.toFixed(2)}%
//                     </Badge>
//                   </div>
//                   <span className="text-lg font-bold">${stockData.price.toFixed(2)}</span>
//                 </div>
//                 <div className="text-sm text-muted-foreground">Available to sell: 100 shares</div>
//               </div>
//             )}

//             {quantity && symbol && price && (
//               <div className="bg-muted/50 rounded-lg p-4">
//                 <h4 className="font-semibold mb-2">Order Summary</h4>
//                 <div className="space-y-1 text-sm">
//                   <div className="flex justify-between">
//                     <span>Shares:</span>
//                     <span>{quantity}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span>Price per share:</span>
//                     <span>${price || "0.00"}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span>Subtotal:</span>
//                     <span>${(Number.parseFloat(quantity || "0") * Number.parseFloat(price || "0")).toFixed(2)}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span>Transaction Fee:</span>
//                     <span>${transactionFee}</span>
//                   </div>
//                   <div className="flex justify-between font-semibold border-t pt-1">
//                     <span>Total:</span>
//                     <span>
//                       $
//                       {(
//                         Number.parseFloat(quantity || "0") * Number.parseFloat(price || "0") -
//                         Number.parseFloat(transactionFee || "0")
//                       ).toFixed(2)}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             )}

//             <Button
//               onClick={() => handleSubmit("sell")}
//               className="w-full bg-red-600 hover:bg-red-700"
//               disabled={!symbol || !quantity || !price || stockLoading}
//             >
//               Place Sell Order
//             </Button>
//           </TabsContent>
//         </Tabs>
//       </DialogContent>
//     </Dialog>
//   )
// }
