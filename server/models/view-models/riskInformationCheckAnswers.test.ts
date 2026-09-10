import { getMockOrder } from '../../../test/mocks/mockOrder'
import getContent from '../../i18n'
import { Locales } from '../../types/i18n/locale'
import FeatureFlags from '../../utils/featureFlags'
import createViewModel from './riskInformationCheckAnswers'

describe('riskInformationCheckAnswers', () => {
  beforeEach(() => {
    jest.spyOn(FeatureFlags.getInstance(), 'get').mockImplementation(flag => flag === 'OFFENCE_FLOW_ENABLED')
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('shows the fixed offence without actions for a non-Family court', () => {
    const order = getMockOrder({
      dataDictionaryVersion: 'DDV6',
      interestedParties: {
        ...getMockOrder().interestedParties!,
        notifyingOrganisation: 'CIVIL_COUNTY_COURT',
      },
      offences: [{ offenceType: 'VIOLENCE_AGAINST_THE_PERSON', offenceDate: null }],
    })

    const model = createViewModel(order, getContent(Locales.en, 'DDV6'), true)
    const offenceAnswer = model.riskInformation.find(answer => answer.key.text === 'Offences')

    expect(offenceAnswer).toEqual({
      key: { text: 'Offences' },
      value: { html: 'Violence against the person' },
      actions: { items: [] },
    })
    expect(model.riskInformation.find(answer => answer.key.text.includes('other information'))).toBeUndefined()
  })

  it('does not show offences or DAPO clauses for Family Court', () => {
    const order = getMockOrder({
      dataDictionaryVersion: 'DDV6',
      interestedParties: {
        ...getMockOrder().interestedParties!,
        notifyingOrganisation: 'FAMILY_COURT',
      },
      dapoClauses: [{ clause: '12', date: '2025-01-01T00:00:00.000Z' }],
    })

    const model = createViewModel(order, getContent(Locales.en, 'DDV6'), true)
    const answerKeys = model.riskInformation.map(answer => answer.key.text)

    expect(answerKeys).not.toContain('Offences')
    expect(answerKeys).not.toContain('DAPO order clauses')
    expect(answerKeys).not.toContain('Any other information to be aware of about the offence committed?')
  })

  it('lists risk answers before offence answers', () => {
    const order = getMockOrder({
      dataDictionaryVersion: 'DDV6',
      interestedParties: {
        ...getMockOrder().interestedParties!,
        notifyingOrganisation: 'PRISON',
      },
      offences: [{ offenceType: 'VIOLENCE_AGAINST_THE_PERSON', offenceDate: null }],
    })

    const model = createViewModel(order, getContent(Locales.en, 'DDV6'), true)
    const answerKeys = model.riskInformation.map(answer => answer.key.text)

    const lastRiskIndex = answerKeys.lastIndexOf(
      getContent(Locales.en, 'DDV6').pages.installationAndRisk.questions.riskDetails.text,
    )
    const firstOffenceIndex = answerKeys.findIndex(key => key.includes('offence'))

    expect(lastRiskIndex).toBeGreaterThan(-1)
    expect(firstOffenceIndex).toBeGreaterThan(lastRiskIndex)
  })
})
