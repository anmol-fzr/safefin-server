import { Hono } from 'hono'
import { showRoutes } from 'hono/dev'
import { logger } from "hono/logger"
import { cors } from "hono/cors";

import { auth } from "@/lib/better-auth"
import { getDb } from './lib/pg';
import { user } from './db/schema';
//import type { User, Session } from "@/lib/auth"
import { quizRouter } from "@/router"
// import { addressRouter } from './router/address.router';
// import { questionRouter } from './router/question.router';
import type { User, Session } from '@/lib/better-auth';

type HonoAppProps = {
  Variables: {
    user: User;
    session: Session;
  },
  Bindings: CloudflareBindings
}

const app = new Hono<HonoAppProps>();

app.use(logger())
app.use(cors({
  origin: [
    "*",
    "http://localhost:5173",
    "http://192.168.29.57:5173"
  ],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true // if you need to send cookies or authorization headers
}));

app.get('/health', (c) => c.text('Hello Hono!'))

app.on(["POST", "GET"], "/api/auth/*", async (c) => {
  return auth(c.env).handler(c.req.raw);
});

app.route("/quiz", quizRouter)
// app.route("/question", questionRouter)
// app.route("/address", addressRouter)
showRoutes(app)

//app.fire()
export type { HonoAppProps }
export default app;
