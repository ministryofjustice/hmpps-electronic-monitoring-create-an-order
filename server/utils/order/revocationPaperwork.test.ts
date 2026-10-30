import { createInterestedParties, createMonitoringConditions, getMockOrder } from '../../../test/mocks/mockOrder'
import usesRevocationPaperwork from './revocationPaperwork'

const order = (overrides = {}) =>
  getMockOrder({
    type: 'REVOCATION',
    interestedParties: createInterestedParties({ notifyingOrganisation: 'PROBATION' }),
    monitoringConditions: createMonitoringConditions({ startDate: '2020-01-01T00:00:00.000Z' }),
    ...overrides,
  })

describe('usesRevocationPaperwork', () => {
  it('is true for a past-dated probation revocation', () => {
    expect(usesRevocationPaperwork(order())).toBe(true)
  })

  it('is false for other service request types', () => {
    expect(usesRevocationPaperwork(order({ type: 'VARIATION' }))).toBe(false)
  })

  it('is false for other notifying organisations', () => {
    expect(
      usesRevocationPaperwork(
        order({ interestedParties: createInterestedParties({ notifyingOrganisation: 'CROWN_COURT' }) }),
      ),
    ).toBe(false)
  })

  it('is false when the start date is in the future', () => {
    expect(
      usesRevocationPaperwork(
        order({ monitoringConditions: createMonitoringConditions({ startDate: '2999-01-01T00:00:00.000Z' }) }),
      ),
    ).toBe(false)
  })
})
