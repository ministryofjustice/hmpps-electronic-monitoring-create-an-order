import { Router } from 'express'
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
import paths from '../../constants/paths'
import { createFeatureRouter } from '../routeHelpers'

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
  const { router, get, post, viewUpdate } = createFeatureRouter(paths.INSTALLATION_AND_RISK.BASE_URL)

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

  get(paths.INSTALLATION_AND_RISK.BASE_URL, installationAndRiskController.view)
  post(paths.INSTALLATION_AND_RISK.BASE_URL, installationAndRiskController.update)
  viewUpdate(paths.INSTALLATION_AND_RISK.CHECK_YOUR_ANSWERS, installationAndRiskCheckAnswersController)
  get(paths.INSTALLATION_AND_RISK.OFFENCE_NEW_ITEM, offenceController.view)
  get(paths.INSTALLATION_AND_RISK.OFFENCE, offenceController.view)
  post(paths.INSTALLATION_AND_RISK.OFFENCE_NEW_ITEM, offenceController.update)
  post(paths.INSTALLATION_AND_RISK.OFFENCE, offenceController.update)
  get(paths.INSTALLATION_AND_RISK.OFFENCE_OTHER_INFO, offenceOtherInfoController.view)
  post(paths.INSTALLATION_AND_RISK.OFFENCE_OTHER_INFO, offenceOtherInfoController.update)
  get(paths.INSTALLATION_AND_RISK.OFFENCE_LIST, offenceListController.view)
  post(paths.INSTALLATION_AND_RISK.OFFENCE_LIST, offenceListController.update)
  get(paths.INSTALLATION_AND_RISK.DAPO, dapoController.view)
  post(paths.INSTALLATION_AND_RISK.DAPO, dapoController.update)
  get(paths.INSTALLATION_AND_RISK.DAPO_ID, dapoController.view)
  post(paths.INSTALLATION_AND_RISK.DAPO_ID, dapoController.update)
  get(paths.INSTALLATION_AND_RISK.DELETE, deleteController.view)
  post(paths.INSTALLATION_AND_RISK.DELETE, deleteController.update)
  get(paths.INSTALLATION_AND_RISK.IS_MAPPA, isMappaController.view)
  post(paths.INSTALLATION_AND_RISK.IS_MAPPA, isMappaController.update)
  get(paths.INSTALLATION_AND_RISK.MAPPA, mappaController.view)
  post(paths.INSTALLATION_AND_RISK.MAPPA, mappaController.update)
  get(paths.INSTALLATION_AND_RISK.DETAILS_OF_INSTALLATION, detailsOfInstallationController.view)
  post(paths.INSTALLATION_AND_RISK.DETAILS_OF_INSTALLATION, detailsOfInstallationController.update)

  return router
}

export default createInstallationAndRiskRouter
