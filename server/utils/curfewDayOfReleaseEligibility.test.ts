import { createInterestedParties, createMonitoringConditions, getMockOrder } from '../../test/mocks/mockOrder'
import shouldShowCurfewDayOfRelease from './curfewDayOfReleaseEligibility'

describe('shouldShowCurfewDayOfRelease', () => {
  it('returns false when the notifying organisation is not prison or youth custody service', () => {
    const order = getMockOrder({
      interestedParties: createInterestedParties({ notifyingOrganisation: 'PROBATION' }),
    })

    expect(shouldShowCurfewDayOfRelease(order)).toBe(false)
  })

  it('returns true when the notifying organisation is prison and no start date has been set yet', () => {
    const order = getMockOrder({
      interestedParties: createInterestedParties({ notifyingOrganisation: 'PRISON' }),
    })

    expect(shouldShowCurfewDayOfRelease(order)).toBe(true)
  })

  it('returns false when the notifying organisation is prison but the monitoring conditions start date is in the past', () => {
    const order = getMockOrder({
      interestedParties: createInterestedParties({ notifyingOrganisation: 'PRISON' }),
      monitoringConditions: createMonitoringConditions({ startDate: '2020-01-01T00:00:00.000Z' }),
    })

    expect(shouldShowCurfewDayOfRelease(order)).toBe(false)
  })
})
