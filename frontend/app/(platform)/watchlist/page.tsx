import { WatchlistTabs } from "./components/watchlist-tabs";
import { Navigation } from "@/components/navigation";

export default function WatchlistPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Watchlists
          </h1>
          <p className="text-muted-foreground">
            Monitor stocks and track market movements
          </p>
        </div>

        <WatchlistTabs />
      </main>
    </div>
  );
}
