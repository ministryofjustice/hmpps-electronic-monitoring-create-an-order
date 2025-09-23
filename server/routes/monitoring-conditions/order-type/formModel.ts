import { z } from 'zod'
import MonitoringConditionsModel from '../model'

export const OrderTypeFormDataModel = z.object({
  action: z.string(),
  orderType: MonitoringConditionsModel.shape.orderType,
})

export default OrderTypeFormDataModel
