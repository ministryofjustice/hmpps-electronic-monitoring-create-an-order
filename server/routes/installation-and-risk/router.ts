import { Router } from 'express'
import OffenceController from './offence/controller'
import OffenceOtherInfoController from './offence-other-info/controller'
import OffenceListController from './offence-list/controller'
import DapoController from './dapo/controller'
import OffenceListDeleteController from './delete/controller'
import MappaController from './mappa/controller'
import { Services } from '../../services'
import DetailsOfInstallationController from './details-of-installation/controller'

const createInstallationAndRiskRouter = (
  services: Pick<
    Services,
    'dapoService' | 'offenceService' | 'mappaService' | 'detailsOfInstallationService' | 'taskListService'
  >,
): Router => {
  const router = Router()

  const { dapoService, offenceService, mappaService, taskListService, detailsOfInstallationService } = services

  const offenceController = new OffenceController(offenceService)
  const offenceOtherInfoController = new OffenceOtherInfoController()
  const offenceListController = new OffenceListController()
  const dapoController = new DapoController(dapoService)
  const deleteController = new OffenceListDeleteController()
  const mappaController = new MappaController(mappaService)
  const detailsOfInstallationController = new DetailsOfInstallationController(
    detailsOfInstallationService,
    taskListService,
  )

  router.get('/offence', offenceController.view)
  router.get('/offence/:offenceId', offenceController.view)
  router.post('/offence', offenceController.update)
  router.get('/offence-other-info', offenceOtherInfoController.view)
  router.post('/offence-other-info', offenceOtherInfoController.update)
  router.get('/offence-list', offenceListController.view)
  router.post('/offence-list', offenceListController.update)
  router.get('/dapo', dapoController.view)
  router.post('/dapo', dapoController.update)
  router.get('/dapo/:clauseId', dapoController.view)
  router.post('/dapo/:clauseId', dapoController.update)
  router.get('/delete', deleteController.view)
  router.post('/delete', deleteController.update)
  router.get('/mappa', mappaController.view)
  router.post('/mappa', mappaController.update)
  router.get('/details-of-installation', detailsOfInstallationController.view)
  router.post('/details-of-installation', detailsOfInstallationController.update)

  return router
}

export default createInstallationAndRiskRouter
