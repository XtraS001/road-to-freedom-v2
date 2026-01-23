import ClientAuthGuard from "../../lib/auth/clientAuthGuard";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return <ClientAuthGuard>{children}</ClientAuthGuard>;
}
