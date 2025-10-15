import { Router } from 'express'
import { Services } from '../../services'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import OrderTypeController from './order-type/controller'
import CheckYourAnswersController from './check-your-answers/controller'
import SentenceTypeController from './sentence-type/controller'
import HdcController from './hdc/controller'
import PilotController from './pilot/controller'

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

  const sentenceTypeController = new SentenceTypeController(monitoringConditionsStoreService)

  const hdcController = new HdcController(monitoringConditionsStoreService)

  const pilotController = new PilotController(monitoringConditionsStoreService)

  router.get('/order-type', asyncMiddleware(orderTypeController.view))
  router.post('/order-type', asyncMiddleware(orderTypeController.update))

  router.get('/sentence-type', asyncMiddleware(sentenceTypeController.view))
  router.post('/sentence-type', asyncMiddleware(sentenceTypeController.update))

  router.get('/check-your-answers', asyncMiddleware(checkYourAnswersController.view))
  router.post('/check-your-answers', asyncMiddleware(checkYourAnswersController.update))

  router.get('/hdc', asyncMiddleware(hdcController.view))
  router.post('/hdc', asyncMiddleware(hdcController.update))

  router.get('/pilot', asyncMiddleware(pilotController.view))
  router.post('/pilot', asyncMiddleware(pilotController.update))

  return router
}

export default createOrderTypeDescriptionRouter
