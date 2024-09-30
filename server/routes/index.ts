import { type RequestHandler, Router } from 'express'

import asyncMiddleware from '../middleware/asyncMiddleware'
import type { Services } from '../services'
import OrderSearchController from '../controllers/orderSearchController'
import OrderController from '../controllers/orderController'
import DeviceWearerController from '../controllers/deviceWearerController'
import ContactDetailsController from '../controllers/contactDetailsController'
import populateOrder from '../middleware/populateCurrentOrder'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function routes({
  auditService,
  orderService,
  orderSearchService,
  deviceWearerService,
}: Services): Router {
  const router = Router()

  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const post = (path: string | string[], handler: RequestHandler) => router.post(path, asyncMiddleware(handler))

  const orderSearchController = new OrderSearchController(auditService, orderSearchService)
  const orderController = new OrderController(auditService, orderService)
  const deviceWearerController = new DeviceWearerController(auditService, deviceWearerService)
  const contactDetailsController = new ContactDetailsController(auditService)

  router.param('orderId', populateOrder(orderService))

  get('/', orderSearchController.search)

  // Order
  post('/order/create', orderController.create)
  get('/order/delete/success', orderController.deleteSuccess)
  get('/order/delete/failed', orderController.deleteFailed)
  get('/order/:orderId/summary', orderController.summary)
  get('/order/:orderId/delete', orderController.confirmDelete)
  post('/order/:orderId/delete', orderController.delete)

  // Device Wearer
  get('/order/:orderId/device-wearer', deviceWearerController.view)

  // Contact Details
  get('/order/:orderId/contact-details', contactDetailsController.view)

  return router
}
