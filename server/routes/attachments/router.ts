import { type RequestHandler, Router } from 'express'
import HaveCourtOrderController from './court-order/controller'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import paths from '../../constants/paths'
import { Services } from '../../services'
import HavePhotoController from './photo-id/controller'
import AttachmentsController from '../../controllers/attachments/attachmentController'
import { relativePath } from '../routeHelpers'

const createAttachmentRouter = (
  services: Pick<Services, 'attachmentService' | 'taskListService' | 'auditService' | 'orderChecklistService'>,
): Router => {
  const router = Router({ mergeParams: true })
  const get = (path: string, handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (path: string, handler: RequestHandler) => router.post(path, asyncMiddleware(handler))
  const rel = (path: string) => relativePath(paths.ATTACHMENT.ATTACHMENTS, path)
  const { attachmentService, taskListService, auditService, orderChecklistService } = services
  const attachmentsController = new AttachmentsController(
    auditService,
    attachmentService,
    taskListService,
    orderChecklistService,
  )
  const haveCourtOrderController = new HaveCourtOrderController(attachmentService, taskListService)
  const havePhotoController = new HavePhotoController(attachmentService, taskListService)

  get(rel(paths.ATTACHMENT.ATTACHMENTS), attachmentsController.view)
  get(rel(paths.ATTACHMENT.FILE_VIEW), attachmentsController.uploadFileView)
  post(rel(paths.ATTACHMENT.FILE_VIEW), attachmentsController.uploadFile)
  get(rel(paths.ATTACHMENT.DOWNLOAD_FILE), attachmentsController.downloadFile)
  get(rel(paths.ATTACHMENT.HAVE_COURT_ORDER), haveCourtOrderController.view)
  post(rel(paths.ATTACHMENT.HAVE_COURT_ORDER), haveCourtOrderController.update)
  get(rel(paths.ATTACHMENT.HAVE_PHOTO), havePhotoController.view)
  post(rel(paths.ATTACHMENT.HAVE_PHOTO), havePhotoController.update)

  return router
}

export default createAttachmentRouter
