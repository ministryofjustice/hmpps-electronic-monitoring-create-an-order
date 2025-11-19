import { Request, RequestHandler, Response } from 'express'
import MonitoringConditionsStoreService from '../monitoringConditionsStoreService'
import constructModel from './viewModel'
import { ValidationResult } from '../../../models/Validation'
import paths from '../../../constants/paths'

export default class HardStopController {
  constructor(private readonly monitoringConditionsStoreService: MonitoringConditionsStoreService) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const monitoringConditions = await this.monitoringConditionsStoreService.getMonitoringConditions(order)
    const errors = req.flash('validationErrors') as unknown as ValidationResult

    const model = constructModel(monitoringConditions, errors)

    res.render('pages/order/monitoring-conditions/order-type-description/hard-stop', model)
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!

    res.redirect(paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.HARD_STOP.replace(':orderId', order.id))
  }
}
