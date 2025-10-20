import { Handler, Request, Response } from 'express'
import MonitoringConditionsStoreService from '../monitoringConditionsStoreService'
import constructModel from './viewModel'

export default class PrarrController {
  constructor(private readonly store: MonitoringConditionsStoreService) {}

  view: Handler = async (req: Request, res: Response) => {
    const order = req.order!

    const data = await this.store.getMonitoringConditions(order)

    const model = constructModel(data, [])

    res.render('pages/order/monitoring-conditions/order-type-description/prarr', model)
  }
}
