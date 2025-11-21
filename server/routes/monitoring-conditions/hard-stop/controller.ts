import { Request, RequestHandler, Response } from 'express'
import MonitoringConditionsStoreService from '../monitoringConditionsStoreService'
import constructModel from './viewModel'

export default class HardStopController {
  constructor(private readonly monitoringConditionsStoreService: MonitoringConditionsStoreService) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const monitoringConditions = await this.monitoringConditionsStoreService.getMonitoringConditions(order)
    const model = constructModel(order, monitoringConditions)

    res.render('pages/order/monitoring-conditions/order-type-description/hard-stop', model)
  }
}
