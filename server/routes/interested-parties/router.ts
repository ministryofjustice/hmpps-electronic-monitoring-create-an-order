import { Router } from 'express'
import NotifingOrganisationController from './notifying-organisation/controller'
import ResponsibleOfficerController from './responsible-officer/controller'
import ProbationDeliveryUnitController from './pdu/controller'
import InterestedPartiesCheckYourAnswersController from './check-your-answers/controller'
import ResponsibleOrganisationController from './responsible-organisation/controller'
import { Services } from '../../services'

const createInterestedPartiesRouter = (services: Pick<Services, 'interestedPartiesStoreService'>): Router => {
  const router = Router()
  const notifyingOrganisationController = new NotifingOrganisationController()
  const responsibleOfficerController = new ResponsibleOfficerController()
  const responsibleOrganisationController = new ResponsibleOrganisationController(
    services.interestedPartiesStoreService,
  )
  const probationDeliveryUnitController = new ProbationDeliveryUnitController()
  const checkYourAnswers = new InterestedPartiesCheckYourAnswersController()

  router.get('/notifying-organisation', notifyingOrganisationController.view)
  router.post('/notifying-organisation', notifyingOrganisationController.update)

  router.get('/responsible-officer', responsibleOfficerController.view)
  router.post('/responsible-officer', responsibleOfficerController.update)

  router.get('/responsible-organisation', responsibleOrganisationController.view)
  router.post('/responsible-organisation', responsibleOrganisationController.update)

  router.get('/probation-delivery-unit', probationDeliveryUnitController.view)
  router.post('/probation-delivery-unit', probationDeliveryUnitController.update)

  router.get('/check-your-answers', checkYourAnswers.view)
  router.post('/check-your-answers', checkYourAnswers.update)

  return router
}

export default createInterestedPartiesRouter
