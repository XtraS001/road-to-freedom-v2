import { TradeEntryForm } from "@/components/trade-entry-form";
import { Navigation } from "@/components/navigation";
import { StatsCards } from "@/components/stats-cards";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Stock Trading Platform
          </h1>
          <p className="text-muted-foreground">
            Monitor your portfolio and execute trades with confidence
          </p>
        </div>

        <StatsCards />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2">
            <TradeEntryForm />

          </div>
          <div className="space-y-6">
            <div className="bg-card border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Market Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Market</span>
                  <span className="text-sm font-medium text-green-600">
                    Open
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Next Close
                  </span>
                  <span className="text-sm font-medium">4:00 PM EST</span>
                </div>
              </div>
            </div>

            <div className="bg-card border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="text-sm text-muted-foreground">
                  No recent trades
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
