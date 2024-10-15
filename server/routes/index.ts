import { type RequestHandler, Router } from 'express'

import paths from '../constants/paths'
import AttachmentsController from '../controllers/attachmentController'
import ContactDetailsController from '../controllers/contact-information/contactDetailsController'
import DeviceWearerController from '../controllers/deviceWearerController'
import ResponsibleAdultController from '../controllers/deviceWearerResponsibleAdultController'
import DeviceWearerCheckAnswersController from '../controllers/deviceWearersCheckAnswersController'
import InstallationAndRiskController from '../controllers/installationAndRisk/installationAndRiskController'
import AlcoholMonitoringController from '../controllers/monitoringConditions/alcoholMonitoringController'
import AttendanceMonitoringController from '../controllers/monitoringConditions/attendanceMonitoringController'
import CurfewConditionsController from '../controllers/monitoringConditions/curfewConditionsController'
import CurfewReleaseDateController from '../controllers/monitoringConditions/curfewReleaseDateController'
import CurfewTimetableController from '../controllers/monitoringConditions/curfewTimetableController'
import EnforcementZoneController from '../controllers/monitoringConditions/enforcementZoneController'
import MonitoringConditionsController from '../controllers/monitoringConditions/monitoringConditionsController'
import TrailMonitoringController from '../controllers/monitoringConditions/trailMonitoringController'
import OrderController from '../controllers/orderController'
import OrderSearchController from '../controllers/orderSearchController'
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
  curfewConditionsService,
  curfewReleaseDateService,
  curfewTimetableService,
  deviceWearerResponsibleAdultService,
  deviceWearerService,
  installationAndRiskService,
  monitoringConditionsService,
  orderService,
  orderSearchService,
  trailMonitoringService,
  zoneService,
}: Services): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (path: string | string[], handler: RequestHandler) => router.post(path, asyncMiddleware(handler))

  const alcoholMonitoringController = new AlcoholMonitoringController(auditService, alcoholMonitoringService)
  const attendanceMonitoringController = new AttendanceMonitoringController(auditService, attendanceMonitoringService)
  const curfewReleaseDateController = new CurfewReleaseDateController(auditService, curfewReleaseDateService)
  const curfewTimetableController = new CurfewTimetableController(auditService, curfewTimetableService)
  const curfewConditionsController = new CurfewConditionsController(auditService, curfewConditionsService)
  const orderSearchController = new OrderSearchController(auditService, orderSearchService)
  const orderController = new OrderController(auditService, orderService)
  const deviceWearerController = new DeviceWearerController(auditService, deviceWearerService)
  const responsibleAdultController = new ResponsibleAdultController(auditService, deviceWearerResponsibleAdultService)
  const responsibleOfficerController = new ResponsibleOfficerController(auditService)
  const deviceWearerCheckAnswersController = new DeviceWearerCheckAnswersController(auditService)
  const attachmentsController = new AttachmentsController(auditService, orderService, attachmentService)
  const contactDetailsController = new ContactDetailsController(auditService, contactDetailsService)
  const installationAndRiskController = new InstallationAndRiskController(auditService, installationAndRiskService)
  const monitoringConditionsController = new MonitoringConditionsController(auditService, monitoringConditionsService)
  const zoneController = new EnforcementZoneController(auditService, zoneService)
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
  post(paths.ABOUT_THE_DEVICE_WEARER.RESPONSIBLE_ADULT, responsibleAdultController.update)

  // ResponsibleOfficer
  get(paths.ABOUT_THE_DEVICE_WEARER.RESPONSIBLE_OFFICER, responsibleOfficerController.view)

  // Check your answers
  get(paths.ABOUT_THE_DEVICE_WEARER.CHECK_YOUR_ANSWERS, deviceWearerCheckAnswersController.view)

  /**
   * CONTACT INFORMATION
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
  get(paths.MONITORING_CONDITIONS.ATTENDANCE, attendanceMonitoringController.new)
  get(paths.MONITORING_CONDITIONS.ATTENDANCE_ITEM, attendanceMonitoringController.view)
  post(paths.MONITORING_CONDITIONS.ATTENDANCE, attendanceMonitoringController.create)
  post(paths.MONITORING_CONDITIONS.ATTENDANCE_ITEM, attendanceMonitoringController.update)

  // Alcohol monitoring page
  get(paths.MONITORING_CONDITIONS.ALCOHOL, alcoholMonitoringController.view)
  post(paths.MONITORING_CONDITIONS.ALCOHOL, alcoholMonitoringController.update)

  // Curfew day of release page
  get(paths.MONITORING_CONDITIONS.CURFEW_RELEASE_DATE, curfewReleaseDateController.view)
  post(paths.MONITORING_CONDITIONS.CURFEW_RELEASE_DATE, curfewReleaseDateController.update)

  // Curfew conditions page
  get(paths.MONITORING_CONDITIONS.CURFEW_CONDITIONS, curfewConditionsController.view)
  post(paths.MONITORING_CONDITIONS.CURFEW_CONDITIONS, curfewConditionsController.update)

  // Curfew dates page
  get(paths.MONITORING_CONDITIONS.CURFEW_TIMETABLE, curfewTimetableController.view)
  post(paths.MONITORING_CONDITIONS.CURFEW_TIMETABLE, curfewTimetableController.update)

  // Exclusion Inclusion Zone
  get(paths.MONITORING_CONDITIONS.ZONE, zoneController.view)
  post(paths.MONITORING_CONDITIONS.ZONE, zoneController.update)
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
