import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, DollarSign, Percent, Calendar } from "lucide-react"

export function PortfolioOverview() {
  const portfolioStats = [
    {
      title: "Total Value",
      value: "$125,430.50",
      change: "+$3,240.20",
      changePercent: "+2.65%",
      changeType: "positive" as const,
      icon: DollarSign,
    },
    {
      title: "Day P&L",
      value: "+$2,840.20",
      change: "Today",
      changePercent: "+2.31%",
      changeType: "positive" as const,
      icon: TrendingUp,
    },
    {
      title: "Total Return",
      value: "+$25,430.50",
      change: "All Time",
      changePercent: "+25.43%",
      changeType: "positive" as const,
      icon: Percent,
    },
    {
      title: "Annual Return",
      value: "+18.7%",
      change: "This Year",
      changePercent: "vs S&P: +12.4%",
      changeType: "positive" as const,
      icon: Calendar,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {portfolioStats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="flex items-center space-x-2 text-xs">
              <span
                className={`${
                  stat.changeType === "positive"
                    ? "text-green-600"
                    : stat.changeType === "negative"
                      ? "text-red-600"
                      : "text-muted-foreground"
                }`}
              >
                {stat.changePercent}
              </span>
              <span className="text-muted-foreground">{stat.change}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
