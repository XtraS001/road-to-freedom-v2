"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  TrendingUp,
  Bookmark,
  PlusCircle,
  Menu,
  X,
} from "lucide-react";
import ModeToggle from "./ModeToggle";
import { useAuthGuard } from "@/lib/auth/use-auth";
import { UserNav } from "./user-nav";
import AdminNav from "./admin-nav";

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuthGuard({ middleware: "guest" });

  const navItems = [
    { href: "/", label: "Trade", icon: PlusCircle },
    { href: "/portfolio", label: "Portfolio", icon: BarChart3 },
    { href: "/watchlist", label: "Watchlist", icon: Bookmark },
    { href: "/performance", label: "Performance", icon: TrendingUp },
  ];

  return (
    <nav className="bg-card border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold text-primary">
              StockTrader
            </Link>

            {user && (
              <div className="hidden md:flex space-x-6">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center space-x-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <ModeToggle />

            {/* Added from navbar.tsx */}
            <AdminNav />
            {user && <UserNav />}
            {user?.authorities.includes("ROLE_PREVIOUS_ADMINISTRATOR") && (
              <a href={"/api/auth/impersonate/exit"}>
                <Button>Exit switch</Button>
              </a>
            )}

            {!user && (
              <Link href={"/auth/login"}>
                <Button variant={"outline"}>Login</Button>
              </Link>
            )}
            {/* <Button variant="outline" size="sm">
              Account
            </Button> */}
          </div>

          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-2 px-2 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
