import { Request, RequestHandler, Response } from 'express'

import paths from '../../constants/paths'
import { AttendanceMonitoring } from '../../models/AttendanceMonitoring'
import { isValidationResult } from '../../models/Validation'
import AttendanceMonitoringService from '../../services/attendanceMonitoringService'
import { serialiseDate, serialiseTime } from '../../utils/utils'
import TaskListService from '../../services/taskListService'
import AttendanceMonitoringFormDataModel, {
  AttendanceMonitoringFormData,
} from '../../models/form-data/attendanceMonitoring'
import attendanceMonitoringViewModel from '../../models/view-models/attendanceMonitoring'

export default class AttendanceMonitoringController {
  constructor(
    private readonly attendanceMonitoringService: AttendanceMonitoringService,
    private readonly taskListService: TaskListService,
  ) {}

  createApiModelFromFormData(formData: AttendanceMonitoringFormData): AttendanceMonitoring {
    const startDate = serialiseDate(formData['startDate-year'], formData['startDate-month'], formData['startDate-day'])
    const endDate = serialiseDate(formData['endDate-year'], formData['endDate-month'], formData['endDate-day'])
    const startTime = serialiseTime(formData.startTimeHours, formData.startTimeMinutes)
    const endTime = serialiseTime(formData.endTimeHours, formData.endTimeMinutes)

    return {
      startDate,
      endDate,
      purpose: formData.purpose,
      appointmentDay: formData.appointmentDay,
      startTime,
      endTime,
      addressLine1: formData.addressLine1,
      addressLine2: formData.addressLine2,
      addressLine3: formData.addressLine3,
      addressLine4: formData.addressLine4,
      postcode: formData.addressPostcode,
    }
  }

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
    const formData = AttendanceMonitoringFormDataModel.parse(req.body)

    const record = this.createApiModelFromFormData(formData)
    record.id = conditionId

    const updateResult = await this.attendanceMonitoringService.update({
      accessToken: res.locals.user.token,
      orderId,
      ...record,
    })

    if (isValidationResult(updateResult)) {
      req.flash('formData', formData)
      req.flash('validationErrors', updateResult)

      res.redirect(paths.MONITORING_CONDITIONS.ATTENDANCE.replace(':orderId', orderId))
    } else if (formData.action === 'continue') {
      if (formData.addAnother === 'true') {
        res.redirect(paths.MONITORING_CONDITIONS.ATTENDANCE.replace(':orderId', orderId))
      } else {
        res.redirect(this.taskListService.getNextPage('ATTENDANCE_MONITORING', req.order!))
      }
    } else {
      res.redirect(paths.ORDER.SUMMARY.replace(':orderId', orderId))
    }
  }
}
