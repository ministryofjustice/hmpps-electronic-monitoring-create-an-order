import { type RequestHandler, Router } from 'express'
import HaveCourtOrderController from './court-order/controller'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import { Services } from '../../services'
import HavePhotoController from './photo-id/controller'
import AttachmentsController from '../../controllers/attachments/attachmentController'

const createAttachmentRouter = (
  services: Pick<Services, 'attachmentService' | 'taskListService' | 'auditService' | 'orderChecklistService'>,
): Router => {
  const router = Router({ mergeParams: true })
  const get = (path: string, handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (path: string, handler: RequestHandler) => router.post(path, asyncMiddleware(handler))
  const { attachmentService, taskListService, auditService, orderChecklistService } = services
  const attachmentsController = new AttachmentsController(
    auditService,
    attachmentService,
    taskListService,
    orderChecklistService,
  )
  const haveCourtOrderController = new HaveCourtOrderController(attachmentService, taskListService)
  const havePhotoController = new HavePhotoController(attachmentService, taskListService)

  get('/', attachmentsController.view)
  get('/:fileType(photo_Id|licence|court_order)', attachmentsController.uploadFileView)
  post('/:fileType(photo_Id|licence|court_order)', attachmentsController.uploadFile)
  get('/:fileType(photo_Id|licence|court_order)/:filename', attachmentsController.downloadFile)
  get('/have-court-order', haveCourtOrderController.view)
  post('/have-court-order', haveCourtOrderController.update)
  get('/have-photo', havePhotoController.view)
  post('/have-photo', havePhotoController.update)

  return router
}

export default createAttachmentRouter
