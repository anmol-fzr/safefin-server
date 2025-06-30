import { db } from '@/config/db'
import { question } from '@/db/schema/quiz'
import { questionSchema } from "@/schema"
import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'

const questionRouter = new Hono()

questionRouter.get("/", async (c) => {
  const ques = await db.select().from(question);
  return c.json(ques)
})

questionRouter.post('/', zValidator("json", questionSchema), async (c) => {
  const body = c.req.valid("json")

  if (!(-1 < body.answer || body.answer < body.options.length)) {
    return c.json({
      error: `Incorrect Answer Index must be between ( 0 - ${body.options.length - 1}) `
    }, 400)
  }

  const newQuestion = await db.insert(question).values(body).returning()

  return c.json(newQuestion)
})

export { questionRouter }
