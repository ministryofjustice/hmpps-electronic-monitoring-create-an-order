import { Router } from 'express'
import OffenceController from './offence/controller'
import OffenceOtherInfoController from './offence-other-info/controller'
import OffenceListController from './offence-list/controller'
import DapoController from './dapo/controller'
import OffenceListDeleteController from './delete/controller'

const createInstallationAndRiskRouter = (): Router => {
  const router = Router()

  const offenceController = new OffenceController()
  const offenceOtherInfoController = new OffenceOtherInfoController()
  const offenceListController = new OffenceListController()
  const dapoController = new DapoController()
  const deleteController = new OffenceListDeleteController()
  router.get('/offence', offenceController.view)
  router.post('/offence', offenceController.update)
  router.get('/offence-other-info', offenceOtherInfoController.view)
  router.post('/offence-other-info', offenceOtherInfoController.update)
  router.get('/offence-list', offenceListController.view)
  router.post('/offence-list', offenceListController.update)
  router.get('/dapo', dapoController.view)
  router.post('/dapo', dapoController.update)
  router.get('/delete', deleteController.view)
  router.post('/delete', deleteController.update)
  return router
}

export default createInstallationAndRiskRouter
