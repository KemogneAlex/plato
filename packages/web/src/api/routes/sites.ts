import { Hono } from "hono";
import { db } from "../database";
import * as schema from "../database/schema";
import { eq, and } from "drizzle-orm";
import { requireAuth, authMiddleware } from "../middleware/auth";

// Template data map (same as templates route)
const TEMPLATE_DATA: Record<string, unknown> = {
  "tpl-brasserie": { blocks: [
    { id: "hero-1", type: "hero", props: { title: "La Brasserie du Centre", subtitle: "Cuisine française authentique depuis 1985", cta: "Réserver une table", bg: "#1A1A2E", textColor: "#FFFFFF" } },
    { id: "menu-1", type: "menu", props: { title: "Notre Carte", items: [{ name: "Sole meunière", price: "28€", desc: "Beurre citronné, légumes de saison" }, { name: "Entrecôte grillée", price: "32€", desc: "Sauce béarnaise, frites maison" }, { name: "Crème brûlée", price: "9€", desc: "Recette traditionnelle" }] } },
    { id: "hours-1", type: "hours", props: { title: "Nos Horaires", rows: [{ day: "Lun–Ven", time: "12h–14h30 | 19h–22h30" }, { day: "Samedi", time: "12h–23h" }, { day: "Dimanche", time: "Fermé" }] } },
    { id: "contact-1", type: "contact", props: { title: "Nous trouver", address: "12 Rue de la Paix, 75001 Paris", phone: "+33 1 23 45 67 89", email: "contact@brasserie.fr" } },
  ]},
  "tpl-pizzeria": { blocks: [
    { id: "hero-1", type: "hero", props: { title: "Pizzeria Roma", subtitle: "Pâte à la napolitaine, ingrédients d'importation", cta: "Commander", bg: "#C0392B", textColor: "#FFFFFF" } },
    { id: "menu-1", type: "menu", props: { title: "Nos Pizzas", items: [{ name: "Margherita", price: "14€", desc: "Tomate, mozzarella, basilic frais" }, { name: "Quattro Stagioni", price: "17€", desc: "Jambon, champignons, olives, artichaut" }, { name: "Truffe Noire", price: "22€", desc: "Crème de truffe, parmesan, roquette" }] } },
    { id: "testimonials-1", type: "testimonials", props: { title: "Ce qu'ils disent", items: [{ name: "Sophie M.", text: "Les meilleures pizzas de Paris, pâte parfaite !", rating: 5 }, { name: "Thomas L.", text: "Toujours un régal, service rapide.", rating: 5 }] } },
    { id: "contact-1", type: "contact", props: { title: "Contact & Livraison", address: "34 Rue Nationale, Lyon", phone: "+33 4 78 12 34 56", email: "roma@pizzeria.fr" } },
  ]},
  "tpl-cafe": { blocks: [
    { id: "hero-1", type: "hero", props: { title: "Café Moderne", subtitle: "Specialty coffee & brunch du mardi au dimanche", cta: "Voir la carte", bg: "#6F4E37", textColor: "#FFFFFF" } },
    { id: "menu-1", type: "menu", props: { title: "Notre Carte", items: [{ name: "Flat White", price: "4,50€", desc: "Double espresso, lait texturé" }, { name: "Avocado Toast", price: "11€", desc: "Pain de campagne, avocat, œuf poché" }, { name: "Granola Bowl", price: "9€", desc: "Yaourt grec, fruits frais, miel" }] } },
    { id: "contact-1", type: "contact", props: { title: "Adresse", address: "22 Rue des Martyrs, 75009 Paris", phone: "+33 1 98 76 54 32", email: "bonjour@cafemoderne.fr" } },
  ]},
};

export const sites = new Hono()
  .use("*", authMiddleware)
  .get("/", requireAuth, async (c) => {
    const user = c.get("user")!;
    const userSites = await db
      .select()
      .from(schema.sites)
      .where(eq(schema.sites.userId, user.id));
    const parsed = userSites.map(s => ({ ...s, content: s.data ? JSON.parse(s.data) : {} }));
    return c.json({ sites: parsed }, 200);
  })
  .post("/", requireAuth, async (c) => {
    const user = c.get("user")!;
    const body = await c.req.json<{ name: string; templateId?: string }>();
    const slug = body.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") + "-" + Date.now();
    // If templateId given, copy template content into site data
    const initialData = body.templateId && TEMPLATE_DATA[body.templateId]
      ? JSON.stringify(TEMPLATE_DATA[body.templateId])
      : "{}";
    const [site] = await db
      .insert(schema.sites)
      .values({
        userId: user.id,
        name: body.name,
        slug,
        templateId: body.templateId ?? null,
        data: initialData,
        status: "draft",
      })
      .returning();
    const parsed = { ...site, content: site.data ? JSON.parse(site.data) : {} };
    return c.json({ site: parsed }, 201);
  })
  .get("/:id", requireAuth, async (c) => {
    const user = c.get("user")!;
    const { id } = c.req.param();
    const [site] = await db
      .select()
      .from(schema.sites)
      .where(and(eq(schema.sites.id, id), eq(schema.sites.userId, user.id)));
    if (!site) return c.json({ message: "Site not found" }, 404);
    const parsed = { ...site, content: site.data ? JSON.parse(site.data) : {} };
    return c.json({ site: parsed }, 200);
  })
  .put("/:id", requireAuth, async (c) => {
    const user = c.get("user")!;
    const { id } = c.req.param();
    const body = await c.req.json<{ name?: string; content?: unknown; customDomain?: string }>();
    const updatePayload: Record<string, unknown> = { updatedAt: new Date() };
    if (body.name !== undefined) updatePayload.name = body.name;
    if (body.customDomain !== undefined) updatePayload.customDomain = body.customDomain;
    if (body.content !== undefined) updatePayload.data = JSON.stringify(body.content);
    const [site] = await db
      .update(schema.sites)
      .set(updatePayload as any)
      .where(and(eq(schema.sites.id, id), eq(schema.sites.userId, user.id)))
      .returning();
    if (!site) return c.json({ message: "Site not found" }, 404);
    // Parse data back to object before returning
    const parsed = { ...site, content: site.data ? JSON.parse(site.data) : {} };
    return c.json({ site: parsed }, 200);
  })
  .delete("/:id", requireAuth, async (c) => {
    const user = c.get("user")!;
    const { id } = c.req.param();
    await db
      .delete(schema.sites)
      .where(and(eq(schema.sites.id, id), eq(schema.sites.userId, user.id)));
    return c.json({ success: true }, 200);
  })
  .post("/:id/publish", requireAuth, async (c) => {
    const user = c.get("user")!;
    const { id } = c.req.param();
    const [site] = await db
      .update(schema.sites)
      .set({ status: "published", updatedAt: new Date() })
      .where(and(eq(schema.sites.id, id), eq(schema.sites.userId, user.id)))
      .returning();
    if (!site) return c.json({ message: "Site not found" }, 404);
    return c.json({ site }, 200);
  })
  .post("/:id/unpublish", requireAuth, async (c) => {
    const user = c.get("user")!;
    const { id } = c.req.param();
    const [site] = await db
      .update(schema.sites)
      .set({ status: "draft", updatedAt: new Date() })
      .where(and(eq(schema.sites.id, id), eq(schema.sites.userId, user.id)))
      .returning();
    if (!site) return c.json({ message: "Site not found" }, 404);
    return c.json({ site }, 200);
  });
