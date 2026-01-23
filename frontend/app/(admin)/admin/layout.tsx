"use client";

import Loading from "@/components/loading";
import Navbar from "@/components/navbar";
import PermissionGuard from "@/components/permission-guard";
import RoleGuard from "@/components/role-guard";
import { useAuthGuard } from "@/lib/auth/use-auth";
import { Role } from "@/models/user/UserResponse";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuthGuard({ middleware: "auth" });

  if (!user) return <Loading />;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center px-4 w-full max-w-(--breakpoint-xl) mx-auto">
          <div className="md:hidden mr-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="pr-0">
                <Navbar className="w-full" orientation="vertical" />
              </SheetContent>
            </Sheet>
          </div>
          <Navbar className="w-full hidden md:flex" />
          <div className="md:hidden flex-1">
            {/* Spacer or mobile logo if needed */}
          </div>
          <Navbar className="w-full md:hidden" orientation="horizontal" />
        </div>
      </header>
      <main className="flex-1 container py-6 px-4 w-full max-w-(--breakpoint-xl) mx-auto">
        <PermissionGuard rolesAllowed={[Role.ADMIN]}></PermissionGuard>
        <RoleGuard rolesAllowed={[Role.ADMIN]}>{children}</RoleGuard>
      </main>
    </div>
  );
}
