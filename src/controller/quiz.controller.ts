import { db } from "@/config/db";
import { createFactory } from "hono/factory"
import { quiz } from '@/db/schema/quiz'
import { eq } from 'drizzle-orm'
import { zValidator } from "@hono/zod-validator";
import { quizSchema } from "@/schema";

const { createHandlers } = createFactory()

const getAllQuizHndlr = createHandlers(async (c) => {
  const result = await db.query.quiz.findMany({
    with: {
      questions: true,
    },
  });

  return c.json({ data: result })
})

const getQuizByIdHndlr = createHandlers(async (c) => {
  const { id } = c.req.param()
  const result = await db.query.quiz.findFirst({
    where: eq(quiz.id, id),
    with: {
      questions: true,
    },
  });

  return c.json({ data: result })
})

const newQuizHndlr = createHandlers(zValidator("json", quizSchema), async (c) => {
  const body = c.req.valid("json")

  const newQuiz = await db.insert(quiz).values(body).returning();


  return c.json(newQuiz)
})

export { getAllQuizHndlr, getQuizByIdHndlr, newQuizHndlr }
