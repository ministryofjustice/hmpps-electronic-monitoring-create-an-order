import { type RequestHandler, Router } from 'express'

import asyncMiddleware from '../middleware/asyncMiddleware'
import type { Services } from '../services'
import OrderSearchController from '../controllers/orderSearchController'
import OrderController from '../controllers/orderController'
import DeviceWearerController from '../controllers/deviceWearerController'
import ContactDetailsController from '../controllers/contactDetailsController'

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
  const deviceWearerController = new DeviceWearerController(auditService, deviceWearerService, orderService)
  const contactDetailsController = new ContactDetailsController(auditService, orderService)

  get('/', orderSearchController.search)
  get('/order/:orderId/summary', orderController.summary)
  get('/order/:orderId/device-wearer', deviceWearerController.view)
  get('/order/:orderId/device-wearer/edit', deviceWearerController.edit)
  get('/order/:orderId/contact-details', contactDetailsController.view)
  get('/order/:orderId/contact-details/edit', contactDetailsController.edit)

  return router
}
