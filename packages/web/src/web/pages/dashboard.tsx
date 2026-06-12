import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import { authClient } from "../lib/auth";
import { Plus, Globe, Edit3, Trash2, ExternalLink, MoreVertical, Clock, CheckCircle, Search } from "lucide-react";
import { NewSiteModal } from "../components/new-site-modal";

type Site = {
  id: string;
  name: string;
  slug: string;
  status: "draft" | "published";
  customDomain: string | null;
  createdAt: number;
  updatedAt: number;
};

type Template = { id: string; name: string; thumbnail: string | null; isPro: boolean; category: string };

function SiteCard({ site, onDelete, onPublish }: { site: Site; onDelete: (id: string) => void; onPublish: (id: string, status: "published" | "draft") => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const isPublished = site.status === "published";

  return (
    <div className="rounded-2xl overflow-hidden transition-all duration-200 relative bg-white"
      style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.07)"; e.currentTarget.style.transform = "none"; }}
    >
      {/* Thumbnail */}
      <div className="h-36 flex items-center justify-center relative" style={{ background: "linear-gradient(135deg, #FF6B35 0%, #E85520 100%)" }}>
        <Globe size={32} color="rgba(255,255,255,0.4)" />
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
            style={{
              background: isPublished ? "rgba(16,185,129,0.2)" : "rgba(255,255,255,0.2)",
              color: isPublished ? "#10B981" : "rgba(255,255,255,0.9)",
              backdropFilter: "blur(8px)",
            }}>
            {isPublished ? <CheckCircle size={10} /> : <Clock size={10} />}
            {isPublished ? "Publié" : "Brouillon"}
          </span>
        </div>
        {/* Menu */}
        <div className="absolute top-3 right-3">
          <button onClick={() => setMenuOpen(!menuOpen)} className="w-7 h-7 rounded-full flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.2)", color: "white" }}>
            <MoreVertical size={14} />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-8 w-44 rounded-xl overflow-hidden bg-white z-10" style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.15)" }}>
              <button onClick={() => { onPublish(site.id, isPublished ? "draft" : "published"); setMenuOpen(false); }}
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors" style={{ color: "var(--color-dark)" }}>
                {isPublished ? "Dépublier" : "Publier"}
              </button>
              <button onClick={() => { onDelete(site.id); setMenuOpen(false); }}
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-red-50 transition-colors" style={{ color: "var(--color-danger)" }}>
                Supprimer
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold mb-1 truncate" style={{ fontFamily: "var(--font-display)", color: "var(--color-dark)" }}>{site.name}</h3>
        <p className="text-xs mb-4 truncate" style={{ color: "var(--color-gray)" }}>
          plato.site/{site.slug}
        </p>
        <div className="flex gap-2">
          <a href={`/editor/${site.id}`} target="_blank" rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all"
            style={{ background: "var(--color-primary)", color: "white", textDecoration: "none" }}
            onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.background = "var(--color-primary-dark)"}
            onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.background = "var(--color-primary)"}>
            <Edit3 size={12} /> Éditer
          </a>
          <Link to={`/preview/${site.id}`}>
            <a className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all"
              style={{ background: "var(--color-gray-light)", color: "var(--color-dark)" }}
              onMouseEnter={e => e.currentTarget.style.background = "#E5E7EB"}
              onMouseLeave={e => e.currentTarget.style.background = "var(--color-gray-light)"}>
              <ExternalLink size={12} />
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { data: session } = authClient.useSession();
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["sites"],
    queryFn: async () => {
      const res = await api.sites.$get();
      return res.json();
    },
  });

  const deleteSite = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.sites[":id"].$delete({ param: { id } });
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["sites"] }),
  });

  const togglePublish = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "published" | "draft" }) => {
      if (status === "published") {
        const res = await (api.sites[":id"] as any).publish.$post({ param: { id } });
        return res.json();
      } else {
        const res = await (api.sites[":id"] as any).unpublish.$post({ param: { id } });
        return res.json();
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["sites"] }),
  });

  const sites: Site[] = (data as any)?.sites ?? [];
  const filtered = sites.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));
  const published = sites.filter(s => s.status === "published").length;

  return (
    <div className="p-6 md:p-8" style={{ fontFamily: "var(--font-body)" }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--color-dark)" }}>
            Bonjour, {session?.user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--color-gray)" }}>
            {sites.length} site{sites.length !== 1 ? "s" : ""} · {published} publié{published !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all self-start sm:self-auto"
          style={{ background: "var(--color-primary)", color: "white" }}
          onMouseEnter={e => { e.currentTarget.style.background = "var(--color-primary-dark)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "var(--color-primary)"; e.currentTarget.style.transform = "none"; }}
        >
          <Plus size={16} /> Nouveau site
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Sites totaux", value: sites.length, color: "var(--color-primary)" },
          { label: "Publiés", value: published, color: "var(--color-success)" },
          { label: "Brouillons", value: sites.length - published, color: "var(--color-warning)" },
          { label: "Vues ce mois", value: "—", color: "var(--color-dark)" },
        ].map((stat, i) => (
          <div key={i} className="p-4 rounded-xl bg-white" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
            <p className="text-xs font-medium mb-1" style={{ color: "var(--color-gray)" }}>{stat.label}</p>
            <p className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: stat.color }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      {sites.length > 0 && (
        <div className="relative mb-6 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--color-gray)" }} />
          <input
            type="text"
            placeholder="Rechercher un site..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none"
            style={{ border: "1.5px solid #E5E7EB", color: "var(--color-dark)", background: "white" }}
            onFocus={e => { e.currentTarget.style.borderColor = "var(--color-primary)"; }}
            onBlur={e => { e.currentTarget.style.borderColor = "#E5E7EB"; }}
          />
        </div>
      )}

      {/* Sites grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[1, 2, 3].map(i => (
            <div key={i} className="rounded-2xl overflow-hidden animate-pulse bg-white" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
              <div className="h-36" style={{ background: "#E5E7EB" }} />
              <div className="p-4 space-y-2">
                <div className="h-4 rounded" style={{ background: "#E5E7EB", width: "70%" }} />
                <div className="h-3 rounded" style={{ background: "#E5E7EB", width: "50%" }} />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map(site => (
            <SiteCard
              key={site.id}
              site={site}
              onDelete={(id) => deleteSite.mutate(id)}
              onPublish={(id, status) => togglePublish.mutate({ id, status })}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="text-6xl mb-4">🍽️</div>
          <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: "var(--font-display)", color: "var(--color-dark)" }}>
            {search ? "Aucun résultat" : "Aucun site pour le moment"}
          </h3>
          <p className="text-sm mb-6" style={{ color: "var(--color-gray)" }}>
            {search ? "Essayez un autre mot-clé" : "Créez votre premier site restaurant en quelques minutes"}
          </p>
          {!search && (
            <button onClick={() => setShowModal(true)} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm"
              style={{ background: "var(--color-primary)", color: "white" }}>
              <Plus size={16} /> Créer mon premier site
            </button>
          )}
        </div>
      )}

      {showModal && <NewSiteModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
