import { Router } from 'express'
import ServiceRequestTypeController from './service-request-type/controller'
import asyncMiddleware from '../../middleware/asyncMiddleware'

const createVariationRouter = (): Router => {
  const router = Router()

  const serviceRequestTypeController = new ServiceRequestTypeController()

  router.get('/service-request-type', asyncMiddleware(serviceRequestTypeController.view))
  router.post('/service-request-type', asyncMiddleware(serviceRequestTypeController.update))
  return router
}

export default createVariationRouter
