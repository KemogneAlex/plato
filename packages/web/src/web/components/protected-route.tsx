import { Redirect } from "wouter";
import { authClient } from "../lib/auth";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--color-gray-light)" }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-t-transparent rounded-full animate-spin" style={{ borderColor: "var(--color-primary)", borderTopColor: "transparent" }} />
          <p className="text-sm" style={{ color: "var(--color-gray)", fontFamily: "var(--font-body)" }}>Chargement...</p>
        </div>
      </div>
    );
  }

  if (!session) return <Redirect to="/login" />;

  return <>{children}</>;
}
