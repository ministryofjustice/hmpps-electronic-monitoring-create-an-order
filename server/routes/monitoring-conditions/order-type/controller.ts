import { Request, RequestHandler, Response } from 'express'
import MonitoringConditionsStoreService from '../monitoringConditionsStoreService'
import { MonitoringConditions } from '../model'

export default class OrderTypeController {
  constructor(private readonly montoringConditionsStoreService: MonitoringConditionsStoreService) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const monitoringConditions = await this.montoringConditionsStoreService.getMonitoringConditions('some token')

    const model = createModel(monitoringConditions)

    res.render('pages/order/monitoring-conditions/order-type-description/order-type', model)
  }
}

const createModel = (monitoringConditions: MonitoringConditions) => {
  return monitoringConditions
}
