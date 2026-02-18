import { Request, RequestHandler, Response } from 'express'
import paths from '../../constants/paths'
import { isValidationResult } from '../../models/Validation'
import AttendanceMonitoringService from '../../services/attendanceMonitoringService'
import TaskListService from '../../services/taskListService'
import { AttendanceMonitoringFormDataModel } from '../../models/form-data/attendanceMonitoring'
import attendanceMonitoringViewModel from '../../models/view-models/attendanceMonitoring'
import FeatureFlags from '../../utils/featureFlags'

export default class AttendanceMonitoringController {
  constructor(
    private readonly attendanceMonitoringService: AttendanceMonitoringService,
    private readonly taskListService: TaskListService,
  ) {}

  new: RequestHandler = async (req: Request, res: Response) => {
    const errors = req.flash('validationErrors')
    const formData = req.flash('formData')

    const viewModel = attendanceMonitoringViewModel.construct(undefined, formData[0] as never, errors as never)
    res.render(`pages/order/monitoring-conditions/attendance-monitoring`, viewModel)
  }

  view: RequestHandler = async (req: Request, res: Response) => {
    const { conditionId } = req.params
    const { mandatoryAttendanceConditions: monitoringConditionsAttendance } = req.order!
    const condition = monitoringConditionsAttendance?.find(c => c.id === conditionId)
    if (!condition) {
      res.send(404)
      return
    }

    const viewModel = attendanceMonitoringViewModel.construct(condition, undefined, [])
    res.render('pages/order/monitoring-conditions/attendance-monitoring', viewModel)
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const { orderId, conditionId } = req.params

    req.body.id = conditionId
    const formData = AttendanceMonitoringFormDataModel.parse(req.body)

    const updateResult = await this.attendanceMonitoringService.update({
      accessToken: res.locals.user.token,
      orderId,

      data: formData,
    })

    if (isValidationResult(updateResult)) {
      req.flash('formData', formData)
      req.flash('validationErrors', updateResult)

      res.redirect(paths.MONITORING_CONDITIONS.ATTENDANCE.replace(':orderId', orderId))
    } else if (formData.action === 'continue') {
      if (FeatureFlags.getInstance().get('LIST_MONITORING_CONDITION_FLOW_ENABLED')) {
        res.redirect(
          paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.TYPES_OF_MONITORING_NEEDED.replace(':orderId', orderId),
        )
      } else if (formData.addAnother === 'true') {
        res.redirect(paths.MONITORING_CONDITIONS.ATTENDANCE.replace(':orderId', orderId))
      } else {
        res.redirect(this.taskListService.getNextPage('ATTENDANCE_MONITORING', req.order!))
      }
    } else {
      res.redirect(paths.ORDER.SUMMARY.replace(':orderId', orderId))
    }
  }
}
