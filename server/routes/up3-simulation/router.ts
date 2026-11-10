import config from '../../config'
import OrderService from '../../services/orderService'
import { createFeatureRouter } from '../routeHelpers'
import Controller, { basePath } from './controller'
import Up3SimulationService from './service'

export default function createUp3SimulationRouter(simulationService: Up3SimulationService, orderService: OrderService) {
  const { router, get, post } = createFeatureRouter(basePath)
  if (!config.up3Simulation.enabled) return router
  const controller = new Controller(simulationService, orderService)
  get('/', controller.entry)
  post('/', controller.selectOrder)
  get('/create', controller.createForm)
  post('/create', controller.create)
  get('/creations/:creationRequestId', controller.creationStatus)
  post('/creations/:creationRequestId/resume', controller.resumeCreation)
  get('/orders/:orderId', controller.inspect)
  post('/orders/:orderId/state', controller.setState)
  get('/orders/:orderId/return', controller.returnForm)
  post('/orders/:orderId/return', controller.publishReturn)
  get('/orders/:orderId/returns/:eventId', controller.returnStatus)
  post('/orders/:orderId/returns/:eventId/retry', controller.retryReturn)
  return router
}
