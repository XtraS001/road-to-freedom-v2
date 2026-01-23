"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useState } from "react"

const performanceData = {
  "1D": [
    { time: "9:30", value: 122190 },
    { time: "10:00", value: 122450 },
    { time: "10:30", value: 122890 },
    { time: "11:00", value: 123120 },
    { time: "11:30", value: 123580 },
    { time: "12:00", value: 124020 },
    { time: "12:30", value: 124380 },
    { time: "1:00", value: 124650 },
    { time: "1:30", value: 125100 },
    { time: "2:00", value: 125430 },
  ],
  "1W": [
    { time: "Mon", value: 120500 },
    { time: "Tue", value: 121200 },
    { time: "Wed", value: 122800 },
    { time: "Thu", value: 124100 },
    { time: "Fri", value: 125430 },
  ],
  "1M": [
    { time: "Week 1", value: 118000 },
    { time: "Week 2", value: 119500 },
    { time: "Week 3", value: 122000 },
    { time: "Week 4", value: 125430 },
  ],
  "1Y": [
    { time: "Jan", value: 100000 },
    { time: "Feb", value: 102000 },
    { time: "Mar", value: 105000 },
    { time: "Apr", value: 108000 },
    { time: "May", value: 112000 },
    { time: "Jun", value: 115000 },
    { time: "Jul", value: 118000 },
    { time: "Aug", value: 121000 },
    { time: "Sep", value: 123000 },
    { time: "Oct", value: 125430 },
  ],
}

export function PerformanceChart() {
  const [timeframe, setTimeframe] = useState<keyof typeof performanceData>("1D")

  const formatValue = (value: number) => {
    return `$${(value / 1000).toFixed(1)}k`
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Portfolio Performance</CardTitle>
          <div className="flex space-x-2">
            {Object.keys(performanceData).map((period) => (
              <Button
                key={period}
                variant={timeframe === period ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeframe(period as keyof typeof performanceData)}
              >
                {period}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={performanceData[timeframe]}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="time" className="text-xs fill-muted-foreground" />
              <YAxis tickFormatter={formatValue} className="text-xs fill-muted-foreground" />
              <Tooltip
                formatter={(value: number) => [`$${value.toLocaleString()}`, "Portfolio Value"]}
                labelClassName="text-foreground"
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: "hsl(var(--chart-1))" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
