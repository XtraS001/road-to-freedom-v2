"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, PlusCircle } from "lucide-react";

import { TradeForm } from "./trade-form";

export function TradeDialog() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"buy" | "sell">("buy");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {/* <Button className="bg-blue-600 hover:bg-blue-700"> */}
        <Button>
          <PlusCircle className="h-4 w-4 mr-2" />
          Trade
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5" />
            <span>Place Trade Order</span>
          </DialogTitle>
        </DialogHeader>

        <Tabs
          defaultValue="buy"
          className="w-full"
          onValueChange={(value) => setActiveTab(value as "buy" | "sell")}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger
              value="buy"
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white dark:data-[state=active]:bg-green-600 dark:data-[state=active]:text-white"
            >
              Buy
            </TabsTrigger>
            <TabsTrigger
              value="sell"
              className="data-[state=active]:bg-red-600 data-[state=active]:text-white dark:data-[state=active]:bg-red-600 dark:data-[state=active]:text-white"
            >
              Sell
            </TabsTrigger>
          </TabsList>

          <TabsContent value="buy">
            <TradeForm type="buy" onSuccess={() => setOpen(false)} />
          </TabsContent>

          <TabsContent value="sell">
            <TradeForm type="sell" onSuccess={() => setOpen(false)} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
