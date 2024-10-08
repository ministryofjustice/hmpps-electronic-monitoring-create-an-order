import { type RequestHandler, Router } from 'express'

import paths from '../constants/paths'
import AttachmentsController from '../controllers/attachmentController'
import ContactDetailsController from '../controllers/contactDetailsController'
import DeviceWearerController from '../controllers/deviceWearerController'
import DeviceWearerCheckAnswersController from '../controllers/deviceWearersCheckAnswersController'
import InstallationAndRiskController from '../controllers/installationAndRisk/installationAndRiskController'
import MonitoringConditionsController from '../controllers/monitoringConditions/monitoringConditionsController'
import OrderController from '../controllers/orderController'
import OrderSearchController from '../controllers/orderSearchController'
import ResponsibleAdultController from '../controllers/responsibleAdultController'
import ResponsibleOfficerController from '../controllers/responsibleOfficerController'
import asyncMiddleware from '../middleware/asyncMiddleware'
import populateOrder from '../middleware/populateCurrentOrder'
import type { Services } from '../services'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function routes(services: Services): Router {
  const router = Router()
  const {
    auditService,
    orderService,
    orderSearchService,
    deviceWearerService,
    attachmentService,
    installationAndRiskService,
    monitoringConditionsService,
  } = services

  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const post = (path: string | string[], handler: RequestHandler) => router.post(path, asyncMiddleware(handler))

  const orderSearchController = new OrderSearchController(auditService, orderSearchService)
  const orderController = new OrderController(auditService, orderService)
  const deviceWearerController = new DeviceWearerController(auditService, deviceWearerService)
  const responsibleAdultController = new ResponsibleAdultController(auditService)
  const responsibleOfficerController = new ResponsibleOfficerController(auditService)
  const deviceWearerCheckAnswersController = new DeviceWearerCheckAnswersController(auditService)
  const attachmentsController = new AttachmentsController(auditService, orderService, attachmentService)
  const contactDetailsController = new ContactDetailsController(auditService)
  const installationAndRiskController = new InstallationAndRiskController(auditService, installationAndRiskService)
  const monitoringConditionsController = new MonitoringConditionsController(auditService, monitoringConditionsService)

  router.param('orderId', populateOrder(orderService))

  get('/', orderSearchController.search)

  // Order
  post(paths.ORDER.CREATE, orderController.create)
  get(paths.ORDER.DELETE_SUCCESS, orderController.deleteSuccess)
  get(paths.ORDER.DELETE_FAILED, orderController.deleteFailed)
  get(paths.ORDER.SUMMARY, orderController.summary)
  get(paths.ORDER.DELETE, orderController.confirmDelete)
  post(paths.ORDER.DELETE, orderController.delete)
  post(paths.ORDER.SUBMIT, orderController.submit)
  get(paths.ORDER.SUBMIT_SUCCESS, orderController.submitSuccess)
  get(paths.ORDER.SUBMIT_FAILED, orderController.submitFailed)

  /**
   * ABOUT THE DEVICE WEARER
   */

  // Device Wearer
  get(paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER, deviceWearerController.view)
  post(paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER, deviceWearerController.update)

  // Responsible Adult
  get(paths.ABOUT_THE_DEVICE_WEARER.RESPONSIBLE_ADULT, responsibleAdultController.view)

  // ResponsibleOfficer
  get(paths.ABOUT_THE_DEVICE_WEARER.RESPONSIBLE_OFFICER, responsibleOfficerController.view)

  // Check your answers
  get(paths.ABOUT_THE_DEVICE_WEARER.CHECK_YOUR_ANSWERS, deviceWearerCheckAnswersController.view)

  /**
   * CONATCT INFORMATION
   */
  get(paths.CONTACT_INFORMATION.CONTACT_DETAILS, contactDetailsController.view)

  /**
   * INSTALLATION AND RISK
   */
  get(paths.INSTALLATION_AND_RISK, installationAndRiskController.view)
  post(paths.INSTALLATION_AND_RISK, installationAndRiskController.update)

  /**
   * MONITORING CONDITIONS
   */

  // Main monitoring conditions page
  get(paths.MONITORING_CONDITIONS.BASE_URL, monitoringConditionsController.view)
  post(paths.MONITORING_CONDITIONS.BASE_URL, monitoringConditionsController.update)

  /**
   * ATTACHMENTS
   */
  get(paths.ATTACHMENT.ATTACHMENTS, attachmentsController.view)
  get(paths.ATTACHMENT.LICENCE, attachmentsController.licence)
  post(paths.ATTACHMENT.LICENCE, attachmentsController.uploadLicence)
  get(paths.ATTACHMENT.PHOTO_ID, attachmentsController.photo)
  post(paths.ATTACHMENT.PHOTO_ID, attachmentsController.uploadPhoto)
  get(paths.ATTACHMENT.DOWNLOAD_LICENCE, attachmentsController.downloadLicence)
  get(paths.ATTACHMENT.DOWNLOAD_PHOTO_ID, attachmentsController.downloadPhoto)

  return router
}
