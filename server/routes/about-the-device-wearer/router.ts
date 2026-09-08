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
  // This router is mounted at paths.ORDER.BASE_URL (see server/routes/index.ts) so that both the
  // non-versioned and versioned URL spaces are handled by a single mount. Routes are only
  // registered for the non-versioned paths below; the check-your-answers page is the only page
  // that should be viewable for a historical version, so it alone gets an explicit versioned
  // route registered too.
  const rel = (path: string) => relativePath(paths.ORDER.BASE_URL, path)

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

  get(rel(paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER), deviceWearerController.viewDeviceWearer)
  post(rel(paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER), deviceWearerController.updateDeviceWearer)
  get(rel(paths.ABOUT_THE_DEVICE_WEARER.IDENTITY_NUMBERS), deviceWearerController.viewIdentityNumbers)
  post(rel(paths.ABOUT_THE_DEVICE_WEARER.IDENTITY_NUMBERS), deviceWearerController.updateIdentityNumbers)
  router
    .route(rel(paths.ABOUT_THE_DEVICE_WEARER.RESPONSIBLE_ADULT))
    .get(asyncMiddleware(responsibleAdultController.view))
    .post(asyncMiddleware(responsibleAdultController.update))
  registerViewUpdate(router, rel(paths.ABOUT_THE_DEVICE_WEARER.CHECK_YOUR_ANSWERS), deviceWearerCheckAnswersController)
  registerViewUpdate(
    router,
    rel(paths.ABOUT_THE_DEVICE_WEARER.CHECK_YOUR_ANSWERS_VERSION),
    deviceWearerCheckAnswersController,
  )

  return router
}

export default createAboutTheDeviceWearerRouter
