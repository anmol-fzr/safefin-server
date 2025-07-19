import { db } from "@/config/db";
import { createFactory } from "hono/factory"
import { option, question, quiz } from '@/db/schema/quiz'
import { eq, inArray } from 'drizzle-orm'
import { zValidator } from "@hono/zod-validator";
import { fullQuizReqSchema, quizSchema } from "@/schema";

const { createHandlers } = createFactory()

const createFullQuizHndlr = createHandlers(zValidator("json", fullQuizReqSchema), async (c) => {
  const body = c.req.valid("json");

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
});

const getAllQuizHndlr = createHandlers(async (c) => {
  const result = await db.query.quiz.findMany();

  return c.json({ data: result })
})


const getQuizByIdHndlr = createHandlers(async (c) => {
  const { id } = c.req.param();

  // Step 1: Get the quiz
  const quizData = await db.query.quiz.findFirst({
    where: eq(quiz.id, id),
    columns: {
      createdAt: false,
      updatedAt: false,
    },
  });

  if (!quizData) return c.json({ error: "Quiz not found" }, 404);

  // Step 2: Get all questions for the quiz
  const questions = await db.query.question.findMany({
    where: eq(question.quizId, id),
    columns: {
      createdAt: false,
      updatedAt: false,
    },
  });

  const questionIds = questions.map(q => q.id);

  // Step 3: Get all options for these questions
  const options = await db.query.option.findMany({
    where: inArray(option.question_id, questionIds),
    columns: {
      createdAt: false,
      updatedAt: false,
    },
  });

  // Step 4: Group options by question_id
  const optionsByQuestionId = new Map<number, typeof options>();

  for (const opt of options) {
    if (!optionsByQuestionId.has(opt.question_id)) {
      optionsByQuestionId.set(opt.question_id, []);
    }
    optionsByQuestionId.get(opt.question_id)!.push(opt);
  }

  // Step 5: Attach options to each question
  const questionsWithOptions = questions.map((q) => ({
    ...q,
    options: optionsByQuestionId.get(q.id) || [],
  }));

  // Step 6: Construct response
  const response = {
    ...quizData,
    questions: questionsWithOptions,
  };

  return c.json({ data: response });
});

const newQuizHndlr = createHandlers(zValidator("json", quizSchema), async (c) => {
  const body = c.req.valid("json")

  const newQuiz = await db.insert(quiz).values(body).returning();


  return c.json(newQuiz)
})

export { getAllQuizHndlr, getQuizByIdHndlr, newQuizHndlr, createFullQuizHndlr }
