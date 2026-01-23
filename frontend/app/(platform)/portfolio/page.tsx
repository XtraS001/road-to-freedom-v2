import { PortfolioOverview } from "@/app/(platform)/portfolio/components/portfolio-overview";
import { HoldingsTable } from "@/app/(platform)/portfolio/components/holdings-table";
import { PerformanceChart } from "@/components/performance-chart";
import { Navigation } from "@/components/navigation";
// import { TradeDialog } from "@/app/(platform)/portfolio/components/trade-dialog";
import { AddCashDialog } from "@/components/add-cash-dialog";
import { TradeDialog } from "@/app/(platform)/portfolio/components/trade-dialog2";

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Portfolio
              </h1>
              <p className="text-muted-foreground">
                Monitor your investments and track performance
              </p>
            </div>
            <div className="flex gap-3">
              <AddCashDialog />
              <TradeDialog />
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <PortfolioOverview />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <PerformanceChart />
            </div>
            <div className="space-y-6">
              <div className="bg-card border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Asset Allocation</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Stocks</span>
                    <span className="text-sm font-medium">85.2%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-chart-1 h-2 rounded-full"
                      style={{ width: "85.2%" }}
                    ></div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Cash</span>
                    <span className="text-sm font-medium">14.8%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-chart-2 h-2 rounded-full"
                      style={{ width: "14.8%" }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="bg-card border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Top Performers</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">NVDA</span>
                    <span className="text-sm text-green-600">+12.4%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">AAPL</span>
                    <span className="text-sm text-green-600">+8.7%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">MSFT</span>
                    <span className="text-sm text-green-600">+6.2%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <HoldingsTable />
        </div>
      </main>
    </div>
  );
}
