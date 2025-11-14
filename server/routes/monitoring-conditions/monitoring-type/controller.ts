import { RequestHandler, Request, Response } from 'express'
import constructModel from './viewModel'
import paths from '../../../constants/paths'
import MonitoringTypesFormDataModel from './formModel'
import { validationErrors } from '../../../constants/validationErrors'
import { ValidationResult } from '../../../models/Validation'
import TaskListService from '../../../services/taskListService'

export default class MonitoringTypeController {
  constructor(private readonly taskListService: TaskListService) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!

    const errors = req.flash('validationErrors') as unknown as ValidationResult

    const model = constructModel(order, errors)
    res.render('pages/order/monitoring-conditions/order-type-description/monitoring-type', model)
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!

    const formData = MonitoringTypesFormDataModel.parse(req.body)

    if (formData.monitoringType === undefined || formData.monitoringType === null) {
      req.flash('validationErrors', [
        { error: validationErrors.monitoringConditions.monitoringTypeRequired, field: 'monitoringType' },
      ])
      res.redirect(paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.MONITORING_TYPE.replace(':orderId', order.id))
      return
    }

    const monitoringConditionPath = this.getMonitoringConditionPath(formData.monitoringType)
    res.redirect(monitoringConditionPath.replace(':orderId', order.id))
  }

  getMonitoringConditionPath = (
    condition: 'curfew' | 'exclusionZone' | 'trail' | 'mandatoryAttendance' | 'alcohol',
  ): string => {
    switch (condition) {
      case 'alcohol':
        return paths.MONITORING_CONDITIONS.ALCOHOL
      case 'curfew':
        return paths.MONITORING_CONDITIONS.CURFEW_RELEASE_DATE
      case 'exclusionZone':
        return paths.MONITORING_CONDITIONS.ZONE_NEW_ITEM
      case 'trail':
        return paths.MONITORING_CONDITIONS.TRAIL
      case 'mandatoryAttendance':
        return paths.MONITORING_CONDITIONS.ATTENDANCE_ADD_TO_LIST
      default:
        return ''
    }
  }
}
