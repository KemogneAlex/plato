# Plato — Page Builder pour Restaurants

## Stack
- **Frontend** : React 19 + Vite + Wouter
- **Backend** : Hono + Bun
- **DB** : Turso (libSQL / SQLite)
- **Auth** : Better-Auth
- **Deploy** : Render (backend + frontend servis ensemble)
- **CI/CD** : GitHub Actions → push main → deploy automatique

---

## 1. Installation locale

```bash
# Cloner
git clone https://github.com/KemogneAlex/plato.git
cd plato

# Installer Bun si pas encore fait
curl -fsSL https://bun.sh/install | bash

# Installer les dépendances
bun install

# Copier les variables d'environnement
cp .env.example .env
# → Remplis .env avec tes vraies valeurs (voir section Variables)
```

---

## 2. Variables d'environnement

Copie `.env.example` → `.env` et remplis :

| Variable | Description | Où l'obtenir |
|---|---|---|
| `DATABASE_URL` | URL Turso | [turso.tech](https://turso.tech) → Create database |
| `DATABASE_AUTH_TOKEN` | Token Turso | Turso dashboard → Generate token |
| `BETTER_AUTH_SECRET` | Secret JWT | `openssl rand -base64 32` |
| `BETTER_AUTH_URL` | URL de l'app | `http://localhost:3000` en dev |
| `WEBSITE_URL` | URL frontend | `http://localhost:5173` en dev |

---

## 3. Dev local

```bash
# Terminal 1 — API (port 3001)
cd packages/web && bun src/server.ts

# Terminal 2 — Frontend avec HMR (port 5173... ou 4200)
cd packages/web && bun run dev
```

Ouvre **http://localhost:5173** (ou le port affiché par Vite).

> En dev, Vite proxifie les requêtes `/api` vers le server Bun automatiquement (voir `vite/plugins/hono-dev-plugin.ts`).

---

## 4. Push → CI/CD automatique

```bash
git add .
git commit -m "feat: ma nouvelle feature"
git push origin main
```

→ GitHub Actions se déclenche :
1. **Typecheck** (tsc --noEmit)
2. **Build** (vite build)
3. **Deploy** → envoie un webhook à Render qui redéploie

**Durée** : ~3-4 minutes

---

## 5. Configurer Render (une seule fois)

1. Va sur [render.com](https://render.com) → New Web Service
2. Connecte ton GitHub → sélectionne le repo `plato`
3. Render détecte `render.yaml` automatiquement
4. Ajoute les variables d'environnement dans Render Dashboard :
   - `DATABASE_URL`
   - `DATABASE_AUTH_TOKEN`
   - `BETTER_AUTH_SECRET`
5. Une fois le premier deploy fait, récupère le **Deploy Hook URL** dans :
   - Render Dashboard → Settings → Deploy Hook
6. Dans GitHub repo → Settings → Secrets → Actions, ajoute :
   - `RENDER_DEPLOY_HOOK_URL` = l'URL du deploy hook Render

Ensuite chaque `git push main` déclenche le deploy automatiquement.

---

## 6. Base de données

```bash
# Appliquer le schema sur Turso
bun run db:push

# Générer les migrations
bun run db:generate

# Studio visuel (optionnel)
bun run db:studio
```

---

## Structure du projet

```
plato/
├── packages/
│   └── web/
│       ├── src/
│       │   ├── api/           # Backend Hono
│       │   │   ├── database/  # Drizzle ORM + schema
│       │   │   ├── routes/    # sites.ts, templates.ts
│       │   │   └── auth.ts
│       │   ├── server.ts      # Entry point Bun
│       │   └── web/           # Frontend React
│       │       ├── pages/     # editor.tsx, preview.tsx, dashboard.tsx...
│       │       └── components/
│       └── vite.config.ts
├── .github/
│   └── workflows/
│       └── deploy.yml         # CI/CD
├── render.yaml                # Config Render
└── .env.example
```
