import { Hono } from 'hono'
import { quizResultRouter } from './quizResult.router'
import type { HonoAppProps } from '..'
import { getQuizzes, getQuizById, createQuiz, updateQuizById, deleteQuizById, } from '@/controller'

const quizRouter = new Hono<HonoAppProps>()

quizRouter
  .get('/', ...getQuizzes)
  .post(...createQuiz)
  .get('/:quiz_id', ...getQuizById)
  .patch(...updateQuizById)
  .delete(...deleteQuizById)
  .route('/result', quizResultRouter)

export { quizRouter }
