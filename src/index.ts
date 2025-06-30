import { Hono } from 'hono'
import { showRoutes } from 'hono/dev'

import { auth } from "@/lib/auth"
import { authenticate } from "@/middleware"

import { logger } from "hono/logger"
import { cors } from "hono/cors";
import { quizRouter } from "@/router"

const app = new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user;
    session: typeof auth.$Infer.Session.session
  }
}>();

app.use(logger())
app.use(cors())

app.get('/health', (c) => c.text('Hello Hono!'))


app.use("*", authenticate);

app.on(["POST", "GET"], "/api/auth/*", (c) => {
  return auth.handler(c.req.raw);
});

app.route("/quiz", quizRouter)
showRoutes(app)

export default app;
