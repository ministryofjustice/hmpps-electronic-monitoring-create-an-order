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
import ProbationDeliveryUnitController from '../controllers/contact-information/probationDeliveryUnitController'
import OrderSearchController from '../controllers/orderSearchController'
import asyncMiddleware from '../middleware/asyncMiddleware'
import populateOrder from '../middleware/populateCurrentOrder'
import { type Services } from '../services'
import paths from '../constants/paths'
import VariationDetailsController from '../controllers/variation/variationDetailsController'
import createOrderTypeDescriptionRouter from './monitoring-conditions/router'
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

  const attachmentsController = new AttachmentsController(
    auditService,
    attachmentService,
    taskListService,
    orderChecklistService,
  )
  const contactDetailsController = new ContactDetailsController(contactDetailsService, taskListService)
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
  const noFixedAbodeController = new NoFixedAbodeController(deviceWearerService, taskListService)
  const interestedPartiesController = new InterestedPartiesController(interestedPartiesService, taskListService)
  const orderSearchController = new OrderSearchController(auditService, orderSearchService)
  const responsibleAdultController = new ResponsibleAdultController(
    deviceWearerResponsibleAdultService,
    taskListService,
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
