"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { DollarSign, CreditCard, Building2 } from "lucide-react"

export function AddCashDialog() {
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("bank")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle cash deposit logic here
    console.log("Adding cash:", { amount, paymentMethod })
    setOpen(false)
    setAmount("")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 bg-transparent">
          <DollarSign className="h-4 w-4" />
          Add Cash
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Cash to Portfolio</DialogTitle>
          <DialogDescription>Deposit funds to your trading account to make new investments.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-10"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label>Payment Method</Label>
            <div className="grid grid-cols-2 gap-3">
              <Card
                className={`cursor-pointer transition-colors ${paymentMethod === "bank" ? "ring-2 ring-primary" : ""}`}
                onClick={() => setPaymentMethod("bank")}
              >
                <CardContent className="flex flex-col items-center p-4">
                  <Building2 className="h-6 w-6 mb-2" />
                  <span className="text-sm font-medium">Bank Transfer</span>
                  <span className="text-xs text-muted-foreground">1-3 days</span>
                </CardContent>
              </Card>

              <Card
                className={`cursor-pointer transition-colors ${paymentMethod === "card" ? "ring-2 ring-primary" : ""}`}
                onClick={() => setPaymentMethod("card")}
              >
                <CardContent className="flex flex-col items-center p-4">
                  <CreditCard className="h-6 w-6 mb-2" />
                  <span className="text-sm font-medium">Debit Card</span>
                  <span className="text-xs text-muted-foreground">Instant</span>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex justify-between items-center text-sm">
              <span>Deposit Amount:</span>
              <span className="font-medium">${amount || "0.00"}</span>
            </div>
            <div className="flex justify-between items-center text-sm mt-1">
              <span>Processing Fee:</span>
              <span className="font-medium">$0.00</span>
            </div>
            <div className="border-t mt-2 pt-2 flex justify-between items-center font-semibold">
              <span>Total:</span>
              <span>${amount || "0.00"}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={!amount}>
              Add Cash
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
