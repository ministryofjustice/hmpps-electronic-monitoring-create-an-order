import { Router } from 'express'
import NotifingOrganisationController from './notifying-organisation/controller'
import ResponsibleOfficerController from './responsible-officer/controller'
import ProbationDeliveryUnitController from './pdu/controller'
import ResponsibleOrganisationController from './responsible-organisation/controller'
import { Services } from '../../services'
import NationalSecurityDirectorateController from './national-security-directorate/controller'

const createInterestedPartiesRouter = (
  services: Pick<
    Services,
    'interestedPartiesStoreService' | 'updateInterestedPartiesService' | 'probationDeliveryUnitService'
  >,
): Router => {
  const router = Router({ mergeParams: true })

  const notifyingOrganisationController = new NotifingOrganisationController(
    services.interestedPartiesStoreService,
    services.updateInterestedPartiesService,
  )
  const responsibleOfficerController = new ResponsibleOfficerController(services.interestedPartiesStoreService)
  const responsibleOrganisationController = new ResponsibleOrganisationController(
    services.interestedPartiesStoreService,
    services.updateInterestedPartiesService,
  )
  const probationDeliveryUnitController = new ProbationDeliveryUnitController(services.probationDeliveryUnitService)

  const nationalSecurityDirectorateController = new NationalSecurityDirectorateController()

  router.get('/notifying-organisation', notifyingOrganisationController.view)
  router.post('/notifying-organisation', notifyingOrganisationController.update)

  router.get('/responsible-officer', responsibleOfficerController.view)
  router.post('/responsible-officer', responsibleOfficerController.update)

  router.get('/responsible-organisation', responsibleOrganisationController.view)
  router.post('/responsible-organisation', responsibleOrganisationController.update)

  router.get('/probation-delivery-unit', probationDeliveryUnitController.view)
  router.post('/probation-delivery-unit', probationDeliveryUnitController.update)

  router.get('/national-security-directorate', nationalSecurityDirectorateController.view)
  router.post('/national-security-directorate', nationalSecurityDirectorateController.update)
  return router
}

export default createInterestedPartiesRouter
