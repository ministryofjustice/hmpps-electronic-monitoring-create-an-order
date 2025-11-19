import { Handler, Request, Response } from 'express'
import MonitoringConditionsStoreService from '../monitoringConditionsStoreService'
import constructModel from './viewModel'
import paths from '../../../constants/paths'
import PrarrFormDataModel from './formModel'
import { validationErrors } from '../../../constants/validationErrors'
import { ValidationResult } from '../../../models/Validation'
import MonitoringConditionsBaseController from '../base/monitoringConditionBaseController'
import MonitoringConditionsUpdateService from '../monitoringConditionsService'

export default class PrarrController extends MonitoringConditionsBaseController {
  constructor(
    readonly montoringConditionsStoreService: MonitoringConditionsStoreService,
    readonly monitoringConditionsService: MonitoringConditionsUpdateService,
  ) {
    super(montoringConditionsStoreService, monitoringConditionsService)
  }

  view: Handler = async (req: Request, res: Response) => {
    const order = req.order!
    const errors = req.flash('validationErrors') as unknown as ValidationResult

    const data = await this.montoringConditionsStoreService.getMonitoringConditions(order)

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

    await this.montoringConditionsStoreService.updateField(order, 'prarr', formData.prarr)

    await super.UpdateMonitoringConditionAndGoToMonitoringTypePage(order, res)
   
  }
}
