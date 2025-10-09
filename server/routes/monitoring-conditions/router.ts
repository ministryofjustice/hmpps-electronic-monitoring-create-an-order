import { Router } from 'express'
import { Services } from '../../services'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import OrderTypeController from './order-type/controller'
import CheckYourAnswersController from './check-your-answers/controller'
import HDCController from './hdc/controller'

const createOrderTypeDescriptionRouter = (
  services: Pick<Services, 'monitoringConditionsStoreService' | 'monitoringConditionsUpdateService'>,
): Router => {
  const router = Router()

  const { monitoringConditionsStoreService, monitoringConditionsUpdateService } = services

  const orderTypeController = new OrderTypeController(monitoringConditionsStoreService)
  const checkYourAnswersController = new CheckYourAnswersController(
    monitoringConditionsStoreService,
    monitoringConditionsUpdateService,
  )

  const hdcController = new HDCController(monitoringConditionsStoreService)

  router.get('/order-type', asyncMiddleware(orderTypeController.view))
  router.post('/order-type', asyncMiddleware(orderTypeController.update))

  router.get('/check-your-answers', asyncMiddleware(checkYourAnswersController.view))
  router.post('/check-your-answers', asyncMiddleware(checkYourAnswersController.update))

  router.get('/hdc', asyncMiddleware(hdcController.view))

  return router
}

export default createOrderTypeDescriptionRouter
