import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { NewSiteModal } from "../components/new-site-modal";
import { Sparkles, Star } from "lucide-react";

type Template = {
  id: string;
  name: string;
  thumbnail: string | null;
  isPro: boolean;
  category: string;
  description?: string;
};

const CATEGORY_LABELS: Record<string, string> = {
  all: "Tous",
  restaurant: "Restaurant",
  bistro: "Bistro",
  cafe: "Café",
  gastronomic: "Gastronomie",
  pizzeria: "Pizzeria",
  brasserie: "Brasserie",
};

export default function TemplatesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [modalTemplateId, setModalTemplateId] = useState<string | null | undefined>(undefined);
  // undefined = modal closed, null = blank template, string = template id

  const { data: tplData, isLoading } = useQuery({
    queryKey: ["templates"],
    queryFn: async () => {
      const res = await api.templates.$get();
      return res.json();
    },
  });

  const templates: Template[] = (tplData as any)?.templates ?? [];

  // Build category list from actual data
  const categories = ["all", ...Array.from(new Set(templates.map(t => t.category)))];

  const filtered =
    selectedCategory === "all"
      ? templates
      : templates.filter(t => t.category === selectedCategory);

  return (
    <div style={{ minHeight: "100vh", background: "#FAFAFA", padding: "32px 40px" }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "linear-gradient(135deg, #FF6B35 0%, #E85520 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Sparkles size={18} color="white" />
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 26,
              fontWeight: 800,
              color: "var(--color-dark)",
              margin: 0,
            }}
          >
            Templates
          </h1>
        </div>
        <p style={{ fontSize: 14, color: "var(--color-gray)", margin: 0, paddingLeft: 46 }}>
          Choisissez un point de départ et personnalisez à votre image.
        </p>
      </div>

      {/* Category filters */}
      {!isLoading && categories.length > 1 && (
        <div style={{ display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap" }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: "6px 16px",
                borderRadius: 20,
                border: selectedCategory === cat ? "none" : "1.5px solid #E5E7EB",
                background: selectedCategory === cat ? "var(--color-primary)" : "white",
                color: selectedCategory === cat ? "white" : "var(--color-dark)",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {CATEGORY_LABELS[cat] ?? cat}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      {isLoading ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 20,
          }}
        >
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              style={{
                borderRadius: 16,
                overflow: "hidden",
                background: "white",
                boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                animation: "pulse 1.5s ease-in-out infinite",
              }}
            >
              <div style={{ height: 180, background: "#F0F0F0" }} />
              <div style={{ padding: 16 }}>
                <div style={{ height: 14, background: "#F0F0F0", borderRadius: 6, marginBottom: 8, width: "60%" }} />
                <div style={{ height: 12, background: "#F0F0F0", borderRadius: 6, width: "40%" }} />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 0", color: "var(--color-gray)" }}>
          <p style={{ fontSize: 15 }}>Aucun template dans cette catégorie.</p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 20,
          }}
        >
          {/* Blank card */}
          {selectedCategory === "all" && (
            <button
              onClick={() => setModalTemplateId(null)}
              style={{
                borderRadius: 16,
                overflow: "hidden",
                background: "white",
                boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                border: "2px dashed #E5E7EB",
                cursor: "pointer",
                transition: "all 0.2s",
                display: "flex",
                flexDirection: "column",
                textAlign: "left",
                padding: 0,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = "var(--color-primary)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(255,107,53,0.12)";
                e.currentTarget.style.transform = "translateY(-3px)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "#E5E7EB";
                e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.06)";
                e.currentTarget.style.transform = "none";
              }}
            >
              <div
                style={{
                  height: 180,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#F9FAFB",
                  width: "100%",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <span style={{ fontSize: 36 }}>✨</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--color-gray)" }}>
                  Site vide
                </span>
              </div>
              <div style={{ padding: "14px 16px" }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: "var(--color-dark)", margin: 0, marginBottom: 4 }}>
                  Partir de zéro
                </p>
                <p style={{ fontSize: 12, color: "var(--color-gray)", margin: 0 }}>
                  Canvas vide, liberté totale
                </p>
              </div>
            </button>
          )}

          {filtered.map(t => (
            <button
              key={t.id}
              onClick={() => setModalTemplateId(t.id)}
              style={{
                borderRadius: 16,
                overflow: "hidden",
                background: "white",
                boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                border: "2px solid transparent",
                cursor: "pointer",
                transition: "all 0.2s",
                display: "flex",
                flexDirection: "column",
                textAlign: "left",
                padding: 0,
                position: "relative",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = "var(--color-primary)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(255,107,53,0.12)";
                e.currentTarget.style.transform = "translateY(-3px)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "transparent";
                e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.06)";
                e.currentTarget.style.transform = "none";
              }}
            >
              {/* Thumbnail */}
              <div style={{ height: 180, overflow: "hidden", position: "relative", width: "100%" }}>
                {t.thumbnail ? (
                  <img
                    src={t.thumbnail}
                    alt={t.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      background: "linear-gradient(135deg, #FF6B35 0%, #E85520 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span style={{ fontSize: 40 }}>🍽️</span>
                  </div>
                )}

                {/* Overlay CTA on hover */}
                <div
                  className="template-overlay"
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(0,0,0,0.45)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: 0,
                    transition: "opacity 0.2s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = "1"; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = "0"; }}
                >
                  <span
                    style={{
                      background: "white",
                      color: "var(--color-primary)",
                      fontWeight: 700,
                      fontSize: 13,
                      padding: "8px 18px",
                      borderRadius: 20,
                    }}
                  >
                    Utiliser ce template
                  </span>
                </div>

                {t.isPro && (
                  <span
                    style={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      background: "var(--color-primary)",
                      color: "white",
                      fontSize: 10,
                      fontWeight: 800,
                      padding: "3px 8px",
                      borderRadius: 6,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      display: "flex",
                      alignItems: "center",
                      gap: 3,
                    }}
                  >
                    <Star size={9} fill="white" /> Pro
                  </span>
                )}
              </div>

              {/* Info */}
              <div style={{ padding: "14px 16px", flex: 1 }}>
                <p
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: "var(--color-dark)",
                    margin: 0,
                    marginBottom: 4,
                    fontFamily: "var(--font-display)",
                  }}
                >
                  {t.name}
                </p>
                <p style={{ fontSize: 12, color: "var(--color-gray)", margin: 0, textTransform: "capitalize" }}>
                  {CATEGORY_LABELS[t.category] ?? t.category}
                </p>
              </div>

              {/* CTA bottom */}
              <div style={{ padding: "0 16px 14px" }}>
                <span
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "8px 0",
                    borderRadius: 10,
                    background: "var(--color-primary)",
                    color: "white",
                    fontSize: 12,
                    fontWeight: 700,
                    textAlign: "center",
                  }}
                >
                  Utiliser ce template
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalTemplateId !== undefined && (
        <NewSiteModal
          defaultTemplateId={modalTemplateId}
          onClose={() => setModalTemplateId(undefined)}
        />
      )}
    </div>
  );
}
