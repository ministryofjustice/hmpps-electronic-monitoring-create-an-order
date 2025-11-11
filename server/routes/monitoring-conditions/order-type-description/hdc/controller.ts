import { Request, RequestHandler, Response } from 'express'
import MonitoringConditionsStoreService from '../monitoringConditionsStoreService'
import { HdcFormDataModel } from './formModel'
import { ValidationResult } from '../../../../models/Validation'
import { validationErrors } from '../../../../constants/validationErrors'
import paths from '../../../../constants/paths'
import constructModel from './viewModel'

export default class HdcController {
  constructor(private readonly montoringConditionsStoreService: MonitoringConditionsStoreService) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const errors = req.flash('validationErrors') as unknown as ValidationResult

    const monitoringConditions = await this.montoringConditionsStoreService.getMonitoringConditions(order)

    const model = constructModel(monitoringConditions, errors)
    res.render('pages/order/monitoring-conditions/order-type-description/hdc', model)
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const formData = HdcFormDataModel.parse(req.body)
    if (formData.hdc === null || formData.hdc === undefined) {
      req.flash('validationErrors', [
        {
          error: validationErrors.monitoringConditions.hdcRequired,
          field: 'hdc',
          focusTarget: 'hdc',
        },
      ])
      res.redirect(paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.HDC.replace(':orderId', order.id))
    } else {
      await this.montoringConditionsStoreService.updateField(order, 'hdc', formData.hdc)
      res.redirect(paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.PILOT.replace(':orderId', order.id))
    }
  }
}
