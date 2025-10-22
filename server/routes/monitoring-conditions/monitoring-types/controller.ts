import { RequestHandler, Request, Response } from 'express'
import MonitoringConditionsStoreService from '../monitoringConditionsStoreService'
import constructModel from './viewModel'
import paths from '../../../constants/paths'
import MonitoringTypesFormDataModel from './formModel'
import { validationErrors } from '../../../constants/validationErrors'
import { ValidationResult } from '../../../models/Validation'

export default class MonitoringTypesController {
  constructor(private readonly store: MonitoringConditionsStoreService) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!

    const errors = req.flash('validationErrors') as unknown as ValidationResult

    const data = await this.store.getMonitoringConditions(order)

    const model = constructModel(data, errors)
    res.render('pages/order/monitoring-conditions/order-type-description/monitoring-types', model)
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!

    const formData = MonitoringTypesFormDataModel.parse(req.body)

    const { action, ...monitoringTypeValues } = formData
    if (Object.values(monitoringTypeValues).every(item => item === false)) {
      req.flash('validationErrors', [
        { error: validationErrors.monitoringConditions.monitoringTypeRequired, field: 'monitoringType' },
      ])
      res.redirect(paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.MONITORING_TYPES.replace(':orderId', order.id))
      return
    }

    await this.store.updateMonitoringType(order, monitoringTypeValues)

    res.redirect(paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.CHECK_YOUR_ANSWERS.replace(':orderId', order.id))
  }
}
