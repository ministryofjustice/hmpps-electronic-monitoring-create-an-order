import { Router } from 'express'
import { Services } from '../../services'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import OrderTypeController from './order-type/controller'
import CheckYourAnswersController from './check-your-answers/controller'
import SentenceTypeController from './sentence-type/controller'
import HdcController from './hdc/controller'
import PilotController from './pilot/controller'
import IsspController from './issp/controller'
import PrarrController from './prarr/controller'
import MonitoringTypesController from './monitoring-types/controller'
import MonitoringDatesController from './monitoring-dates/controller'

const createOrderTypeDescriptionRouter = (
  services: Pick<
    Services,
    'monitoringConditionsStoreService' | 'monitoringConditionsUpdateService' | 'taskListService'
  >,
): Router => {
  const router = Router()

  const { monitoringConditionsStoreService, monitoringConditionsUpdateService, taskListService } = services

  const orderTypeController = new OrderTypeController(monitoringConditionsStoreService)
  const checkYourAnswersController = new CheckYourAnswersController(
    monitoringConditionsStoreService,
    monitoringConditionsUpdateService,
  )

  const sentenceTypeController = new SentenceTypeController(monitoringConditionsStoreService)

  const hdcController = new HdcController(monitoringConditionsStoreService)

  const pilotController = new PilotController(monitoringConditionsStoreService)

  const isspController = new IsspController(monitoringConditionsStoreService)

  const prarrController = new PrarrController(monitoringConditionsStoreService)

  const monitoringTypesController = new MonitoringTypesController(
    monitoringConditionsStoreService,
    monitoringConditionsUpdateService,
    taskListService,
  )

  const monitoringDatesController = new MonitoringDatesController(monitoringConditionsStoreService)

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

  router.get('/issp', asyncMiddleware(isspController.view))
  router.post('/issp', asyncMiddleware(isspController.update))

  router.get('/prarr', asyncMiddleware(prarrController.view))
  router.post('/prarr', asyncMiddleware(prarrController.update))

  router.get('/monitoring-types', asyncMiddleware(monitoringTypesController.view))
  router.post('/monitoring-types', asyncMiddleware(monitoringTypesController.update))

  router.get('/monitoring-dates', asyncMiddleware(monitoringDatesController.view))
  router.post('/monitoring-dates', asyncMiddleware(monitoringDatesController.update))

  return router
}

export default createOrderTypeDescriptionRouter
