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
    const orderId = req.order!.id
    const errors = req.flash('validationErrors') as unknown as ValidationResult

    const data = await this.store.getMonitoringConditions(orderId)

    const model = constructModel(data, errors)

    res.render('pages/order/monitoring-conditions/order-type-description/pilot', model)
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const orderId = req.order!.id
    const formData = PilotFormDataModel.parse(req.body)

    if (formData.pilot === null || formData.pilot === undefined) {
      req.flash('validationErrors', [{ error: validationErrors.monitoringConditions.pilotRequired, field: 'pilot' }])
      res.redirect(paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.PILOT.replace(':orderId', orderId))
      return
    }

    await this.store.updateField(orderId, 'pilot', formData.pilot)

    // update to PRARR page when it is made
    // res.redirect(paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.PRARR.replace(':orderId', orderId))
    res.redirect(paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.CHECK_YOUR_ANSWERS.replace(':orderId', orderId))
  }
}
