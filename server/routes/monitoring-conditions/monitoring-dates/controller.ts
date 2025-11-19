import { Request, RequestHandler, Response } from 'express'
import MonitoringConditionsStoreService from '../monitoringConditionsStoreService'
import constructModel from './viewModel'
import { ValidationResult } from '../../../models/Validation'
import { MonitoringDatesFormDataModel } from './formModel'
import paths from '../../../constants/paths'
import FeatureFlags from '../../../utils/featureFlags'
import MonitoringConditionsUpdateService from '../monitoringConditionsService'
import MonitoringConditionsBaseController from '../base/monitoringConditionBaseController'

export default class MonitoringDatesController extends MonitoringConditionsBaseController {
  constructor(
    readonly montoringConditionsStoreService: MonitoringConditionsStoreService,
    readonly monitoringConditionsService: MonitoringConditionsUpdateService,
  ) {
    super(montoringConditionsStoreService, monitoringConditionsService)
  }

  view: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const monitoringConditions = await this.montoringConditionsStoreService.getMonitoringConditions(order)

    const errors = req.flash('validationErrors') as unknown as ValidationResult
    const model = constructModel(monitoringConditions, errors)

    res.render('pages/order/monitoring-conditions/order-type-description/monitoring-dates', model)
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const formData = MonitoringDatesFormDataModel.safeParse(req.body)
    if (!formData.success) {
      const validationErrors = formData.error.issues.map(issue => ({
        error: issue.message,
        field: issue.path[0].toString(),
      }))
      req.flash('validationErrors', validationErrors)
      await super.UpdateMonitoringConditionAndGoToMonitoringTypePage(order, res)
      return
    }
    await this.montoringConditionsStoreService.updateMonitoringDates(order, formData.data)

    if (FeatureFlags.getInstance().get('LIST_MONITORING_CONDITION_FLOW_ENABLED')) {
      await super.UpdateMonitoringConditionAndGoToMonitoringTypePage(order, res)
      return
    }
    res.redirect(paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.MONITORING_TYPES.replace(':orderId', order.id))
  }
}
