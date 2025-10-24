import { Handler, Request, Response } from 'express'
import MonitoringConditionsStoreService from '../monitoringConditionsStoreService'
import constructModel from './viewModel'
import paths from '../../../constants/paths'
import PrarrFormDataModel from './formModel'
import { validationErrors } from '../../../constants/validationErrors'
import { ValidationResult } from '../../../models/Validation'

export default class PrarrController {
  constructor(private readonly store: MonitoringConditionsStoreService) {}

  view: Handler = async (req: Request, res: Response) => {
    const order = req.order!
    const errors = req.flash('validationErrors') as unknown as ValidationResult

    const data = await this.store.getMonitoringConditions(order)

    const model = constructModel(data, errors)

    res.render('pages/order/monitoring-conditions/order-type-description/prarr', model)
  }

  update: Handler = async (req: Request, res: Response) => {
    const order = req.order!

    const formData = PrarrFormDataModel.parse(req.body)

    if (formData.prarr === null || formData.prarr === undefined) {
      req.flash('validationErrors', [{ error: validationErrors.monitoringConditions.prarrRequired, field: 'prarr' }])
      res.redirect(paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.PRARR.replace(':orderId', order.id))
      return
    }

    await this.store.updateField(order, 'prarr', formData.prarr)

    // update to monitoring dates
    res.redirect(paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.MONITORING_TYPES.replace(':orderId', order.id))
  }
}
