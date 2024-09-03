import { type RequestHandler, Router } from 'express'

import asyncMiddleware from '../middleware/asyncMiddleware'
import type { Services } from '../services'
import FormController from '../controllers/formController'
import SectionController from '../controllers/sectionController'
import QuestionController from '../controllers/questionController'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function routes({ auditService }: Services): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (path: string | string[], handler: RequestHandler) => router.post(path, asyncMiddleware(handler))
  const formController = new FormController(auditService)
  const sectionController = new SectionController()
  const questionController = new QuestionController()

  get('/', formController.getForms)

  get('/newForm', formController.getNewFormPage)

  post('/newForm', formController.postNewForm)

  post('/createForm', formController.createForm)

  get('/section/:formId/:sectionName', sectionController.getSection)

  get('/section/:sectionName/question/:questionName', questionController.getSection)

  post('/section/next', questionController.postNext)

  return router
}
