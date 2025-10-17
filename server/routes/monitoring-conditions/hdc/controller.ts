import { Request, RequestHandler, Response } from 'express'
import MonitoringConditionsStoreService from '../monitoringConditionsStoreService'
import { HdcFormDataModel } from './formModel'
import { ValidationResult } from '../../../models/Validation'
import { validationErrors } from '../../../constants/validationErrors'
import paths from '../../../constants/paths'
import constructModel from './viewModel'

export default class HdcController {
  constructor(private readonly montoringConditionsStoreService: MonitoringConditionsStoreService) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const orderId = req.order!.id
    const errors = req.flash('validationErrors') as unknown as ValidationResult

    const monitoringConditions = await this.montoringConditionsStoreService.getMonitoringConditions(orderId)

    const model = constructModel(monitoringConditions, errors)
    res.render('pages/order/monitoring-conditions/order-type-description/hdc', model)
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const orderId = req.order!.id
    const formData = HdcFormDataModel.parse(req.body)
    if (formData.hdc === null || formData.hdc === undefined) {
      req.flash('validationErrors', [
        {
          error: validationErrors.monitoringConditions.hdcRequired,
          field: 'hdc',
          focusTarget: 'hdc',
        },
      ])
      res.redirect(paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.HDC.replace(':orderId', orderId))
    } else {
      await this.montoringConditionsStoreService.updateField(orderId, 'hdc', formData.hdc)
      res.redirect(paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.PILOT.replace(':orderId', orderId))
    }
  }
}
