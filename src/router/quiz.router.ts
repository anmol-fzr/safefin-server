import { getDb } from '@/lib/pg'
import { Hono } from 'hono'
import { option, question, quiz } from '@/db/schema'
import { zValidator } from '@hono/zod-validator'
import { fullQuizReqSchema, quizResultReqSchema } from '@/schema'
import { eq } from 'drizzle-orm'
import { authenticate } from '@/middleware'
import { quizResultRouter } from './quizResult.router'

const quizRouter = new Hono<{ Bindings: CloudflareBindings }>()

quizRouter
  .get('/', async (c) => {
    const db = getDb(c.env.DATABASE_URL)

    const quizs = await db.query.quiz.findMany({
      with: {
        questions: {
          with: {
            options: true,
            answer: true,
          },
        },
      },
    });

    return c.json({ data: quizs })
  })
  .get('/:quiz_id', async (c) => {
    const db = getDb(c.env.DATABASE_URL)
    const quizId = c.req.param("quiz_id")

    const quizs = await db.query.quiz.findFirst({
      where: (quiz, { eq }) => eq(quiz.id, quizId),
      with: {
        questions: {
          with: {
            options: true,
            answer: true,
          },
        },
      },
    });
    // db.select().from(quiz).fullJoin(question, eq(quiz.id, question.quizId))

    return c.json({ data: quizs })
  })
  .post('/full', zValidator("json", fullQuizReqSchema), async (c) => {
    const body = c.req.valid("json");
    const db = getDb(c.env.DATABASE_URL)

    try {
      const newQuiz = await db.transaction(async (tx) => {
        const quizBody = { title: body.title, desc: body.desc };

        const insertedQuiz = await tx.insert(quiz).values(quizBody).returning();
        const newQuizId = insertedQuiz[0].id;

        for (const questionData of body.questions) {
          const insertedQuestion = await tx.insert(question).values({
            quizId: newQuizId,
            question: questionData.question,
            answerId: null,
          }).returning();

          const questionId = insertedQuestion[0].id;

          const optionsBody = questionData.options.map((option) => ({
            value: option.value,
            question_id: questionId,
          }));

          const insertedOptions = await tx.insert(option).values(optionsBody).returning();

          const answerOption = insertedOptions.find(
            (opt) => opt.value === questionData.answer
          );

          if (!answerOption) {
            throw new Error(`Answer "${questionData.answer}" not found in options for question "${questionData.question}"`);
          }

          await tx.update(question)
            .set({ answerId: answerOption.id })
            .where(eq(question.id, questionId));
        }

        return insertedQuiz[0]; // return full quiz object
      });
      return c.json({ data: newQuiz });
    } catch (error) {
      console.error("Transaction failed:", error);
      return c.json({ success: false, error: error.message }, 500);
    }

  })
  .delete('/:quiz_id', async (c) => {
    const quizId = c.req.param("quiz_id")
    const db = getDb(c.env.DATABASE_URL)


    const quiz = await db.query.quiz.findFirst({
      where: (quiz, { eq }) => eq(quiz.id, quizId),
    })

    return c.json({ data: quiz })
  })
  .patch('/:quiz_id', async (c) => {
    const quizId = c.req.param("quiz_id")
    const db = getDb(c.env.DATABASE_URL)

    const updatedQuiz = await db.update(quiz).set({
      isPublished: true
    }).where(eq(quiz.id, quizId)).returning()

    if (updatedQuiz.length === 0) {
      return c.json({ data: null, error: "Quiz Not Found", message: "Quiz Doesn't Exists" }, 404)
    }

    return c.json({ data: updatedQuiz[0], message: "Quiz Updated Successfully" })
  }).route('/result', quizResultRouter)

// .post('/', ...newQuizHndlr)
// .get('/:id', ...getQuizByIdHndlr)

export { quizRouter }
