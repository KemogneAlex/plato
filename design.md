# Plato — Design System

## Inspiration
Shopify-style landing: bold hero with colored background cutting into white via wave/diagonal shape. Clean, confident, conversion-focused.

## Brand
- **Name:** Plato
- **Tagline:** Créez le site de votre restaurant en minutes.
- **Audience:** Restaurateurs (non-techniques) + Agences web / freelances

## Colors
```css
--color-primary: #FF6B35;       /* Orange chaud — dominant */
--color-primary-dark: #E85520;  /* Hover states */
--color-primary-light: #FF8C5A; /* Highlights */
--color-dark: #1A1A2E;          /* Navy dark — text, footer bg */
--color-dark-2: #16213E;        /* Cards, sidebar */
--color-gray: #6B7280;          /* Secondary text */
--color-gray-light: #F3F4F6;    /* Background sections */
--color-white: #FFFFFF;
--color-success: #10B981;
--color-danger: #EF4444;
--color-warning: #F59E0B;
```

## Typography
- **Display:** Poppins (700, 600) — titres hero, headings
- **Body:** Inter (400, 500) — texte courant, labels, UI
- **Mono:** JetBrains Mono — code snippets uniquement

### Scale
- Hero title: 56px / 700 / line-height 1.1
- H1: 40px / 700
- H2: 32px / 600
- H3: 24px / 600
- Body: 16px / 400 / line-height 1.6
- Small: 14px / 400
- Label: 12px / 500 / uppercase + tracking

## Layout
- **Max width:** 1200px, centered
- **Grid:** 12 columns, gap 24px
- **Sections:** padding 80px vertical (landing), 40px (app)
- **Border radius:** 12px (cards), 8px (inputs/buttons), 4px (badges)
- Hero: fond orange (#FF6B35) avec wave SVG en bas vers blanc

## Components

### Buttons
- **Primary:** bg-primary, text-white, px-6 py-3, rounded-lg, font-semibold — hover: bg-primary-dark, shadow-lg
- **Secondary:** border border-primary, text-primary — hover: bg-primary/10
- **Ghost:** text-gray — hover: text-dark bg-gray-light
- **Danger:** bg-red-500 text-white

### Cards (Dashboard)
- bg-white, border border-gray-200, rounded-xl, shadow-sm
- hover: shadow-md, border-primary/30
- Padding: 24px

### Form Inputs
- border border-gray-300, rounded-lg, px-4 py-3, focus: border-primary ring-2 ring-primary/20
- Error: border-red-400

### Navigation (App)
- Sidebar: bg-dark-2 (#16213E), text-white, width 240px
- Active item: bg-primary/20 text-primary border-l-2 border-primary
- Top nav (landing): transparent → bg-white on scroll

### Badges
- Draft: bg-gray-100 text-gray-600
- Published: bg-green-100 text-green-700
- Template: bg-primary/10 text-primary

## Motion
- Page transitions: fade + slide up (200ms ease-out)
- Cards: hover scale(1.01) 150ms
- Buttons: active scale(0.97) 100ms
- Sidebar items: translateX on active

## Landing Page Sections
1. **Navbar** — logo + nav links + CTA button (sticky, blur backdrop)
2. **Hero** — fond orange, titre bold, sous-titre, 2 CTAs, mockup editor à droite, wave vers blanc
3. **Logos confiance** — "Utilisé par 500+ restaurants"
4. **Features** — 3 colonnes, icône + titre + description
5. **Templates** — grid de templates restaurant avec preview hover
6. **How it works** — 3 étapes numérotées
7. **Pricing** — 2 plans (Starter / Pro), toggle mensuel/annuel
8. **Testimonials** — carousel de témoignages restaurateurs
9. **CTA final** — fond orange, headline, bouton
10. **Footer** — liens, réseaux, copyright 2026

## App UI (Dashboard / Editor)
- Sidebar gauche fixe (240px) + contenu principal
- Header avec breadcrumb + user avatar
- Editor: 3 panneaux — sidebar composants (gauche) + canvas central + properties (droite)
- Preview: toggle mobile/desktop dans le header
