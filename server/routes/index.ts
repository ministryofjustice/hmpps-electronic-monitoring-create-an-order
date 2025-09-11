import { type RequestHandler, Router } from 'express'

import AttachmentsController from '../controllers/attachments/attachmentController'
import AddressController from '../controllers/contact-information/addressController'
import ContactDetailsController from '../controllers/contact-information/contactDetailsController'
import NoFixedAbodeController from '../controllers/contact-information/noFixedAbodeController'
import InterestedPartiesController from '../controllers/contact-information/interestedPartiesController'
import ContactInformationCheckAnswersController from '../controllers/contact-information/checkAnswersController'
import DeviceWearerController from '../controllers/about-the-device-wearer/deviceWearerController'
import ResponsibleAdultController from '../controllers/about-the-device-wearer/deviceWearerResponsibleAdultController'
import DeviceWearerCheckAnswersController from '../controllers/about-the-device-wearer/deviceWearerCheckAnswersController'
import InstallationAndRiskController from '../controllers/installationAndRisk/installationAndRiskController'
import InstallationAndRiskCheckAnswersController from '../controllers/installationAndRisk/installationAndRiskCheckAnswersController'
import AlcoholMonitoringController from '../controllers/monitoringConditions/alcoholMonitoringController'
import AttendanceMonitoringController from '../controllers/monitoringConditions/attendanceMonitoringController'
import CurfewConditionsController from '../controllers/monitoringConditions/curfewConditionsController'
import CurfewReleaseDateController from '../controllers/monitoringConditions/curfewReleaseDateController'
import CurfewTimetableController from '../controllers/monitoringConditions/curfewTimetableController'
import EnforcementZoneController from '../controllers/monitoringConditions/enforcementZoneController'
import MonitoringConditionsController from '../controllers/monitoringConditions/monitoringConditionsController'
import TrailMonitoringController from '../controllers/monitoringConditions/trailMonitoringController'
import MonitoringConditionsCheckAnswersController from '../controllers/monitoringConditions/checkAnswersController'
import ProbationDeliveryUnitController from '../controllers/contact-information/probationDeliveryUnitController'
import InstallationAppointmentController from '../controllers/monitoringConditions/installationAppointmentController'
import OrderController from '../controllers/orderController'
import OrderSearchController from '../controllers/orderSearchController'
import asyncMiddleware from '../middleware/asyncMiddleware'
import populateOrder from '../middleware/populateCurrentOrder'
import type { Services } from '../services'
import paths from '../constants/paths'
import VariationDetailsController from '../controllers/variation/variationDetailsController'
import CurfewAdditionalDetailsController from '../controllers/monitoringConditions/curfewAdditionalDetailsController'
import InstallationLocationController from '../controllers/monitoringConditions/installationLocationController'
import ReceiptController from '../controllers/receiptController'
import AttachmentHavePhotoController from '../controllers/attachments/attachmentHavePhotoController'
import IsRejectionController from './is-rejection/controller'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function routes({
  alcoholMonitoringService,
  attachmentService,
  attendanceMonitoringService,
  auditService,
  contactDetailsService,
  curfewConditionsService,
  curfewAdditionalDetailsService,
  curfewReleaseDateService,
  curfewTimetableService,
  addressService,
  deviceWearerResponsibleAdultService,
  deviceWearerService,
  installationAndRiskService,
  monitoringConditionsService,
  interestedPartiesService,
  orderService,
  orderSearchService,
  taskListService,
  trailMonitoringService,
  variationService,
  probationDeliveryUnitService,
  zoneService,
  installationLocationService,
  installationAppointmentService,
  orderChecklistService,
}: Services): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (path: string | string[], handler: RequestHandler) => router.post(path, asyncMiddleware(handler))

  const addressController = new AddressController(auditService, addressService, taskListService)
  const alcoholMonitoringController = new AlcoholMonitoringController(
    auditService,
    alcoholMonitoringService,
    taskListService,
  )
  const attachmentsController = new AttachmentsController(
    auditService,
    orderService,
    attachmentService,
    taskListService,
    orderChecklistService,
  )
  const attachmentsHavePhotoController = new AttachmentHavePhotoController(
    attachmentService,
    taskListService,
    orderService,
  )
  const attendanceMonitoringController = new AttendanceMonitoringController(
    attendanceMonitoringService,
    taskListService,
  )
  const contactDetailsController = new ContactDetailsController(auditService, contactDetailsService, taskListService)
  const curfewReleaseDateController = new CurfewReleaseDateController(
    auditService,
    curfewReleaseDateService,
    taskListService,
  )
  const curfewTimetableController = new CurfewTimetableController(auditService, curfewTimetableService, taskListService)
  const curfewConditionsController = new CurfewConditionsController(
    auditService,
    curfewConditionsService,
    taskListService,
  )
  const curfewAdditionalDetailsController = new CurfewAdditionalDetailsController(
    auditService,
    curfewAdditionalDetailsService,
    taskListService,
  )
  const deviceWearerController = new DeviceWearerController(auditService, deviceWearerService, taskListService)
  const deviceWearerCheckAnswersController = new DeviceWearerCheckAnswersController(
    auditService,
    taskListService,
    orderChecklistService,
  )
  const installationAndRiskController = new InstallationAndRiskController(
    auditService,
    installationAndRiskService,
    taskListService,
  )
  const installationAndRiskCheckAnswersController = new InstallationAndRiskCheckAnswersController(
    auditService,
    taskListService,
    orderChecklistService,
  )
  const monitoringConditionsController = new MonitoringConditionsController(
    monitoringConditionsService,
    taskListService,
  )
  const noFixedAbodeController = new NoFixedAbodeController(auditService, deviceWearerService, taskListService)
  const notifyingOrganisationController = new InterestedPartiesController(
    auditService,
    interestedPartiesService,
    taskListService,
  )
  const orderSearchController = new OrderSearchController(auditService, orderSearchService)
  const orderController = new OrderController(auditService, orderService, taskListService)
  const responsibleAdultController = new ResponsibleAdultController(
    auditService,
    deviceWearerResponsibleAdultService,
    taskListService,
  )
  const trailMonitoringController = new TrailMonitoringController(auditService, trailMonitoringService, taskListService)
  const zoneController = new EnforcementZoneController(auditService, zoneService, taskListService)
  const monitoringConditionsCheckYourAnswersController = new MonitoringConditionsCheckAnswersController(
    auditService,
    taskListService,
    orderChecklistService,
  )
  const contactInformationCheckAnswersController = new ContactInformationCheckAnswersController(
    auditService,
    taskListService,
    orderChecklistService,
  )
  const variationDetailsController = new VariationDetailsController(
    auditService,
    variationService,
    taskListService,
    orderChecklistService,
  )
  const receiptController = new ReceiptController()

  const probationDeliveryUnitController = new ProbationDeliveryUnitController(
    auditService,
    probationDeliveryUnitService,
    taskListService,
  )

  const installationLocationController = new InstallationLocationController(
    installationLocationService,
    taskListService,
  )

  const installationAppointmentController = new InstallationAppointmentController(
    installationAppointmentService,
    taskListService,
  )

  const isRejectionController = new IsRejectionController()
  router.param('orderId', populateOrder(orderService))

  get('/', orderSearchController.list)
  get('/search', orderSearchController.search)

  // Order
  post(paths.ORDER.CREATE, orderController.create)
  get(paths.ORDER.DELETE_SUCCESS, orderController.deleteSuccess)
  get(paths.ORDER.DELETE_FAILED, orderController.deleteFailed)
  get(paths.ORDER.SUMMARY, orderController.summary)
  get(paths.ORDER.EDIT, orderController.confirmEdit)
  get(paths.ORDER.IS_REJECTION, isRejectionController.view)
  post(paths.ORDER.VARIATION, orderController.createVariation)
  get(paths.ORDER.DELETE, orderController.confirmDelete)
  post(paths.ORDER.DELETE, orderController.delete)
  post(paths.ORDER.SUBMIT, orderController.submit)
  get(paths.ORDER.SUBMIT_SUCCESS, orderController.submitSuccess)
  get(paths.ORDER.SUBMIT_PATIAL_SUCCESS, orderController.submitPartialSuccess)
  get(paths.ORDER.SUBMIT_FAILED, orderController.submitFailed)
  get(paths.ORDER.RECEIPT, receiptController.viewReceipt)
  get(paths.ORDER.RECEIPT_DOWNLOAD, receiptController.downloadReceipt)

  /**
   * ABOUT THE DEVICE WEARER
   */

  // Device Wearer
  get(paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER, deviceWearerController.viewDeviceWearer)
  post(paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER, deviceWearerController.updateDeviceWearer)

  // Identity numbers
  get(paths.ABOUT_THE_DEVICE_WEARER.IDENTITY_NUMBERS, deviceWearerController.viewIdentityNumbers)
  post(paths.ABOUT_THE_DEVICE_WEARER.IDENTITY_NUMBERS, deviceWearerController.updateIdentityNumbers)

  // Responsible Adult
  get(paths.ABOUT_THE_DEVICE_WEARER.RESPONSIBLE_ADULT, responsibleAdultController.view)
  post(paths.ABOUT_THE_DEVICE_WEARER.RESPONSIBLE_ADULT, responsibleAdultController.update)

  // Check your answers
  get(paths.ABOUT_THE_DEVICE_WEARER.CHECK_YOUR_ANSWERS, deviceWearerCheckAnswersController.view)
  post(paths.ABOUT_THE_DEVICE_WEARER.CHECK_YOUR_ANSWERS, deviceWearerCheckAnswersController.update)

  /**
   * CONTACT INFORMATION
   */

  // Contact details
  get(paths.CONTACT_INFORMATION.CONTACT_DETAILS, contactDetailsController.view)
  post(paths.CONTACT_INFORMATION.CONTACT_DETAILS, contactDetailsController.update)

  // No fixed abode
  get(paths.CONTACT_INFORMATION.NO_FIXED_ABODE, noFixedAbodeController.view)
  post(paths.CONTACT_INFORMATION.NO_FIXED_ABODE, noFixedAbodeController.update)

  // Device wearer addresses
  get(paths.CONTACT_INFORMATION.ADDRESSES, addressController.view)
  post(paths.CONTACT_INFORMATION.ADDRESSES, addressController.update)

  // Interested parties
  get(paths.CONTACT_INFORMATION.INTERESTED_PARTIES, notifyingOrganisationController.view)
  post(paths.CONTACT_INFORMATION.INTERESTED_PARTIES, notifyingOrganisationController.update)

  // Probation delivery unit
  get(paths.CONTACT_INFORMATION.PROBATION_DELIVERY_UNIT, probationDeliveryUnitController.view)
  post(paths.CONTACT_INFORMATION.PROBATION_DELIVERY_UNIT, probationDeliveryUnitController.update)

  // Check your answers
  get(paths.CONTACT_INFORMATION.CHECK_YOUR_ANSWERS, contactInformationCheckAnswersController.view)
  post(paths.CONTACT_INFORMATION.CHECK_YOUR_ANSWERS, contactInformationCheckAnswersController.update)

  /**
   * INSTALLATION AND RISK
   */
  get(paths.INSTALLATION_AND_RISK.INSTALLATION_AND_RISK, installationAndRiskController.view)
  post(paths.INSTALLATION_AND_RISK.INSTALLATION_AND_RISK, installationAndRiskController.update)

  get(paths.INSTALLATION_AND_RISK.CHECK_YOUR_ANSWERS, installationAndRiskCheckAnswersController.view)
  post(paths.INSTALLATION_AND_RISK.CHECK_YOUR_ANSWERS, installationAndRiskCheckAnswersController.update)

  /**
   * MONITORING CONDITIONS
   */

  // Main monitoring conditions page
  get(paths.MONITORING_CONDITIONS.BASE_URL, monitoringConditionsController.view)
  post(paths.MONITORING_CONDITIONS.BASE_URL, monitoringConditionsController.update)

  // Installation location page
  get(paths.MONITORING_CONDITIONS.INSTALLATION_LOCATION, installationLocationController.view)
  post(paths.MONITORING_CONDITIONS.INSTALLATION_LOCATION, installationLocationController.update)

  // Installation appointment page
  get(paths.MONITORING_CONDITIONS.INSTALLATION_APPOINTMENT, installationAppointmentController.view)
  post(paths.MONITORING_CONDITIONS.INSTALLATION_APPOINTMENT, installationAppointmentController.update)
  // Installation address page
  get(paths.MONITORING_CONDITIONS.INSTALLATION_ADDRESS, addressController.view)
  post(paths.MONITORING_CONDITIONS.INSTALLATION_ADDRESS, addressController.update)

  // Trail monitoring page
  get(paths.MONITORING_CONDITIONS.TRAIL, trailMonitoringController.view)
  post(paths.MONITORING_CONDITIONS.TRAIL, trailMonitoringController.update)

  // Attendance monitoring page
  get(paths.MONITORING_CONDITIONS.ATTENDANCE, attendanceMonitoringController.new)
  get(paths.MONITORING_CONDITIONS.ATTENDANCE_ITEM, attendanceMonitoringController.view)
  post(paths.MONITORING_CONDITIONS.ATTENDANCE, attendanceMonitoringController.update)
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

  // Curfew additional details page
  get(paths.MONITORING_CONDITIONS.CURFEW_ADDITIONAL_DETAILS, curfewAdditionalDetailsController.view)
  post(paths.MONITORING_CONDITIONS.CURFEW_ADDITIONAL_DETAILS, curfewAdditionalDetailsController.update)

  // Curfew dates page
  get(paths.MONITORING_CONDITIONS.CURFEW_TIMETABLE, curfewTimetableController.view)
  post(paths.MONITORING_CONDITIONS.CURFEW_TIMETABLE, curfewTimetableController.update)

  // Exclusion Inclusion Zone
  get(paths.MONITORING_CONDITIONS.ZONE, zoneController.view)
  post(paths.MONITORING_CONDITIONS.ZONE, zoneController.update)

  // Check your answers
  get(paths.MONITORING_CONDITIONS.CHECK_YOUR_ANSWERS, monitoringConditionsCheckYourAnswersController.view)
  post(paths.MONITORING_CONDITIONS.CHECK_YOUR_ANSWERS, monitoringConditionsCheckYourAnswersController.update)

  /**
   * ATTACHMENTS
   */
  get(paths.ATTACHMENT.ATTACHMENTS, attachmentsController.view)
  get(paths.ATTACHMENT.FILE_VIEW, attachmentsController.uploadFileView)
  post(paths.ATTACHMENT.FILE_VIEW, attachmentsController.uploadFile)
  get(paths.ATTACHMENT.DOWNLOAD_FILE, attachmentsController.downloadFile)
  get(paths.ATTACHMENT.HAVE_PHOTO, attachmentsHavePhotoController.view)
  post(paths.ATTACHMENT.HAVE_PHOTO, attachmentsHavePhotoController.update)

  /**
   * VARIATIONS
   */
  get(paths.VARIATION.VARIATION_DETAILS, variationDetailsController.view)
  post(paths.VARIATION.VARIATION_DETAILS, variationDetailsController.update)

  return router
}
