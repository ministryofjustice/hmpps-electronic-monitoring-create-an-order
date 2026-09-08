import { type RequestHandler, Router } from 'express'
import { Services } from '../../services'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import { registerViewUpdate, relativePath } from '../routeHelpers'
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
import paths from '../../constants/paths'

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
  const rel = (path: string) => relativePath(paths.MONITORING_CONDITIONS.BASE_URL, path)

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

  registerViewUpdate(router, rel(paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.ORDER_TYPE), orderTypeController)
  registerViewUpdate(
    router,
    rel(paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.SENTENCE_TYPE),
    sentenceTypeController,
  )
  registerViewUpdate(router, rel(paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.HDC), hdcController)
  registerViewUpdate(router, rel(paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.HDC_PAUSE), hdcPauseController)
  registerViewUpdate(router, rel(paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.PILOT), pilotController)
  registerViewUpdate(
    router,
    rel(paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.PATHFINDER_PROGRAMME),
    pilotController,
  )
  registerViewUpdate(
    router,
    rel(paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.DAPOL_MISSED_IN_ERROR),
    dapolMissedInErrorController,
  )
  registerViewUpdate(
    router,
    rel(paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.OFFENCE_TYPE),
    offenceTypeController,
  )
  registerViewUpdate(router, rel(paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.ISSP), isspController)
  registerViewUpdate(router, rel(paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.PRARR), prarrController)
  registerViewUpdate(
    router,
    rel(paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.TYPES_OF_MONITORING_NEEDED),
    typesOfMonitoringNeededController,
  )
  registerViewUpdate(router, rel(paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.POLICE_AREA), policeAreaController)
  get(rel(paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.HARD_STOP), hardStopController.view)
  registerViewUpdate(
    router,
    rel(paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.MONITORING_TYPE),
    monitoringTypeController,
  )
  registerViewUpdate(router, rel(paths.MONITORING_CONDITIONS.REMOVE_MONITORING_TYPE), removeMonitoringTypeController)
  registerViewUpdate(router, rel(paths.MONITORING_CONDITIONS.INSTALLATION_LOCATION), installationLocationController)
  registerViewUpdate(
    router,
    rel(paths.MONITORING_CONDITIONS.INSTALLATION_APPOINTMENT),
    installationAppointmentController,
  )
  registerViewUpdate(router, rel(paths.MONITORING_CONDITIONS.TRAIL), trailMonitoringController)
  get(rel(paths.MONITORING_CONDITIONS.ATTENDANCE), attendanceMonitoringController.new)
  get(rel(paths.MONITORING_CONDITIONS.ATTENDANCE_ITEM), attendanceMonitoringController.view)
  post(rel(paths.MONITORING_CONDITIONS.ATTENDANCE), attendanceMonitoringController.update)
  post(rel(paths.MONITORING_CONDITIONS.ATTENDANCE_ITEM), attendanceMonitoringController.update)
  get(rel(paths.MONITORING_CONDITIONS.ATTENDANCE_ADD_TO_LIST), attendanceMonitoringAddToListController.new)
  get(rel(paths.MONITORING_CONDITIONS.ATTENDANCE_ITEM_ADD_TO_LIST), attendanceMonitoringAddToListController.view)
  post(rel(paths.MONITORING_CONDITIONS.ATTENDANCE_ADD_TO_LIST), attendanceMonitoringAddToListController.update)
  post(rel(paths.MONITORING_CONDITIONS.ATTENDANCE_ITEM_ADD_TO_LIST), attendanceMonitoringAddToListController.update)
  registerViewUpdate(router, rel(paths.MONITORING_CONDITIONS.ALCOHOL), alcoholMonitoringController)
  registerViewUpdate(router, rel(paths.MONITORING_CONDITIONS.CURFEW_RELEASE_DATE), curfewReleaseDateController)
  registerViewUpdate(router, rel(paths.MONITORING_CONDITIONS.CURFEW_CONDITIONS), curfewConditionsController)
  registerViewUpdate(
    router,
    rel(paths.MONITORING_CONDITIONS.CURFEW_ADDITIONAL_DETAILS),
    curfewAdditionalDetailsController,
  )
  registerViewUpdate(router, rel(paths.MONITORING_CONDITIONS.CURFEW_TIMETABLE), curfewTimetableController)
  get(rel(paths.MONITORING_CONDITIONS.ZONE_NEW_ITEM), zoneControllerAddToList.new)
  get(rel(paths.MONITORING_CONDITIONS.ZONE_ADD_TO_LIST), zoneControllerAddToList.view)
  post(rel(paths.MONITORING_CONDITIONS.ZONE_ADD_TO_LIST), zoneControllerAddToList.update)
  registerViewUpdate(
    router,
    rel(paths.MONITORING_CONDITIONS.CHECK_YOUR_ANSWERS),
    monitoringConditionsCheckYourAnswersController,
  )
  registerViewUpdate(
    router,
    rel(paths.MONITORING_CONDITIONS.CHECK_YOUR_ANSWERS_VERSION),
    monitoringConditionsCheckYourAnswersController,
  )

  return router
}

export default createOrderTypeDescriptionRouter
