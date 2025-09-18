import { Router } from 'express'
import { Services } from '../../../services'
import asyncMiddleware from '../../../middleware/asyncMiddleware'
import OrderTypeController from './controller'

const createOrderTypeDescriptionRouter = (services: Pick<Services, 'orderTypeService'>): Router => {
  const router = Router()

  const { orderTypeService } = services

  const orderTypeController = new OrderTypeController(orderTypeService)

  router.get('/order-type', asyncMiddleware(orderTypeController.view))

  return router
}

export default createOrderTypeDescriptionRouter
