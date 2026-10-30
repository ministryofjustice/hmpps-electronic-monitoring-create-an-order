import { createInterestedParties, getMockOrder } from '../../../test/mocks/mockOrder'
import { NotifyingOrganisation, notifyingOrganisations } from '../../models/NotifyingOrganisation'
import { NO_RESPONSIBLE_ADULT_REQUIRED, shouldAskResponsibleAdultQuestion } from './responsibleAdultQuestion'

const orderFrom = (notifyingOrganisation: NotifyingOrganisation) =>
  getMockOrder({ interestedParties: createInterestedParties({ notifyingOrganisation }) })

describe('shouldAskResponsibleAdultQuestion', () => {
  const youthOrPrison: NotifyingOrganisation[] = ['YOUTH_CUSTODY_SERVICE', 'YOUTH_COURT', 'PRISON']

  it.each(youthOrPrison)('asks the question for %s orders', notifyingOrganisation => {
    expect(shouldAskResponsibleAdultQuestion(orderFrom(notifyingOrganisation))).toBe(true)
  })

  it.each(notifyingOrganisations.filter(org => !youthOrPrison.includes(org)))(
    'does not ask the question for %s orders',
    notifyingOrganisation => {
      expect(shouldAskResponsibleAdultQuestion(orderFrom(notifyingOrganisation))).toBe(false)
    },
  )

  it('does not ask the question when the notifying organisation is not known', () => {
    expect(shouldAskResponsibleAdultQuestion(getMockOrder({ interestedParties: null }))).toBe(false)
  })

  it('answers "no responsible adult required" with an adult device wearer', () => {
    expect(NO_RESPONSIBLE_ADULT_REQUIRED).toEqual({ adultAtTimeOfInstallation: true })
  })
})
