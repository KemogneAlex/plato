import { Hono } from "hono";
import { cors } from "hono/cors";
import { auth } from "./auth";
import { sites } from "./routes/sites";
import { templates } from "./routes/templates";

const app = new Hono()
  .use(cors({ origin: (origin) => origin ?? "*", credentials: true, exposeHeaders: ["set-auth-token"] }))
  .on(["GET", "POST"], "/api/auth/*", (c) => auth.handler(c.req.raw))
  .basePath("api")
  .get("/health", (c) => c.json({ status: "ok" }, 200))
  .route("/sites", sites)
  .route("/templates", templates);

export type AppType = typeof app;
export default app;
