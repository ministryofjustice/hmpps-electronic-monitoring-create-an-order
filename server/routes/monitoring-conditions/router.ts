import { Router } from 'express'
import { Services } from '../../services'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import OrderTypeController from './order-type/controller'
import CheckYourAnswersController from './check-your-answers/controller'

const createOrderTypeDescriptionRouter = (services: Pick<Services, 'monitoringConditionsStoreService'>): Router => {
  const router = Router()

  const { monitoringConditionsStoreService } = services

  const orderTypeController = new OrderTypeController(monitoringConditionsStoreService)
  const checkYourAnswersController = new CheckYourAnswersController(monitoringConditionsStoreService)

  router.get('/order-type', asyncMiddleware(orderTypeController.view))
  router.post('/order-type', asyncMiddleware(orderTypeController.update))

  router.get('/check-your-answers', asyncMiddleware(checkYourAnswersController.view))

  return router
}

export default createOrderTypeDescriptionRouter
