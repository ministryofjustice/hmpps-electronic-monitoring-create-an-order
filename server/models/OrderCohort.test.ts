import { getOrderCohort } from './OrderCohort'

describe('getOrderCohort', () => {
  it.each([
    ['PRISON', 'STANDARD'],
    ['PROBATION', 'STANDARD'],
    ['YOUTH_CUSTODY_SERVICE', 'STANDARD'],
    ['HOME_OFFICE', 'HOME_OFFICE'],
    ['CIVIL_COUNTY_COURT', 'COURT'],
    ['FAMILY_COURT', 'FAMILY_COURT'],
  ] as const)('maps %s to %s', (notifyingOrganisation, cohort) => {
    expect(getOrderCohort(notifyingOrganisation)).toBe(cohort)
  })

  it('defaults to standard before the notifying organisation is selected', () => {
    expect(getOrderCohort(undefined)).toBe('STANDARD')
  })
})
