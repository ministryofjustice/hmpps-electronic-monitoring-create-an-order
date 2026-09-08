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

  get('/notifying-organisation', notifyingOrganisationController.view)
  post('/notifying-organisation', notifyingOrganisationController.update)

  get('/responsible-officer', responsibleOfficerController.view)
  post('/responsible-officer', responsibleOfficerController.update)

  get('/responsible-organisation', responsibleOrganisationController.view)
  post('/responsible-organisation', responsibleOrganisationController.update)

  get('/probation-delivery-unit', probationDeliveryUnitController.view)
  post('/probation-delivery-unit', probationDeliveryUnitController.update)

  get('/national-security-directorate', nationalSecurityDirectorateController.view)
  post('/national-security-directorate', nationalSecurityDirectorateController.update)

  get('/check-your-answers', interestedPartiesCheckYourAnswersController.view)
  post('/check-your-answers', interestedPartiesCheckYourAnswersController.update)

  get('/sentencing-act-selection', sentencingActSelectionController.view)
  post('/sentencing-act-selection', sentencingActSelectionController.update)

  return router
}

export default createInterestedPartiesRouter
