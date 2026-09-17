import { Router } from 'express'
import ResponsibleOfficerController from './responsible-officer/controller'
import ProbationDeliveryUnitController from './pdu/controller'
import ResponsibleOrganisationController from './responsible-organisation/controller'
import { Services } from '../../services'
import NationalSecurityDirectorateController from './national-security-directorate/controller'
import NotifingOrganisationController from './notifying-organisation/controller'
import InterestedPartiesCheckYourAnswersController from './check-your-answers/controller'
import SentencingActSelection from '../sentencing-act-selection/controller'
import paths from '../../constants/paths'
import { createFeatureRouter } from '../routeHelpers'

const createInterestedPartiesRouter = (
  services: Pick<
    Services,
    | 'interestedPartiesStoreService'
    | 'updateInterestedPartiesService'
    | 'probationDeliveryUnitService'
    | 'taskListService'
    | 'orderChecklistService'
    | 'sectionService'
    | 'sentencingActService'
  >,
): Router => {
  const { router, get, post } = createFeatureRouter(paths.INTEREST_PARTIES.BASE_URL)

  const {
    interestedPartiesStoreService,
    updateInterestedPartiesService,
    probationDeliveryUnitService,
    taskListService,
    orderChecklistService,
    sectionService,
    sentencingActService,
  } = services

  const notifyingOrganisationController = new NotifingOrganisationController(
    interestedPartiesStoreService,
    updateInterestedPartiesService,
  )
  const responsibleOfficerController = new ResponsibleOfficerController(interestedPartiesStoreService)
  const responsibleOrganisationController = new ResponsibleOrganisationController(
    interestedPartiesStoreService,
    updateInterestedPartiesService,
  )
  const probationDeliveryUnitController = new ProbationDeliveryUnitController(probationDeliveryUnitService)
  const nationalSecurityDirectorateController = new NationalSecurityDirectorateController()
  const interestedPartiesCheckYourAnswersController = new InterestedPartiesCheckYourAnswersController(
    taskListService,
    orderChecklistService,
    sectionService,
  )
  const sentencingActSelectionController = new SentencingActSelection(sentencingActService)

  get(paths.INTEREST_PARTIES.NOTIFYING_ORGANISATION, notifyingOrganisationController.view)
  post(paths.INTEREST_PARTIES.NOTIFYING_ORGANISATION, notifyingOrganisationController.update)

  get(paths.INTEREST_PARTIES.RESPONSIBLE_OFFICER, responsibleOfficerController.view)
  post(paths.INTEREST_PARTIES.RESPONSIBLE_OFFICER, responsibleOfficerController.update)

  get(paths.INTEREST_PARTIES.RESPONSIBLE_ORGANISATION, responsibleOrganisationController.view)
  post(paths.INTEREST_PARTIES.RESPONSIBLE_ORGANISATION, responsibleOrganisationController.update)

  get(paths.INTEREST_PARTIES.PDU, probationDeliveryUnitController.view)
  post(paths.INTEREST_PARTIES.PDU, probationDeliveryUnitController.update)

  get(paths.INTEREST_PARTIES.NSD, nationalSecurityDirectorateController.view)
  post(paths.INTEREST_PARTIES.NSD, nationalSecurityDirectorateController.update)

  get(paths.INTEREST_PARTIES.CHECK_YOUR_ANSWERS, interestedPartiesCheckYourAnswersController.view)
  post(paths.INTEREST_PARTIES.CHECK_YOUR_ANSWERS, interestedPartiesCheckYourAnswersController.update)

  get(paths.INTEREST_PARTIES.SENTENCING_ACT_SELECTION, sentencingActSelectionController.view)
  post(paths.INTEREST_PARTIES.SENTENCING_ACT_SELECTION, sentencingActSelectionController.update)

  return router
}

export default createInterestedPartiesRouter
