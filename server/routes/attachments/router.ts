import { Router } from 'express'
import HaveCourtOrderController from './court-order/controller'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import { Services } from '../../services'

const createAttachmentRouter = (services: Pick<Services, 'attachmentService' | 'taskListService'>): Router => {
  const router = Router()
  const { attachmentService, taskListService } = services
  const haveCourtOrderController = new HaveCourtOrderController(attachmentService, taskListService)

  router.get('/have-court-order', asyncMiddleware(haveCourtOrderController.view))
  router.post('/have-court-order', asyncMiddleware(haveCourtOrderController.update))

  return router
}

export default createAttachmentRouter
