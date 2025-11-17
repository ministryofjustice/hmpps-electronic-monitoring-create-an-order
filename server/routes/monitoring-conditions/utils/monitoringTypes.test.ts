import {
  createCurfewConditions,
  createEnforcementZoneCondition,
  createMonitoringConditionsAlcohol,
  createMonitoringConditionsAttendance,
  createMonitoringConditionsTrail,
  getMockOrder,
} from '../../../../test/mocks/mockOrder'
import { Order } from '../../../models/Order'
import { findMonitoringTypeById } from './monitoringTypes'

describe('monitoring type utils', () => {
  describe('findMonitoringTypeFromId', () => {
    let order: Order
    beforeEach(() => {
      order = getMockOrder()
    })

    it('returns undefined if there is no match', () => {
      const match = findMonitoringTypeById(order, 'some id')
      expect(match).toBeUndefined()
    })

    it('returns a match to curfew', () => {
      order.curfewConditions = createCurfewConditions({ id: 'curfewId' })
      const match = findMonitoringTypeById(order, 'curfewId')
      expect(match).toEqual({ monitoringType: order.curfewConditions, type: 'Curfew' })
    })

    it('returns a match to trail', () => {
      order.monitoringConditionsTrail = createMonitoringConditionsTrail({ id: 'trailId' })
      const match = findMonitoringTypeById(order, 'trailId')
      expect(match).toEqual({ monitoringType: order.monitoringConditionsTrail, type: 'Trail monitoring' })
    })

    it('returns a match to alcohol', () => {
      order.monitoringConditionsAlcohol = createMonitoringConditionsAlcohol({ id: 'alcoholId' })
      const match = findMonitoringTypeById(order, 'alcoholId')
      expect(match).toEqual({ monitoringType: order.monitoringConditionsAlcohol, type: 'Alcohol monitoring' })
    })

    it('returns a match to exclusion zone', () => {
      const exclusionZone = createEnforcementZoneCondition({ id: 'exlcusionId' })
      order.enforcementZoneConditions.push(exclusionZone)
      const match = findMonitoringTypeById(order, 'exlcusionId')
      expect(match).toEqual({ monitoringType: exclusionZone, type: 'Exclusion zone monitoring' })
    })

    it('returns a match to mandatory attendance', () => {
      const mandatoryAttendance = createMonitoringConditionsAttendance({ id: 'attendanceId' })
      order.mandatoryAttendanceConditions.push(mandatoryAttendance)
      const match = findMonitoringTypeById(order, 'attendanceId')
      expect(match).toEqual({ monitoringType: mandatoryAttendance, type: 'Mandatory attendance monitoring' })
    })
  })
})
