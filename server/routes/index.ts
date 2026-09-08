import { type RequestHandler, Router } from 'express'

import AlcoholMonitoringController from '../controllers/monitoringConditions/alcoholMonitoringController'
import AttendanceMonitoringController from '../controllers/monitoringConditions/attendanceMonitoringController'
import AttendanceMonitoringAddToListController from './monitoring-conditions/attendance-monitoring/controller'
import CurfewConditionsController from '../controllers/monitoringConditions/curfewConditionsController'
import CurfewReleaseDateController from '../controllers/monitoringConditions/curfewReleaseDateController'
import CurfewTimetableController from '../controllers/monitoringConditions/curfewTimetableController'
import EnforcementZoneAddToListController from './monitoring-conditions/enforcement-zone/controller'
import TrailMonitoringController from '../controllers/monitoringConditions/trailMonitoringController'
import MonitoringConditionsCheckAnswersController from '../controllers/monitoringConditions/checkAnswersController'
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
import createContactInformationRouter from './contact-information/router'
import createOrderRouter from './order/router'
import IsAddressChangeController from './variations/is-address-change/controller'
import createAboutTheDeviceWearerRouter from './about-the-device-wearer/router'

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
  const attendanceMonitoringController = new AttendanceMonitoringController(attendanceMonitoringService)
  const attendanceMonitoringAddToListController = new AttendanceMonitoringAddToListController(
    attendanceMonitoringAddToListService,
  )
  const curfewReleaseDateController = new CurfewReleaseDateController(curfewReleaseDateService)
  const curfewTimetableController = new CurfewTimetableController(curfewTimetableService)
  const curfewConditionsController = new CurfewConditionsController(curfewConditionsService)
  const curfewAdditionalDetailsController = new CurfewAdditionalDetailsController(curfewAdditionalDetailsService)
  const removeMonitoringTypeController = new RemoveMonitoringTypeController(removeMonitoringTypeService)
  const orderSearchController = new OrderSearchController(auditService, orderSearchService)
  const trailMonitoringController = new TrailMonitoringController(trailMonitoringService)
  const zoneControllerAddToList = new EnforcementZoneAddToListController(auditService, zoneAddToListService)
  const monitoringConditionsCheckYourAnswersController = new MonitoringConditionsCheckAnswersController(
    taskListService,
    orderChecklistService,
    sectionService,
  )
  const variationDetailsController = new VariationDetailsController(
    variationService,
    taskListService,
    orderChecklistService,
  )

  const installationLocationController = new InstallationLocationController(
    installationLocationService,
    taskListService,
  )

  const installationAppointmentController = new InstallationAppointmentController(
    installationAppointmentService,
    taskListService,
  )

  const serviceRequestTypeController = new ServiceRequestTypeController(serviceRequestTypeService)
  const isAddressChangeController = new IsAddressChangeController(serviceRequestTypeService)
  router.param('orderId', populateOrder(orderService))

  get('/', orderSearchController.list)
  get('/search', orderSearchController.search)

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
      taskListService,
      orderChecklistService,
      sectionService,
      sentencingActService,
    }),
  )
  router.use(
    paths.ABOUT_THE_DEVICE_WEARER.BASE_URL,
    createAboutTheDeviceWearerRouter({
      deviceWearerService,
      deviceWearerResponsibleAdultService,
      taskListService,
      orderChecklistService,
      sectionService,
    }),
  )
  router.use(
    paths.ABOUT_THE_DEVICE_WEARER.VERSION_BASE_URL,
    createAboutTheDeviceWearerRouter({
      deviceWearerService,
      deviceWearerResponsibleAdultService,
      taskListService,
      orderChecklistService,
      sectionService,
    }),
  )

  router.use(
    '/',
    createContactInformationRouter({
      contactDetailsService,
      deviceWearerService,
      interestedPartiesService,
      probationDeliveryUnitService,
      taskListService,
      orderChecklistService,
    }),
  )

  router.use(
    [
      paths.INSTALLATION_AND_RISK.BASE_URL,
      paths.INSTALLATION_AND_RISK.CHECK_YOUR_ANSWERS_VERSION.replace('/check-your-answers', ''),
    ],
    createInstallationAndRiskRouter({
      dapoService,
      offenceService,
      mappaService,
      detailsOfInstallationService,
      installationAndRiskService,
      orderChecklistService,
      sectionService,
      taskListService,
      offenceOtherInfoService,
    }),
  )
  router.use(
    [paths.ATTACHMENT.ATTACHMENTS, paths.ATTACHMENT.ATTACHMENTS_VERSION],
    createAttachmentRouter({
      auditService,
      attachmentService,
      orderChecklistService,
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
