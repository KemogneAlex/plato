# Plato — Build Progress

## Done
- [x] app_init
- [x] design.md
- [x] better-auth installed
- [x] auth-schema generated
- [x] DB schema (sites, templates) + db:push
- [x] auth.ts (better-auth config)
- [x] middleware/auth.ts
- [x] routes/sites.ts
- [x] routes/templates.ts
- [x] api/index.ts (auth + routes)
- [x] lib/auth.ts (web client)
- [x] lib/api.ts (hono typed client)
- [x] components: ProtectedRoute, AppLayout, Provider
- [x] pages: Landing (/)
- [x] pages: Login (/login)
- [x] pages: Register (/register)
- [x] pages: Dashboard (/dashboard)
- [x] pages: Editor (/editor/:id)
- [x] pages: Preview (/preview/:id)
- [x] pages: Settings (/settings/:id)
- [x] app.tsx routes wired
- [x] bun run build — PASS (0 errors)
- [x] dev server running on :5173 + API on :3001

## Status
V1 COMPLETE ✅
Dev: http://localhost:5173
API: http://localhost:3001

## Next steps (V2)
- Real Craft.js MFE integration (ChartProject)
- Analytics / views counter
- Template gallery page (/templates)
- Real HTML export
- Custom domain DNS verification
