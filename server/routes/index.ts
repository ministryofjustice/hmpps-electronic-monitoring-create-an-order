import { type RequestHandler, Router } from 'express'

import OrderSearchController from '../controllers/orderSearchController'
import asyncMiddleware from '../middleware/asyncMiddleware'
import populateOrder from '../middleware/populateCurrentOrder'
import { type Services } from '../services'
import paths from '../constants/paths'
import createOrderTypeDescriptionRouter from './monitoring-conditions/router'
import createPostcodeLookupRouter from './postcode-lookup/router'
import createInstallationAndRiskRouter from './installation-and-risk/router'
import createAttachmentRouter from './attachments/router'
import createInterestedPartiesRouter from './interested-parties/router'
import createContactInformationRouter from './contact-information/router'
import createOrderRouter from './order/router'
import createAboutTheDeviceWearerRouter from './about-the-device-wearer/router'
import createVariationsRouter from './variations/router'

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

  const orderSearchController = new OrderSearchController(auditService, orderSearchService)
  router.param('orderId', populateOrder(orderService))

  get('/', orderSearchController.list)
  get('/search', orderSearchController.search)

  router.use(
    paths.MONITORING_CONDITIONS.BASE_URL,
    createOrderTypeDescriptionRouter({
      alcoholMonitoringService,
      attendanceMonitoringService,
      attendanceMonitoringAddToListService,
      auditService,
      curfewConditionsService,
      curfewAdditionalDetailsService,
      curfewReleaseDateService,
      curfewTimetableService,
      installationLocationService,
      installationAppointmentService,
      monitoringConditionsStoreService,
      monitoringConditionsUpdateService,
      orderChecklistService,
      removeMonitoringTypeService,
      sectionService,
      taskListService,
      trailMonitoringService,
      zoneAddToListService,
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
    createVariationsRouter({
      variationService,
      taskListService,
      orderChecklistService,
      serviceRequestTypeService,
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
