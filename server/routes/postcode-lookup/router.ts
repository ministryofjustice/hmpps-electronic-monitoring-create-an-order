import { Router } from 'express'
import FindAddressController from './find-address/controller'
import AddressResultController from './address-result/controller'
import ConfirmAddressController from './confirm-address/controller'
import AddressListController from './address-list/controller'
import EnterAddressController from './enter-address/controller'
import { Services } from '../../services'
import paths from '../../constants/paths'
import { createFeatureRouter } from '../routeHelpers'

const createPostcodeLookupRouter = (
  services: Pick<Services, 'postcodeService' | 'addressService' | 'taskListService' | 'auditService'>,
): Router => {
  const { router, get, post } = createFeatureRouter(paths.ORDER.BASE_URL)

  const findAddressController = new FindAddressController(services.postcodeService)
  const addressResultController = new AddressResultController(services.postcodeService, services.addressService)
  const confirmAddressController = new ConfirmAddressController(services.postcodeService, services.taskListService)
  const addressListController = new AddressListController(services.taskListService)
  const enterAddressController = new EnterAddressController(services.addressService)
  get(paths.POSTCODE_LOOKUP.FIND_ADDRESS, findAddressController.view)
  post(paths.POSTCODE_LOOKUP.FIND_ADDRESS, findAddressController.update)

  get(paths.POSTCODE_LOOKUP.ADDRESS_RESULT, addressResultController.view)
  post(paths.POSTCODE_LOOKUP.ADDRESS_RESULT, addressResultController.update)

  get(paths.POSTCODE_LOOKUP.CONFIRM_ADDRESS, confirmAddressController.view)
  post(paths.POSTCODE_LOOKUP.CONFIRM_ADDRESS, confirmAddressController.update)

  get(paths.POSTCODE_LOOKUP.ENTER_ADDRESS, enterAddressController.view)
  post(paths.POSTCODE_LOOKUP.ENTER_ADDRESS, enterAddressController.update)

  get(paths.POSTCODE_LOOKUP.ADDRESS_LIST, addressListController.view)
  post(paths.POSTCODE_LOOKUP.ADDRESS_LIST, addressListController.update)

  return router
}

export default createPostcodeLookupRouter
