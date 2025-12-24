import { Router } from 'express'
import HaveCourtOrderController from './court-order/controller'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import { Services } from '../../services'
import HaveGrantOfBailController from './grant-of-bail/controller'

const createAttachmentRouter = (services: Pick<Services, 'attachmentService' | 'taskListService'>): Router => {
  const router = Router()
  const { attachmentService, taskListService } = services
  const haveCourtOrderController = new HaveCourtOrderController(attachmentService, taskListService)
  const haveGrantOfBailController = new HaveGrantOfBailController(attachmentService, taskListService)
  router.get('/have-court-order', asyncMiddleware(haveCourtOrderController.view))
  router.post('/have-court-order', asyncMiddleware(haveCourtOrderController.update))

  router.get('/have-grant-of-bail', asyncMiddleware(haveGrantOfBailController.view))
  router.post('/have-grant-of-bail', asyncMiddleware(haveGrantOfBailController.update))
  return router
}

export default createAttachmentRouter
