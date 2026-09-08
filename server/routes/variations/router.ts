import { type RequestHandler, Router } from 'express'
import { type Services } from '../../services'
import paths from '../../constants/paths'
import { registerViewUpdate } from '../routeHelpers'
import VariationDetailsController from '../../controllers/variation/variationDetailsController'
import ServiceRequestTypeController from './service-request-type/controller'
import IsAddressChangeController from './is-address-change/controller'
import asyncMiddleware from '../../middleware/asyncMiddleware'

const createVariationsRouter = (
  services: Pick<
    Services,
    'variationService' | 'taskListService' | 'orderChecklistService' | 'serviceRequestTypeService'
  >,
): Router => {
  const router = Router()
  const get = (path: string, handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (path: string, handler: RequestHandler) => router.post(path, asyncMiddleware(handler))

  const { variationService, taskListService, orderChecklistService, serviceRequestTypeService } = services

  const variationDetailsController = new VariationDetailsController(
    variationService,
    taskListService,
    orderChecklistService,
  )
  const serviceRequestTypeController = new ServiceRequestTypeController(serviceRequestTypeService)
  const isAddressChangeController = new IsAddressChangeController(serviceRequestTypeService)

  registerViewUpdate(router, paths.VARIATION.VARIATION_DETAILS, variationDetailsController)
  registerViewUpdate(router, paths.VARIATION.VARIATION_DETAILS_VERSION, variationDetailsController)
  registerViewUpdate(router, paths.VARIATION.SERVICE_REQUEST_TYPE, serviceRequestTypeController)
  get(paths.VARIATION.CREATE_VARIATION, isAddressChangeController.view)
  post(paths.VARIATION.CREATE_VARIATION, isAddressChangeController.update)

  return router
}

export default createVariationsRouter
