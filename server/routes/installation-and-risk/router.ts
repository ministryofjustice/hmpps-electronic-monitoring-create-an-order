import { Router } from 'express'
import OffenceController from './offence/controller'

const createInstallationAdnRiskRouter = (): Router => {
  const router = Router()

  const offenceController = new OffenceController()

  router.get('/offence', offenceController.view)
  router.post('/offence', offenceController.update)
  return router
}

export default createInstallationAdnRiskRouter
