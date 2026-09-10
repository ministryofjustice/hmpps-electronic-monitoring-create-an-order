import { Router } from 'express'
import DeviceWearerController from '../../controllers/about-the-device-wearer/deviceWearerController'
import DeviceWearerCheckAnswersController from '../../controllers/about-the-device-wearer/deviceWearerCheckAnswersController'
import ResponsibleAdultController from '../../controllers/about-the-device-wearer/deviceWearerResponsibleAdultController'
import DeviceWearerSearchResultsController from './device-wearer-search-results/controller'
import paths from '../../constants/paths'
import { createFeatureRouter } from '../routeHelpers'
import { Services } from '../../services'

const createAboutTheDeviceWearerRouter = (
  services: Pick<
    Services,
    | 'deviceWearerService'
    | 'deviceWearerResponsibleAdultService'
    | 'deviceWearerSearchResultsService'
    | 'taskListService'
    | 'orderChecklistService'
    | 'sectionService'
  >,
): Router => {
  const { router, get, post, viewUpdate } = createFeatureRouter(paths.ABOUT_THE_DEVICE_WEARER.BASE_URL)

  const {
    deviceWearerService,
    deviceWearerResponsibleAdultService,
    deviceWearerSearchResultsService,
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
  const deviceWearerSearchResultsController = new DeviceWearerSearchResultsController(deviceWearerSearchResultsService)

  get(paths.ABOUT_THE_DEVICE_WEARER.BASE_URL, deviceWearerController.viewDeviceWearer)
  post(paths.ABOUT_THE_DEVICE_WEARER.BASE_URL, deviceWearerController.updateDeviceWearer)
  get(paths.ABOUT_THE_DEVICE_WEARER.IDENTITY_NUMBERS, deviceWearerController.viewIdentityNumbers)
  post(paths.ABOUT_THE_DEVICE_WEARER.IDENTITY_NUMBERS, deviceWearerController.updateIdentityNumbers)
  get(paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER_SEARCH_RESULTS, deviceWearerSearchResultsController.view)
  post(paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER_SEARCH_RESULTS, deviceWearerSearchResultsController.update)
  viewUpdate(paths.ABOUT_THE_DEVICE_WEARER.RESPONSIBLE_ADULT, responsibleAdultController)
  viewUpdate(paths.ABOUT_THE_DEVICE_WEARER.CHECK_YOUR_ANSWERS, deviceWearerCheckAnswersController)

  return router
}

export default createAboutTheDeviceWearerRouter
