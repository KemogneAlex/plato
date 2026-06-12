import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";

type Template = { id: string; name: string; thumbnail: string | null; isPro: boolean; category: string };

export function NewSiteModal({
  onClose,
  defaultTemplateId = null,
}: {
  onClose: () => void;
  defaultTemplateId?: string | null;
}) {
  const [name, setName] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(defaultTemplateId);
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();

  const { data: tplData } = useQuery({
    queryKey: ["templates"],
    queryFn: async () => {
      const res = await api.templates.$get();
      return res.json();
    },
  });
  const templates: Template[] = (tplData as any)?.templates ?? [];

  const createSite = useMutation({
    mutationFn: async () => {
      const res = await api.sites.$post({ json: { name, templateId: selectedTemplate ?? undefined } });
      return res.json();
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["sites"] });
      onClose();
      if (data?.site?.id) {
        window.open(`/editor/${data.site.id}`, "_blank");
      }
    },
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(2px)" }}
      onClick={onClose}
    >
      <div
        className="w-full rounded-2xl bg-white"
        style={{ maxWidth: 600, maxHeight: "90vh", overflow: "hidden", display: "flex", flexDirection: "column" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ padding: "24px 24px 16px", borderBottom: "1px solid #F0F0F0" }}>
          <h2 style={{ fontFamily: "var(--font-display)", color: "var(--color-dark)", fontSize: 20, fontWeight: 700, marginBottom: 4 }}>
            Nouveau site
          </h2>
          <p style={{ fontSize: 13, color: "var(--color-gray)" }}>
            Choisissez un template et donnez un nom à votre site
          </p>
        </div>

        <div style={{ overflowY: "auto", flex: 1, padding: "20px 24px" }}>
          {/* Name */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--color-dark)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Nom du site
            </label>
            <input
              autoFocus
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ex: Brasserie du Port"
              style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #E5E7EB", fontSize: 14, color: "var(--color-dark)", outline: "none", boxSizing: "border-box" }}
              onFocus={e => { e.currentTarget.style.borderColor = "var(--color-primary)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(255,107,53,0.12)"; }}
              onBlur={e => { e.currentTarget.style.borderColor = "#E5E7EB"; e.currentTarget.style.boxShadow = "none"; }}
              onKeyDown={e => { if (e.key === "Enter" && name.trim()) createSite.mutate(); }}
            />
          </div>

          {/* Templates */}
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--color-dark)", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Template de départ
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              {/* Blank */}
              <button
                onClick={() => setSelectedTemplate(null)}
                style={{ border: selectedTemplate === null ? "2px solid var(--color-primary)" : "2px solid #E5E7EB", borderRadius: 10, overflow: "hidden", cursor: "pointer", background: "white", transition: "all 0.15s", padding: 0 }}
              >
                <div style={{ height: 72, display: "flex", alignItems: "center", justifyContent: "center", background: "#F9FAFB", borderBottom: "1px solid #E5E7EB" }}>
                  <span style={{ fontSize: 24 }}>✨</span>
                </div>
                <div style={{ padding: "8px 10px", textAlign: "left" }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: "var(--color-dark)" }}>Vide</p>
                  <p style={{ fontSize: 11, color: "var(--color-gray)" }}>Partir de zéro</p>
                </div>
              </button>

              {templates.map(t => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTemplate(t.id)}
                  style={{ border: selectedTemplate === t.id ? "2px solid var(--color-primary)" : "2px solid #E5E7EB", borderRadius: 10, overflow: "hidden", cursor: "pointer", background: "white", transition: "all 0.15s", padding: 0, position: "relative" }}
                >
                  {t.thumbnail ? (
                    <div style={{ height: 72, overflow: "hidden", position: "relative" }}>
                      <img src={t.thumbnail} alt={t.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      {t.isPro && (
                        <span style={{ position: "absolute", top: 4, right: 4, background: "var(--color-primary)", color: "white", fontSize: 9, fontWeight: 800, padding: "2px 5px", borderRadius: 4, textTransform: "uppercase" }}>Pro</span>
                      )}
                    </div>
                  ) : (
                    <div style={{ height: 72, display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg,#FF6B35,#E85520)", borderBottom: "1px solid #E5E7EB", position: "relative" }}>
                      <span style={{ fontSize: 22 }}>🍽️</span>
                      {t.isPro && (
                        <span style={{ position: "absolute", top: 4, right: 4, background: "var(--color-primary)", color: "white", fontSize: 9, fontWeight: 800, padding: "2px 5px", borderRadius: 4, textTransform: "uppercase" }}>Pro</span>
                      )}
                    </div>
                  )}
                  <div style={{ padding: "8px 10px", textAlign: "left" }}>
                    <p style={{ fontSize: 12, fontWeight: 700, color: "var(--color-dark)" }}>{t.name}</p>
                    <p style={{ fontSize: 11, color: "var(--color-gray)", textTransform: "capitalize" }}>{t.category}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: "16px 24px", borderTop: "1px solid #F0F0F0", display: "flex", gap: 10 }}>
          <button
            onClick={onClose}
            style={{ flex: 1, padding: "10px", borderRadius: 10, border: "1.5px solid #E5E7EB", background: "white", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "var(--color-gray)" }}
          >
            Annuler
          </button>
          <button
            onClick={() => createSite.mutate()}
            disabled={!name.trim() || createSite.isPending}
            style={{ flex: 2, padding: "10px", borderRadius: 10, background: "var(--color-primary)", color: "white", border: "none", cursor: !name.trim() ? "not-allowed" : "pointer", fontSize: 13, fontWeight: 700, opacity: (!name.trim() || createSite.isPending) ? 0.6 : 1, transition: "opacity 0.15s" }}
          >
            {createSite.isPending ? "Création en cours..." : "Créer et ouvrir l'éditeur →"}
          </button>
        </div>
      </div>
    </div>
  );
}
