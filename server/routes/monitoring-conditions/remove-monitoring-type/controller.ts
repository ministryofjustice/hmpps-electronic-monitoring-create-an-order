import { Handler, Request, Response } from 'express'
import Model, { MonitoringTypeData } from './viewModel'
import { Order } from '../../../models/Order'

export default class RemoveMonitoringTypeController {
  constructor() {}

  view: Handler = (req: Request, res: Response) => {
    const { monitoringTypeId } = req.params
    const order = req.order!

    const monitoringType = this.findMonitoringType(order, monitoringTypeId)

    const model = Model.construct(monitoringType)

    res.render('pages/order/monitoring-conditions/remove-monitoring-type', model)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private findMonitoringType = (order: Order, monitoringTypeId: string): MonitoringTypeData => {
    // search through all monitoring types and find match
    return {
      type: 'Curfew',
      monitoringType: order.curfewConditions!,
    }
  }
}
