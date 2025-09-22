import { Router } from 'express'
import { Services } from '../../../services'
import asyncMiddleware from '../../../middleware/asyncMiddleware'
import OrderTypeController from './controller'

const createOrderTypeDescriptionRouter = (services: Pick<Services, 'monitoringConditionsStoreService'>): Router => {
  const router = Router()

  const { monitoringConditionsStoreService } = services

  const orderTypeController = new OrderTypeController(monitoringConditionsStoreService)

  router.get('/order-type', asyncMiddleware(orderTypeController.view))

  return router
}

export default createOrderTypeDescriptionRouter
