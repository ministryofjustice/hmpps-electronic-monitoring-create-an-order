import { Handler, Request, Response } from 'express'
import Model, { MonitoringTypeData, MonitoringType } from './viewModel'
import { Order } from '../../../models/Order'

export default class RemoveMonitoringTypeController {
  constructor() {}

  view: Handler = (req: Request, res: Response) => {
    const { monitoringTypeId } = req.params
    const { order } = req
    if (!order) {
      res.status(400).send('Order not found on request')
      return
    }

    const monitoringTypeData = this.findMonitoringType(order, monitoringTypeId)

    if (monitoringTypeData === undefined) {
      res.status(404).send(`No matching monitoring type: ${monitoringTypeId}`)
      return
    }

    const model = Model.construct(monitoringTypeData)

    res.render('pages/order/monitoring-conditions/remove-monitoring-type', model)
  }

  private findMonitoringType = (order: Order, monitoringTypeId: string): MonitoringTypeData | undefined => {
    const allPossibleMatches = MONITORING_TYPE_KEYS.map(key => {
      const propertyValue = order[key]

      if (!propertyValue) {
        return undefined
      }

      let match: MonitoringType | undefined

      if (Array.isArray(propertyValue)) {
        match = propertyValue.find(type => type.id === monitoringTypeId)
      } else if (propertyValue.id === monitoringTypeId) {
        match = propertyValue
      }

      if (match) {
        return {
          type: MONITORING_KEY_TO_TYPE[key],
          monitoringType: match,
        }
      }

      return undefined
    })

    return allPossibleMatches.find(item => item !== undefined)
  }
}

const MONITORING_TYPE_KEYS = [
  'curfewConditions',
  'enforcementZoneConditions',
  'monitoringConditionsTrail',
  'mandatoryAttendanceConditions',
  'monitoringConditionsAlcohol',
] as const

type MonitoringKey = (typeof MONITORING_TYPE_KEYS)[number]

const MONITORING_KEY_TO_TYPE: Record<MonitoringKey, MonitoringTypeData['type']> = {
  curfewConditions: 'Curfew',
  enforcementZoneConditions: 'Exclusion zone monitoring',
  monitoringConditionsTrail: 'Trail monitoring',
  mandatoryAttendanceConditions: 'Mandatory attendance monitoring',
  monitoringConditionsAlcohol: 'Alcohol monitoring',
}
