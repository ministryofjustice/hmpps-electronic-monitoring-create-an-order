import { Router } from 'express'
import FindAddressController from './find-address/controller'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import AddressResultController from './address-result/controller'
import ConfrimAddressController from './confirm-address/controller'
import AddressListController from './address-list/controller'
import EnterAddressController from './enter-address/controller'

const createPostcodeLookupRouter = (): Router => {
  const router = Router()

  const findAddressController = new FindAddressController()
  const addressResultController = new AddressResultController()
  const confrimAddressController = new ConfrimAddressController()
  const addressListController = new AddressListController()
  const enterAddressController = new EnterAddressController()
  router.get('/find-address/:addressType', asyncMiddleware(findAddressController.view))
  router.post('/find-address/:addressType', asyncMiddleware(findAddressController.update))

  router.get('/address-result/:addressType', asyncMiddleware(addressResultController.view))
  router.post('/address-result/:addressType', asyncMiddleware(addressResultController.update))

  router.get('/confirm-address/:addressType', asyncMiddleware(confrimAddressController.view))
  router.post('/confirm-address/:addressType', asyncMiddleware(confrimAddressController.update))

  router.get('/enter-address/:addressType', asyncMiddleware(enterAddressController.view))
  router.post('/enter-address/:addressType', asyncMiddleware(enterAddressController.update))

  router.get('/address-list', asyncMiddleware(addressListController.view))
  router.post('/address-list', asyncMiddleware(addressListController.update))

  return router
}

export default createPostcodeLookupRouter
