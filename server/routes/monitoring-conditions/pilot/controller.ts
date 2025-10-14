import { Request, Response, RequestHandler } from 'express'
import constructModel from './viewModel'
import MonitoringConditionsStoreService from '../monitoringConditionsStoreService'

export default class PilotController {
  constructor(private readonly store: MonitoringConditionsStoreService) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const { id } = req.order!

    const data = await this.store.getMonitoringConditions(id)

    const model = constructModel(data)

    res.render('pages/order/monitoring-conditions/order-type-description/pilot', model)
  }
}
