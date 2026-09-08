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
import createRiskInformationPageGuard from './riskInformationPageGuard'

const createInstallationAndRiskRouter = (
  services: Pick<
    Services,
    | 'dapoService'
    | 'offenceService'
    | 'mappaService'
    | 'offenceOtherInfoService'
    | 'detailsOfInstallationService'
    | 'taskListService'
  >,
): Router => {
  const router = Router()

  const {
    dapoService,
    offenceService,
    mappaService,
    taskListService,
    detailsOfInstallationService,
    offenceOtherInfoService,
  } = services

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

  const offenceGuard = createRiskInformationPageGuard('OFFENCE')
  const offenceOtherInfoGuard = createRiskInformationPageGuard('OFFENCE_OTHER_INFO')
  const offenceListGuard = createRiskInformationPageGuard('OFFENCE_LIST')
  const dapoGuard = createRiskInformationPageGuard('DAPO')

  router.get('/offence', offenceGuard, offenceController.view)
  router.get('/offence/:offenceId', offenceGuard, offenceController.view)
  router.post('/offence', offenceGuard, offenceController.update)
  router.post('/offence/:offenceId', offenceGuard, offenceController.update)
  router.get('/offence-other-info', offenceOtherInfoGuard, offenceOtherInfoController.view)
  router.post('/offence-other-info', offenceOtherInfoGuard, offenceOtherInfoController.update)
  router.get('/offence-list', offenceListGuard, offenceListController.view)
  router.post('/offence-list', offenceListGuard, offenceListController.update)
  router.get('/dapo', dapoGuard, dapoController.view)
  router.post('/dapo', dapoGuard, dapoController.update)
  router.get('/dapo/:clauseId', dapoGuard, dapoController.view)
  router.post('/dapo/:clauseId', dapoGuard, dapoController.update)
  router.get('/delete/:offenceId', offenceListGuard, deleteController.view)
  router.post('/delete/:offenceId', offenceListGuard, deleteController.update)
  router.get('/is-mappa', isMappaController.view)
  router.post('/is-mappa', isMappaController.update)
  router.get('/mappa', mappaController.view)
  router.post('/mappa', mappaController.update)
  router.get('/details-of-installation', detailsOfInstallationController.view)
  router.post('/details-of-installation', detailsOfInstallationController.update)

  return router
}

export default createInstallationAndRiskRouter
