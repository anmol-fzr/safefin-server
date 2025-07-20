import { relations } from "drizzle-orm";
import {
  pgTable,
  timestamp,
  varchar,
  serial,
  integer,
  boolean,
  text,
} from "drizzle-orm/pg-core";
import { user } from "./auth";

export const quiz = pgTable("quiz", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 256 }).notNull(),
  desc: varchar("desc", { length: 256 }).notNull(),
  isPublished: boolean("is_published").default(false),
  createdAt: timestamp("created_at").$defaultFn(() => new Date()).notNull(),
  updatedAt: timestamp("updated_at").$defaultFn(() => new Date()).notNull(),
});

export const option = pgTable("option", {
  id: serial("id").primaryKey(),
  question_id: integer("question_id").notNull(),
  value: varchar("value", { length: 100 }),
  createdAt: timestamp("created_at").$defaultFn(() => new Date()).notNull(),
  updatedAt: timestamp("updated_at").$defaultFn(() => new Date()).notNull(),
});

export const question = pgTable("question", {
  id: serial("id").primaryKey(),
  quizId: integer("quiz_id").notNull().references(() => quiz.id),
  question: varchar("question", { length: 500 }).notNull(),
  answerId: integer("answer_id").references(() => option.id), // refer to option // allows null to get out of loop to create a question with options created
  createdAt: timestamp("created_at").$defaultFn(() => new Date()).notNull(),
  updatedAt: timestamp("updated_at").$defaultFn(() => new Date()).notNull(),
});

// One Quiz Many Questions
export const quizQuestionsRelations = relations(quiz, ({ many }) => ({
  questions: many(question), // Drizzle infers the name from the property name if not specified or you can keep relationName: "questions"
}));

export const optionRelations = relations(option, ({ one }) => ({
  question: one(question, {
    fields: [option.question_id],
    references: [question.id],
  }),
}));

export const questionOptionsRelations = relations(question, ({ many, one }) => ({
  options: many(option), // Drizzle infers the name from the property name
  answer: one(option, {
    fields: [question.answerId],
    references: [option.id],
  }),
  quiz: one(quiz, {
    fields: [question.quizId],
    references: [quiz.id]
  }),
}));

export const userQuizResult = pgTable("user_quiz_result", {
  id: serial("id").primaryKey(),
  quizId: integer("quiz_id")
    .references(() => quiz.id)
    .notNull(),
  userId: text("user_id")
    .references(() => user.id)
    .notNull(),
});

export const quizQuestionResult = pgTable("quiz_question_result", {
  id: serial("id").primaryKey(),
  questionId: integer("question_id")
    .references(() => question.id)
    .notNull(),
  answeredId: integer("answered_id")
    .references(() => option.id)
    .notNull(),
  userQuizResultId: integer("user_quiz_result_id")
    .references(() => userQuizResult.id)
    .notNull(),
});
