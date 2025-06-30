import { z } from "zod"

const quizSchema = z.object({
  title: z.string().describe("Title of the Quiz"),
  desc: z.string().describe("Desc of the Quiz"),
})

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
const questionSchema = z.object({
  quiz_id: z.number().describe("Quiz Id Referencing to Quiz"),
  question: z.string().describe("Question"),
  options: z.array(z.string().describe("Available Options")).min(4).max(6).nonempty(),
  answer: z.number().describe("Answer Index from Available Options").min(0).max(5),
})

export { quizSchema, questionSchema }
