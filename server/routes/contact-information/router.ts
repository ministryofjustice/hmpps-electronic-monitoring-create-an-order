import { Router } from 'express'
import ContactDetailsController from '../../controllers/contact-information/contactDetailsController'
import NoFixedAbodeController from '../../controllers/contact-information/noFixedAbodeController'
import InterestedPartiesController from '../../controllers/contact-information/interestedPartiesController'
import ContactInformationCheckAnswersController from '../../controllers/contact-information/checkAnswersController'
import ProbationDeliveryUnitController from '../../controllers/contact-information/probationDeliveryUnitController'
import { type Services } from '../../services'
import paths from '../../constants/paths'
import { createFeatureRouter } from '../routeHelpers'

const createContactInformationRouter = (
  services: Pick<
    Services,
    | 'contactDetailsService'
    | 'deviceWearerService'
    | 'interestedPartiesService'
    | 'probationDeliveryUnitService'
    | 'taskListService'
    | 'orderChecklistService'
  >,
): Router => {
  const { router, viewUpdate } = createFeatureRouter(paths.CONTACT_INFORMATION.BASE_URL)
  const {
    contactDetailsService,
    deviceWearerService,
    interestedPartiesService,
    probationDeliveryUnitService,
    taskListService,
    orderChecklistService,
  } = services

  const contactDetailsController = new ContactDetailsController(contactDetailsService, taskListService)
  const noFixedAbodeController = new NoFixedAbodeController(deviceWearerService, taskListService)
  const interestedPartiesController = new InterestedPartiesController(interestedPartiesService, taskListService)
  const probationDeliveryUnitController = new ProbationDeliveryUnitController(
    probationDeliveryUnitService,
    taskListService,
  )
  const contactInformationCheckAnswersController = new ContactInformationCheckAnswersController(
    taskListService,
    orderChecklistService,
  )

  viewUpdate(paths.CONTACT_INFORMATION.CONTACT_DETAILS, contactDetailsController)
  viewUpdate(paths.CONTACT_INFORMATION.NO_FIXED_ABODE, noFixedAbodeController)
  viewUpdate(paths.CONTACT_INFORMATION.INTERESTED_PARTIES, interestedPartiesController)
  viewUpdate(paths.CONTACT_INFORMATION.PROBATION_DELIVERY_UNIT, probationDeliveryUnitController)
  viewUpdate(paths.CONTACT_INFORMATION.CHECK_YOUR_ANSWERS, contactInformationCheckAnswersController)

  return router
}

export default createContactInformationRouter
