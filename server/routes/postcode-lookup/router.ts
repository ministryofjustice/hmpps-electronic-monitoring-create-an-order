import { Router } from 'express'
import FindAddressController from './find-address/controller'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import AddressResultController from './address-result/controller'
import ConfirmAddressController from './confirm-address/controller'
import AddressListController from './address-list/controller'
import EnterAddressController from './enter-address/controller'
import { Services } from '../../services'
import paths from '../../constants/paths'
import { relativePath } from '../routeHelpers'

const createPostcodeLookupRouter = (
  services: Pick<Services, 'postcodeService' | 'addressService' | 'taskListService' | 'auditService'>,
): Router => {
  const router = Router({ mergeParams: true })
  const rel = (path: string) => relativePath(paths.ORDER.BASE_URL, path)

  const findAddressController = new FindAddressController(services.postcodeService)
  const addressResultController = new AddressResultController(services.postcodeService, services.addressService)
  const confirmAddressController = new ConfirmAddressController(services.postcodeService, services.taskListService)
  const addressListController = new AddressListController(services.taskListService)
  const enterAddressController = new EnterAddressController(services.addressService)
  router.get(rel(paths.POSTCODE_LOOKUP.FIND_ADDRESS), asyncMiddleware(findAddressController.view))
  router.post(rel(paths.POSTCODE_LOOKUP.FIND_ADDRESS), asyncMiddleware(findAddressController.update))

  router.get(rel(paths.POSTCODE_LOOKUP.ADDRESS_RESULT), asyncMiddleware(addressResultController.view))
  router.post(rel(paths.POSTCODE_LOOKUP.ADDRESS_RESULT), asyncMiddleware(addressResultController.update))

  router.get(rel(paths.POSTCODE_LOOKUP.CONFIRM_ADDRESS), asyncMiddleware(confirmAddressController.view))
  router.post(rel(paths.POSTCODE_LOOKUP.CONFIRM_ADDRESS), asyncMiddleware(confirmAddressController.update))

  router.get(rel(paths.POSTCODE_LOOKUP.ENTER_ADDRESS), asyncMiddleware(enterAddressController.view))
  router.post(rel(paths.POSTCODE_LOOKUP.ENTER_ADDRESS), asyncMiddleware(enterAddressController.update))

  router.get(rel(paths.POSTCODE_LOOKUP.ADDRESS_LIST), asyncMiddleware(addressListController.view))
  router.post(rel(paths.POSTCODE_LOOKUP.ADDRESS_LIST), asyncMiddleware(addressListController.update))

  return router
}

export default createPostcodeLookupRouter
