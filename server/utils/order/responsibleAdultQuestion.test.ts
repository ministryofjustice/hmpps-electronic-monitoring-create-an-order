import { createInterestedParties, getMockOrder } from '../../../test/mocks/mockOrder'
import { NotifyingOrganisation } from '../../models/NotifyingOrganisation'
import { NO_RESPONSIBLE_ADULT_REQUIRED, shouldAskResponsibleAdultQuestion } from './responsibleAdultQuestion'

const orderFrom = (notifyingOrganisation: NotifyingOrganisation, notifyingOrganisationName?: string | null) =>
  getMockOrder({ interestedParties: createInterestedParties({ notifyingOrganisation, notifyingOrganisationName }) })

describe('shouldAskResponsibleAdultQuestion', () => {
  it.each([
    ['YOUTH_CUSTODY_SERVICE', null, true],
    ['PRISON', 'FELTHAM_YOUNG_OFFENDER_INSTITUTION', true],
    ['PRISON', 'AYLESBURY_PRISON_AND_YOUNG_OFFENDER_INSTITUTION', true],
    ['PRISON', 'BEDFORD_PRISON', false],
    ['PRISON', null, false],
    ['YOUTH_COURT', null, false],
    ['PROBATION', null, false],
  ] as const)(
    'responsible adult question for %s / %s: %s',
    (notifyingOrganisation, notifyingOrganisationName, expected) => {
      expect(shouldAskResponsibleAdultQuestion(orderFrom(notifyingOrganisation, notifyingOrganisationName))).toBe(
        expected,
      )
    },
  )

  it('does not ask the question when the notifying organisation is not known', () => {
    expect(shouldAskResponsibleAdultQuestion(getMockOrder({ interestedParties: null }))).toBe(false)
  })

  it('answers "no responsible adult required" with an adult device wearer', () => {
    expect(NO_RESPONSIBLE_ADULT_REQUIRED).toEqual({ adultAtTimeOfInstallation: true })
  })
})
