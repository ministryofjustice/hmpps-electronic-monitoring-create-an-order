import { type RequestHandler, Router } from 'express'
import OffenceController from './offence/controller'
import OffenceOtherInfoController from './offence-other-info/controller'
import OffenceListController from './offence-list/controller'
import DapoController from './dapo/controller'
import OffenceListDeleteController from './delete/controller'
import MappaController from './mappa/controller'
import { Services } from '../../services'
import DetailsOfInstallationController from './details-of-installation/controller'
import IsMappaController from './is-mappa/controller'
import InstallationAndRiskController from '../../controllers/installationAndRisk/installationAndRiskController'
import InstallationAndRiskCheckAnswersController from '../../controllers/installationAndRisk/installationAndRiskCheckAnswersController'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import { registerViewUpdate } from '../routeHelpers'

const createInstallationAndRiskRouter = (
  services: Pick<
    Services,
    | 'dapoService'
    | 'offenceService'
    | 'mappaService'
    | 'offenceOtherInfoService'
    | 'detailsOfInstallationService'
    | 'installationAndRiskService'
    | 'orderChecklistService'
    | 'sectionService'
    | 'taskListService'
  >,
): Router => {
  const router = Router({ mergeParams: true })
  const get = (path: string, handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (path: string, handler: RequestHandler) => router.post(path, asyncMiddleware(handler))
  const whenNotVersioned =
    (handler: RequestHandler): RequestHandler =>
    (req, res, next) => {
      if (req.params.versionId) {
        next('route')
        return
      }

      handler(req, res, next)
    }

  const {
    dapoService,
    offenceService,
    mappaService,
    taskListService,
    detailsOfInstallationService,
    offenceOtherInfoService,
    installationAndRiskService,
    orderChecklistService,
    sectionService,
  } = services

  const installationAndRiskController = new InstallationAndRiskController(installationAndRiskService, taskListService)
  const installationAndRiskCheckAnswersController = new InstallationAndRiskCheckAnswersController(
    taskListService,
    orderChecklistService,
    sectionService,
  )
  const offenceController = new OffenceController(offenceService)
  const offenceOtherInfoController = new OffenceOtherInfoController(offenceOtherInfoService)
  const offenceListController = new OffenceListController()
  const dapoController = new DapoController(dapoService)
  const deleteController = new OffenceListDeleteController(offenceService, dapoService)
  const isMappaController = new IsMappaController(mappaService, taskListService)
  const mappaController = new MappaController(mappaService)
  const detailsOfInstallationController = new DetailsOfInstallationController(
    detailsOfInstallationService,
    taskListService,
  )

  get('/', whenNotVersioned(installationAndRiskController.view))
  post('/', whenNotVersioned(installationAndRiskController.update))
  registerViewUpdate(router, '/check-your-answers', installationAndRiskCheckAnswersController)
  get('/offence', offenceController.view)
  get('/offence/:offenceId', offenceController.view)
  post('/offence', offenceController.update)
  post('/offence/:offenceId', offenceController.update)
  get('/offence-other-info', offenceOtherInfoController.view)
  post('/offence-other-info', offenceOtherInfoController.update)
  get('/offence-list', offenceListController.view)
  post('/offence-list', offenceListController.update)
  get('/dapo', dapoController.view)
  post('/dapo', dapoController.update)
  get('/dapo/:clauseId', dapoController.view)
  post('/dapo/:clauseId', dapoController.update)
  get('/delete/:offenceId', deleteController.view)
  post('/delete/:offenceId', deleteController.update)
  get('/is-mappa', isMappaController.view)
  post('/is-mappa', isMappaController.update)
  get('/mappa', mappaController.view)
  post('/mappa', mappaController.update)
  get('/details-of-installation', detailsOfInstallationController.view)
  post('/details-of-installation', detailsOfInstallationController.update)

  return router
}

export default createInstallationAndRiskRouter
