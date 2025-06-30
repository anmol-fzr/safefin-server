import { relations } from "drizzle-orm";
import { pgTable, timestamp, varchar, smallint, serial, integer } from "drizzle-orm/pg-core";

export const quiz = pgTable("quiz", {
  id: serial('id').primaryKey(),
  title: varchar({ length: 256 }).notNull(),
  desc: varchar({ length: 256 }).notNull(),
  type: varchar(),
  createdAt: timestamp('created_at').$defaultFn(() => /* @__PURE__ */ new Date()).notNull(),
  updatedAt: timestamp('updated_at').$defaultFn(() => /* @__PURE__ */ new Date()).notNull(),
});

// {
//   "question": "Batman's City ?",
//   "options": [
//     "New York",
//     "New Jersey",
//     "Gotham",
//     "Detroit",
//   ],
//   "answer": 2
// }
export const question = pgTable("question", {
  id: serial("id").primaryKey(),
  quiz_id: integer("quiz_id").references(() => quiz.id).notNull(),

  question: varchar("question", { length: 500 }).notNull(),
  options: varchar("options", { length: 100 }).array(),
  answer: smallint("answer"),

  createdAt: timestamp('created_at').$defaultFn(() => /* @__PURE__ */ new Date()).notNull(),
  updatedAt: timestamp('updated_at').$defaultFn(() => /* @__PURE__ */ new Date()).notNull(),
});

export const quizQuestionRelations = relations(quiz, ({ many }) => ({
  questions: many(question),
}));

export const questionQuizRelations = relations(question, ({ one }) => ({
  quiz: one(quiz, {
    fields: [question.quiz_id],
    references: [quiz.id],
  }),
}));

