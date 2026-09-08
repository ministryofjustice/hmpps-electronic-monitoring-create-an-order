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
import paths from '../../constants/paths'
import { registerViewUpdate, relativePath } from '../routeHelpers'

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
  // This router is mounted at paths.ORDER.BASE_URL (see server/routes/index.ts) so that both the
  // non-versioned and versioned URL spaces are handled by a single mount. Routes are only
  // registered for the non-versioned paths below; the check-your-answers page is the only page
  // that should be viewable for a historical version, so it alone gets an explicit versioned
  // route registered too.
  const rel = (path: string) => relativePath(paths.ORDER.BASE_URL, path)

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

  get(rel(paths.INSTALLATION_AND_RISK.BASE_URL), installationAndRiskController.view)
  post(rel(paths.INSTALLATION_AND_RISK.BASE_URL), installationAndRiskController.update)
  registerViewUpdate(
    router,
    rel(paths.INSTALLATION_AND_RISK.CHECK_YOUR_ANSWERS),
    installationAndRiskCheckAnswersController,
  )
  registerViewUpdate(
    router,
    rel(paths.INSTALLATION_AND_RISK.CHECK_YOUR_ANSWERS_VERSION),
    installationAndRiskCheckAnswersController,
  )
  get(rel(paths.INSTALLATION_AND_RISK.OFFENCE_NEW_ITEM), offenceController.view)
  get(rel(paths.INSTALLATION_AND_RISK.OFFENCE), offenceController.view)
  post(rel(paths.INSTALLATION_AND_RISK.OFFENCE_NEW_ITEM), offenceController.update)
  post(rel(paths.INSTALLATION_AND_RISK.OFFENCE), offenceController.update)
  get(rel(paths.INSTALLATION_AND_RISK.OFFENCE_OTHER_INFO), offenceOtherInfoController.view)
  post(rel(paths.INSTALLATION_AND_RISK.OFFENCE_OTHER_INFO), offenceOtherInfoController.update)
  get(rel(paths.INSTALLATION_AND_RISK.OFFENCE_LIST), offenceListController.view)
  post(rel(paths.INSTALLATION_AND_RISK.OFFENCE_LIST), offenceListController.update)
  get(rel(paths.INSTALLATION_AND_RISK.DAPO), dapoController.view)
  post(rel(paths.INSTALLATION_AND_RISK.DAPO), dapoController.update)
  get(rel(paths.INSTALLATION_AND_RISK.DAPO_ID), dapoController.view)
  post(rel(paths.INSTALLATION_AND_RISK.DAPO_ID), dapoController.update)
  get(rel(paths.INSTALLATION_AND_RISK.DELETE), deleteController.view)
  post(rel(paths.INSTALLATION_AND_RISK.DELETE), deleteController.update)
  get(rel(paths.INSTALLATION_AND_RISK.IS_MAPPA), isMappaController.view)
  post(rel(paths.INSTALLATION_AND_RISK.IS_MAPPA), isMappaController.update)
  get(rel(paths.INSTALLATION_AND_RISK.MAPPA), mappaController.view)
  post(rel(paths.INSTALLATION_AND_RISK.MAPPA), mappaController.update)
  get(rel(paths.INSTALLATION_AND_RISK.DETAILS_OF_INSTALLATION), detailsOfInstallationController.view)
  post(rel(paths.INSTALLATION_AND_RISK.DETAILS_OF_INSTALLATION), detailsOfInstallationController.update)

  return router
}

export default createInstallationAndRiskRouter
