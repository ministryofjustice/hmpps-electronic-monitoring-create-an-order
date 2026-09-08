import { type RequestHandler, Router } from 'express'
import { Services } from '../../services'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import { registerViewUpdate } from '../routeHelpers'
import OrderTypeController from './order-type/controller'
import SentenceTypeController from './sentence-type/controller'
import HdcController from './hdc/controller'
import PilotController from './pilot/controller'
import IsspController from './issp/controller'
import PrarrController from './prarr/controller'
import MonitoringTypeController from './monitoring-type/controller'
import OffenceTypeController from './offence-type/controller'
import PoliceAreaController from './police-area/controller'
import TypesOfMonitoringNeededController from './types-of-monitoring-needed/controller'
import HardStopController from './hard-stop/controller'
import DapolMissedInErrorController from './dapol-missed-in-error/controller'
import HdcPauseController from './hdc-pause/controller'
import InstallationLocationController from '../../controllers/monitoringConditions/installationLocationController'
import InstallationAppointmentController from '../../controllers/monitoringConditions/installationAppointmentController'
import TrailMonitoringController from '../../controllers/monitoringConditions/trailMonitoringController'
import AttendanceMonitoringController from '../../controllers/monitoringConditions/attendanceMonitoringController'
import AttendanceMonitoringAddToListController from './attendance-monitoring/controller'
import AlcoholMonitoringController from '../../controllers/monitoringConditions/alcoholMonitoringController'
import CurfewReleaseDateController from '../../controllers/monitoringConditions/curfewReleaseDateController'
import CurfewConditionsController from '../../controllers/monitoringConditions/curfewConditionsController'
import CurfewAdditionalDetailsController from '../../controllers/monitoringConditions/curfewAdditionalDetailsController'
import CurfewTimetableController from '../../controllers/monitoringConditions/curfewTimetableController'
import EnforcementZoneAddToListController from './enforcement-zone/controller'
import MonitoringConditionsCheckAnswersController from '../../controllers/monitoringConditions/checkAnswersController'
import RemoveMonitoringTypeController from './remove-monitoring-type/controller'

const createOrderTypeDescriptionRouter = (
  services: Pick<
    Services,
    | 'monitoringConditionsStoreService'
    | 'monitoringConditionsUpdateService'
    | 'taskListService'
    | 'removeMonitoringTypeService'
    | 'installationLocationService'
    | 'installationAppointmentService'
    | 'trailMonitoringService'
    | 'attendanceMonitoringService'
    | 'attendanceMonitoringAddToListService'
    | 'alcoholMonitoringService'
    | 'curfewReleaseDateService'
    | 'curfewConditionsService'
    | 'curfewAdditionalDetailsService'
    | 'curfewTimetableService'
    | 'auditService'
    | 'zoneAddToListService'
    | 'orderChecklistService'
    | 'sectionService'
  >,
): Router => {
  const router = Router({ mergeParams: true })
  const get = (path: string, handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (path: string, handler: RequestHandler) => router.post(path, asyncMiddleware(handler))

  const {
    monitoringConditionsStoreService,
    monitoringConditionsUpdateService,
    taskListService,
    removeMonitoringTypeService,
    installationLocationService,
    installationAppointmentService,
    trailMonitoringService,
    attendanceMonitoringService,
    attendanceMonitoringAddToListService,
    alcoholMonitoringService,
    curfewReleaseDateService,
    curfewConditionsService,
    curfewAdditionalDetailsService,
    curfewTimetableService,
    auditService,
    zoneAddToListService,
    orderChecklistService,
    sectionService,
  } = services

  const orderTypeController = new OrderTypeController(
    monitoringConditionsStoreService,
    monitoringConditionsUpdateService,
  )
  const sentenceTypeController = new SentenceTypeController(
    monitoringConditionsStoreService,
    monitoringConditionsUpdateService,
  )
  const hdcController = new HdcController(monitoringConditionsStoreService)
  const hdcPauseController = new HdcPauseController(monitoringConditionsStoreService)
  const pilotController = new PilotController(monitoringConditionsStoreService)
  const dapolMissedInErrorController = new DapolMissedInErrorController(monitoringConditionsStoreService)
  const offenceTypeController = new OffenceTypeController(monitoringConditionsStoreService)
  const isspController = new IsspController(monitoringConditionsStoreService, monitoringConditionsUpdateService)
  const hardStopController = new HardStopController(monitoringConditionsStoreService)
  const prarrController = new PrarrController(monitoringConditionsStoreService, monitoringConditionsUpdateService)
  const monitoringTypeController = new MonitoringTypeController()
  const policeAreaController = new PoliceAreaController(monitoringConditionsStoreService)
  const typesOfMonitoringNeededController = new TypesOfMonitoringNeededController(taskListService)
  const removeMonitoringTypeController = new RemoveMonitoringTypeController(removeMonitoringTypeService)
  const installationLocationController = new InstallationLocationController(
    installationLocationService,
    taskListService,
  )
  const installationAppointmentController = new InstallationAppointmentController(
    installationAppointmentService,
    taskListService,
  )
  const trailMonitoringController = new TrailMonitoringController(trailMonitoringService)
  const attendanceMonitoringController = new AttendanceMonitoringController(attendanceMonitoringService)
  const attendanceMonitoringAddToListController = new AttendanceMonitoringAddToListController(
    attendanceMonitoringAddToListService,
  )
  const alcoholMonitoringController = new AlcoholMonitoringController(alcoholMonitoringService)
  const curfewReleaseDateController = new CurfewReleaseDateController(curfewReleaseDateService)
  const curfewConditionsController = new CurfewConditionsController(curfewConditionsService)
  const curfewAdditionalDetailsController = new CurfewAdditionalDetailsController(curfewAdditionalDetailsService)
  const curfewTimetableController = new CurfewTimetableController(curfewTimetableService)
  const zoneControllerAddToList = new EnforcementZoneAddToListController(auditService, zoneAddToListService)
  const monitoringConditionsCheckYourAnswersController = new MonitoringConditionsCheckAnswersController(
    taskListService,
    orderChecklistService,
    sectionService,
  )

  registerViewUpdate(router, '/monitoring-conditions/order-type-description/order-type', orderTypeController)
  registerViewUpdate(router, '/monitoring-conditions/order-type-description/sentence-type', sentenceTypeController)
  registerViewUpdate(router, '/monitoring-conditions/order-type-description/hdc', hdcController)
  registerViewUpdate(router, '/monitoring-conditions/order-type-description/hdc-pause', hdcPauseController)
  registerViewUpdate(router, '/monitoring-conditions/order-type-description/pilot', pilotController)
  registerViewUpdate(router, '/monitoring-conditions/order-type-description/pathfinder-programme', pilotController)
  registerViewUpdate(
    router,
    '/monitoring-conditions/order-type-description/dapol-missed-in-error',
    dapolMissedInErrorController,
  )
  registerViewUpdate(router, '/monitoring-conditions/order-type-description/offence-type', offenceTypeController)
  registerViewUpdate(router, '/monitoring-conditions/order-type-description/issp', isspController)
  registerViewUpdate(router, '/monitoring-conditions/order-type-description/prarr', prarrController)
  registerViewUpdate(
    router,
    '/monitoring-conditions/order-type-description/types-of-monitoring-needed',
    typesOfMonitoringNeededController,
  )
  registerViewUpdate(router, '/monitoring-conditions/order-type-description/police-area', policeAreaController)
  get('/monitoring-conditions/order-type-description/hard-stop', hardStopController.view)
  registerViewUpdate(router, '/monitoring-conditions/order-type-description/monitoring-type', monitoringTypeController)
  registerViewUpdate(
    router,
    '/monitoring-condtions/remove-monitoring-type/:monitoringTypeId',
    removeMonitoringTypeController,
  )
  registerViewUpdate(router, '/monitoring-conditions/installation-location', installationLocationController)
  registerViewUpdate(router, '/monitoring-conditions/installation-appointment', installationAppointmentController)
  registerViewUpdate(router, '/monitoring-conditions/trail', trailMonitoringController)
  get('/monitoring-conditions/attendance', attendanceMonitoringController.new)
  get('/monitoring-conditions/attendance/:conditionId', attendanceMonitoringController.view)
  post('/monitoring-conditions/attendance', attendanceMonitoringController.update)
  post('/monitoring-conditions/attendance/:conditionId', attendanceMonitoringController.update)
  get('/monitoring-conditions/add-to-list/attendance', attendanceMonitoringAddToListController.new)
  get('/monitoring-conditions/add-to-list/attendance/:conditionId', attendanceMonitoringAddToListController.view)
  post('/monitoring-conditions/add-to-list/attendance', attendanceMonitoringAddToListController.update)
  post('/monitoring-conditions/add-to-list/attendance/:conditionId', attendanceMonitoringAddToListController.update)
  registerViewUpdate(router, '/monitoring-conditions/alcohol', alcoholMonitoringController)
  registerViewUpdate(router, '/monitoring-conditions/curfew/release-date', curfewReleaseDateController)
  registerViewUpdate(router, '/monitoring-conditions/curfew/conditions', curfewConditionsController)
  registerViewUpdate(router, '/monitoring-conditions/curfew/additional-details', curfewAdditionalDetailsController)
  registerViewUpdate(router, '/monitoring-conditions/curfew/timetable', curfewTimetableController)
  get('/monitoring-conditions/add-to-list/zone/:zoneType', zoneControllerAddToList.new)
  get('/monitoring-conditions/add-to-list/zone/:zoneType/:zoneId', zoneControllerAddToList.view)
  post('/monitoring-conditions/add-to-list/zone/:zoneType/:zoneId', zoneControllerAddToList.update)
  registerViewUpdate(
    router,
    '/monitoring-conditions/check-your-answers',
    monitoringConditionsCheckYourAnswersController,
  )
  registerViewUpdate(
    router,
    '/version/:versionId/monitoring-conditions/check-your-answers',
    monitoringConditionsCheckYourAnswersController,
  )

  return router
}

export default createOrderTypeDescriptionRouter
