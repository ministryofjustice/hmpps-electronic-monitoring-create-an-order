import { Request, Response, RequestHandler } from 'express'
import constructModel from './viewModel'
import MonitoringConditionsStoreService from '../monitoringConditionsStoreService'
import { validationErrors } from '../../../constants/validationErrors'
import { ValidationResult } from '../../../models/Validation'
import paths from '../../../constants/paths'
import { PilotFormDataModel } from './formModel'

export default class PilotController {
  constructor(private readonly store: MonitoringConditionsStoreService) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const errors = req.flash('validationErrors') as unknown as ValidationResult

    const data = await this.store.getMonitoringConditions(order)

    const model = constructModel(order, data, errors)

    res.render('pages/order/monitoring-conditions/order-type-description/pilot', model)
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const formData = PilotFormDataModel.parse(req.body)

    if (formData.pilot === null || formData.pilot === undefined) {
      req.flash('validationErrors', [{ error: validationErrors.monitoringConditions.pilotRequired, field: 'pilot' }])
      res.redirect(paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.PILOT.replace(':orderId', order.id))
      return
    }

    await this.store.updateField(order, 'pilot', formData.pilot)

    res.redirect(paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.PRARR.replace(':orderId', order.id))
  }
}
