import { Hono } from 'hono'
import { showRoutes } from 'hono/dev'

import { auth } from "@/lib/auth"

import { logger } from "hono/logger"
import { cors } from "hono/cors";

const app = new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null
  }
}>();

app.use(logger())
app.use(cors())

app.get('/health', (c) => {
  return c.text('Hello Hono!')
})

app.use("*", async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    c.set("user", null);
    c.set("session", null);
    return next();
  }

  c.set("user", session.user);
  c.set("session", session.session);
  return next();
});

app.on(["POST", "GET"], "/api/auth/*", (c) => {
  return auth.handler(c.req.raw);
});

showRoutes(app)
export default app;
