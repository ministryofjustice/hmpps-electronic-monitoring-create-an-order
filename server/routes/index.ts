import { type RequestHandler, Router } from 'express'

import asyncMiddleware from '../middleware/asyncMiddleware'
import type { Services } from '../services'
import OrderSearchController from '../controllers/orderSearchController'
import OrderController from '../controllers/orderController'
import DeviceWearerController from '../controllers/deviceWearerController'
import ContactDetailsController from '../controllers/contactDetailsController'
import populateOrder from '../middleware/populateCurrentOrder'
import AttachmentsController from '../controllers/attachmentController'

import paths from '../constants/paths'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function routes({
  auditService,
  orderService,
  orderSearchService,
  deviceWearerService,
  attachmentService,
}: Services): Router {
  const router = Router()

  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const post = (path: string | string[], handler: RequestHandler) => router.post(path, asyncMiddleware(handler))

  const orderSearchController = new OrderSearchController(auditService, orderSearchService)
  const orderController = new OrderController(auditService, orderService)
  const deviceWearerController = new DeviceWearerController(auditService, deviceWearerService)
  const contactDetailsController = new ContactDetailsController(auditService)
  router.param('orderId', populateOrder(orderService))
  const attachmentsController = new AttachmentsController(auditService, orderService, attachmentService)

  get('/', orderSearchController.search)

  // Order
  post(paths.ORDER.CREATE, orderController.create)
  get(paths.ORDER.DELETE_SUCCESS, orderController.deleteSuccess)
  get(paths.ORDER.DELETE_FAILED, orderController.deleteFailed)
  get(paths.ORDER.SUMMARY, orderController.summary)
  get(paths.ORDER.DELETE, orderController.confirmDelete)
  post(paths.ORDER.DELETE, orderController.delete)

  // Device Wearer
  get(paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER, deviceWearerController.view)
  post(paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER, deviceWearerController.update)

  // Contact Details
  get(paths.ABOUT_THE_DEVICE_WEARER.CONTACT_DETAILS, contactDetailsController.view)

  // Attachments
  get(paths.ATTACHMENT.ATTACHMENTS, attachmentsController.view)
  get(paths.ATTACHMENT.LICENCE, attachmentsController.licence)
  post(paths.ATTACHMENT.LICENCE, attachmentsController.uploadLicence)
  get(paths.ATTACHMENT.PHOTO_ID, attachmentsController.photo)
  post(paths.ATTACHMENT.PHOTO_ID, attachmentsController.uploadPhoto)
  get(paths.ATTACHMENT.DOWNLOAD_LICENCE, attachmentsController.downloadLicence)
  get(paths.ATTACHMENT.DOWNLOAD_PHOTO_ID, attachmentsController.downloadPhoto)

  return router
}
