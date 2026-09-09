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

  // Express caches `router.param` callbacks per request (see `paramcalled` in Router.handle), so the
  // first layer to capture `:orderId` decided what the order lookup saw and later layers silently
  // reused that result. Any feature router mounted on a bare `/order/:orderId` prefix therefore
  // resolved the order before `:versionId` had been captured, so versioned pages loaded the latest
  // order instead of the requested version. Mounting the lookup explicitly - ahead of every feature
  // router and with the versioned prefix listed first - captures both params in a single layer, so
  // the correct version is resolved regardless of the order the feature routers are mounted in.
  router.use([paths.ORDER.BASE_URL_VERSION, paths.ORDER.BASE_URL], populateOrder(orderService))

  get('/', orderSearchController.list)
  get('/search', orderSearchController.search)

  router.use(
    [paths.MONITORING_CONDITIONS.BASE_URL, paths.MONITORING_CONDITIONS.BASE_URL_VERSION],
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
    [paths.INTEREST_PARTIES.BASE_URL, paths.INTEREST_PARTIES.BASE_URL_VERSION],
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
    [paths.ABOUT_THE_DEVICE_WEARER.BASE_URL, paths.ABOUT_THE_DEVICE_WEARER.BASE_URL_VERSION],
    createAboutTheDeviceWearerRouter({
      deviceWearerService,
      deviceWearerResponsibleAdultService,
      taskListService,
      orderChecklistService,
      sectionService,
    }),
  )

  router.use(
    [paths.CONTACT_INFORMATION.BASE_URL, paths.CONTACT_INFORMATION.BASE_URL_VERSION],
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
    [paths.INSTALLATION_AND_RISK.BASE_URL, paths.INSTALLATION_AND_RISK.BASE_URL_VERSION],
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
    [paths.ATTACHMENT.BASE_URL, paths.ATTACHMENT.BASE_URL_VERSION],
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
