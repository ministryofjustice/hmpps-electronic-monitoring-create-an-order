import { Handler, Request, Response } from 'express'
import MonitoringConditionsStoreService from '../monitoringConditionsStoreService'
import constructModel from './viewModel'
import { ValidationResult } from '../../../../models/Validation'
import paths from '../../../../constants/paths'
import { validationErrors } from '../../../../constants/validationErrors'
import OffenceTypeFormDataModel from './formModel'

export default class OffenceTypeController {
  constructor(private readonly store: MonitoringConditionsStoreService) {}

  view: Handler = async (req: Request, res: Response) => {
    const order = req.order!

    const errors = req.flash('validationErrors') as unknown as ValidationResult

    const data = await this.store.getMonitoringConditions(order)

    const model = constructModel(data, errors)
    res.render('pages/order/monitoring-conditions/order-type-description/offence-type', model)
  }

  update: Handler = async (req: Request, res: Response) => {
    const order = req.order!

    const formData = OffenceTypeFormDataModel.parse(req.body)

    if (formData.offenceType === undefined || formData.offenceType === null) {
      req.flash('validationErrors', [
        {
          error: validationErrors.monitoringConditions.offenceTypeRequired,
          field: 'offenceType',
        },
      ])
      res.redirect(paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.OFFENCE_TYPE.replace(':orderId', order.id))
      return
    }

    await this.store.updateField(order, 'offenceType', formData.offenceType)

    res.redirect(paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.POLICE_AREA.replace(':orderId', order.id))
  }
}
