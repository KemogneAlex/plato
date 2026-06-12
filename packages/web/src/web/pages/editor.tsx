import { useState, useCallback, useEffect, useRef } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import {
  Layout, Type, Image, Phone, Star, ChevronRight, ChevronLeft,
  Save, Eye, Undo, Redo, Settings, GripVertical, Plus, Trash2,
  AlignLeft, AlignCenter, AlignRight, Bold, Italic, Palette, X,
  CheckCircle, Globe
} from "lucide-react";

// ─── Block types ─────────────────────────────────────────────────────────────

type BlockType = "navbar" | "hero" | "menu" | "gallery" | "contact" | "testimonials" | "hours" | "divider" | "text" | "footer";

interface Block {
  id: string;
  type: BlockType;
  props: Record<string, unknown>;
}

// ─── Block definitions ────────────────────────────────────────────────────────

const BLOCK_DEFS: Array<{ type: BlockType; label: string; icon: React.ReactNode; desc: string }> = [
  { type: "navbar",       label: "Navbar",      icon: <AlignLeft size={16} />,    desc: "Barre de navigation" },
  { type: "hero",         label: "Hero",        icon: <Layout size={16} />,       desc: "Bannière principale avec titre" },
  { type: "menu",         label: "Menu",        icon: <AlignLeft size={16} />,    desc: "Carte du restaurant" },
  { type: "gallery",      label: "Galerie",     icon: <Image size={16} />,        desc: "Photos de plats / ambiance" },
  { type: "contact",      label: "Contact",     icon: <Phone size={16} />,        desc: "Infos & formulaire" },
  { type: "testimonials", label: "Avis",        icon: <Star size={16} />,         desc: "Témoignages clients" },
  { type: "hours",        label: "Horaires",    icon: <Settings size={16} />,     desc: "Horaires d'ouverture" },
  { type: "text",         label: "Texte",       icon: <Type size={16} />,         desc: "Bloc de texte libre" },
  { type: "divider",      label: "Séparateur",  icon: <ChevronRight size={16} />, desc: "Ligne de séparation" },
  { type: "footer",       label: "Footer",      icon: <Globe size={16} />,        desc: "Pied de page avec réseaux & copyright" },
];

const DEFAULT_PROPS: Record<BlockType, Record<string, unknown>> = {
  navbar: { logo: "Mon Restaurant", links: ["Accueil", "Menu", "Galerie", "Contact", "Réservation"], bg: "#FFFFFF", textColor: "#1A1A2E", logoUrl: "" },
  hero: { title: "Bienvenue au Restaurant", subtitle: "Une expérience culinaire unique", cta: "Réserver", bg: "#1A1A2E", textColor: "#FFFFFF", imageUrl: "" },
  menu: { title: "Notre Carte", items: [{ name: "Plat du jour", price: "18€", desc: "Selon le marché" }, { name: "Entrée maison", price: "12€", desc: "Produits locaux" }] },
  gallery: { title: "Notre Galerie", cols: 3, images: [] },
  contact: { title: "Nous contacter", address: "12 Rue de la Paix, Paris", phone: "+33 1 23 45 67 89", email: "contact@restaurant.fr" },
  testimonials: { title: "Ils nous font confiance", items: [{ name: "Marie D.", text: "Excellent repas, service impeccable !", rating: 5 }] },
  hours: { title: "Horaires", rows: [{ day: "Lun-Ven", time: "12h – 14h30 | 19h – 22h30" }, { day: "Samedi", time: "12h – 23h" }, { day: "Dimanche", time: "Fermé" }] },
  text: { content: "Votre texte ici...", align: "left", size: "md" },
  divider: { style: "solid", color: "#E5E7EB" },
  footer: { copyright: "© 2025 — Tous droits réservés", address: "", facebook: "", instagram: "", website: "", bg: "#1A1A2E", textColor: "#FFFFFF" },
};

// ─── Image URL field helper ───────────────────────────────────────────────────

function ImageField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "var(--color-gray)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</label>
      {value && (
        <div style={{ position: "relative", marginBottom: 6, borderRadius: 8, overflow: "hidden", border: "1.5px solid #E5E7EB" }}>
          <img src={value} alt="" style={{ width: "100%", height: 80, objectFit: "cover", display: "block" }} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
          <button
            onClick={() => onChange("")}
            style={{ position: "absolute", top: 4, right: 4, width: 20, height: 20, borderRadius: "50%", background: "rgba(0,0,0,0.6)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <X size={10} color="white" />
          </button>
        </div>
      )}
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="https://... (URL de l'image)"
        style={{ width: "100%", padding: "6px 10px", borderRadius: 8, border: "1.5px solid #E5E7EB", fontSize: 12, color: "var(--color-dark)", background: "white", boxSizing: "border-box" }}
      />
    </div>
  );
}

// ─── Block renderers ──────────────────────────────────────────────────────────

function BlockPreview({ block, selected }: { block: Block; selected: boolean }) {
  const base: React.CSSProperties = {
    border: selected ? "2px solid var(--color-primary)" : "2px solid transparent",
    borderRadius: 12,
    transition: "border 0.15s",
    cursor: "pointer",
    userSelect: "none",
    overflow: "hidden",
  };

  switch (block.type) {
    case "navbar": {
      const p = block.props as typeof DEFAULT_PROPS["navbar"];
      const links = p.links as string[];
      return (
        <div style={{ ...base, background: p.bg as string, padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {(p.logoUrl as string) && (
              <img src={p.logoUrl as string} alt="logo" style={{ height: 32, width: 32, objectFit: "cover", borderRadius: 6 }} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
            )}
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: p.textColor as string }}>{p.logo as string}</span>
          </div>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            {links.map((link, i) => (
              <span key={i} style={{ fontSize: 12, color: p.textColor as string, fontWeight: i === links.length - 1 ? 700 : 400, padding: i === links.length - 1 ? "6px 14px" : "0", borderRadius: i === links.length - 1 ? 8 : 0, background: i === links.length - 1 ? "var(--color-primary)" : "transparent", color: i === links.length - 1 ? "white" : p.textColor as string }}>
                {link}
              </span>
            ))}
          </div>
        </div>
      );
    }
    case "hero": {
      const p = block.props as typeof DEFAULT_PROPS["hero"];
      const hasImage = !!(p.imageUrl as string);
      return (
        <div style={{
          ...base,
          background: hasImage ? "transparent" : p.bg as string,
          backgroundImage: hasImage ? `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url(${p.imageUrl})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
          padding: "40px 24px",
          textAlign: "center",
        }}>
          <h2 style={{ color: hasImage ? "#fff" : p.textColor as string, fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 8 }}>{p.title as string}</h2>
          <p style={{ color: hasImage ? "rgba(255,255,255,0.85)" : p.textColor as string, opacity: hasImage ? 1 : 0.8, fontSize: 14, marginBottom: 16 }}>{p.subtitle as string}</p>
          <button style={{ background: "var(--color-primary)", color: "white", border: "none", borderRadius: 8, padding: "10px 24px", fontWeight: 600, fontSize: 13 }}>
            {p.cta as string}
          </button>
        </div>
      );
    }
    case "menu": {
      const p = block.props as typeof DEFAULT_PROPS["menu"];
      const items = p.items as Array<{ name: string; price: string; desc: string }>;
      return (
        <div style={{ ...base, padding: "24px", background: "#FAFAFA" }}>
          <h3 style={{ fontFamily: "var(--font-display)", color: "var(--color-dark)", fontSize: 16, marginBottom: 12 }}>{p.title as string}</h3>
          {items.map((item, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10, paddingBottom: 10, borderBottom: i < items.length - 1 ? "1px solid #E5E7EB" : "none" }}>
              <div>
                <p style={{ fontWeight: 600, fontSize: 13, color: "var(--color-dark)" }}>{item.name}</p>
                <p style={{ fontSize: 12, color: "var(--color-gray)" }}>{item.desc}</p>
              </div>
              <span style={{ fontWeight: 700, color: "var(--color-primary)", fontSize: 14 }}>{item.price}</span>
            </div>
          ))}
        </div>
      );
    }
    case "gallery": {
      const p = block.props as typeof DEFAULT_PROPS["gallery"];
      const images = (p.images as string[]) ?? [];
      const cols = Number(p.cols) || 3;
      const count = cols * 2;
      return (
        <div style={{ ...base, padding: "24px", background: "white" }}>
          <h3 style={{ fontFamily: "var(--font-display)", color: "var(--color-dark)", fontSize: 16, marginBottom: 12 }}>{p.title as string}</h3>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 8 }}>
            {Array.from({ length: count }).map((_, i) => {
              const url = images[i];
              return url
                ? <img key={i} src={url} alt="" style={{ aspectRatio: "1", borderRadius: 8, objectFit: "cover", width: "100%", display: "block" }} />
                : <div key={i} style={{ aspectRatio: "1", borderRadius: 8, background: `hsl(${20 + i * 15}, 40%, 88%)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Image size={14} color="#aaa" />
                  </div>;
            })}
          </div>
        </div>
      );
    }
    case "contact": {
      const p = block.props as typeof DEFAULT_PROPS["contact"];
      return (
        <div style={{ ...base, padding: "24px", background: "#FAFAFA" }}>
          <h3 style={{ fontFamily: "var(--font-display)", color: "var(--color-dark)", fontSize: 16, marginBottom: 12 }}>{p.title as string}</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <p style={{ fontSize: 12, color: "var(--color-gray)" }}>📍 {p.address as string}</p>
            <p style={{ fontSize: 12, color: "var(--color-gray)" }}>📞 {p.phone as string}</p>
            <p style={{ fontSize: 12, color: "var(--color-gray)" }}>✉️ {p.email as string}</p>
          </div>
        </div>
      );
    }
    case "testimonials": {
      const p = block.props as typeof DEFAULT_PROPS["testimonials"];
      const items = p.items as Array<{ name: string; text: string; rating: number }>;
      return (
        <div style={{ ...base, padding: "24px", background: "white" }}>
          <h3 style={{ fontFamily: "var(--font-display)", color: "var(--color-dark)", fontSize: 16, marginBottom: 12 }}>{p.title as string}</h3>
          {items.map((item, i) => (
            <div key={i} style={{ background: "#F9FAFB", borderRadius: 8, padding: "12px", marginBottom: 8 }}>
              <div style={{ display: "flex", gap: 4, marginBottom: 6 }}>
                {Array.from({ length: item.rating }).map((_, j) => (
                  <Star key={j} size={12} fill="#FF6B35" color="#FF6B35" />
                ))}
              </div>
              <p style={{ fontSize: 12, color: "var(--color-gray)", fontStyle: "italic", marginBottom: 6 }}>"{item.text}"</p>
              <p style={{ fontSize: 11, fontWeight: 600, color: "var(--color-dark)" }}>— {item.name}</p>
            </div>
          ))}
        </div>
      );
    }
    case "hours": {
      const p = block.props as typeof DEFAULT_PROPS["hours"];
      const rows = p.rows as Array<{ day: string; time: string }>;
      return (
        <div style={{ ...base, padding: "24px", background: "#FAFAFA" }}>
          <h3 style={{ fontFamily: "var(--font-display)", color: "var(--color-dark)", fontSize: 16, marginBottom: 12 }}>{p.title as string}</h3>
          {rows.map((r, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: i < rows.length - 1 ? "1px solid #E5E7EB" : "none" }}>
              <span style={{ fontWeight: 600, fontSize: 12, color: "var(--color-dark)" }}>{r.day}</span>
              <span style={{ fontSize: 12, color: "var(--color-gray)" }}>{r.time}</span>
            </div>
          ))}
        </div>
      );
    }
    case "text": {
      const p = block.props as typeof DEFAULT_PROPS["text"];
      const sizeMap: Record<string, string> = { sm: "12px", md: "14px", lg: "18px" };
      return (
        <div style={{ ...base, padding: "20px 24px", background: "white", textAlign: p.align as "left" | "center" | "right" }}>
          <p style={{ fontSize: sizeMap[p.size as string] || "14px", color: "var(--color-dark)", lineHeight: 1.7 }}>{p.content as string}</p>
        </div>
      );
    }
    case "divider":
      return (
        <div style={{ ...base, padding: "12px 24px", background: "white" }}>
          <hr style={{ border: "none", borderTop: `1px ${(block.props as typeof DEFAULT_PROPS["divider"]).style} ${(block.props as typeof DEFAULT_PROPS["divider"]).color}` }} />
        </div>
      );
    case "footer": {
      const p = block.props as typeof DEFAULT_PROPS["footer"];
      return (
        <div style={{ ...base, background: p.bg as string, padding: "20px 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
            <p style={{ fontSize: 12, color: p.textColor as string, opacity: 0.7 }}>{p.copyright as string}</p>
            <div style={{ display: "flex", gap: 8 }}>
              {(p.instagram as string) && <span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 20, background: "rgba(255,255,255,0.15)", color: p.textColor as string }}>Instagram</span>}
              {(p.facebook as string) && <span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 20, background: "rgba(255,255,255,0.15)", color: p.textColor as string }}>Facebook</span>}
              {(p.website as string) && <span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 20, background: "rgba(255,255,255,0.15)", color: p.textColor as string }}>Site web</span>}
            </div>
          </div>
        </div>
      );
    }
    default:
      return null;
  }
}

// ─── Properties panel ─────────────────────────────────────────────────────────

function PropertiesPanel({ block, onChange }: { block: Block; onChange: (props: Record<string, unknown>) => void }) {
  const p = block.props;

  const field = (label: string, key: string, type: "text" | "color" | "number" | "select", options?: string[]) => (
    <div key={key} style={{ marginBottom: 14 }}>
      <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "var(--color-gray)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</label>
      {type === "select" ? (
        <select
          value={p[key] as string}
          onChange={e => onChange({ ...p, [key]: e.target.value })}
          style={{ width: "100%", padding: "6px 10px", borderRadius: 8, border: "1.5px solid #E5E7EB", fontSize: 13, color: "var(--color-dark)", background: "white" }}
        >
          {options?.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input
          type={type}
          value={p[key] as string | number}
          onChange={e => onChange({ ...p, [key]: type === "number" ? Number(e.target.value) : e.target.value })}
          style={{ width: "100%", padding: "6px 10px", borderRadius: 8, border: "1.5px solid #E5E7EB", fontSize: 13, color: "var(--color-dark)", background: "white", boxSizing: "border-box" }}
        />
      )}
    </div>
  );

  switch (block.type) {
    case "navbar": {
      const links = (p.links as string[]) ?? [];
      return (
        <div>
          {field("Nom / Logo texte", "logo", "text")}
          <ImageField label="Logo image (URL)" value={(p.logoUrl as string) ?? ""} onChange={v => onChange({ ...p, logoUrl: v })} />
          {field("Fond", "bg", "color")}
          {field("Couleur texte", "textColor", "color")}
          <div style={{ marginBottom: 6 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "var(--color-gray)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Liens de navigation</label>
            {links.map((link, i) => (
              <div key={i} style={{ display: "flex", gap: 6, marginBottom: 6, alignItems: "center" }}>
                <input
                  type="text"
                  value={link}
                  onChange={e => {
                    const next = [...links];
                    next[i] = e.target.value;
                    onChange({ ...p, links: next });
                  }}
                  style={{ flex: 1, padding: "5px 8px", borderRadius: 7, border: "1.5px solid #E5E7EB", fontSize: 12, color: "var(--color-dark)", background: "white", boxSizing: "border-box" }}
                />
                <button
                  onClick={() => onChange({ ...p, links: links.filter((_, j) => j !== i) })}
                  style={{ padding: "4px 8px", borderRadius: 7, border: "1px solid #E5E7EB", background: "white", cursor: "pointer", color: "var(--color-gray)" }}
                >
                  <X size={12} />
                </button>
              </div>
            ))}
            <button
              onClick={() => onChange({ ...p, links: [...links, "Nouveau lien"] })}
              style={{ width: "100%", padding: "6px", borderRadius: 7, border: "1.5px dashed #E5E7EB", background: "transparent", cursor: "pointer", fontSize: 12, color: "var(--color-primary)", fontWeight: 600 }}
            >
              + Ajouter un lien
            </button>
          </div>
          <div style={{ marginTop: 8, padding: "8px 10px", borderRadius: 8, background: "#F9FAFB", fontSize: 11, color: "var(--color-gray)", lineHeight: 1.5 }}>
            💡 Le dernier lien sera mis en avant comme bouton (ex: Réservation)
          </div>
        </div>
      );
    }
    case "hero":
      return (
        <div>
          {field("Titre", "title", "text")}
          {field("Sous-titre", "subtitle", "text")}
          {field("Bouton CTA", "cta", "text")}
          <ImageField
            label="Image de fond"
            value={(p.imageUrl as string) ?? ""}
            onChange={v => onChange({ ...p, imageUrl: v })}
          />
          <div style={{ marginBottom: 14, padding: "8px 10px", borderRadius: 8, background: "#F9FAFB", fontSize: 11, color: "var(--color-gray)", lineHeight: 1.5 }}>
            💡 Si une image est définie, la couleur de fond sera ignorée
          </div>
          {field("Couleur fond (sans image)", "bg", "color")}
          {field("Couleur texte", "textColor", "color")}
        </div>
      );
    case "text":
      return (
        <div>
          {field("Contenu", "content", "text")}
          {field("Alignement", "align", "select", ["left", "center", "right"])}
          {field("Taille", "size", "select", ["sm", "md", "lg"])}
        </div>
      );
    case "gallery": {
      const images = (p.images as string[]) ?? [];
      const cols = Number(p.cols) || 3;
      return (
        <div>
          {field("Titre", "title", "text")}
          {field("Colonnes", "cols", "number")}
          <div style={{ marginBottom: 6 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "var(--color-gray)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Images (URLs)</label>
            {Array.from({ length: cols * 2 }).map((_, i) => (
              <div key={i} style={{ marginBottom: 8, display: "flex", gap: 6, alignItems: "center" }}>
                {images[i] && (
                  <img src={images[i]} alt="" style={{ width: 32, height: 32, objectFit: "cover", borderRadius: 6, border: "1px solid #E5E7EB", flexShrink: 0 }} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                )}
                <input
                  type="text"
                  value={images[i] ?? ""}
                  placeholder={`Image ${i + 1}...`}
                  onChange={e => {
                    const next = [...images];
                    next[i] = e.target.value;
                    onChange({ ...p, images: next });
                  }}
                  style={{ flex: 1, padding: "5px 8px", borderRadius: 7, border: "1.5px solid #E5E7EB", fontSize: 11, color: "var(--color-dark)", background: "white", boxSizing: "border-box" }}
                />
              </div>
            ))}
          </div>
        </div>
      );
    }
    case "contact":
      return (
        <div>
          {field("Titre", "title", "text")}
          {field("Adresse", "address", "text")}
          {field("Téléphone", "phone", "text")}
          {field("Email", "email", "text")}
        </div>
      );
    case "hours": {
      const rows = (p.rows as Array<{ day: string; time: string }>) ?? [];
      return (
        <div>
          {field("Titre", "title", "text")}
          <div style={{ marginBottom: 6 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "var(--color-gray)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Plages horaires</label>
            {rows.map((row, i) => (
              <div key={i} style={{ display: "flex", gap: 6, marginBottom: 6, alignItems: "center" }}>
                <input
                  type="text"
                  value={row.day}
                  placeholder="Jour"
                  onChange={e => {
                    const next = rows.map((r, j) => j === i ? { ...r, day: e.target.value } : r);
                    onChange({ ...p, rows: next });
                  }}
                  style={{ width: 80, padding: "5px 8px", borderRadius: 7, border: "1.5px solid #E5E7EB", fontSize: 12, color: "var(--color-dark)", background: "white", flexShrink: 0 }}
                />
                <input
                  type="text"
                  value={row.time}
                  placeholder="Horaires"
                  onChange={e => {
                    const next = rows.map((r, j) => j === i ? { ...r, time: e.target.value } : r);
                    onChange({ ...p, rows: next });
                  }}
                  style={{ flex: 1, padding: "5px 8px", borderRadius: 7, border: "1.5px solid #E5E7EB", fontSize: 12, color: "var(--color-dark)", background: "white" }}
                />
                <button
                  onClick={() => onChange({ ...p, rows: rows.filter((_, j) => j !== i) })}
                  style={{ padding: "4px 7px", borderRadius: 7, border: "1px solid #E5E7EB", background: "white", cursor: "pointer", color: "var(--color-gray)", flexShrink: 0 }}
                >
                  <X size={11} />
                </button>
              </div>
            ))}
            <button
              onClick={() => onChange({ ...p, rows: [...rows, { day: "Jour", time: "Horaires" }] })}
              style={{ width: "100%", padding: "6px", borderRadius: 7, border: "1.5px dashed #E5E7EB", background: "transparent", cursor: "pointer", fontSize: 12, color: "var(--color-primary)", fontWeight: 600 }}
            >
              + Ajouter une ligne
            </button>
          </div>
        </div>
      );
    }
    case "menu": {
      const items = (p.items as Array<{ name: string; price: string; desc: string; category?: string }>) ?? [];
      return (
        <div>
          {field("Titre de la section", "title", "text")}
          <div style={{ marginBottom: 6 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "var(--color-gray)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Plats / Articles</label>
            {items.map((item, i) => (
              <div key={i} style={{ marginBottom: 10, padding: "10px", borderRadius: 10, border: "1.5px solid #E5E7EB", background: "#FAFAFA", position: "relative" }}>
                <button
                  onClick={() => onChange({ ...p, items: items.filter((_, j) => j !== i) })}
                  style={{ position: "absolute", top: 6, right: 6, padding: "2px 6px", borderRadius: 6, border: "1px solid #FECACA", background: "white", cursor: "pointer" }}
                >
                  <X size={10} color="var(--color-danger)" />
                </button>
                <div style={{ display: "flex", flexDirection: "column", gap: 5, paddingRight: 24 }}>
                  <input
                    type="text"
                    value={item.name}
                    placeholder="Nom du plat"
                    onChange={e => {
                      const next = items.map((it, j) => j === i ? { ...it, name: e.target.value } : it);
                      onChange({ ...p, items: next });
                    }}
                    style={{ padding: "5px 8px", borderRadius: 7, border: "1.5px solid #E5E7EB", fontSize: 12, fontWeight: 600, color: "var(--color-dark)", background: "white" }}
                  />
                  <div style={{ display: "flex", gap: 5 }}>
                    <input
                      type="text"
                      value={item.price}
                      placeholder="Prix (ex: 18€)"
                      onChange={e => {
                        const next = items.map((it, j) => j === i ? { ...it, price: e.target.value } : it);
                        onChange({ ...p, items: next });
                      }}
                      style={{ width: 70, padding: "5px 8px", borderRadius: 7, border: "1.5px solid #E5E7EB", fontSize: 12, color: "var(--color-primary)", fontWeight: 700, background: "white", flexShrink: 0 }}
                    />
                    <input
                      type="text"
                      value={item.category ?? ""}
                      placeholder="Catégorie (optionnel)"
                      onChange={e => {
                        const next = items.map((it, j) => j === i ? { ...it, category: e.target.value } : it);
                        onChange({ ...p, items: next });
                      }}
                      style={{ flex: 1, padding: "5px 8px", borderRadius: 7, border: "1.5px solid #E5E7EB", fontSize: 11, color: "var(--color-gray)", background: "white" }}
                    />
                  </div>
                  <input
                    type="text"
                    value={item.desc}
                    placeholder="Description courte"
                    onChange={e => {
                      const next = items.map((it, j) => j === i ? { ...it, desc: e.target.value } : it);
                      onChange({ ...p, items: next });
                    }}
                    style={{ padding: "5px 8px", borderRadius: 7, border: "1.5px solid #E5E7EB", fontSize: 11, color: "var(--color-gray)", background: "white" }}
                  />
                </div>
              </div>
            ))}
            <button
              onClick={() => onChange({ ...p, items: [...items, { name: "Nouveau plat", price: "0€", desc: "Description", category: "" }] })}
              style={{ width: "100%", padding: "8px", borderRadius: 7, border: "1.5px dashed #E5E7EB", background: "transparent", cursor: "pointer", fontSize: 12, color: "var(--color-primary)", fontWeight: 600 }}
            >
              + Ajouter un plat
            </button>
          </div>
        </div>
      );
    }
    case "testimonials": {
      const items = (p.items as Array<{ name: string; text: string; rating: number }>) ?? [];
      return (
        <div>
          {field("Titre", "title", "text")}
          <div style={{ marginBottom: 6 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "var(--color-gray)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Témoignages</label>
            {items.map((item, i) => (
              <div key={i} style={{ marginBottom: 10, padding: "10px", borderRadius: 10, border: "1.5px solid #E5E7EB", background: "#FAFAFA", position: "relative" }}>
                <button
                  onClick={() => onChange({ ...p, items: items.filter((_, j) => j !== i) })}
                  style={{ position: "absolute", top: 6, right: 6, padding: "2px 6px", borderRadius: 6, border: "1px solid #FECACA", background: "white", cursor: "pointer" }}
                >
                  <X size={10} color="var(--color-danger)" />
                </button>
                <div style={{ display: "flex", flexDirection: "column", gap: 5, paddingRight: 24 }}>
                  <input
                    type="text"
                    value={item.name}
                    placeholder="Nom"
                    onChange={e => {
                      const next = items.map((it, j) => j === i ? { ...it, name: e.target.value } : it);
                      onChange({ ...p, items: next });
                    }}
                    style={{ padding: "5px 8px", borderRadius: 7, border: "1.5px solid #E5E7EB", fontSize: 12, fontWeight: 600, color: "var(--color-dark)", background: "white" }}
                  />
                  <input
                    type="text"
                    value={item.text}
                    placeholder="Témoignage"
                    onChange={e => {
                      const next = items.map((it, j) => j === i ? { ...it, text: e.target.value } : it);
                      onChange({ ...p, items: next });
                    }}
                    style={{ padding: "5px 8px", borderRadius: 7, border: "1.5px solid #E5E7EB", fontSize: 11, color: "var(--color-gray)", background: "white" }}
                  />
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ fontSize: 11, color: "var(--color-gray)" }}>Note:</span>
                    {[1,2,3,4,5].map(n => (
                      <button key={n} onClick={() => {
                        const next = items.map((it, j) => j === i ? { ...it, rating: n } : it);
                        onChange({ ...p, items: next });
                      }} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, fontSize: 14, opacity: n <= item.rating ? 1 : 0.3 }}>★</button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={() => onChange({ ...p, items: [...items, { name: "Nouveau client", text: "Excellent restaurant !", rating: 5 }] })}
              style={{ width: "100%", padding: "6px", borderRadius: 7, border: "1.5px dashed #E5E7EB", background: "transparent", cursor: "pointer", fontSize: 12, color: "var(--color-primary)", fontWeight: 600 }}
            >
              + Ajouter un avis
            </button>
          </div>
        </div>
      );
    }
    case "divider":
      return (
        <div>
          {field("Style", "style", "select", ["solid", "dashed", "dotted"])}
          {field("Couleur", "color", "color")}
        </div>
      );
    case "footer":
      return (
        <div>
          {field("Copyright", "copyright", "text")}
          {field("Adresse", "address", "text")}
          <div style={{ marginBottom: 10, paddingTop: 4, borderTop: "1px solid #F0F0F0" }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "var(--color-gray)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Réseaux sociaux</label>
          </div>
          {field("Instagram (URL)", "instagram", "text")}
          {field("Facebook (URL)", "facebook", "text")}
          {field("Site web (URL)", "website", "text")}
          {field("Fond", "bg", "color")}
          {field("Texte", "textColor", "color")}
        </div>
      );
    default:
      return <p style={{ fontSize: 12, color: "var(--color-gray)" }}>Sélectionnez un bloc</p>;
  }
}

// ─── Main Editor ──────────────────────────────────────────────────────────────

export default function EditorPage() {
  const [, params] = useRoute("/editor/:id");
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

  const [blocks, setBlocks] = useState<Block[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  const [saved, setSaved] = useState(false);
  const [history, setHistory] = useState<Block[][]>([[]]);
  const [histIdx, setHistIdx] = useState(0);
  const [initialized, setInitialized] = useState(false);
  const dragIndexRef = useRef<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Init blocks from server once data arrives
  useEffect(() => {
    if (!initialized && site) {
      const serverBlocks: Block[] = site?.content?.blocks ?? [];
      setBlocks(serverBlocks);
      setHistory([serverBlocks]);
      setInitialized(true);
    }
  }, [site, initialized]);

  const push = useCallback((next: Block[]) => {
    const sliced = history.slice(0, histIdx + 1);
    setHistory([...sliced, next]);
    setHistIdx(sliced.length);
    setBlocks(next);
  }, [history, histIdx]);

  const undo = () => {
    if (histIdx > 0) { setHistIdx(histIdx - 1); setBlocks(history[histIdx - 1]); }
  };
  const redo = () => {
    if (histIdx < history.length - 1) { setHistIdx(histIdx + 1); setBlocks(history[histIdx + 1]); }
  };

  const addBlock = (type: BlockType) => {
    const block: Block = { id: `${type}-${Date.now()}`, type, props: { ...DEFAULT_PROPS[type] } };
    const next = [...blocks, block];
    push(next);
    setSelectedId(block.id);
  };

  const deleteBlock = (id: string) => {
    push(blocks.filter(b => b.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const moveBlock = (id: string, dir: "up" | "down") => {
    const idx = blocks.findIndex(b => b.id === id);
    if (dir === "up" && idx === 0) return;
    if (dir === "down" && idx === blocks.length - 1) return;
    const next = [...blocks];
    const swap = dir === "up" ? idx - 1 : idx + 1;
    [next[idx], next[swap]] = [next[swap], next[idx]];
    push(next);
  };

  const updateProps = (id: string, props: Record<string, unknown>) => {
    const next = blocks.map(b => b.id === id ? { ...b, props } : b);
    push(next);
  };

  const reorderBlocks = (from: number, to: number) => {
    if (from === to) return;
    const next = [...blocks];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    push(next);
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      const res = await api.sites[":id"].$put({
        param: { id },
        json: { content: { blocks } },
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sites"] });
      queryClient.invalidateQueries({ queryKey: ["site", id] });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    },
  });

  const selectedBlock = blocks.find(b => b.id === selectedId);

  if (isLoading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#F8F9FA" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 40, height: 40, border: "3px solid var(--color-primary)", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
          <p style={{ color: "var(--color-gray)", fontSize: 14 }}>Chargement de l'éditeur...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#F0F2F5", fontFamily: "var(--font-body)" }}>
      {/* Toolbar */}
      <div style={{ height: 52, background: "white", borderBottom: "1px solid #E5E7EB", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--color-primary)", fontSize: 16 }}>Plato</span>
          <span style={{ color: "#E5E7EB" }}>·</span>
          <span style={{ fontSize: 13, color: "var(--color-dark)", fontWeight: 500 }}>{site?.name ?? "Éditeur"}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={undo} disabled={histIdx === 0} title="Annuler" style={{ padding: "6px 8px", borderRadius: 8, border: "1.5px solid #E5E7EB", background: "white", cursor: histIdx === 0 ? "not-allowed" : "pointer", opacity: histIdx === 0 ? 0.4 : 1 }}>
            <Undo size={14} color="var(--color-dark)" />
          </button>
          <button onClick={redo} disabled={histIdx === history.length - 1} title="Rétablir" style={{ padding: "6px 8px", borderRadius: 8, border: "1.5px solid #E5E7EB", background: "white", cursor: histIdx === history.length - 1 ? "not-allowed" : "pointer", opacity: histIdx === history.length - 1 ? 0.4 : 1 }}>
            <Redo size={14} color="var(--color-dark)" />
          </button>
          <button onClick={() => navigate(`/preview/${id}`, { replace: true })} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 8, border: "1.5px solid #E5E7EB", background: "white", cursor: "pointer", fontSize: 13, fontWeight: 500, color: "var(--color-dark)" }}>
            <Eye size={14} /> Aperçu
          </button>
          <button
            onClick={() => saveMutation.mutate()}
            disabled={saveMutation.isPending}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 16px", borderRadius: 8, background: saved ? "var(--color-success)" : "var(--color-primary)", color: "white", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, transition: "background 0.2s" }}
          >
            {saved ? <><CheckCircle size={14} /> Enregistré</> : <><Save size={14} /> {saveMutation.isPending ? "..." : "Sauvegarder"}</>}
          </button>
        </div>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Left panel — components */}
        <div style={{ width: leftOpen ? 220 : 0, minWidth: leftOpen ? 220 : 0, transition: "width 0.2s, min-width 0.2s", overflow: "hidden", background: "white", borderRight: "1px solid #E5E7EB", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "12px 14px 8px", borderBottom: "1px solid #E5E7EB" }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "var(--color-gray)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Composants</p>
          </div>
          <div style={{ overflowY: "auto", flex: 1, padding: 10 }}>
            {BLOCK_DEFS.map(def => (
              <button
                key={def.type}
                onClick={() => addBlock(def.type)}
                style={{ width: "100%", display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 12px", borderRadius: 10, border: "1.5px solid #E5E7EB", background: "white", cursor: "pointer", marginBottom: 6, textAlign: "left", transition: "all 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--color-primary)"; e.currentTarget.style.background = "rgba(255,107,53,0.04)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#E5E7EB"; e.currentTarget.style.background = "white"; }}
              >
                <span style={{ color: "var(--color-primary)", marginTop: 1 }}>{def.icon}</span>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 600, color: "var(--color-dark)", marginBottom: 1 }}>{def.label}</p>
                  <p style={{ fontSize: 10, color: "var(--color-gray)", lineHeight: 1.4 }}>{def.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Toggle left */}
        <button onClick={() => setLeftOpen(!leftOpen)} style={{ position: "absolute", left: leftOpen ? 226 : 6, top: "50%", transform: "translateY(-50%)", zIndex: 20, width: 22, height: 48, borderRadius: 6, background: "white", border: "1px solid #E5E7EB", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", transition: "left 0.2s" }}>
          {leftOpen ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
        </button>

        {/* Canvas */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 40px", display: "flex", flexDirection: "column", gap: 0 }}>
          {blocks.length === 0 ? (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 400, border: "2px dashed #D1D5DB", borderRadius: 16, padding: 40, textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🏗️</div>
              <h3 style={{ fontFamily: "var(--font-display)", color: "var(--color-dark)", fontSize: 18, marginBottom: 8 }}>Canvas vide</h3>
              <p style={{ color: "var(--color-gray)", fontSize: 13, marginBottom: 20 }}>Cliquez sur un composant à gauche pour commencer</p>
              <button onClick={() => addBlock("hero")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 10, background: "var(--color-primary)", color: "white", border: "none", cursor: "pointer", fontWeight: 600, fontSize: 13 }}>
                <Plus size={14} /> Ajouter un Hero
              </button>
            </div>
          ) : (
            <div style={{ maxWidth: 720, margin: "0 auto", width: "100%", display: "flex", flexDirection: "column", gap: 8 }}>
              {blocks.map((block, idx) => (
                <div
                  key={block.id}
                  style={{
                    position: "relative",
                    opacity: dragOverIndex === idx && dragIndexRef.current !== idx ? 0.5 : 1,
                    transition: "opacity 0.15s",
                  }}
                  draggable
                  onDragStart={() => { dragIndexRef.current = idx; }}
                  onDragOver={e => { e.preventDefault(); setDragOverIndex(idx); }}
                  onDragEnd={() => {
                    if (dragIndexRef.current !== null && dragOverIndex !== null) {
                      reorderBlocks(dragIndexRef.current, dragOverIndex);
                    }
                    dragIndexRef.current = null;
                    setDragOverIndex(null);
                  }}
                  onDrop={e => { e.preventDefault(); }}
                >
                  {/* Drag handle */}
                  <div
                    style={{ position: "absolute", left: -36, top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", gap: 2, zIndex: 5, cursor: "grab" }}
                    title="Glisser pour réordonner"
                  >
                    <div style={{ width: 26, height: 38, borderRadius: 6, background: "white", border: "1px solid #E5E7EB", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <GripVertical size={12} color="var(--color-gray)" />
                    </div>
                  </div>
                  {/* Delete */}
                  <button onClick={() => deleteBlock(block.id)} style={{ position: "absolute", right: -32, top: "50%", transform: "translateY(-50%)", width: 26, height: 26, borderRadius: 6, background: "white", border: "1px solid #FECACA", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 5 }}>
                    <Trash2 size={10} color="var(--color-danger)" />
                  </button>

                  {/* Drop indicator line */}
                  {dragOverIndex === idx && dragIndexRef.current !== null && dragIndexRef.current !== idx && (
                    <div style={{ position: "absolute", top: -3, left: 0, right: 0, height: 3, background: "var(--color-primary)", borderRadius: 2, zIndex: 10 }} />
                  )}

                  <div onClick={() => setSelectedId(block.id === selectedId ? null : block.id)}>
                    <BlockPreview block={block} selected={selectedId === block.id} />
                  </div>
                </div>
              ))}
              {/* Add block button */}
              <button
                onClick={() => addBlock("divider")}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px", borderRadius: 10, border: "2px dashed #D1D5DB", background: "transparent", cursor: "pointer", color: "var(--color-gray)", fontSize: 12, fontWeight: 500, marginTop: 8, transition: "all 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--color-primary)"; e.currentTarget.style.color = "var(--color-primary)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#D1D5DB"; e.currentTarget.style.color = "var(--color-gray)"; }}
              >
                <Plus size={14} /> Ajouter un bloc
              </button>
            </div>
          )}
        </div>

        {/* Right panel — properties */}
        <div style={{ width: rightOpen ? 240 : 0, minWidth: rightOpen ? 240 : 0, transition: "width 0.2s, min-width 0.2s", overflow: "hidden", background: "white", borderLeft: "1px solid #E5E7EB", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "12px 14px 8px", borderBottom: "1px solid #E5E7EB" }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "var(--color-gray)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Propriétés</p>
          </div>
          <div style={{ overflowY: "auto", flex: 1, padding: "14px 12px" }}>
            {selectedBlock ? (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <span style={{ padding: "3px 8px", borderRadius: 20, background: "rgba(255,107,53,0.1)", color: "var(--color-primary)", fontSize: 11, fontWeight: 600 }}>
                    {BLOCK_DEFS.find(d => d.type === selectedBlock.type)?.label}
                  </span>
                </div>
                <PropertiesPanel
                  block={selectedBlock}
                  onChange={props => updateProps(selectedBlock.id, props)}
                />
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "32px 16px" }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>🖱️</div>
                <p style={{ fontSize: 12, color: "var(--color-gray)", lineHeight: 1.6 }}>Cliquez sur un bloc pour modifier ses propriétés</p>
              </div>
            )}
          </div>
        </div>

        {/* Toggle right */}
        <button onClick={() => setRightOpen(!rightOpen)} style={{ position: "absolute", right: rightOpen ? 246 : 6, top: "50%", transform: "translateY(-50%)", zIndex: 20, width: 22, height: 48, borderRadius: 6, background: "white", border: "1px solid #E5E7EB", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", transition: "right 0.2s" }}>
          {rightOpen ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
