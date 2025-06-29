import { Hono } from 'hono'

const authRouter = new Hono()

authRouter.post('/login', async (c) => {
  return c.json([])
})

export { authRouter }
