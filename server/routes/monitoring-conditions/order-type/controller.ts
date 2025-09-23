import { Request, RequestHandler, Response } from 'express'
import MonitoringConditionsStoreService from '../monitoringConditionsStoreService'
import constructModel from './model'

export default class OrderTypeController {
  constructor(private readonly montoringConditionsStoreService: MonitoringConditionsStoreService) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const monitoringConditions = await this.montoringConditionsStoreService.getMonitoringConditions('some token')

    const notifyingOrganisation = req.order?.interestedParties?.notifyingOrganisation
    if (!notifyingOrganisation) {
      // Throw error for now as this will not be possible in the future
      // Should figure out what behaviour we want if it isn't set
      throw new Error('notifyingOrganisation not set')
    }

    const model = constructModel(notifyingOrganisation, monitoringConditions)

    res.render('pages/order/monitoring-conditions/order-type-description/order-type', model)
  }
}
