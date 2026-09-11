import getContent from '../../i18n'
import FeatureFlags from '../../utils/featureFlags'
import { getMockOrder } from '../../../test/mocks/mockOrder'
import createViewModel from './riskInformationCheckAnswers'

describe('risk information check answers view model', () => {
  beforeEach(() => {
    jest.spyOn(FeatureFlags.getInstance(), 'get').mockReturnValue(true)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('shows only the questions asked for a court order', () => {
    const order = getMockOrder({
      dataDictionaryVersion: 'DDV6',
      interestedParties: {
        ...getMockOrder().interestedParties!,
        notifyingOrganisation: 'CIVIL_COUNTY_COURT',
      },
      detailsOfInstallation: {
        riskCategory: ['RISK_TO_GENDER', 'IOM'],
        genderRiskDetails: 'Women',
        riskDetails: 'some risk details',
      },
      offences: [{ offenceType: 'SEXUAL_OFFENCES' }],
      offenceAdditionalDetails: { additionalDetails: 'stale offence details' },
    })

    const viewModel = createViewModel(order, getContent('en', 'DDV6'), true)

    expect(viewModel.riskInformation.map(answer => answer.key.text)).toEqual([
      "At installation what are the possible risks from the device wearer's behaviour?",
      'What sex or gender are they a risk to?',
      'What are the possible risks at the installation address? (optional)',
      'Any other risks to be aware of? (optional)',
    ])
  })

  it('shows standard risk questions before offence questions', () => {
    const order = getMockOrder({
      dataDictionaryVersion: 'DDV6',
      interestedParties: {
        ...getMockOrder().interestedParties!,
        notifyingOrganisation: 'PRISON',
      },
      detailsOfInstallation: {
        riskCategory: ['RISK_TO_GENDER', 'IOM'],
        genderRiskDetails: 'Women',
        riskDetails: 'some risk details',
      },
      offences: [{ offenceType: 'SEXUAL_OFFENCES' }],
      offenceAdditionalDetails: { additionalDetails: 'some offence details' },
    })

    const viewModel = createViewModel(order, getContent('en', 'DDV6'), true)

    expect(viewModel.riskInformation.map(answer => answer.key.text)).toEqual([
      "At installation what are the possible risks from the device wearer's behaviour?",
      'What sex or gender are they a risk to?',
      'What are the possible risks at the installation address? (optional)',
      'Any other risks to be aware of? (optional)',
      'What type of offence did the device wearer commit?',
      'Any other information to be aware of about the offence committed?',
    ])
  })
})
