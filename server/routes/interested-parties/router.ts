import { type RequestHandler, Router } from 'express'
import ResponsibleOfficerController from './responsible-officer/controller'
import ProbationDeliveryUnitController from './pdu/controller'
import ResponsibleOrganisationController from './responsible-organisation/controller'
import { Services } from '../../services'
import NationalSecurityDirectorateController from './national-security-directorate/controller'
import NotifingOrganisationController from './notifying-organisation/controller'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import InterestedPartiesCheckYourAnswersController from './check-your-answers/controller'
import SentencingActSelection from '../sentencing-act-selection/controller'
import paths from '../../constants/paths'
import { relativePath } from '../routeHelpers'

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
  const router = Router({ mergeParams: true })
  const get = (path: string, handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (path: string, handler: RequestHandler) => router.post(path, asyncMiddleware(handler))
  const rel = (path: string) => relativePath(paths.INTEREST_PARTIES.BASE_URL, path)

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

  get(rel(paths.INTEREST_PARTIES.NOTIFYING_ORGANISATION), notifyingOrganisationController.view)
  post(rel(paths.INTEREST_PARTIES.NOTIFYING_ORGANISATION), notifyingOrganisationController.update)

  get(rel(paths.INTEREST_PARTIES.RESPONSIBLE_OFFICER), responsibleOfficerController.view)
  post(rel(paths.INTEREST_PARTIES.RESPONSIBLE_OFFICER), responsibleOfficerController.update)

  get(rel(paths.INTEREST_PARTIES.RESPONSBILE_ORGANISATION), responsibleOrganisationController.view)
  post(rel(paths.INTEREST_PARTIES.RESPONSBILE_ORGANISATION), responsibleOrganisationController.update)

  get(rel(paths.INTEREST_PARTIES.PDU), probationDeliveryUnitController.view)
  post(rel(paths.INTEREST_PARTIES.PDU), probationDeliveryUnitController.update)

  get(rel(paths.INTEREST_PARTIES.NSD), nationalSecurityDirectorateController.view)
  post(rel(paths.INTEREST_PARTIES.NSD), nationalSecurityDirectorateController.update)

  get(rel(paths.INTEREST_PARTIES.CHECK_YOUR_ANSWERS), interestedPartiesCheckYourAnswersController.view)
  post(rel(paths.INTEREST_PARTIES.CHECK_YOUR_ANSWERS), interestedPartiesCheckYourAnswersController.update)

  get(rel(paths.INTEREST_PARTIES.SENTENCING_ACT_SELECTION), sentencingActSelectionController.view)
  post(rel(paths.INTEREST_PARTIES.SENTENCING_ACT_SELECTION), sentencingActSelectionController.update)

  return router
}

export default createInterestedPartiesRouter
