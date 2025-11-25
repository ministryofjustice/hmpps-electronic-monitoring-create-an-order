import { Request, RequestHandler, Response } from 'express'
import MonitoringConditionsStoreService from '../monitoringConditionsStoreService'
import { IsspFormDataModel } from './formModel'
import { ValidationResult } from '../../../models/Validation'
import { validationErrors } from '../../../constants/validationErrors'
import paths from '../../../constants/paths'
import constructModel from './viewModel'
import MonitoringConditionsUpdateService from '../monitoringConditionsService'
import MonitoringConditionsBaseController from '../base/monitoringConditionBaseController'

export default class IsspController extends MonitoringConditionsBaseController {
  constructor(
    readonly montoringConditionsStoreService: MonitoringConditionsStoreService,
    monitoringConditionsService: MonitoringConditionsUpdateService,
  ) {
    super(montoringConditionsStoreService, monitoringConditionsService)
  }

  view: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const errors = req.flash('validationErrors') as unknown as ValidationResult

    const monitoringConditions = await this.montoringConditionsStoreService.getMonitoringConditions(order)

    const model = constructModel(monitoringConditions, errors)
    res.render('pages/order/monitoring-conditions/order-type-description/issp', model)
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const formData = IsspFormDataModel.parse(req.body)
    if (formData.issp === null || formData.issp === undefined) {
      req.flash('validationErrors', [
        {
          error: validationErrors.monitoringConditions.isspRequired,
          field: 'issp',
          focusTarget: 'issp',
        },
      ])
      res.redirect(paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.ISSP.replace(':orderId', order.id))
    } else {
      await this.montoringConditionsStoreService.updateField(order, 'issp', formData.issp)
      const monitoringConditions = await this.montoringConditionsStoreService.getMonitoringConditions(order)
      if (monitoringConditions.sentenceType === 'DTO')
        res.redirect(paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.PRARR.replace(':orderId', order.id))
      else await super.UpdateMonitoringConditionAndGoToMonitoringTypePage(order, req, res)
    }
  }
}
