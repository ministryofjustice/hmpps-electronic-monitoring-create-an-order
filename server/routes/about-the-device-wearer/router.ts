import { type RequestHandler, Router } from 'express'
import DeviceWearerController from '../../controllers/about-the-device-wearer/deviceWearerController'
import DeviceWearerCheckAnswersController from '../../controllers/about-the-device-wearer/deviceWearerCheckAnswersController'
import ResponsibleAdultController from '../../controllers/about-the-device-wearer/deviceWearerResponsibleAdultController'
import paths from '../../constants/paths'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import { registerViewUpdate, relativePath } from '../routeHelpers'
import { Services } from '../../services'

const createAboutTheDeviceWearerRouter = (
  services: Pick<
    Services,
    | 'deviceWearerService'
    | 'deviceWearerResponsibleAdultService'
    | 'taskListService'
    | 'orderChecklistService'
    | 'sectionService'
  >,
): Router => {
  const router = Router({ mergeParams: true })
  const get = (path: string, ...handlers: RequestHandler[]) => router.get(path, ...handlers.map(asyncMiddleware))
  const post = (path: string, ...handlers: RequestHandler[]) => router.post(path, ...handlers.map(asyncMiddleware))

  const {
    deviceWearerService,
    deviceWearerResponsibleAdultService,
    taskListService,
    orderChecklistService,
    sectionService,
  } = services

  const deviceWearerController = new DeviceWearerController(deviceWearerService, taskListService)
  const responsibleAdultController = new ResponsibleAdultController(
    deviceWearerResponsibleAdultService,
    taskListService,
  )
  const deviceWearerCheckAnswersController = new DeviceWearerCheckAnswersController(
    taskListService,
    orderChecklistService,
    sectionService,
  )

  const blockVersionedRoutes: RequestHandler = (req, res, next) => {
    if (req.params.versionId) {
      res.sendStatus(404)
      return
    }

    next()
  }

  get(
    relativePath(paths.ABOUT_THE_DEVICE_WEARER.BASE_URL, paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER),
    blockVersionedRoutes,
    deviceWearerController.viewDeviceWearer,
  )
  post(
    relativePath(paths.ABOUT_THE_DEVICE_WEARER.BASE_URL, paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER),
    blockVersionedRoutes,
    deviceWearerController.updateDeviceWearer,
  )
  get(
    relativePath(paths.ABOUT_THE_DEVICE_WEARER.BASE_URL, paths.ABOUT_THE_DEVICE_WEARER.IDENTITY_NUMBERS),
    blockVersionedRoutes,
    deviceWearerController.viewIdentityNumbers,
  )
  post(
    relativePath(paths.ABOUT_THE_DEVICE_WEARER.BASE_URL, paths.ABOUT_THE_DEVICE_WEARER.IDENTITY_NUMBERS),
    blockVersionedRoutes,
    deviceWearerController.updateIdentityNumbers,
  )
  router
    .route(relativePath(paths.ABOUT_THE_DEVICE_WEARER.BASE_URL, paths.ABOUT_THE_DEVICE_WEARER.RESPONSIBLE_ADULT))
    .get(asyncMiddleware(blockVersionedRoutes), asyncMiddleware(responsibleAdultController.view))
    .post(asyncMiddleware(blockVersionedRoutes), asyncMiddleware(responsibleAdultController.update))
  registerViewUpdate(
    router,
    relativePath(paths.ABOUT_THE_DEVICE_WEARER.BASE_URL, paths.ABOUT_THE_DEVICE_WEARER.CHECK_YOUR_ANSWERS),
    deviceWearerCheckAnswersController,
  )
  registerViewUpdate(
    router,
    relativePath(
      paths.ABOUT_THE_DEVICE_WEARER.VERSION_BASE_URL,
      paths.ABOUT_THE_DEVICE_WEARER.CHECK_YOUR_ANSWERS_VERSION,
    ),
    deviceWearerCheckAnswersController,
  )

  return router
}

export default createAboutTheDeviceWearerRouter
