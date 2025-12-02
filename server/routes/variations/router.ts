import { Router } from 'express'
import ServiceRequestTypeController from './service-request-type/controller'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import { Services } from '../../services'

const createVariationRouter = (services: Pick<Services, 'serviceRequestTypeService'>): Router => {
  const router = Router()
  const { serviceRequestTypeService } = services
  const serviceRequestTypeController = new ServiceRequestTypeController(serviceRequestTypeService)

  router.get('/service-request-type', asyncMiddleware(serviceRequestTypeController.view))
  router.post('/service-request-type', asyncMiddleware(serviceRequestTypeController.update))
  return router
}

export default createVariationRouter
