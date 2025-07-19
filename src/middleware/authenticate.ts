import { createFactory } from 'hono/factory'
import { auth } from "@/lib/better-auth"
import { HonoAppProps } from '..';

const factory = createFactory<HonoAppProps>()

const authenticate = factory.createMiddleware(async (c, next) => {
  const session = await auth(c.env).api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    return c.json({
      error: "Unauthorized"
    }, 401)
  }

  c.set("user", session.user);
  c.set("session", session.session);
  return next();
})

export { authenticate }
