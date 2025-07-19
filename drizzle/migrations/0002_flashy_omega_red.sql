CREATE TABLE "quiz_question_result" (
	"id" serial PRIMARY KEY NOT NULL,
	"question_id" integer NOT NULL,
	"answered_id" integer NOT NULL,
	"user_quiz_result_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_quiz_result" (
	"id" serial PRIMARY KEY NOT NULL,
	"quiz_id" integer NOT NULL,
	"user_id" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "quiz_question_result" ADD CONSTRAINT "quiz_question_result_question_id_question_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."question"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quiz_question_result" ADD CONSTRAINT "quiz_question_result_answered_id_question_id_fk" FOREIGN KEY ("answered_id") REFERENCES "public"."question"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quiz_question_result" ADD CONSTRAINT "quiz_question_result_user_quiz_result_id_user_quiz_result_id_fk" FOREIGN KEY ("user_quiz_result_id") REFERENCES "public"."user_quiz_result"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_quiz_result" ADD CONSTRAINT "user_quiz_result_quiz_id_quiz_id_fk" FOREIGN KEY ("quiz_id") REFERENCES "public"."quiz"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_quiz_result" ADD CONSTRAINT "user_quiz_result_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;