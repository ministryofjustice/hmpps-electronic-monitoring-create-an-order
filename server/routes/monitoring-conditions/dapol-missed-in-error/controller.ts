import { Request, Response, RequestHandler } from 'express'
import { ValidationResult } from '../../../models/Validation'
import paths from '../../../constants/paths'
import constructModel from './viewModel'
import { DapolMissedInErrorFormDataModel } from './formModel'
import MonitoringConditionsStoreService from '../monitoringConditionsStoreService'
import { validationErrors } from '../../../constants/validationErrors'

export default class DapolMissedInErrorController {
  constructor(private readonly montoringConditionsStoreService: MonitoringConditionsStoreService) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const errors = req.flash('validationErrors') as unknown as ValidationResult

    const monitoringConditions = await this.montoringConditionsStoreService.getMonitoringConditions(order)

    const model = constructModel(monitoringConditions, errors)

    res.render('pages/order/monitoring-conditions/order-type-description/dapol-missed-in-error', model)
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const formData = DapolMissedInErrorFormDataModel.parse(req.body)

    if (!formData.dapolMissedInError) {
      req.flash('validationErrors', [
        {
          error: validationErrors.monitoringConditions.dapolMissedRequired,
          field: 'dapolMissedInError',
          focusTarget: 'dapolMissedInError',
        },
      ])
      res.redirect(
        paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.DAPOL_MISSED_IN_ERROR.replace(':orderId', order.id),
      )
    } else {
      await this.montoringConditionsStoreService.updateField(order, 'dapolMissedInError', formData.dapolMissedInError)
      res.redirect(paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.PRARR.replace(':orderId', order.id))
    }
  }
}
