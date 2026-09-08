import { type RequestHandler, Router } from 'express'

import AttachmentsController from '../controllers/attachments/attachmentController'
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
import AttendanceMonitoringAddToListController from './monitoring-conditions/attendance-monitoring/controller'
import CurfewConditionsController from '../controllers/monitoringConditions/curfewConditionsController'
import CurfewReleaseDateController from '../controllers/monitoringConditions/curfewReleaseDateController'
import CurfewTimetableController from '../controllers/monitoringConditions/curfewTimetableController'
import EnforcementZoneAddToListController from './monitoring-conditions/enforcement-zone/controller'
import TrailMonitoringController from '../controllers/monitoringConditions/trailMonitoringController'
import MonitoringConditionsCheckAnswersController from '../controllers/monitoringConditions/checkAnswersController'
import ProbationDeliveryUnitController from '../controllers/contact-information/probationDeliveryUnitController'
import InstallationAppointmentController from '../controllers/monitoringConditions/installationAppointmentController'
import OrderSearchController from '../controllers/orderSearchController'
import asyncMiddleware from '../middleware/asyncMiddleware'
import populateOrder from '../middleware/populateCurrentOrder'
import { type Services } from '../services'
import paths from '../constants/paths'
import VariationDetailsController from '../controllers/variation/variationDetailsController'
import CurfewAdditionalDetailsController from '../controllers/monitoringConditions/curfewAdditionalDetailsController'
import InstallationLocationController from '../controllers/monitoringConditions/installationLocationController'
import createOrderTypeDescriptionRouter from './monitoring-conditions/router'
import RemoveMonitoringTypeController from './monitoring-conditions/remove-monitoring-type/controller'
import createPostcodeLookupRouter from './postcode-lookup/router'
import ServiceRequestTypeController from './variations/service-request-type/controller'
import createInstallationAndRiskRouter from './installation-and-risk/router'
import createAttachmentRouter from './attachments/router'
import createInterestedPartiesRouter from './interested-parties/router'
import createOrderRouter from './order/router'
import InterestedPartiesCheckYourAnswersController from './interested-parties/check-your-answers/controller'
import IsAddressChangeController from './variations/is-address-change/controller'
import SentencingActSelection from './sentencing-act-selection/controller'

export default function routes({
  alcoholMonitoringService,
  attachmentService,
  attendanceMonitoringService,
  attendanceMonitoringAddToListService,
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
  interestedPartiesService,
  orderService,
  orderSearchService,
  taskListService,
  trailMonitoringService,
  variationService,
  probationDeliveryUnitService,
  zoneAddToListService,
  installationLocationService,
  installationAppointmentService,
  orderChecklistService,
  isRejectionService,
  monitoringConditionsStoreService,
  monitoringConditionsUpdateService,
  removeMonitoringTypeService,
  serviceRequestTypeService,
  fmsRequestService,
  dapoService,
  offenceService,
  mappaService,
  detailsOfInstallationService,
  offenceOtherInfoService,
  interestedPartiesStoreService,
  updateInterestedPartiesService,
  postcodeService,
  sectionService,
  sentencingActService,
}: Services): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (path: string | string[], handler: RequestHandler) => router.post(path, asyncMiddleware(handler))

  const alcoholMonitoringController = new AlcoholMonitoringController(alcoholMonitoringService)
  const attachmentsController = new AttachmentsController(
    auditService,
    attachmentService,
    taskListService,
    orderChecklistService,
  )
  const attendanceMonitoringController = new AttendanceMonitoringController(attendanceMonitoringService)
  const attendanceMonitoringAddToListController = new AttendanceMonitoringAddToListController(
    attendanceMonitoringAddToListService,
  )
  const contactDetailsController = new ContactDetailsController(contactDetailsService, taskListService)
  const curfewReleaseDateController = new CurfewReleaseDateController(curfewReleaseDateService)
  const curfewTimetableController = new CurfewTimetableController(curfewTimetableService)
  const curfewConditionsController = new CurfewConditionsController(curfewConditionsService)
  const curfewAdditionalDetailsController = new CurfewAdditionalDetailsController(curfewAdditionalDetailsService)
  const deviceWearerController = new DeviceWearerController(deviceWearerService, taskListService)
  const deviceWearerCheckAnswersController = new DeviceWearerCheckAnswersController(
    taskListService,
    orderChecklistService,
    sectionService,
  )
  const installationAndRiskController = new InstallationAndRiskController(installationAndRiskService, taskListService)
  const installationAndRiskCheckAnswersController = new InstallationAndRiskCheckAnswersController(
    taskListService,
    orderChecklistService,
    sectionService,
  )
  const removeMonitoringTypeController = new RemoveMonitoringTypeController(removeMonitoringTypeService)
  const noFixedAbodeController = new NoFixedAbodeController(deviceWearerService, taskListService)
  const interestedPartiesController = new InterestedPartiesController(interestedPartiesService, taskListService)
  const orderSearchController = new OrderSearchController(auditService, orderSearchService)
  const responsibleAdultController = new ResponsibleAdultController(
    deviceWearerResponsibleAdultService,
    taskListService,
  )
  const trailMonitoringController = new TrailMonitoringController(trailMonitoringService)
  const zoneControllerAddToList = new EnforcementZoneAddToListController(auditService, zoneAddToListService)
  const monitoringConditionsCheckYourAnswersController = new MonitoringConditionsCheckAnswersController(
    taskListService,
    orderChecklistService,
    sectionService,
  )
  const contactInformationCheckAnswersController = new ContactInformationCheckAnswersController(
    taskListService,
    orderChecklistService,
  )
  const variationDetailsController = new VariationDetailsController(
    variationService,
    taskListService,
    orderChecklistService,
  )
  const probationDeliveryUnitController = new ProbationDeliveryUnitController(
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

  const interestedPartiesCheckYourAsnwerController = new InterestedPartiesCheckYourAnswersController(
    taskListService,
    orderChecklistService,
    sectionService,
  )

  const serviceRequestTypeController = new ServiceRequestTypeController(serviceRequestTypeService)
  const isAddressChangeController = new IsAddressChangeController(serviceRequestTypeService)
  const setSentencingAct = new SentencingActSelection(sentencingActService)
  router.param('orderId', populateOrder(orderService))

  get('/', orderSearchController.list)
  get('/search', orderSearchController.search)

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
  get(paths.ABOUT_THE_DEVICE_WEARER.CHECK_YOUR_ANSWERS_VERSION, deviceWearerCheckAnswersController.view)
  post(paths.ABOUT_THE_DEVICE_WEARER.CHECK_YOUR_ANSWERS_VERSION, deviceWearerCheckAnswersController.update)

  /**
   * CONTACT INFORMATION
   */

  // Contact details
  get(paths.CONTACT_INFORMATION.CONTACT_DETAILS, contactDetailsController.view)
  post(paths.CONTACT_INFORMATION.CONTACT_DETAILS, contactDetailsController.update)

  // No fixed abode
  get(paths.CONTACT_INFORMATION.NO_FIXED_ABODE, noFixedAbodeController.view)
  post(paths.CONTACT_INFORMATION.NO_FIXED_ABODE, noFixedAbodeController.update)

  // Interested parties
  get(paths.CONTACT_INFORMATION.INTERESTED_PARTIES, interestedPartiesController.view)
  post(paths.CONTACT_INFORMATION.INTERESTED_PARTIES, interestedPartiesController.update)

  // Probation delivery unit
  get(paths.CONTACT_INFORMATION.PROBATION_DELIVERY_UNIT, probationDeliveryUnitController.view)
  post(paths.CONTACT_INFORMATION.PROBATION_DELIVERY_UNIT, probationDeliveryUnitController.update)

  // Check your answers
  get(paths.CONTACT_INFORMATION.CHECK_YOUR_ANSWERS, contactInformationCheckAnswersController.view)
  post(paths.CONTACT_INFORMATION.CHECK_YOUR_ANSWERS, contactInformationCheckAnswersController.update)
  get(paths.CONTACT_INFORMATION.CHECK_YOUR_ANSWERS_VERSION, contactInformationCheckAnswersController.view)
  post(paths.CONTACT_INFORMATION.CHECK_YOUR_ANSWERS_VERSION, contactInformationCheckAnswersController.update)

  /**
   * INSTALLATION AND RISK
   */
  get(paths.INSTALLATION_AND_RISK.INSTALLATION_AND_RISK, installationAndRiskController.view)
  post(paths.INSTALLATION_AND_RISK.INSTALLATION_AND_RISK, installationAndRiskController.update)

  get(paths.INSTALLATION_AND_RISK.CHECK_YOUR_ANSWERS, installationAndRiskCheckAnswersController.view)
  post(paths.INSTALLATION_AND_RISK.CHECK_YOUR_ANSWERS, installationAndRiskCheckAnswersController.update)
  get(paths.INSTALLATION_AND_RISK.CHECK_YOUR_ANSWERS_VERSION, installationAndRiskCheckAnswersController.view)
  post(paths.INSTALLATION_AND_RISK.CHECK_YOUR_ANSWERS_VERSION, installationAndRiskCheckAnswersController.update)

  /**
   * MONITORING CONDITIONS
   */

  get(paths.MONITORING_CONDITIONS.REMOVE_MONITORING_TYPE, removeMonitoringTypeController.view)
  post(paths.MONITORING_CONDITIONS.REMOVE_MONITORING_TYPE, removeMonitoringTypeController.update)

  // Installation location page
  get(paths.MONITORING_CONDITIONS.INSTALLATION_LOCATION, installationLocationController.view)
  post(paths.MONITORING_CONDITIONS.INSTALLATION_LOCATION, installationLocationController.update)

  // Installation appointment page
  get(paths.MONITORING_CONDITIONS.INSTALLATION_APPOINTMENT, installationAppointmentController.view)
  post(paths.MONITORING_CONDITIONS.INSTALLATION_APPOINTMENT, installationAppointmentController.update)

  // Trail monitoring page
  get(paths.MONITORING_CONDITIONS.TRAIL, trailMonitoringController.view)
  post(paths.MONITORING_CONDITIONS.TRAIL, trailMonitoringController.update)

  // Attendance monitoring page
  get(paths.MONITORING_CONDITIONS.ATTENDANCE, attendanceMonitoringController.new)
  get(paths.MONITORING_CONDITIONS.ATTENDANCE_ITEM, attendanceMonitoringController.view)
  post(paths.MONITORING_CONDITIONS.ATTENDANCE, attendanceMonitoringController.update)
  post(paths.MONITORING_CONDITIONS.ATTENDANCE_ITEM, attendanceMonitoringController.update)

  // Attendance monitoring page add to list
  get(paths.MONITORING_CONDITIONS.ATTENDANCE_ADD_TO_LIST, attendanceMonitoringAddToListController.new)
  get(paths.MONITORING_CONDITIONS.ATTENDANCE_ITEM_ADD_TO_LIST, attendanceMonitoringAddToListController.view)
  post(paths.MONITORING_CONDITIONS.ATTENDANCE_ADD_TO_LIST, attendanceMonitoringAddToListController.update)
  post(paths.MONITORING_CONDITIONS.ATTENDANCE_ITEM_ADD_TO_LIST, attendanceMonitoringAddToListController.update)

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

  // Exclusion Inclusion Zone Add To List
  get(paths.MONITORING_CONDITIONS.ZONE_NEW_ITEM, zoneControllerAddToList.new)
  get(paths.MONITORING_CONDITIONS.ZONE_ADD_TO_LIST, zoneControllerAddToList.view)
  post(paths.MONITORING_CONDITIONS.ZONE_ADD_TO_LIST, zoneControllerAddToList.update)

  // Check your answers
  get(paths.MONITORING_CONDITIONS.CHECK_YOUR_ANSWERS, monitoringConditionsCheckYourAnswersController.view)
  post(paths.MONITORING_CONDITIONS.CHECK_YOUR_ANSWERS, monitoringConditionsCheckYourAnswersController.update)
  get(paths.MONITORING_CONDITIONS.CHECK_YOUR_ANSWERS_VERSION, monitoringConditionsCheckYourAnswersController.view)
  post(paths.MONITORING_CONDITIONS.CHECK_YOUR_ANSWERS_VERSION, monitoringConditionsCheckYourAnswersController.update)

  /**
   * ATTACHMENTS
   */
  get(paths.ATTACHMENT.ATTACHMENTS, attachmentsController.view)
  get(paths.ATTACHMENT.ATTACHMENTS_VERSION, attachmentsController.view)
  get(paths.ATTACHMENT.FILE_VIEW, attachmentsController.uploadFileView)
  post(paths.ATTACHMENT.FILE_VIEW, attachmentsController.uploadFile)
  get(paths.ATTACHMENT.DOWNLOAD_FILE, attachmentsController.downloadFile)

  /**
   * VARIATIONS
   */
  get(paths.VARIATION.VARIATION_DETAILS_VERSION, variationDetailsController.view)
  post(paths.VARIATION.VARIATION_DETAILS_VERSION, variationDetailsController.update)
  get(paths.VARIATION.VARIATION_DETAILS, variationDetailsController.view)
  post(paths.VARIATION.VARIATION_DETAILS, variationDetailsController.update)
  get(paths.VARIATION.SERVICE_REQUEST_TYPE, serviceRequestTypeController.view)
  post(paths.VARIATION.SERVICE_REQUEST_TYPE, serviceRequestTypeController.update)
  get(paths.VARIATION.CREATE_VARIATION, isAddressChangeController.view)
  post(paths.VARIATION.CREATE_VARIATION, isAddressChangeController.update)

  get(paths.INTEREST_PARTIES.CHECK_YOUR_ANSWERS_VERSION, interestedPartiesCheckYourAsnwerController.view)
  post(paths.INTEREST_PARTIES.CHECK_YOUR_ANSWERS_VERSION, interestedPartiesCheckYourAsnwerController.update)
  get(paths.INTEREST_PARTIES.CHECK_YOUR_ANSWERS, interestedPartiesCheckYourAsnwerController.view)
  post(paths.INTEREST_PARTIES.CHECK_YOUR_ANSWERS, interestedPartiesCheckYourAsnwerController.update)

  // Sentencing act
  get(paths.INTEREST_PARTIES.SENTENCING_ACT_SELECTION, setSentencingAct.view)
  post(paths.INTEREST_PARTIES.SENTENCING_ACT_SELECTION, setSentencingAct.update)

  router.use(
    paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.BASE_PATH,
    createOrderTypeDescriptionRouter({
      monitoringConditionsStoreService,
      monitoringConditionsUpdateService,
      taskListService,
    }),
  )

  router.use(
    paths.ORDER.BASE_URL,
    createPostcodeLookupRouter({ postcodeService, addressService, taskListService, auditService }),
  )

  router.use(
    paths.INTEREST_PARTIES.BASE_PATH,
    createInterestedPartiesRouter({
      interestedPartiesStoreService,
      updateInterestedPartiesService,
      probationDeliveryUnitService,
    }),
  )

  router.use(
    paths.INSTALLATION_AND_RISK.BASE_URL,
    createInstallationAndRiskRouter({
      dapoService,
      offenceService,
      mappaService,
      detailsOfInstallationService,
      taskListService,
      offenceOtherInfoService,
    }),
  )
  router.use(
    paths.ATTACHMENT.ATTACHMENTS,
    createAttachmentRouter({
      attachmentService,
      taskListService,
    }),
  )
  router.use(
    '/',
    createOrderRouter({
      orderService,
      sectionService,
      fmsRequestService,
      isRejectionService,
      serviceRequestTypeService,
    }),
  )
  return router
}
