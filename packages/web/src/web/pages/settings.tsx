import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import {
  Globe, Link2, Trash2, Download, CheckCircle, AlertTriangle,
  Copy, ExternalLink, ToggleLeft, ToggleRight, ArrowLeft, Save
} from "lucide-react";

export default function SettingsPage() {
  const [, params] = useRoute("/settings/:id");
  const [, navigate] = useLocation();
  const id = params?.id ?? "";
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["site", id],
    queryFn: async () => {
      const res = await api.sites[":id"].$get({ param: { id } });
      return res.json();
    },
    enabled: !!id,
  });

  const site = (data as any)?.site;

  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (site) {
      setName(site.name ?? "");
      setDomain(site.customDomain ?? "");
    }
  }, [site]);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const updateSite = useMutation({
    mutationFn: async () => {
      const res = await api.sites[":id"].$put({
        param: { id },
        json: { name, customDomain: domain || null },
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sites"] });
      queryClient.invalidateQueries({ queryKey: ["site", id] });
      showToast("Paramètres sauvegardés !");
    },
    onError: () => showToast("Erreur lors de la sauvegarde", "error"),
  });

  const togglePublish = useMutation({
    mutationFn: async (action: "publish" | "unpublish") => {
      const res = await (api.sites[":id"] as any)[action].$post({ param: { id } });
      return res.json();
    },
    onSuccess: (_, action) => {
      queryClient.invalidateQueries({ queryKey: ["sites"] });
      queryClient.invalidateQueries({ queryKey: ["site", id] });
      showToast(action === "publish" ? "Site publié !" : "Site dépublié");
    },
    onError: () => showToast("Erreur", "error"),
  });

  const deleteSite = useMutation({
    mutationFn: async () => {
      const res = await api.sites[":id"].$delete({ param: { id } });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sites"] });
      navigate("/dashboard");
    },
    onError: () => showToast("Erreur lors de la suppression", "error"),
  });

  const copySlug = () => {
    navigator.clipboard.writeText(`plato.site/${site?.slug}`);
    showToast("URL copiée !");
  };

  const isPublished = site?.status === "published";

  if (isLoading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
        <div style={{ width: 36, height: 36, border: "3px solid var(--color-primary)", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ padding: "32px", maxWidth: 640, margin: "0 auto", fontFamily: "var(--font-body)" }}>
      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", top: 20, right: 20, zIndex: 9999, display: "flex", alignItems: "center", gap: 8,
          padding: "12px 18px", borderRadius: 12, background: toast.type === "success" ? "#10B981" : "#EF4444",
          color: "white", fontSize: 13, fontWeight: 600, boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
          animation: "slideIn 0.2s ease",
        }}>
          {toast.type === "success" ? <CheckCircle size={15} /> : <AlertTriangle size={15} />}
          {toast.msg}
        </div>
      )}

      {/* Back */}
      <button onClick={() => navigate("/dashboard")} style={{ display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 24, background: "none", border: "none", cursor: "pointer", color: "var(--color-gray)", fontSize: 13, padding: 0 }}>
        <ArrowLeft size={14} /> Tableau de bord
      </button>

      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 24, color: "var(--color-dark)", marginBottom: 4 }}>
        Paramètres
      </h1>
      <p style={{ color: "var(--color-gray)", fontSize: 14, marginBottom: 32 }}>{site?.name}</p>

      {/* Section: Informations */}
      <section style={{ background: "white", borderRadius: 16, padding: "24px", marginBottom: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 16, color: "var(--color-dark)", marginBottom: 18 }}>Informations générales</h2>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--color-gray)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Nom du site</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #E5E7EB", fontSize: 14, color: "var(--color-dark)", outline: "none", boxSizing: "border-box" }}
            onFocus={e => { e.currentTarget.style.borderColor = "var(--color-primary)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(255,107,53,0.1)"; }}
            onBlur={e => { e.currentTarget.style.borderColor = "#E5E7EB"; e.currentTarget.style.boxShadow = "none"; }}
          />
        </div>

        {/* URL Plato */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--color-gray)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>URL Plato</label>
          <div style={{ display: "flex", alignItems: "center", gap: 0, border: "1.5px solid #E5E7EB", borderRadius: 10, overflow: "hidden" }}>
            <span style={{ padding: "10px 12px", background: "#F9FAFB", color: "var(--color-gray)", fontSize: 13, borderRight: "1px solid #E5E7EB", whiteSpace: "nowrap" }}>plato.site/</span>
            <span style={{ flex: 1, padding: "10px 12px", fontSize: 14, color: "var(--color-dark)" }}>{site?.slug}</span>
            <button onClick={copySlug} style={{ padding: "10px 12px", background: "none", border: "none", cursor: "pointer", color: "var(--color-gray)", display: "flex", alignItems: "center" }} title="Copier">
              <Copy size={14} />
            </button>
          </div>
        </div>

        <button
          onClick={() => updateSite.mutate()}
          disabled={updateSite.isPending}
          style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 10, background: "var(--color-primary)", color: "white", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600 }}
        >
          <Save size={14} /> {updateSite.isPending ? "Sauvegarde..." : "Sauvegarder"}
        </button>
      </section>

      {/* Section: Domaine custom */}
      <section style={{ background: "white", borderRadius: 16, padding: "24px", marginBottom: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <Globe size={16} color="var(--color-primary)" />
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 16, color: "var(--color-dark)" }}>Domaine personnalisé</h2>
        </div>
        <p style={{ fontSize: 13, color: "var(--color-gray)", marginBottom: 16 }}>Connectez votre propre domaine à ce site</p>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--color-gray)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Domaine</label>
          <input
            type="text"
            value={domain}
            onChange={e => setDomain(e.target.value)}
            placeholder="www.monrestaurant.fr"
            style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #E5E7EB", fontSize: 14, color: "var(--color-dark)", outline: "none", boxSizing: "border-box" }}
            onFocus={e => { e.currentTarget.style.borderColor = "var(--color-primary)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(255,107,53,0.1)"; }}
            onBlur={e => { e.currentTarget.style.borderColor = "#E5E7EB"; e.currentTarget.style.boxShadow = "none"; }}
          />
        </div>

        {domain && (
          <div style={{ padding: "10px 14px", borderRadius: 10, background: "#FFF7ED", border: "1px solid #FED7AA", marginBottom: 16 }}>
            <p style={{ fontSize: 12, color: "#92400E", lineHeight: 1.6 }}>
              <strong>DNS à configurer:</strong> Ajoutez un enregistrement CNAME pointant vers <code style={{ background: "rgba(0,0,0,0.06)", padding: "1px 5px", borderRadius: 4 }}>sites.plato.io</code> dans votre gestionnaire DNS.
            </p>
          </div>
        )}

        <button
          onClick={() => updateSite.mutate()}
          disabled={updateSite.isPending}
          style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 10, background: "var(--color-primary)", color: "white", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600 }}
        >
          <Link2 size={14} /> Associer le domaine
        </button>
      </section>

      {/* Section: Publication */}
      <section style={{ background: "white", borderRadius: 16, padding: "24px", marginBottom: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 16, color: "var(--color-dark)", marginBottom: 6 }}>Publication</h2>
        <p style={{ fontSize: 13, color: "var(--color-gray)", marginBottom: 20 }}>Contrôlez la visibilité publique de votre site</p>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px", borderRadius: 12, background: "#F9FAFB", border: "1px solid #E5E7EB", marginBottom: 16 }}>
          <div>
            <p style={{ fontWeight: 600, fontSize: 14, color: "var(--color-dark)", marginBottom: 2 }}>
              Statut: <span style={{ color: isPublished ? "var(--color-success)" : "var(--color-gray)" }}>{isPublished ? "Publié ✅" : "Brouillon"}</span>
            </p>
            <p style={{ fontSize: 12, color: "var(--color-gray)" }}>
              {isPublished ? `Accessible sur plato.site/${site?.slug}` : "Visible uniquement par vous"}
            </p>
          </div>
          <button
            onClick={() => togglePublish.mutate(isPublished ? "unpublish" : "publish")}
            disabled={togglePublish.isPending}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, background: isPublished ? "#FEE2E2" : "var(--color-primary)", color: isPublished ? "var(--color-danger)" : "white", transition: "all 0.2s" }}
          >
            {isPublished ? <><ToggleRight size={15} /> Dépublier</> : <><ToggleLeft size={15} /> Publier</>}
          </button>
        </div>

        {isPublished && (
          <a href={`https://plato.site/${site?.slug}`} target="_blank" rel="noopener noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--color-primary)", textDecoration: "none", fontWeight: 500 }}>
            <ExternalLink size={13} /> Voir le site en ligne
          </a>
        )}
      </section>

      {/* Section: Export */}
      <section style={{ background: "white", borderRadius: 16, padding: "24px", marginBottom: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 16, color: "var(--color-dark)", marginBottom: 6 }}>Export</h2>
        <p style={{ fontSize: 13, color: "var(--color-gray)", marginBottom: 16 }}>Téléchargez le code source de votre site</p>

        <button
          onClick={() => showToast("Export HTML disponible prochainement")}
          style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 10, background: "#F3F4F6", color: "var(--color-dark)", border: "1.5px solid #E5E7EB", cursor: "pointer", fontSize: 13, fontWeight: 600, transition: "all 0.15s" }}
          onMouseEnter={e => e.currentTarget.style.background = "#E5E7EB"}
          onMouseLeave={e => e.currentTarget.style.background = "#F3F4F6"}
        >
          <Download size={14} /> Exporter en HTML
        </button>
      </section>

      {/* Danger zone */}
      <section style={{ background: "white", borderRadius: 16, padding: "24px", border: "1px solid #FECACA", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <AlertTriangle size={15} color="var(--color-danger)" />
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 16, color: "var(--color-danger)" }}>Zone de danger</h2>
        </div>
        <p style={{ fontSize: 13, color: "var(--color-gray)", marginBottom: 16 }}>La suppression est irréversible. Tout le contenu sera perdu.</p>

        {!confirmDelete ? (
          <button
            onClick={() => setConfirmDelete(true)}
            style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 10, background: "#FEE2E2", color: "var(--color-danger)", border: "1.5px solid #FECACA", cursor: "pointer", fontSize: 13, fontWeight: 600 }}
          >
            <Trash2 size={14} /> Supprimer ce site
          </button>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", borderRadius: 12, background: "#FEF2F2", border: "1px solid #FECACA" }}>
            <p style={{ fontSize: 13, color: "var(--color-danger)", flex: 1, fontWeight: 500 }}>Êtes-vous sûr ? Cette action est irréversible.</p>
            <button onClick={() => setConfirmDelete(false)} style={{ padding: "7px 14px", borderRadius: 8, background: "white", border: "1.5px solid #E5E7EB", cursor: "pointer", fontSize: 12, fontWeight: 500, color: "var(--color-gray)" }}>
              Annuler
            </button>
            <button
              onClick={() => deleteSite.mutate()}
              disabled={deleteSite.isPending}
              style={{ padding: "7px 14px", borderRadius: 8, background: "var(--color-danger)", color: "white", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700 }}
            >
              {deleteSite.isPending ? "..." : "Supprimer"}
            </button>
          </div>
        )}
      </section>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes slideIn { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
      `}</style>
    </div>
  );
}
