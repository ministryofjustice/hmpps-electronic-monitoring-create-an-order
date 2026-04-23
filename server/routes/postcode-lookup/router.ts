import { Router } from 'express'
import FindAddressController from './find-address/controller'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import AddressResultController from './address-result/controller'
import ConfirmAddressController from './confirm-address/controller'
import AddressListController from './address-list/controller'
import EnterAddressController from './enter-address/controller'
import { Services } from '../../services'

const createPostcodeLookupRouter = (
  services: Pick<Services, 'postcodeService' | 'addressService' | 'taskListService' | 'auditService'>,
): Router => {
  const router = Router({ mergeParams: true })

  const findAddressController = new FindAddressController(services.postcodeService)
  const addressResultController = new AddressResultController(services.postcodeService, services.addressService)
  const confirmAddressController = new ConfirmAddressController(services.postcodeService, services.taskListService)
  const addressListController = new AddressListController()
  const enterAddressController = new EnterAddressController(services.auditService, services.addressService)
  router.get('/find-address/:addressType', asyncMiddleware(findAddressController.view))
  router.post('/find-address/:addressType', asyncMiddleware(findAddressController.update))

  router.get('/address-result/:addressType', asyncMiddleware(addressResultController.view))
  router.post('/address-result/:addressType', asyncMiddleware(addressResultController.update))

  router.get('/confirm-address/:addressType', asyncMiddleware(confirmAddressController.view))
  router.post('/confirm-address/:addressType', asyncMiddleware(confirmAddressController.update))

  router.get('/enter-address/:addressType', asyncMiddleware(enterAddressController.view))
  router.post('/enter-address/:addressType', asyncMiddleware(enterAddressController.update))

  router.get('/address-list', asyncMiddleware(addressListController.view))
  router.post('/address-list', asyncMiddleware(addressListController.update))

  return router
}

export default createPostcodeLookupRouter
