import { Router } from 'express'
import HaveCourtOrderController from './court-order/controller'
import paths from '../../constants/paths'
import { Services } from '../../services'
import HavePhotoController from './photo-id/controller'
import AttachmentsController from '../../controllers/attachments/attachmentController'
import { createFeatureRouter } from '../routeHelpers'

const createAttachmentRouter = (
  services: Pick<Services, 'attachmentService' | 'taskListService' | 'auditService' | 'orderChecklistService'>,
): Router => {
  const { router, get, post } = createFeatureRouter(paths.ATTACHMENT.BASE_URL)
  const { attachmentService, taskListService, auditService, orderChecklistService } = services
  const attachmentsController = new AttachmentsController(
    auditService,
    attachmentService,
    taskListService,
    orderChecklistService,
  )
  const haveCourtOrderController = new HaveCourtOrderController(attachmentService, taskListService)
  const havePhotoController = new HavePhotoController(attachmentService, taskListService)

  get(paths.ATTACHMENT.BASE_URL, attachmentsController.view)
  get(paths.ATTACHMENT.FILE_VIEW, attachmentsController.uploadFileView)
  post(paths.ATTACHMENT.FILE_VIEW, attachmentsController.uploadFile)
  get(paths.ATTACHMENT.DOWNLOAD_FILE, attachmentsController.downloadFile)
  get(paths.ATTACHMENT.HAVE_COURT_ORDER, haveCourtOrderController.view)
  post(paths.ATTACHMENT.HAVE_COURT_ORDER, haveCourtOrderController.update)
  get(paths.ATTACHMENT.HAVE_PHOTO, havePhotoController.view)
  post(paths.ATTACHMENT.HAVE_PHOTO, havePhotoController.update)

  return router
}

export default createAttachmentRouter
