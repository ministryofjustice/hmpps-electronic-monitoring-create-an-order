import { Router } from 'express'
import DeviceWearerController from './device-wearer/controller'
import DeviceWearerCheckAnswersController from './check-your-answers/controller'
import ResponsibleAdultController from './responsible-adult/controller'
import DeviceWearerDetailsController from './device-wearer-details/controller'
import DisabilitiesController from './disabilities/controller'
import LanguageController from './language/controller'
import AdultAtInstallationController from './adult-at-installation/controller'
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
    | 'deviceWearerAnswersService'
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
    deviceWearerAnswersService,
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
  viewUpdate(
    paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER_DETAILS,
    new DeviceWearerDetailsController(deviceWearerAnswersService, taskListService),
  )
  viewUpdate(
    paths.ABOUT_THE_DEVICE_WEARER.DISABILITIES,
    new DisabilitiesController(deviceWearerAnswersService, taskListService),
  )
  viewUpdate(
    paths.ABOUT_THE_DEVICE_WEARER.LANGUAGE,
    new LanguageController(deviceWearerAnswersService, taskListService),
  )
  viewUpdate(
    paths.ABOUT_THE_DEVICE_WEARER.ADULT_AT_INSTALLATION,
    new AdultAtInstallationController(deviceWearerAnswersService, taskListService),
  )
  viewUpdate(paths.ABOUT_THE_DEVICE_WEARER.CHECK_YOUR_ANSWERS, deviceWearerCheckAnswersController)

  return router
}

export default createAboutTheDeviceWearerRouter
