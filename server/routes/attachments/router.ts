import { Router } from 'express'
import HaveCourtOrderController from './court-order/controller'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import { Services } from '../../services'
import HavePhotoController from './photo-id/controller'

const createAttachmentRouter = (services: Pick<Services, 'attachmentService' | 'taskListService'>): Router => {
  const router = Router()
  const { attachmentService, taskListService } = services
  const haveCourtOrderController = new HaveCourtOrderController(attachmentService, taskListService)
  const havePhotoController = new HavePhotoController(attachmentService, taskListService)
  router.get('/have-court-order', asyncMiddleware(haveCourtOrderController.view))
  router.post('/have-court-order', asyncMiddleware(haveCourtOrderController.update))

  router.get('/have-photo', asyncMiddleware(havePhotoController.view))
  router.post('/have-photo', asyncMiddleware(havePhotoController.update))
  return router
}

export default createAttachmentRouter
