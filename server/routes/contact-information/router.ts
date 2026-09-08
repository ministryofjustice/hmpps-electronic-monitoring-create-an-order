import { Router } from 'express'
import ContactDetailsController from '../../controllers/contact-information/contactDetailsController'
import NoFixedAbodeController from '../../controllers/contact-information/noFixedAbodeController'
import InterestedPartiesController from '../../controllers/contact-information/interestedPartiesController'
import ContactInformationCheckAnswersController from '../../controllers/contact-information/checkAnswersController'
import ProbationDeliveryUnitController from '../../controllers/contact-information/probationDeliveryUnitController'
import { type Services } from '../../services'
import paths from '../../constants/paths'
import { registerViewUpdate } from '../routeHelpers'

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
  const router = Router()
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

  registerViewUpdate(router, paths.CONTACT_INFORMATION.CONTACT_DETAILS, contactDetailsController)
  registerViewUpdate(router, paths.CONTACT_INFORMATION.NO_FIXED_ABODE, noFixedAbodeController)
  registerViewUpdate(router, paths.CONTACT_INFORMATION.INTERESTED_PARTIES, interestedPartiesController)
  registerViewUpdate(router, paths.CONTACT_INFORMATION.PROBATION_DELIVERY_UNIT, probationDeliveryUnitController)
  registerViewUpdate(router, paths.CONTACT_INFORMATION.CHECK_YOUR_ANSWERS, contactInformationCheckAnswersController)
  registerViewUpdate(
    router,
    paths.CONTACT_INFORMATION.CHECK_YOUR_ANSWERS_VERSION,
    contactInformationCheckAnswersController,
  )

  return router
}

export default createContactInformationRouter
