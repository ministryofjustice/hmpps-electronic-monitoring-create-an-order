import { type RequestHandler, Router } from 'express'

import asyncMiddleware from '../middleware/asyncMiddleware'
import type { Services } from '../services'
import { Page } from '../services/auditService'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function routes({ auditService }: Services): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

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

  return router
}
