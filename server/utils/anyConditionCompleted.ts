import { Order } from '../models/Order'

export default function anyConditionCompleted(order: Order): boolean {
  return (
    order.monitoringConditionsAlcohol?.startDate !== undefined ||
    order.curfewConditions?.startDate !== undefined ||
    order.monitoringConditionsTrail?.startDate !== undefined ||
    order.enforcementZoneConditions?.length !== 0 ||
    order.mandatoryAttendanceConditions?.length !== 0
  )
}
