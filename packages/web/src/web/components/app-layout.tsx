import { Link, useLocation } from "wouter";
import { authClient, clearToken } from "../lib/auth";
import {
  LayoutDashboard, Globe, Settings, LogOut, ChefHat, Plus, Menu, X
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Mes sites" },
  { href: "/templates", icon: Globe, label: "Templates" },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = authClient.useSession();
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await authClient.signOut();
    clearToken();
    window.location.href = "/";
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-5 border-b border-white/10">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--color-primary)" }}>
          <ChefHat size={18} color="white" />
        </div>
        <span className="text-white font-bold text-lg" style={{ fontFamily: "var(--font-display)" }}>Plato</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = location.startsWith(href);
          return (
            <Link key={href} to={href}>
              <a
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150"
                style={{
                  color: active ? "var(--color-primary)" : "rgba(255,255,255,0.65)",
                  background: active ? "rgba(255,107,53,0.15)" : "transparent",
                  borderLeft: active ? "2px solid var(--color-primary)" : "2px solid transparent",
                  fontFamily: "var(--font-body)",
                }}
                onClick={() => setMobileOpen(false)}
              >
                <Icon size={18} />
                {label}
              </a>
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="px-3 py-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold" style={{ background: "var(--color-primary)" }}>
            {session?.user?.name?.charAt(0).toUpperCase() ?? "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate" style={{ fontFamily: "var(--font-body)" }}>{session?.user?.name}</p>
            <p className="text-xs truncate" style={{ color: "rgba(255,255,255,0.45)", fontFamily: "var(--font-body)" }}>{session?.user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm transition-all"
          style={{ color: "rgba(255,255,255,0.55)", fontFamily: "var(--font-body)" }}
          onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
        >
          <LogOut size={16} />
          Déconnexion
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--color-gray-light)" }}>
      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex flex-col w-60 shrink-0"
        style={{ background: "var(--color-dark-2)", boxShadow: "2px 0 12px rgba(0,0,0,0.15)" }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-60 flex flex-col" style={{ background: "var(--color-dark-2)" }}>
            <button className="absolute top-4 right-4 text-white/70" onClick={() => setMobileOpen(false)}>
              <X size={20} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile topbar */}
        <header className="md:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-200">
          <button onClick={() => setMobileOpen(true)} style={{ color: "var(--color-dark)" }}>
            <Menu size={22} />
          </button>
          <span className="font-bold text-lg" style={{ fontFamily: "var(--font-display)", color: "var(--color-dark)" }}>Plato</span>
        </header>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
