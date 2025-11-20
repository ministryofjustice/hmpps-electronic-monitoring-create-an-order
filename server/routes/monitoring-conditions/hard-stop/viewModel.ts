import { MonitoringConditions } from '../model'
import { Order } from '../../../models/Order'

export type HardStopModel = {
  hardStopText: string
  order: {
    id: string
  }
}

const constructModel = (order: Order, data: MonitoringConditions): HardStopModel => {
  const hardStopText: string = data.offenceType
    ? "To be eligible for the acquisitive crime pilot the device wearer's release address must be in an in-scope police force area."
    : 'To be eligible for the acquisitive crime pilot the device wearer must have committed an acquisitive offence.'

  return {
    hardStopText,
    order: {
      id: order.id,
    },
  }
}

export default constructModel
