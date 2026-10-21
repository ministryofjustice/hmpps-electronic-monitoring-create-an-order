import { createMonitoringConditions, getMockOrder } from '../../test/mocks/mockOrder'
import { isPastDatedVariation, isStartDateInPast } from './orderStartDate'

const now = new Date('2026-06-15T12:00:00.000Z')

const orderStarting = (startDate: string | null, overrides = {}) =>
  getMockOrder({ monitoringConditions: createMonitoringConditions({ startDate }), ...overrides })

describe('isStartDateInPast', () => {
  it('returns true when the start date is before now', () => {
    expect(isStartDateInPast(orderStarting('2026-06-15T11:59:59.999Z'), { now })).toBe(true)
  })

  it('returns false when the start date is after now', () => {
    expect(isStartDateInPast(orderStarting('2026-06-15T12:00:00.001Z'), { now })).toBe(false)
  })

  it('returns false when the start date is equal to now', () => {
    expect(isStartDateInPast(orderStarting('2026-06-15T12:00:00.000Z'), { now })).toBe(false)
  })

  it('returns false when there is no start date by default', () => {
    expect(isStartDateInPast(orderStarting(null), { now })).toBe(false)
  })

  it('returns true when there is no start date and missing dates are treated as past', () => {
    expect(isStartDateInPast(orderStarting(null), { now, treatMissingAsPast: true })).toBe(true)
  })
})

describe('isPastDatedVariation', () => {
  it('returns true for a variation with a start date in the past', () => {
    expect(isPastDatedVariation(orderStarting('2026-01-01T00:00:00.000Z', { type: 'VARIATION' }), { now })).toBe(true)
  })

  it('returns false for a variation with a start date in the future', () => {
    expect(isPastDatedVariation(orderStarting('2027-01-01T00:00:00.000Z', { type: 'VARIATION' }), { now })).toBe(false)
  })

  it('returns false for a non-variation with a start date in the past', () => {
    expect(isPastDatedVariation(orderStarting('2026-01-01T00:00:00.000Z', { type: 'REQUEST' }), { now })).toBe(false)
  })

  it('applies the missing start date option', () => {
    const order = orderStarting(null, { type: 'VARIATION' })

    expect(isPastDatedVariation(order, { now })).toBe(false)
    expect(isPastDatedVariation(order, { now, treatMissingAsPast: true })).toBe(true)
  })
})
