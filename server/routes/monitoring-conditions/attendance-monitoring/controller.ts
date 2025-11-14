import { Request, RequestHandler, Response } from 'express'
import paths from '../../../constants/paths'
import { isValidationResult } from '../../../models/Validation'
import AttendanceMonitoringAddToListService from './service'
import attendanceMonitoringAddToListViewModel from './viewModel'
import { AttendanceMonitoringAddToListFormDataModel } from './formModel'

export default class AttendanceMonitoringAddToListController {
  constructor(private readonly attendanceMonitoringAddToListService: AttendanceMonitoringAddToListService) {}

  new: RequestHandler = async (req: Request, res: Response) => {
    const errors = req.flash('validationErrors')
    const formData = req.flash('formData')

    const viewModel = attendanceMonitoringAddToListViewModel.construct(undefined, formData[0] as never, errors as never)
    res.render(`pages/order/monitoring-conditions/attendance-monitoring-add-to-list`, viewModel)
  }

  view: RequestHandler = async (req: Request, res: Response) => {
    const { conditionId } = req.params
    const { mandatoryAttendanceConditions: monitoringConditionsAttendance } = req.order!
    const condition = monitoringConditionsAttendance?.find(c => c.id === conditionId)
    if (!condition) {
      res.send(404)
      return
    }

    const viewModel = attendanceMonitoringAddToListViewModel.construct(condition, undefined, [])
    res.render('pages/order/monitoring-conditions/attendance-monitoring-add-to-list', viewModel)
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const { orderId, conditionId } = req.params

    req.body.id = conditionId
    const formData = AttendanceMonitoringAddToListFormDataModel.parse(req.body)

    const updateResult = await this.attendanceMonitoringAddToListService.update({
      accessToken: res.locals.user.token,
      orderId,

      data: formData,
    })

    if (isValidationResult(updateResult)) {
      req.flash('formData', formData)
      req.flash('validationErrors', updateResult)

      res.redirect(paths.MONITORING_CONDITIONS.ATTENDANCE_ADD_TO_LIST.replace(':orderId', orderId))
    }
    if (formData.action === 'continue') {
      res.redirect(
        paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.TYPES_OF_MONITORING_NEEDED.replace(
          ':orderId',
          req.order!.id,
        ),
      )
    } else {
      res.redirect(paths.ORDER.SUMMARY.replace(':orderId', orderId))
    }
  }
}
