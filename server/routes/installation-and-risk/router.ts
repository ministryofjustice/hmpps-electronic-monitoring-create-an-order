import { Router } from 'express'
import OffenceController from './offence/controller'
import OffenceOtherInfoController from './offence-other-info/controller'

const createInstallationAdnRiskRouter = (): Router => {
  const router = Router()

  const offenceController = new OffenceController()
  const offenceOtherInfoController = new OffenceOtherInfoController()
  router.get('/offence', offenceController.view)
  router.post('/offence', offenceController.update)
  router.get('/offence-other-info', offenceOtherInfoController.view)
  router.post('/offence-other-info', offenceOtherInfoController.update)
  return router
}

export default createInstallationAdnRiskRouter
