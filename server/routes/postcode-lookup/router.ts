import { Router } from 'express'
import FindAddressController from './find-address/controller'
import asyncMiddleware from '../../middleware/asyncMiddleware'

const createPostcodeLookupRouter = (): Router => {
  const router = Router()

  const findAddressController = new FindAddressController()
  router.get('/find-address/:addressType', asyncMiddleware(findAddressController.view))
  router.post('/find-address/:addressType', asyncMiddleware(findAddressController.update))

  return router
}

export default createPostcodeLookupRouter
