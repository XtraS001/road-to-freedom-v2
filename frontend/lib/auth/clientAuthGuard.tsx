"use client";

import Loading from "@/components/loading";
import { useAuthGuard } from "@/lib/auth/use-auth";



export default function ClientAuthGuard({ children }: { children: React.ReactNode }) {
  const { user } = useAuthGuard({
    middleware: "auth",
  });

  if (!user) return <Loading />;

  return <>{children}</>;
}
