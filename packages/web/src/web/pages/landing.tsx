import { Link } from "wouter";
import { useState, useEffect } from "react";
import { ChefHat, Zap, Palette, Globe, Star, CheckCircle, ArrowRight, Menu, X } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Éditeur drag & drop",
    desc: "Construisez votre site visuellement, sans coder. Déplacez, redimensionnez, personnalisez en temps réel.",
  },
  {
    icon: Palette,
    title: "Templates professionnels",
    desc: "Choisissez parmi nos templates conçus spécialement pour les restaurants, brasseries, cafés et plus.",
  },
  {
    icon: Globe,
    title: "Publication en 1 clic",
    desc: "Publiez votre site instantanément. Domaine custom, SSL inclus, hébergement géré.",
  },
];

const steps = [
  { num: "01", title: "Choisissez un template", desc: "Sélectionnez parmi nos templates restaurant et personnalisez-le à votre image." },
  { num: "02", title: "Personnalisez", desc: "Glissez-déposez vos sections, ajoutez votre menu, vos photos, vos horaires." },
  { num: "03", title: "Publiez", desc: "Mettez votre site en ligne en un clic. Votre restaurant sera visible partout." },
];

const testimonials = [
  { name: "Marie Dupont", role: "Propriétaire, Brasserie du Port", text: "Plato m'a permis de créer un site pro en une soirée. Mes clients le trouvent super.", rating: 5 },
  { name: "Karim Benzali", role: "Chef, Le Palais Oriental", text: "Interface intuitive, templates magnifiques. Je recommande à tous les restaurateurs.", rating: 5 },
  { name: "Sophie Martin", role: "Gérante, Café des Arts", text: "Enfin un outil pensé pour les restaurateurs. Simple, rapide, efficace.", rating: 5 },
];

const plans = [
  {
    name: "Starter",
    price: { monthly: "29", yearly: "23" },
    desc: "Idéal pour débuter",
    features: ["1 site", "10 templates", "Sous-domaine Plato", "Support email", "SSL inclus"],
    cta: "Commencer gratuitement",
    highlighted: false,
  },
  {
    name: "Pro",
    price: { monthly: "79", yearly: "63" },
    desc: "Pour les pros et agences",
    features: ["Sites illimités", "Tous les templates", "Domaine custom", "Support prioritaire", "Export du site", "Analytics avancés"],
    cta: "Essai gratuit 14 jours",
    highlighted: true,
  },
];

const logos = ["Le Figaro", "TripAdvisor", "Google", "Deliveroo", "Yelp"];

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [billingYearly, setBillingYearly] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen" style={{ fontFamily: "var(--font-body)" }}>
      {/* Navbar */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? "rgba(255,255,255,0.95)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          boxShadow: scrolled ? "0 1px 20px rgba(0,0,0,0.08)" : "none",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--color-primary)" }}>
              <ChefHat size={18} color="white" />
            </div>
            <span className="font-bold text-xl" style={{ fontFamily: "var(--font-display)", color: scrolled ? "var(--color-dark)" : "white" }}>Plato</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {["Features", "Templates", "Tarifs"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-medium transition-colors"
                style={{ color: scrolled ? "var(--color-gray)" : "rgba(255,255,255,0.85)" }}
                onMouseEnter={e => e.currentTarget.style.color = scrolled ? "var(--color-dark)" : "white"}
                onMouseLeave={e => e.currentTarget.style.color = scrolled ? "var(--color-gray)" : "rgba(255,255,255,0.85)"}
              >{item}</a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link to="/login">
              <a className="text-sm font-medium px-4 py-2 rounded-lg transition-all"
                style={{ color: scrolled ? "var(--color-dark)" : "white" }}>
                Connexion
              </a>
            </Link>
            <Link to="/register">
              <a className="text-sm font-semibold px-5 py-2 rounded-lg transition-all"
                style={{ background: scrolled ? "var(--color-primary)" : "white", color: scrolled ? "white" : "var(--color-primary)" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
              >
                Commencer gratuitement
              </a>
            </Link>
          </div>

          <button className="md:hidden" onClick={() => setMobileNav(!mobileNav)} style={{ color: scrolled ? "var(--color-dark)" : "white" }}>
            {mobileNav ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {mobileNav && (
          <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 space-y-3">
            {["Features", "Templates", "Tarifs"].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} className="block text-sm font-medium py-2" style={{ color: "var(--color-gray)" }} onClick={() => setMobileNav(false)}>{item}</a>
            ))}
            <Link to="/login"><a className="block text-sm font-medium py-2" style={{ color: "var(--color-dark)" }}>Connexion</a></Link>
            <Link to="/register">
              <a className="block text-sm font-semibold px-4 py-2.5 rounded-lg text-center text-white" style={{ background: "var(--color-primary)" }}>
                Commencer gratuitement
              </a>
            </Link>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section style={{ background: "var(--color-primary)", paddingTop: "80px", position: "relative", overflow: "hidden" }}>
        {/* Background decoration */}
        <div style={{ position: "absolute", top: -100, right: -100, width: 400, height: 400, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
        <div style={{ position: "absolute", bottom: 50, left: -80, width: 280, height: 280, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />

        <div className="max-w-6xl mx-auto px-6 py-20 md:py-28 relative">
          <div className="max-w-2xl animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6"
              style={{ background: "rgba(255,255,255,0.2)", color: "white", backdropFilter: "blur(8px)" }}>
              <Star size={12} fill="white" />
              Utilisé par 500+ restaurants
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight" style={{ color: "white", fontFamily: "var(--font-display)" }}>
              Créez le site de votre restaurant{" "}
              <span style={{ color: "rgba(255,255,255,0.8)", fontStyle: "italic" }}>en minutes</span>
            </h1>
            <p className="text-lg md:text-xl mb-8 leading-relaxed" style={{ color: "rgba(255,255,255,0.85)" }}>
              Plato est le page builder conçu spécialement pour les restaurateurs. Drag & drop, templates pro, publication en 1 clic. Sans coder.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/register">
                <a className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-base transition-all"
                  style={{ background: "white", color: "var(--color-primary)" }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.15)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
                >
                  Créer mon site gratuitement
                  <ArrowRight size={18} />
                </a>
              </Link>
              <a href="#features" className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl font-semibold text-base transition-all"
                style={{ background: "rgba(255,255,255,0.15)", color: "white", border: "1px solid rgba(255,255,255,0.3)" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.22)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
              >
                Voir les templates
              </a>
            </div>
          </div>
        </div>

        {/* Wave SVG */}
        <div style={{ lineHeight: 0 }}>
          <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" style={{ display: "block", width: "100%" }}>
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* Trust logos */}
      <section className="py-10" style={{ background: "white" }}>
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-center text-sm font-medium mb-6" style={{ color: "var(--color-gray)" }}>Mentionné et intégré avec</p>
          <div className="flex items-center justify-center gap-8 flex-wrap">
            {logos.map((logo) => (
              <span key={logo} className="text-base font-semibold" style={{ color: "var(--color-gray)", opacity: 0.5, fontFamily: "var(--font-display)" }}>{logo}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20" style={{ background: "var(--color-gray-light)" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: "var(--font-display)", color: "var(--color-dark)" }}>
              Tout ce dont votre restaurant a besoin
            </h2>
            <p className="text-lg max-w-xl mx-auto" style={{ color: "var(--color-gray)" }}>
              Un outil complet, pensé pour les restaurateurs. Pas de compétences techniques requises.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc }, i) => (
              <div key={i} className="p-6 rounded-2xl transition-all duration-200"
                style={{ background: "white", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.06)"; e.currentTarget.style.transform = "none"; }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: "rgba(255,107,53,0.1)" }}>
                  <Icon size={24} style={{ color: "var(--color-primary)" }} />
                </div>
                <h3 className="font-semibold text-lg mb-2" style={{ fontFamily: "var(--font-display)", color: "var(--color-dark)" }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--color-gray)" }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates */}
      <section id="templates" className="py-20" style={{ background: "white" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: "var(--font-display)", color: "var(--color-dark)" }}>
              Templates pour tous les restaurants
            </h2>
            <p className="text-lg max-w-xl mx-auto" style={{ color: "var(--color-gray)" }}>
              Choisissez, personnalisez, publiez. Chaque template est optimisé mobile et SEO.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[
              { name: "La Brasserie", cat: "Brasserie", img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80", pro: false },
              { name: "Pizzeria Roma", cat: "Pizzeria", img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80", pro: false },
              { name: "Sushi Bar", cat: "Japonais", img: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&q=80", pro: true },
              { name: "Burger Spot", cat: "Burger", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80", pro: false },
              { name: "Café Moderne", cat: "Café", img: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&q=80", pro: false },
              { name: "Gastronomie", cat: "Gastronomique", img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80", pro: true },
            ].map((tpl, i) => (
              <div key={i} className="rounded-xl overflow-hidden group cursor-pointer transition-all duration-200"
                style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.14)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.08)"; e.currentTarget.style.transform = "none"; }}
              >
                <div className="relative overflow-hidden" style={{ height: 180 }}>
                  <img src={tpl.img} alt={tpl.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  {tpl.pro && (
                    <div className="absolute top-3 right-3 px-2 py-1 rounded-md text-xs font-semibold"
                      style={{ background: "var(--color-primary)", color: "white" }}>Pro</div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    style={{ background: "rgba(26,26,46,0.6)" }}>
                    <Link to="/register">
                      <a className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ background: "white", color: "var(--color-dark)" }}>
                        Utiliser ce template
                      </a>
                    </Link>
                  </div>
                </div>
                <div className="p-4 bg-white">
                  <p className="font-semibold text-sm" style={{ fontFamily: "var(--font-display)", color: "var(--color-dark)" }}>{tpl.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--color-gray)" }}>{tpl.cat}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/register">
              <a className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all"
                style={{ background: "var(--color-primary)", color: "white" }}
                onMouseEnter={e => { e.currentTarget.style.background = "var(--color-primary-dark)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "var(--color-primary)"; e.currentTarget.style.transform = "none"; }}
              >
                Voir tous les templates <ArrowRight size={16} />
              </a>
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20" style={{ background: "var(--color-dark)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 300, height: 300, borderRadius: "50%", background: "rgba(255,107,53,0.06)" }} />
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: "var(--font-display)", color: "white" }}>
              Votre site en 3 étapes
            </h2>
            <p className="text-lg" style={{ color: "rgba(255,255,255,0.6)" }}>Simple, rapide, efficace.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="text-center">
                <div className="text-5xl font-bold mb-4" style={{ color: "var(--color-primary)", opacity: 0.3, fontFamily: "var(--font-display)" }}>{step.num}</div>
                <h3 className="font-semibold text-lg mb-3" style={{ fontFamily: "var(--font-display)", color: "white" }}>{step.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="tarifs" className="py-20" style={{ background: "var(--color-gray-light)" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: "var(--font-display)", color: "var(--color-dark)" }}>
              Des tarifs transparents
            </h2>
            <div className="inline-flex items-center gap-2 p-1 rounded-lg mt-2" style={{ background: "white", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
              <button onClick={() => setBillingYearly(false)} className="px-4 py-1.5 rounded-md text-sm font-medium transition-all"
                style={{ background: !billingYearly ? "var(--color-primary)" : "transparent", color: !billingYearly ? "white" : "var(--color-gray)" }}>
                Mensuel
              </button>
              <button onClick={() => setBillingYearly(true)} className="px-4 py-1.5 rounded-md text-sm font-medium transition-all"
                style={{ background: billingYearly ? "var(--color-primary)" : "transparent", color: billingYearly ? "white" : "var(--color-gray)" }}>
                Annuel <span className="text-xs ml-1 opacity-75">-20%</span>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {plans.map((plan, i) => (
              <div key={i} className="p-8 rounded-2xl"
                style={{
                  background: plan.highlighted ? "var(--color-primary)" : "white",
                  boxShadow: plan.highlighted ? "0 12px 40px rgba(255,107,53,0.3)" : "0 1px 4px rgba(0,0,0,0.06)",
                  transform: plan.highlighted ? "scale(1.02)" : "none",
                }}>
                <p className="text-sm font-semibold mb-1" style={{ color: plan.highlighted ? "rgba(255,255,255,0.8)" : "var(--color-gray)" }}>{plan.desc}</p>
                <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: "var(--font-display)", color: plan.highlighted ? "white" : "var(--color-dark)" }}>{plan.name}</h3>
                <div className="flex items-end gap-1 mb-6">
                  <span className="text-4xl font-bold" style={{ fontFamily: "var(--font-display)", color: plan.highlighted ? "white" : "var(--color-dark)" }}>
                    {billingYearly ? plan.price.yearly : plan.price.monthly}€
                  </span>
                  <span className="text-sm mb-1" style={{ color: plan.highlighted ? "rgba(255,255,255,0.7)" : "var(--color-gray)" }}>/mois</span>
                </div>
                <ul className="space-y-2 mb-8">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm">
                      <CheckCircle size={15} style={{ color: plan.highlighted ? "white" : "var(--color-success)", flexShrink: 0 }} />
                      <span style={{ color: plan.highlighted ? "rgba(255,255,255,0.9)" : "var(--color-dark)" }}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/register">
                  <a className="block text-center px-6 py-3 rounded-xl font-semibold text-sm transition-all"
                    style={{
                      background: plan.highlighted ? "white" : "var(--color-primary)",
                      color: plan.highlighted ? "var(--color-primary)" : "white",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)"; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
                  >
                    {plan.cta}
                  </a>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20" style={{ background: "white" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: "var(--font-display)", color: "var(--color-dark)" }}>
              Ce que disent nos clients
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="p-6 rounded-2xl" style={{ background: "var(--color-gray-light)" }}>
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={14} fill="var(--color-warning)" style={{ color: "var(--color-warning)" }} />
                  ))}
                </div>
                <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--color-dark)" }}>"{t.text}"</p>
                <div>
                  <p className="font-semibold text-sm" style={{ fontFamily: "var(--font-display)", color: "var(--color-dark)" }}>{t.name}</p>
                  <p className="text-xs" style={{ color: "var(--color-gray)" }}>{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-20" style={{ background: "var(--color-primary)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -80, right: -80, width: 350, height: 350, borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />
        <div className="max-w-2xl mx-auto px-6 text-center relative">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: "var(--font-display)", color: "white" }}>
            Prêt à lancer votre site restaurant ?
          </h2>
          <p className="text-lg mb-8" style={{ color: "rgba(255,255,255,0.8)" }}>
            Rejoignez des centaines de restaurateurs qui font confiance à Plato.
          </p>
          <Link to="/register">
            <a className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-base transition-all"
              style={{ background: "white", color: "var(--color-primary)" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.15)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
            >
              Commencer gratuitement <ArrowRight size={18} />
            </a>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10" style={{ background: "var(--color-dark)" }}>
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "var(--color-primary)" }}>
              <ChefHat size={15} color="white" />
            </div>
            <span className="font-bold text-base" style={{ fontFamily: "var(--font-display)", color: "white" }}>Plato</span>
          </div>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>© 2026 Plato. Tous droits réservés.</p>
          <div className="flex gap-6">
            {["Confidentialité", "CGU", "Contact"].map(item => (
              <a key={item} href="#" className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>{item}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
