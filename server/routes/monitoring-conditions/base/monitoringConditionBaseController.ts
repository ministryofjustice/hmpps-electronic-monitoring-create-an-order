import { Request, Response } from 'express'
import paths from '../../../constants/paths'
import { Order } from '../../../models/Order'
import MonitoringConditionsUpdateService from '../monitoringConditionsService'
import MonitoringConditionsStoreService from '../monitoringConditionsStoreService'
import anyConditionCompleted from '../../../utils/anyConditionCompleted'

export default abstract class MonitoringConditionsBaseController {
  constructor(
    protected readonly montoringConditionsStoreService: MonitoringConditionsStoreService,
    protected readonly monitoringConditionsService: MonitoringConditionsUpdateService,
  ) {}

  async UpdateMonitoringConditionAndGoToMonitoringTypePage(order: Order, req: Request, res: Response) {
    const data = await this.montoringConditionsStoreService.getMonitoringConditions(order)
    // clear any existing start and end date
    data.startDate = null
    data.endDate = null
    await this.monitoringConditionsService.updateMonitoringConditions({
      data,
      accessToken: res.locals.user.token,
      orderId: order.id,
    })
    if (anyConditionCompleted(order)) {
      res.redirect(
        paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.TYPES_OF_MONITORING_NEEDED.replace(':orderId', order.id),
      )
    } else {
      req.flash('redirect', 'true')
      res.redirect(paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.MONITORING_TYPE.replace(':orderId', order.id))
    }
  }
}
