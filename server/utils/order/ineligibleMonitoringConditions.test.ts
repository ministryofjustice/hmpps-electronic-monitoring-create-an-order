import { Order } from '../../models/Order'
import getIneligibleMonitoringConditionsErrors, { ineligibleMonitoringMessages } from './ineligibleMonitoringConditions'

const buildOrder = (overrides: Record<string, unknown> = {}, notifyingOrganisation = 'PRISON', noFixedAbode = true) =>
  ({
    deviceWearer: { noFixedAbode, adultAtTimeOfInstallation: true },
    interestedParties: { notifyingOrganisation },
    curfewConditions: null,
    mandatoryAttendanceConditions: [],
    enforcementZoneConditions: [],
    monitoringConditionsTrail: null,
    monitoringConditionsAlcohol: null,
    ...overrides,
  }) as unknown as Order

const condition = { startDate: '2025-01-01' }

describe('getIneligibleMonitoringConditionsErrors', () => {
  it('returns no errors when there are no conditions', () => {
    expect(getIneligibleMonitoringConditionsErrors(buildOrder())).toEqual([])
  })

  describe('no fixed abode, not Home Office', () => {
    it.each([
      ['curfew', { curfewConditions: condition }],
      ['mandatory attendance', { mandatoryAttendanceConditions: [condition] }],
      ['enforcement zone', { enforcementZoneConditions: [condition] }],
      ['trail', { monitoringConditionsTrail: condition }],
    ])('is invalid with %s', (_, overrides) => {
      expect(getIneligibleMonitoringConditionsErrors(buildOrder(overrides))).toEqual([
        ineligibleMonitoringMessages.noFixedAbode,
      ])
    })

    it('allows alcohol monitoring', () => {
      expect(getIneligibleMonitoringConditionsErrors(buildOrder({ monitoringConditionsAlcohol: condition }))).toEqual(
        [],
      )
    })
  })

  describe('no fixed abode, Home Office', () => {
    it.each([
      ['curfew', { curfewConditions: condition }],
      ['mandatory attendance', { mandatoryAttendanceConditions: [condition] }],
    ])('is invalid with %s', (_, overrides) => {
      expect(getIneligibleMonitoringConditionsErrors(buildOrder(overrides, 'HOME_OFFICE'))).toEqual([
        ineligibleMonitoringMessages.noFixedAbodeHomeOffice,
      ])
    })

    it.each([
      ['enforcement zone', { enforcementZoneConditions: [condition] }],
      ['trail', { monitoringConditionsTrail: condition }],
      ['alcohol', { monitoringConditionsAlcohol: condition }],
    ])('allows %s', (_, overrides) => {
      expect(getIneligibleMonitoringConditionsErrors(buildOrder(overrides, 'HOME_OFFICE'))).toEqual([])
    })
  })

  it('allows any conditions when the device wearer has a fixed abode', () => {
    const order = buildOrder({ curfewConditions: condition, monitoringConditionsTrail: condition }, 'PRISON', false)
    expect(getIneligibleMonitoringConditionsErrors(order)).toEqual([])
  })

  describe('youth', () => {
    it('is invalid with alcohol monitoring', () => {
      const order = buildOrder({ monitoringConditionsAlcohol: condition }, 'PRISON', false)
      order.deviceWearer.adultAtTimeOfInstallation = false
      expect(getIneligibleMonitoringConditionsErrors(order)).toEqual([ineligibleMonitoringMessages.youthAlcohol])
    })

    it('does not treat an unanswered adult question as youth', () => {
      const order = buildOrder({ monitoringConditionsAlcohol: condition }, 'PRISON', false)
      order.deviceWearer.adultAtTimeOfInstallation = null
      expect(getIneligibleMonitoringConditionsErrors(order)).toEqual([])
    })
  })

  it('returns every applicable error', () => {
    const order = buildOrder({ curfewConditions: condition, monitoringConditionsAlcohol: condition })
    order.deviceWearer.adultAtTimeOfInstallation = false
    expect(getIneligibleMonitoringConditionsErrors(order)).toEqual([
      ineligibleMonitoringMessages.noFixedAbode,
      ineligibleMonitoringMessages.youthAlcohol,
    ])
  })
})
