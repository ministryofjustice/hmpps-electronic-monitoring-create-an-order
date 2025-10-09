import { Request, RequestHandler, Response } from 'express'
import MonitoringConditionsStoreService from '../monitoringConditionsStoreService'

export default class HDCController {
  constructor(private readonly montoringConditionsStoreService: MonitoringConditionsStoreService) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const model = {}
    res.render('pages/order/monitoring-conditions/order-type-description/hdc', model)
  }
}
