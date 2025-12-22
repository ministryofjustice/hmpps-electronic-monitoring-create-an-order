import { Router } from 'express'
import HaveCourtOrderController from './court-order/controller'
import asyncMiddleware from '../../middleware/asyncMiddleware'

const createAttachmentRouter = (): Router => {
  const router = Router()

  const haveCourtOrderController = new HaveCourtOrderController()

  router.get('/have-court-order', asyncMiddleware(haveCourtOrderController.view))
  router.post('/have-court-order', asyncMiddleware(haveCourtOrderController.update))

  return router
}

export default createAttachmentRouter
