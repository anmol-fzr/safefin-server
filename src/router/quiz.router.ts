import { Hono } from 'hono'
import { questionRouter } from './question.router'
import { getAllQuizHndlr, getQuizByIdHndlr, newQuizHndlr } from '@/controller'

const quizRouter = new Hono()

quizRouter.route("/question", questionRouter)

quizRouter
  .get('/', ...getAllQuizHndlr)
  .post('/', ...newQuizHndlr)

quizRouter.get('/:id', ...getQuizByIdHndlr)

export { quizRouter }
