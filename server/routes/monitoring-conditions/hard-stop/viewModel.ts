import { MonitoringConditions } from '../model'
import { Order } from '../../../models/Order'

export type HardStopModel = {
  hardStopText: string
  order: {
    id: string
  }
}

const getHardStopText = (data: MonitoringConditions) => {
  if (data.offenceType === 'They did not commit one of these offences') {
    return 'To be eligible for the acquisitive crime pilot the device wearer must have committed an acquisitive offence.'
  }
  if (data.policeArea === "The device wearer's release address is in a different police force area") {
    return "To be eligible for the acquisitive crime pilot the device wearer's release address must be in an in-scope police force area."
  }
  return ''
}

const constructModel = (order: Order, data: MonitoringConditions): HardStopModel => {
  return {
    hardStopText: getHardStopText(data),
    order: {
      id: order.id,
    },
  }
}

export default constructModel
