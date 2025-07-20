ALTER TABLE "quiz_question_result" DROP CONSTRAINT "quiz_question_result_answered_id_question_id_fk";
--> statement-breakpoint
ALTER TABLE "quiz_question_result" ADD CONSTRAINT "quiz_question_result_answered_id_option_id_fk" FOREIGN KEY ("answered_id") REFERENCES "public"."option"("id") ON DELETE no action ON UPDATE no action;