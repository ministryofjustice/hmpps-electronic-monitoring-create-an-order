import { Request, RequestHandler, Response } from 'express'
import MonitoringConditionsStoreService from '../monitoringConditionsStoreService'
import { HdcPauseFormDataModel } from './formModel'
import { ValidationResult } from '../../../models/Validation'
import { validationErrors } from '../../../constants/validationErrors'
import paths from '../../../constants/paths'
import constructModel from './viewModel'

export default class HdcPauseController {
  constructor(private readonly montoringConditionsStoreService: MonitoringConditionsStoreService) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const errors = req.flash('validationErrors') as unknown as ValidationResult

    const model = constructModel(errors)
    res.render('pages/order/monitoring-conditions/order-type-description/hdc-pause', model)
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const formData = HdcPauseFormDataModel.parse(req.body)
    if (formData.hdcPause === null || formData.hdcPause === undefined) {
      req.flash('validationErrors', [
        {
          error: validationErrors.monitoringConditions.hdcRequired,
          field: 'hdcPause',
          focusTarget: 'hdc',
        },
      ])
      res.redirect(paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.HDC_PAUSE.replace(':orderId', order.id))
    } else {
      await this.montoringConditionsStoreService.updateField(order, 'hdc', formData.hdcPause)
      res.redirect(paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.PILOT.replace(':orderId', order.id))
    }
  }
}
