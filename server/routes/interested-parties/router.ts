import { Router } from 'express'
import NotifingOrganisationController from './notifying-organisation/controller'

const createInterestedPartiesRouter = (): Router => {
  const router = Router()
  const notifyingOrganisationController = new NotifingOrganisationController()

  router.get('/notifying-organisation', notifyingOrganisationController.view)
  return router
}

export default createInterestedPartiesRouter
