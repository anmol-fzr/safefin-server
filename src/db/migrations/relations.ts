import { relations } from "drizzle-orm/relations";
import { user, account, session, quiz, question } from "./schema";

export const accountRelations = relations(account, ({one}) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	accounts: many(account),
	sessions: many(session),
}));

export const sessionRelations = relations(session, ({one}) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	}),
}));

export const questionRelations = relations(question, ({one}) => ({
	quiz: one(quiz, {
		fields: [question.quizId],
		references: [quiz.id]
	}),
}));

export const quizRelations = relations(quiz, ({many}) => ({
	questions: many(question),
}));