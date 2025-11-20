import { Response } from 'express'
import paths from '../../../constants/paths'
import { Order } from '../../../models/Order'
import MonitoringConditionsUpdateService from '../monitoringConditionsService'
import MonitoringConditionsStoreService from '../monitoringConditionsStoreService'
import FeatureFlags from '../../../utils/featureFlags'

export default abstract class MonitoringConditionsBaseController {
  constructor(
    protected readonly montoringConditionsStoreService: MonitoringConditionsStoreService,
    protected readonly monitoringConditionsService: MonitoringConditionsUpdateService,
  ) {}

  async UpdateMonitoringConditionAndGoToMonitoringTypePage(order: Order, res: Response) {
    if (FeatureFlags.getInstance().get('LIST_MONITORING_CONDITION_FLOW_ENABLED')) {
      const data = await this.montoringConditionsStoreService.getMonitoringConditions(order)
      await this.monitoringConditionsService.updateMonitoringConditions({
        data,
        accessToken: res.locals.user.token,
        orderId: order.id,
      })

      res.redirect(paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.MONITORING_TYPE.replace(':orderId', order.id))
    } else {
      res.redirect(paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.MONITORING_TYPES.replace(':orderId', order.id))
    }
  }
}
