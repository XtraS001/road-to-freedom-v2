import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, DollarSign, Activity } from "lucide-react"

export function StatsCards() {
  const stats = [
    {
      title: "Portfolio Value",
      value: "$125,430.50",
      change: "+2.4%",
      changeType: "positive" as const,
      icon: DollarSign,
    },
    {
      title: "Day P&L",
      value: "+$2,840.20",
      change: "+1.8%",
      changeType: "positive" as const,
      icon: TrendingUp,
    },
    {
      title: "Total P&L",
      value: "+$15,430.50",
      change: "+14.1%",
      changeType: "positive" as const,
      icon: Activity,
    },
    {
      title: "Buying Power",
      value: "$45,230.00",
      change: "Available",
      changeType: "neutral" as const,
      icon: DollarSign,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p
              className={`text-xs ${
                stat.changeType === "positive"
                  ? "text-green-600"
                  : stat.changeType === "negative"
                    ? "text-red-600"
                    : "text-muted-foreground"
              }`}
            >
              {stat.change}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
