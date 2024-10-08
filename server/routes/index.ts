import { type RequestHandler, Router } from 'express'

import paths from '../constants/paths'
import AttachmentsController from '../controllers/attachmentController'
import ContactDetailsController from '../controllers/contact-information/contactDetailsController'
import DeviceWearerController from '../controllers/deviceWearerController'
import DeviceWearerCheckAnswersController from '../controllers/deviceWearersCheckAnswersController'
import InstallationAndRiskController from '../controllers/installationAndRisk/installationAndRiskController'
import AlcoholMonitoringController from '../controllers/monitoringConditions/alcoholMonitoringController'
import AttendanceMonitoringController from '../controllers/monitoringConditions/attendanceMonitoringController'
import CurfewDatesController from '../controllers/monitoringConditions/curfewDatesController'
import CurfewDayOfReleaseController from '../controllers/monitoringConditions/curfewDayOfReleaseController'
import CurfewTimetableController from '../controllers/monitoringConditions/curfewTimetableController'
import MonitoringConditionsController from '../controllers/monitoringConditions/monitoringConditionsController'
import TrailMonitoringController from '../controllers/monitoringConditions/trailMonitoringController'
import OrderController from '../controllers/orderController'
import OrderSearchController from '../controllers/orderSearchController'
import ResponsibleAdultController from '../controllers/responsibleAdultController'
import ResponsibleOfficerController from '../controllers/responsibleOfficerController'
import asyncMiddleware from '../middleware/asyncMiddleware'
import populateOrder from '../middleware/populateCurrentOrder'
import type { Services } from '../services'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function routes({
  alcoholMonitoringService,
  attachmentService,
  attendanceMonitoringService,
  auditService,
  contactDetailsService,
  curfewDatesService,
  curfewDayOfReleaseService,
  curfewTimetableService,
  deviceWearerService,
  installationAndRiskService,
  monitoringConditionsService,
  orderService,
  orderSearchService,
  trailMonitoringService,
}: Services): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (path: string | string[], handler: RequestHandler) => router.post(path, asyncMiddleware(handler))

  const alcoholMonitoringController = new AlcoholMonitoringController(auditService, alcoholMonitoringService)
  const attendanceMonitoringController = new AttendanceMonitoringController(auditService, attendanceMonitoringService)
  const curfewDayOfReleaseController = new CurfewDayOfReleaseController(auditService, curfewDayOfReleaseService)
  const curfewTimetableController = new CurfewTimetableController(auditService, curfewTimetableService)
  const curfewDatesController = new CurfewDatesController(auditService, curfewDatesService)
  const orderSearchController = new OrderSearchController(auditService, orderSearchService)
  const orderController = new OrderController(auditService, orderService)
  const deviceWearerController = new DeviceWearerController(auditService, deviceWearerService)
  const responsibleAdultController = new ResponsibleAdultController(auditService)
  const responsibleOfficerController = new ResponsibleOfficerController(auditService)
  const deviceWearerCheckAnswersController = new DeviceWearerCheckAnswersController(auditService)
  const attachmentsController = new AttachmentsController(auditService, orderService, attachmentService)
  const contactDetailsController = new ContactDetailsController(auditService, contactDetailsService)
  const installationAndRiskController = new InstallationAndRiskController(auditService, installationAndRiskService)
  const monitoringConditionsController = new MonitoringConditionsController(auditService, monitoringConditionsService)
  const trailMonitoringController = new TrailMonitoringController(auditService, trailMonitoringService)

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
  get(paths.CONTACT_INFORMATION.CONTACT_DETAILS, contactDetailsController.get)
  post(paths.CONTACT_INFORMATION.CONTACT_DETAILS, contactDetailsController.post)

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

  // Trail monitoring page
  get(paths.MONITORING_CONDITIONS.TRAIL, trailMonitoringController.view)
  post(paths.MONITORING_CONDITIONS.TRAIL, trailMonitoringController.update)

  // Attendance monitoring page
  get(paths.MONITORING_CONDITIONS.ATTENDANCE, attendanceMonitoringController.view)
  post(paths.MONITORING_CONDITIONS.ATTENDANCE, attendanceMonitoringController.update)

  // Alcohol monitoring page
  get(paths.MONITORING_CONDITIONS.ALCOHOL, alcoholMonitoringController.view)
  post(paths.MONITORING_CONDITIONS.ALCOHOL, alcoholMonitoringController.update)

  // Curfew day of release page
  get(paths.MONITORING_CONDITIONS.CURFEW_DAY_OF_RELEASE, curfewDayOfReleaseController.view)
  post(paths.MONITORING_CONDITIONS.CURFEW_DAY_OF_RELEASE, curfewDayOfReleaseController.update)

  // Curfew dates page
  get(paths.MONITORING_CONDITIONS.CURFEW_DATES, curfewDatesController.view)
  post(paths.MONITORING_CONDITIONS.CURFEW_DATES, curfewDatesController.update)

  // Curfew dates page
  get(paths.MONITORING_CONDITIONS.CURFEW_TIMETABLE, curfewTimetableController.view)
  post(paths.MONITORING_CONDITIONS.CURFEW_TIMETABLE, curfewTimetableController.update)

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
