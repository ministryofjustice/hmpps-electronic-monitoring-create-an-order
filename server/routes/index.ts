import { type RequestHandler, Router } from 'express'

import asyncMiddleware from '../middleware/asyncMiddleware'
import type { Services } from '../services'
import { Page } from '../services/auditService'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function routes({ auditService }: Services): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (path: string | string[], handler: RequestHandler) => router.post(path, asyncMiddleware(handler))

  get('/', async (req, res, next) => {
    await auditService.logPageView(Page.EXAMPLE_PAGE, { who: res.locals.user.username, correlationId: req.id })
    const orderList = [
      { title: 'Test Form 1', status: 'Draft' },
      { title: 'Test Form 2', status: 'Draft' },
      { title: 'Test Form 3', status: 'Draft' },
      { title: 'Test Form 4', status: 'Submitted' },
      { title: 'Test Form 5', status: 'Submitted' },
    ]
    res.render('pages/index', { orderList })
  })

  get('/newForm', async (req, res, next) => {
    await auditService.logPageView(Page.EXAMPLE_PAGE, { who: res.locals.user.username, correlationId: req.id })

    res.render('pages/newForm', {})
  })

  post('/newForm', async (req, res, next) => {
    await auditService.logPageView(Page.EXAMPLE_PAGE, { who: res.locals.user.username, correlationId: req.id })

    if (req.body.formType === 'HDC') res.render('pages/hdc')
    else res.render('pages/WIP', {})
  })

  post('/createForm', async (req, res, next) => {
    await auditService.logPageView(Page.EXAMPLE_PAGE, { who: res.locals.user.username, correlationId: req.id })
    let form = {}

    if (req.body.formType === 'HDC') {
      form = {
        id: '1',
        title: 'Home Detention Curfew (HDC) form',
        sections: [
          { ref: '/section/abc/identifyNumbers', description: 'Identify numbers', isComplete: true },
          { ref: 'x', description: 'About the device wearer', isComplete: false },
          { ref: 'x', description: 'About the HDC', isComplete: false },
          { ref: 'x', description: 'Other monitoring conditions', isComplete: false },
          { ref: 'x', description: 'Installations and risk information', isComplete: false },
          { ref: 'x', description: 'About organisations', isComplete: false },
        ],
      }
      res.render('pages/details', { form })
    } else res.render('pages/WIP', {})
  })

  get('/section/:formId/:sectionName', async (req, res, next) => {
    await auditService.logPageView(Page.EXAMPLE_PAGE, { who: res.locals.user.username, correlationId: req.id })
    let section = {}
    if (req.params.sectionName === 'identifyNumbers') {
      section = {
        id: '1',
        title: 'Identify numbers questions',
        questions: [
          { ref: '/sections/identifyNumbers/nomisId', description: 'NOMIS ID' },
          { ref: 'x', description: 'PNC ID', value: 'mock ID' },
        ],
      }
      res.render('pages/sectionDetails', { section })
    } else res.render('pages/WIP', {})
  })

  get('/sections/identifyNumbers/nomisId', async (req, res, next) => {
    res.render('pages/sections/identifyNumbers/nomisId', {})
  })

  return router
}
