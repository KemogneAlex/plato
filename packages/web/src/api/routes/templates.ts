import { Hono } from "hono";
import { db } from "../database";
import * as schema from "../database/schema";

const BRASSERIE_BLOCKS = {
  blocks: [
    { id: "navbar-1", type: "navbar", props: { logo: "La Brasserie du Centre", links: ["Accueil", "Menu", "Horaires", "Contact", "Réserver"], bg: "#FFFFFF", textColor: "#1A1A2E", logoUrl: "" } },
    { id: "hero-1", type: "hero", props: { title: "La Brasserie du Centre", subtitle: "Cuisine française authentique depuis 1985", cta: "Réserver une table", bg: "#1A1A2E", textColor: "#FFFFFF" } },
    { id: "menu-1", type: "menu", props: { title: "Notre Carte", items: [{ name: "Sole meunière", price: "28€", desc: "Beurre citronné, légumes de saison" }, { name: "Entrecôte grillée", price: "32€", desc: "Sauce béarnaise, frites maison" }, { name: "Crème brûlée", price: "9€", desc: "Recette traditionnelle" }] } },
    { id: "hours-1", type: "hours", props: { title: "Nos Horaires", rows: [{ day: "Lun–Ven", time: "12h–14h30 | 19h–22h30" }, { day: "Samedi", time: "12h–23h" }, { day: "Dimanche", time: "Fermé" }] } },
    { id: "contact-1", type: "contact", props: { title: "Nous trouver", address: "12 Rue de la Paix, 75001 Paris", phone: "+33 1 23 45 67 89", email: "contact@brasserie.fr" } },
  ]
};

const PIZZERIA_BLOCKS = {
  blocks: [
    { id: "navbar-1", type: "navbar", props: { logo: "Pizzeria Roma", links: ["Accueil", "Pizzas", "Galerie", "Contact", "Commander"], bg: "#FFFFFF", textColor: "#1A1A2E", logoUrl: "" } },
    { id: "hero-1", type: "hero", props: { title: "Pizzeria Roma", subtitle: "Pâte à la napolitaine, ingrédients d'importation", cta: "Commander", bg: "#C0392B", textColor: "#FFFFFF" } },
    { id: "menu-1", type: "menu", props: { title: "Nos Pizzas", items: [{ name: "Margherita", price: "14€", desc: "Tomate, mozzarella, basilic frais" }, { name: "Quattro Stagioni", price: "17€", desc: "Jambon, champignons, olives, artichaut" }, { name: "Truffe Noire", price: "22€", desc: "Crème de truffe, parmesan, roquette" }] } },
    { id: "testimonials-1", type: "testimonials", props: { title: "Ce qu'ils disent", items: [{ name: "Sophie M.", text: "Les meilleures pizzas de Paris, pâte parfaite !", rating: 5 }, { name: "Thomas L.", text: "Toujours un régal, service rapide.", rating: 5 }] } },
    { id: "contact-1", type: "contact", props: { title: "Contact & Livraison", address: "34 Rue Nationale, Lyon", phone: "+33 4 78 12 34 56", email: "roma@pizzeria.fr" } },
  ]
};

const SUSHI_BLOCKS = {
  blocks: [
    { id: "navbar-1", type: "navbar", props: { logo: "Sushi Bar Osaka", links: ["Accueil", "Menu", "Galerie", "Contact", "Réserver"], bg: "#2C3E50", textColor: "#FFFFFF", logoUrl: "" } },
    { id: "hero-1", type: "hero", props: { title: "Sushi Bar Osaka", subtitle: "L'art culinaire japonais au cœur de Paris", cta: "Réserver", bg: "#2C3E50", textColor: "#FFFFFF" } },
    { id: "menu-1", type: "menu", props: { title: "Menu Omakase", items: [{ name: "Salmon Nigiri (x2)", price: "12€", desc: "Saumon Label Rouge, wasabi maison" }, { name: "Dragon Roll (8 pcs)", price: "18€", desc: "Avocat, crevette tempura, tobiko" }, { name: "Chirashi Thon", price: "24€", desc: "Riz shari, thon rouge, concombre" }] } },
    { id: "gallery-1", type: "gallery", props: { title: "Notre Cuisine", cols: 3 } },
    { id: "contact-1", type: "contact", props: { title: "Réservation", address: "8 Rue Saint-Anne, 75001 Paris", phone: "+33 1 45 67 89 01", email: "osaka@sushibar.fr" } },
  ]
};

const BURGER_BLOCKS = {
  blocks: [
    { id: "navbar-1", type: "navbar", props: { logo: "Burger Spot", links: ["Accueil", "Menu", "Horaires", "Contact", "Commander"], bg: "#FFFFFF", textColor: "#1A1A2E", logoUrl: "" } },
    { id: "hero-1", type: "hero", props: { title: "Burger Spot", subtitle: "Des burgers qui déchirent, des ingrédients qui claquent", cta: "Voir la carte", bg: "#E67E22", textColor: "#FFFFFF" } },
    { id: "menu-1", type: "menu", props: { title: "Nos Burgers", items: [{ name: "Classic Smash", price: "13€", desc: "Double patty, cheddar fondu, sauce maison" }, { name: "BBQ Ranch", price: "15€", desc: "Bacon croustillant, oignons caramélisés" }, { name: "Veggie Deluxe", price: "12€", desc: "Steak de légumes, avocat, tomate confite" }] } },
    { id: "hours-1", type: "hours", props: { title: "Ouvert tous les jours", rows: [{ day: "Lun–Jeu", time: "11h30–22h" }, { day: "Ven–Sam", time: "11h30–23h" }, { day: "Dimanche", time: "12h–21h" }] } },
    { id: "contact-1", type: "contact", props: { title: "Viens nous voir", address: "56 Avenue de la République, Bordeaux", phone: "+33 5 56 78 90 12", email: "hello@burgerspot.fr" } },
  ]
};

const CAFE_BLOCKS = {
  blocks: [
    { id: "navbar-1", type: "navbar", props: { logo: "Café Moderne", links: ["Accueil", "Carte", "Brunch", "Contact", "Réserver"], bg: "#FFFFFF", textColor: "#1A1A2E", logoUrl: "" } },
    { id: "hero-1", type: "hero", props: { title: "Café Moderne", subtitle: "Specialty coffee & brunch du mardi au dimanche", cta: "Voir la carte", bg: "#6F4E37", textColor: "#FFFFFF" } },
    { id: "menu-1", type: "menu", props: { title: "Notre Carte", items: [{ name: "Flat White", price: "4,50€", desc: "Double espresso, lait texturé" }, { name: "Avocado Toast", price: "11€", desc: "Pain de campagne, avocat, œuf poché" }, { name: "Granola Bowl", price: "9€", desc: "Yaourt grec, fruits frais, miel" }] } },
    { id: "testimonials-1", type: "testimonials", props: { title: "Ils adorent", items: [{ name: "Léa B.", text: "Meilleur café de quartier, ambiance super.", rating: 5 }] } },
    { id: "contact-1", type: "contact", props: { title: "Adresse", address: "22 Rue des Martyrs, 75009 Paris", phone: "+33 1 98 76 54 32", email: "bonjour@cafemoderne.fr" } },
  ]
};

const GASTRO_BLOCKS = {
  blocks: [
    { id: "navbar-1", type: "navbar", props: { logo: "Le Jardin des Saveurs", links: ["Accueil", "Menu", "L'histoire", "Contact", "Réserver"], bg: "#0D0D0D", textColor: "#F5E6C8", logoUrl: "" } },
    { id: "hero-1", type: "hero", props: { title: "Le Jardin des Saveurs", subtitle: "Gastronomie française — Table étoilée Michelin", cta: "Réserver votre table", bg: "#0D0D0D", textColor: "#F5E6C8" } },
    { id: "text-1", type: "text", props: { content: "Une expérience culinaire d'exception dans un cadre intimiste. Le chef Armand Dubois vous propose des créations saisonnières inspirées du terroir français, sublimées par des techniques contemporaines.", align: "center", size: "md" } },
    { id: "menu-1", type: "menu", props: { title: "Menu Dégustation", items: [{ name: "Amuse-bouche", price: "–", desc: "Surprise du chef" }, { name: "Saint-Jacques poêlées", price: "42€", desc: "Velouté de châtaigne, truffe blanche" }, { name: "Filet de bœuf Wagyu", price: "68€", desc: "Jus réduit, moelle, légumes racines" }, { name: "Soufflé Grand Marnier", price: "18€", desc: "Crème anglaise vanille Bourbon" }] } },
    { id: "contact-1", type: "contact", props: { title: "Réservations", address: "1 Place Vendôme, 75001 Paris", phone: "+33 1 40 20 72 10", email: "reservation@lejardin.fr" } },
  ]
};

const TEMPLATE_DATA: Record<string, { blocks: unknown[] }> = {
  "tpl-brasserie": BRASSERIE_BLOCKS,
  "tpl-pizzeria": PIZZERIA_BLOCKS,
  "tpl-sushi": SUSHI_BLOCKS,
  "tpl-burger": BURGER_BLOCKS,
  "tpl-cafe": CAFE_BLOCKS,
  "tpl-gastronomie": GASTRO_BLOCKS,
};

const SEED_TEMPLATES = [
  { id: "tpl-brasserie", name: "La Brasserie", category: "restaurant", isPro: false, thumbnail: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80", data: JSON.stringify(BRASSERIE_BLOCKS) },
  { id: "tpl-pizzeria", name: "Pizzeria Roma", category: "restaurant", isPro: false, thumbnail: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80", data: JSON.stringify(PIZZERIA_BLOCKS) },
  { id: "tpl-sushi", name: "Sushi Bar", category: "restaurant", isPro: true, thumbnail: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&q=80", data: JSON.stringify(SUSHI_BLOCKS) },
  { id: "tpl-burger", name: "Burger Spot", category: "restaurant", isPro: false, thumbnail: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80", data: JSON.stringify(BURGER_BLOCKS) },
  { id: "tpl-cafe", name: "Café Moderne", category: "cafe", isPro: false, thumbnail: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&q=80", data: JSON.stringify(CAFE_BLOCKS) },
  { id: "tpl-gastronomie", name: "Gastronomie", category: "restaurant", isPro: true, thumbnail: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80", data: JSON.stringify(GASTRO_BLOCKS) },
];

export const templates = new Hono()
  .get("/", async (c) => {
    let dbTemplates = await db.select().from(schema.templates);
    if (dbTemplates.length === 0) {
      await db.insert(schema.templates).values(SEED_TEMPLATES).onConflictDoNothing();
      dbTemplates = await db.select().from(schema.templates);
    }
    // Always update data with latest blocks (in case seed changed)
    const result = dbTemplates.map(t => ({
      ...t,
      data: TEMPLATE_DATA[t.id] ? JSON.stringify(TEMPLATE_DATA[t.id]) : t.data,
    }));
    return c.json({ templates: result }, 200);
  })
  .get("/:id/data", async (c) => {
    const { id } = c.req.param();
    const data = TEMPLATE_DATA[id];
    if (!data) return c.json({ message: "Template not found" }, 404);
    return c.json({ data }, 200);
  });
