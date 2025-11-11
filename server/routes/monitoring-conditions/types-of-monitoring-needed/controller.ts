import { Request, RequestHandler, Response } from 'express'
import constructModel from './viewModel'
import { ValidationResult } from '../../../models/Validation'
import { TypesOfMonitoringNeededFormDataModel } from './formModel'
import paths from '../../../constants/paths'
import { validationErrors } from '../../../constants/validationErrors'

export default class TypesOfMonitoringNeededController {
  constructor() {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const errors = req.flash('validationErrors') as unknown as ValidationResult
    const model = constructModel(order, errors)

    res.render('pages/order/monitoring-conditions/order-type-description/types-of-monitoring-needed', model)
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const formData = TypesOfMonitoringNeededFormDataModel.parse(req.body)

    if (formData.addAnother === null || formData.addAnother === undefined) {
      req.flash('validationErrors', [
        {
          error: validationErrors.monitoringConditions.addAnotherRequired,
          field: 'addAnother',
          focusTarget: 'addAnother',
        },
      ])
      return res.redirect(
        paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.TYPES_OF_MONITORING_NEEDED.replace(':orderId', order.id),
      )
    }

    // TODO
    return res.redirect(
      paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.MONITORING_TYPE.replace(':orderId', order.id),
    )
  }
}
