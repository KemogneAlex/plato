import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { Monitor, Smartphone, ArrowLeft, ExternalLink, Edit3 } from "lucide-react";

type BlockType = "navbar" | "hero" | "menu" | "gallery" | "contact" | "testimonials" | "hours" | "divider" | "text" | "footer";

interface Block {
  id: string;
  type: BlockType;
  props: Record<string, unknown>;
}

function RenderedBlock({ block, mode }: { block: Block; mode: "desktop" | "mobile" }) {
  const isMobile = mode === "mobile";
  const px = isMobile ? "20px 16px" : "80px 80px";
  const titleSize = isMobile ? 22 : 38;
  const subtitleSize = isMobile ? 14 : 18;
  const sectionPad = isMobile ? "40px 20px" : "72px 80px";
  const h2Size = isMobile ? 20 : 30;

  switch (block.type) {
    case "navbar": {
      const p = block.props;
      const links = (p.links as string[]) ?? [];
      return (
        <nav style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: p.bg as string,
          padding: isMobile ? "12px 20px" : "14px 80px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 1px 8px rgba(0,0,0,0.07)",
        }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {(p.logoUrl as string) && (
              <img src={p.logoUrl as string} alt="logo" style={{ height: 36, width: 36, objectFit: "cover", borderRadius: 8 }} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
            )}
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: isMobile ? 16 : 20, color: p.textColor as string, whiteSpace: "nowrap" }}>{p.logo as string}</span>
          </div>
          {/* Links */}
          {isMobile ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {/* Mobile: show only CTA button (last link) */}
              <button style={{ padding: "8px 16px", borderRadius: 8, background: "var(--color-primary)", color: "white", border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                {links[links.length - 1] ?? "Menu"}
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
              {links.slice(0, -1).map((link, i) => (
                <a key={i} href="#" style={{ fontSize: 15, color: p.textColor as string, textDecoration: "none", fontWeight: 500, opacity: 0.85, transition: "opacity 0.15s" }}>
                  {link}
                </a>
              ))}
              {links.length > 0 && (
                <button style={{ padding: "10px 22px", borderRadius: 10, background: "var(--color-primary)", color: "white", border: "none", fontWeight: 700, fontSize: 14, cursor: "pointer", letterSpacing: "0.02em" }}>
                  {links[links.length - 1]}
                </button>
              )}
            </div>
          )}
        </nav>
      );
    }
    case "hero": {
      const p = block.props;
      const hasImage = !!(p.imageUrl as string);
      return (
        <div style={{
          background: hasImage ? "transparent" : p.bg as string,
          backgroundImage: hasImage ? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${p.imageUrl})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
          padding: isMobile ? "80px 24px" : "120px 80px",
          textAlign: "center",
        }}>
          <h1 style={{ color: hasImage ? "#fff" : p.textColor as string, fontFamily: "var(--font-display)", fontSize: titleSize, marginBottom: 16, lineHeight: 1.2, maxWidth: 800, margin: "0 auto 16px" }}>{p.title as string}</h1>
          <p style={{ color: hasImage ? "rgba(255,255,255,0.9)" : p.textColor as string, opacity: hasImage ? 1 : 0.8, fontSize: subtitleSize, maxWidth: isMobile ? 320 : 600, margin: "0 auto 32px", lineHeight: 1.6 }}>{p.subtitle as string}</p>
          <button style={{ background: "var(--color-primary)", color: "white", border: "none", borderRadius: 12, padding: isMobile ? "12px 24px" : "16px 36px", fontWeight: 700, fontSize: isMobile ? 14 : 16, cursor: "pointer", letterSpacing: "0.02em" }}>
            {p.cta as string}
          </button>
        </div>
      );
    }
    case "menu": {
      const p = block.props;
      const items = p.items as Array<{ name: string; price: string; desc: string }>;
      const half = Math.ceil(items.length / 2);
      return (
        <div style={{ padding: sectionPad, background: "#FAFAFA" }}>
          <h2 style={{ fontFamily: "var(--font-display)", color: "var(--color-dark)", fontSize: h2Size, marginBottom: 40, textAlign: "center" }}>{p.title as string}</h2>
          <div style={{ maxWidth: isMobile ? "100%" : 900, margin: "0 auto", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 0 : "0 48px" }}>
            {items.map((item, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "18px 0", borderBottom: "1px solid #E5E7EB" }}>
                <div>
                  <p style={{ fontWeight: 700, fontSize: isMobile ? 15 : 16, color: "var(--color-dark)", marginBottom: 4 }}>{item.name}</p>
                  <p style={{ fontSize: isMobile ? 13 : 14, color: "var(--color-gray)", lineHeight: 1.5 }}>{item.desc}</p>
                </div>
                <span style={{ fontWeight: 800, color: "var(--color-primary)", fontSize: isMobile ? 16 : 18, whiteSpace: "nowrap", marginLeft: 20 }}>{item.price}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    case "gallery": {
      const p = block.props;
      const cols = isMobile ? 2 : (Number(p.cols) || 3);
      const images = (p.images as string[]) ?? [];
      return (
        <div style={{ padding: sectionPad, background: "white" }}>
          <h2 style={{ fontFamily: "var(--font-display)", color: "var(--color-dark)", fontSize: h2Size, marginBottom: 32, textAlign: "center" }}>{p.title as string}</h2>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: isMobile ? 10 : 16 }}>
            {Array.from({ length: cols * 2 }).map((_, i) => {
              const url = images[i];
              return url
                ? <img key={i} src={url} alt="" style={{ aspectRatio: "4/3", borderRadius: isMobile ? 10 : 14, objectFit: "cover", width: "100%", display: "block" }} />
                : <div key={i} style={{ aspectRatio: "4/3", borderRadius: isMobile ? 10 : 14, background: `hsl(${20 + i * 18}, 40%, 90%)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: 24, opacity: 0.4 }}>🖼️</span>
                  </div>;
            })}
          </div>
        </div>
      );
    }
    case "contact": {
      const p = block.props;
      return (
        <div style={{ padding: sectionPad, background: "#FAFAFA" }}>
          <h2 style={{ fontFamily: "var(--font-display)", color: "var(--color-dark)", fontSize: h2Size, marginBottom: 32, textAlign: "center" }}>{p.title as string}</h2>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: 16, maxWidth: isMobile ? 360 : 900, margin: "0 auto" }}>
            {[
              { icon: "📍", val: p.address as string },
              { icon: "📞", val: p.phone as string },
              { icon: "✉️", val: p.email as string },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: isMobile ? "14px 18px" : "20px 24px", borderRadius: 14, background: "white", boxShadow: "0 1px 6px rgba(0,0,0,0.07)", textAlign: "left" }}>
                <span style={{ fontSize: isMobile ? 20 : 26, flexShrink: 0 }}>{item.icon}</span>
                <p style={{ fontSize: isMobile ? 13 : 15, color: "var(--color-dark)", lineHeight: 1.5 }}>{item.val}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }
    case "testimonials": {
      const p = block.props;
      const items = p.items as Array<{ name: string; text: string; rating: number }>;
      const gridCols = isMobile ? "1fr" : items.length >= 3 ? "1fr 1fr 1fr" : items.length > 1 ? "1fr 1fr" : "1fr";
      return (
        <div style={{ padding: sectionPad, background: "white" }}>
          <h2 style={{ fontFamily: "var(--font-display)", color: "var(--color-dark)", fontSize: h2Size, marginBottom: 32, textAlign: "center" }}>{p.title as string}</h2>
          <div style={{ display: "grid", gridTemplateColumns: gridCols, gap: isMobile ? 12 : 20, maxWidth: isMobile ? "100%" : 1000, margin: "0 auto" }}>
            {items.map((item, i) => (
              <div key={i} style={{ padding: isMobile ? "18px" : "28px", borderRadius: 16, background: "#F9FAFB", border: "1px solid #E5E7EB" }}>
                <div style={{ display: "flex", gap: 3, marginBottom: 12 }}>
                  {Array.from({ length: item.rating }).map((_, j) => (
                    <span key={j} style={{ color: "#FF6B35", fontSize: isMobile ? 14 : 18 }}>★</span>
                  ))}
                </div>
                <p style={{ fontSize: isMobile ? 13 : 15, color: "var(--color-gray)", fontStyle: "italic", lineHeight: 1.8, marginBottom: 16 }}>"{item.text}"</p>
                <p style={{ fontSize: isMobile ? 12 : 14, fontWeight: 700, color: "var(--color-dark)" }}>— {item.name}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }
    case "hours": {
      const p = block.props;
      const rows = p.rows as Array<{ day: string; time: string }>;
      return (
        <div style={{ padding: sectionPad, background: "#FAFAFA" }}>
          <h2 style={{ fontFamily: "var(--font-display)", color: "var(--color-dark)", fontSize: h2Size, marginBottom: 32, textAlign: "center" }}>{p.title as string}</h2>
          <div style={{ maxWidth: isMobile ? "100%" : 600, margin: "0 auto", background: "white", borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
            {rows.map((r, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: isMobile ? "14px 20px" : "18px 32px", borderBottom: i < rows.length - 1 ? "1px solid #E5E7EB" : "none", background: i % 2 === 0 ? "white" : "#FAFAFA" }}>
                <span style={{ fontWeight: 700, fontSize: isMobile ? 14 : 15, color: "var(--color-dark)" }}>{r.day}</span>
                <span style={{ fontSize: isMobile ? 14 : 15, color: r.time === "Fermé" ? "var(--color-danger, #EF4444)" : "var(--color-gray)", fontWeight: r.time === "Fermé" ? 600 : 400 }}>{r.time}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    case "text": {
      const p = block.props;
      const sizeMap: Record<string, string> = { sm: isMobile ? "13px" : "15px", md: isMobile ? "15px" : "17px", lg: isMobile ? "18px" : "22px" };
      return (
        <div style={{ padding: sectionPad, background: "white", textAlign: p.align as "left" | "center" | "right" }}>
          <p style={{ fontSize: sizeMap[p.size as string] || "17px", color: "var(--color-dark)", lineHeight: 1.9, maxWidth: isMobile ? "100%" : 800, margin: "0 auto" }}>{p.content as string}</p>
        </div>
      );
    }
    case "divider":
      return (
        <div style={{ padding: "4px 0", background: "white" }}>
          <hr style={{ border: "none", borderTop: `1px ${block.props.style} ${block.props.color}`, margin: "0 80px" }} />
        </div>
      );
    case "footer": {
      const p = block.props;
      const socials = [
        { key: "instagram", label: "Instagram", icon: "📸" },
        { key: "facebook", label: "Facebook", icon: "👥" },
        { key: "website", label: "Site web", icon: "🌐" },
      ].filter(s => !!(p[s.key] as string));
      return (
        <div style={{ background: p.bg as string, padding: isMobile ? "32px 20px" : "48px 80px" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            {(p.address as string) && (
              <p style={{ fontSize: isMobile ? 13 : 14, color: p.textColor as string, opacity: 0.7, marginBottom: 16, textAlign: "center" }}>📍 {p.address as string}</p>
            )}
            {socials.length > 0 && (
              <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
                {socials.map(s => (
                  <a key={s.key} href={p[s.key] as string} target="_blank" rel="noopener noreferrer"
                    style={{ display: "flex", alignItems: "center", gap: 6, padding: isMobile ? "8px 14px" : "10px 18px", borderRadius: 24, background: "rgba(255,255,255,0.12)", color: p.textColor as string, textDecoration: "none", fontSize: isMobile ? 12 : 14, fontWeight: 500, transition: "background 0.15s" }}>
                    <span>{s.icon}</span> {s.label}
                  </a>
                ))}
              </div>
            )}
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.12)", paddingTop: 16, textAlign: "center" }}>
              <p style={{ fontSize: isMobile ? 11 : 13, color: p.textColor as string, opacity: 0.5 }}>{p.copyright as string}</p>
              <p style={{ fontSize: 11, color: p.textColor as string, opacity: 0.3, marginTop: 4 }}>Créé avec Plato</p>
            </div>
          </div>
        </div>
      );
    }
    default:
      return null;
  }
}

export default function PreviewPage() {
  const [, params] = useRoute("/preview/:id");
  const [, navigate] = useLocation();
  const id = params?.id ?? "";
  const [mode, setMode] = useState<"desktop" | "mobile">("desktop");

  const { data, isLoading } = useQuery({
    queryKey: ["site", id],
    queryFn: async () => {
      const res = await api.sites[":id"].$get({ param: { id } });
      return res.json();
    },
    enabled: !!id,
  });

  const site = (data as any)?.site;
  const blocks: Block[] = site?.content?.blocks ?? [];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#F0F2F5", fontFamily: "var(--font-body)" }}>
      {/* Toolbar */}
      <div style={{ height: 52, background: "white", borderBottom: "1px solid #E5E7EB", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", zIndex: 10, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => navigate(`/editor/${id}`, { replace: true })} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 8, border: "1.5px solid #E5E7EB", background: "white", cursor: "pointer", fontSize: 13, fontWeight: 500, color: "var(--color-dark)" }}>
            <ArrowLeft size={14} /> Retour
          </button>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--color-primary)", fontSize: 15 }}>
            {site?.name ?? "Aperçu"}
          </span>
        </div>

        {/* Device toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: 2, background: "#F3F4F6", borderRadius: 10, padding: 3 }}>
          {([
            { id: "desktop", icon: <Monitor size={15} />, label: "Bureau" },
            { id: "mobile", icon: <Smartphone size={15} />, label: "Mobile" },
          ] as const).map(d => (
            <button
              key={d.id}
              onClick={() => setMode(d.id)}
              style={{
                display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600,
                background: mode === d.id ? "white" : "transparent",
                color: mode === d.id ? "var(--color-dark)" : "var(--color-gray)",
                boxShadow: mode === d.id ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                transition: "all 0.15s",
              }}
            >
              {d.icon} {d.label}
            </button>
          ))}
        </div>

        <button onClick={() => navigate(`/editor/${id}`, { replace: true })} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 8, background: "var(--color-primary)", color: "white", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
          <Edit3 size={14} /> Éditer
        </button>
      </div>

      {/* Preview area */}
      <div style={{ flex: 1, overflow: "auto", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: mode === "mobile" ? "32px 16px" : "32px 24px", background: mode === "desktop" ? "#E8EBF0" : "#F0F2F5" }}>
        <div style={{
          width: mode === "mobile" ? 375 : "100%",
          maxWidth: mode === "mobile" ? 375 : 1280,
          background: "white",
          boxShadow: mode === "mobile" ? "0 8px 32px rgba(0,0,0,0.18)" : "0 4px 24px rgba(0,0,0,0.10)",
          borderRadius: mode === "mobile" ? 24 : 12,
          overflow: "hidden",
          minHeight: 600,
          transition: "all 0.3s",
        }}>
          {isLoading ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300 }}>
              <div style={{ width: 32, height: 32, border: "3px solid var(--color-primary)", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            </div>
          ) : blocks.length === 0 ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 400, padding: 40, textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🍽️</div>
              <h3 style={{ fontFamily: "var(--font-display)", color: "var(--color-dark)", fontSize: 20, marginBottom: 8 }}>Aucun contenu</h3>
              <p style={{ color: "var(--color-gray)", fontSize: 14, marginBottom: 20 }}>Ajoutez des blocs dans l'éditeur pour voir l'aperçu ici</p>
              <button onClick={() => navigate(`/editor/${id}`, { replace: true })} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 10, background: "var(--color-primary)", color: "white", border: "none", cursor: "pointer", fontWeight: 600, fontSize: 14 }}>
                <Edit3 size={14} /> Ouvrir l'éditeur
              </button>
            </div>
          ) : (
            <div>
              {blocks.map(block => (
                <RenderedBlock key={block.id} block={block} mode={mode} />
              ))}
              {/* Fallback footer si pas de bloc footer */}
              {!blocks.some(b => b.type === "footer") && (
                <div style={{ padding: mode === "desktop" ? "24px 80px" : "18px 20px", background: "#1A1A2E", textAlign: "center" }}>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>{site?.name} · Créé avec Plato</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
