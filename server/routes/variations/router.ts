import { Router } from 'express'
import { type Services } from '../../services'
import paths from '../../constants/paths'
import { createFeatureRouter } from '../routeHelpers'
import VariationDetailsController from '../../controllers/variation/variationDetailsController'
import ServiceRequestTypeController from './service-request-type/controller'
import IsAddressChangeController from './is-address-change/controller'

const createVariationsRouter = (
  services: Pick<
    Services,
    'variationService' | 'taskListService' | 'orderChecklistService' | 'serviceRequestTypeService'
  >,
): Router => {
  const { router, get, post, viewUpdate } = createFeatureRouter()

  const { variationService, taskListService, orderChecklistService, serviceRequestTypeService } = services

  const variationDetailsController = new VariationDetailsController(
    variationService,
    taskListService,
    orderChecklistService,
  )
  const serviceRequestTypeController = new ServiceRequestTypeController(serviceRequestTypeService)
  const isAddressChangeController = new IsAddressChangeController(serviceRequestTypeService)

  viewUpdate(paths.VARIATION.VARIATION_DETAILS, variationDetailsController)
  viewUpdate(paths.VARIATION.VARIATION_DETAILS_VERSION, variationDetailsController)
  viewUpdate(paths.VARIATION.SERVICE_REQUEST_TYPE, serviceRequestTypeController)
  get(paths.VARIATION.CREATE_VARIATION, isAddressChangeController.view)
  post(paths.VARIATION.CREATE_VARIATION, isAddressChangeController.update)

  return router
}

export default createVariationsRouter
