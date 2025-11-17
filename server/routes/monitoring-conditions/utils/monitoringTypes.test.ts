import {
  createCurfewConditions,
  createEnforcementZoneCondition,
  createMonitoringConditionsAlcohol,
  createMonitoringConditionsAttendance,
  createMonitoringConditionsTrail,
  getMockOrder,
} from '../../../../test/mocks/mockOrder'
import { Order } from '../../../models/Order'
import { findMonitoringTypeById, getAllMonitoringTypes } from './monitoringTypes'

describe('monitoring type utils', () => {
  let order: Order
  beforeEach(() => {
    order = getMockOrder()
  })
  describe('findMonitoringTypeFromId', () => {
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
  describe('findAllMatchingMonitoringTypes', () => {
    it('returns an empty array if there are no matches', () => {
      const matches = getAllMonitoringTypes(order)
      expect(matches).toEqual([])
    })

    it('returns one monitoring type', () => {
      order.curfewConditions = createCurfewConditions({ id: 'curfewId' })
      const matches = getAllMonitoringTypes(order)
      expect(matches).toEqual([order.curfewConditions])
    })
    it('returns all monitoring types', () => {
      order.curfewConditions = createCurfewConditions({ id: 'curfewId' })
      order.monitoringConditionsTrail = createMonitoringConditionsTrail({ id: 'trailId' })
      order.monitoringConditionsAlcohol = createMonitoringConditionsAlcohol({ id: 'alcoholId' })
      const exclusionZone = createEnforcementZoneCondition({ id: 'exlcusionId' })
      order.enforcementZoneConditions.push(exclusionZone)
      const mandatoryAttendance = createMonitoringConditionsAttendance({ id: 'attendanceId' })
      order.mandatoryAttendanceConditions.push(mandatoryAttendance)

      const matches = getAllMonitoringTypes(order)

      expect(matches).toEqual([
        order.curfewConditions,
        order.monitoringConditionsTrail,
        order.monitoringConditionsAlcohol,
        exclusionZone,
        mandatoryAttendance,
      ])
    })
  })
})
