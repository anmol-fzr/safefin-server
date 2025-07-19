import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { quizResultReqSchema } from '@/schema'
import { authenticate } from '@/middleware'
import type { HonoAppProps } from '..'
import { getDb } from '@/lib/pg'
import { quizQuestionResult, userQuizResult } from '@/db/schema'

const quizResultRouter = new Hono<HonoAppProps>()

quizResultRouter.post('/', authenticate, zValidator("json", quizResultReqSchema), async (c) => {
  const body = c.req.valid("json")

  const db = getDb(c.env.DATABASE_URL)
  const user = c.get("user")

  try {
    const result = await db.transaction(async (tx) => {
      const savedQuizResult = await tx.insert(userQuizResult).values({
        quizId: body.quizId,
        userId: user.id
      }).returning()

      const results = body.result.map(quizResult => {
        return { ...quizResult, userQuizResultId: savedQuizResult[0].id }
      })

      await tx.insert(quizQuestionResult).values(results).returning()
      return savedQuizResult[0]
    })

    return c.json({
      data: result,
      message: "Quiz Result Saved Successfully"
    })
  } catch (error) {
    return c.json({
      message: "Something went Wrong",
      error
    })
  }

})

export { quizResultRouter }
