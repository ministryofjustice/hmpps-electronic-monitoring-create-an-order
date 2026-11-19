import getContent from '../../../i18n'
import FeatureFlags from '../../../utils/featureFlags'
import { getMockOrder } from '../../../../test/mocks/mockOrder'
import paths from '../../../constants/paths'
import createViewModel from './viewModel'

describe('risk information check answers view model', () => {
  beforeEach(() => {
    jest.spyOn(FeatureFlags.getInstance(), 'get').mockReturnValue(true)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it.each(['SUBMITTED', 'ERROR', 'REJECTED'] as const)('hides change links for %s orders', status => {
    const order = getMockOrder({ status, isOwner: true, dataDictionaryVersion: 'DDV6' })

    const model = createViewModel(order, getContent('en', 'DDV6'), false)

    expect(model.riskInformation.length).toBeGreaterThan(0)
    expect(model.riskInformation.every(answer => answer.actions.items.length === 0)).toBe(true)
  })

  it('hides change links for drafts owned by another user', () => {
    const order = getMockOrder({ status: 'IN_PROGRESS', isOwner: false, dataDictionaryVersion: 'DDV6' })

    const model = createViewModel(order, getContent('en', 'DDV6'), false)

    expect(model.riskInformation.every(answer => answer.actions.items.length === 0)).toBe(true)
  })

  it('shows explicit negative risk selections', () => {
    const order = getMockOrder({
      dataDictionaryVersion: 'DDV6',
      detailsOfInstallation: { riskCategory: ['NO_RISK', 'NO_RISK_AT_ADDRESS'], riskDetails: '' },
    })

    const model = createViewModel(order, getContent('en', 'DDV6'), true)

    expect(model.riskInformation[0].value.html).toBe('There are no risks that the installer should be aware of')
    expect(model.riskInformation[1].value.html).toBe('No risk at the address')
    expect(model.riskInformation[2].value.text).toBe('No')
  })

  it.each(['saved-offence-details-id', undefined])(
    'displays No only for a saved empty offence-details answer (id=%s)',
    id => {
      const order = getMockOrder({
        dataDictionaryVersion: 'DDV6',
        offenceAdditionalDetails: { id, additionalDetails: '' },
      })

      const model = createViewModel(order, getContent('en', 'DDV6'), true)
      const row = model.riskInformation.find(
        answer => answer.key.text === 'Any other information to be aware of about the offence committed?',
      )

      expect(row?.value.text).toBe(id ? 'No' : '')
    },
  )

  it('leaves unanswered other risks blank', () => {
    const order = getMockOrder({ dataDictionaryVersion: 'DDV6', detailsOfInstallation: null })

    const model = createViewModel(order, getContent('en', 'DDV6'), true)
    const row = model.riskInformation.find(answer => answer.key.text === 'Are there other risks to be aware of?')

    expect(row?.value.text).toBe('')
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
      'At installation what are the possible risks at the address?',
      'Are there other risks to be aware of?',
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
      'At installation what are the possible risks at the address?',
      'Are there other risks to be aware of?',
      'What type of offence did the device wearer commit?',
      'Any other information to be aware of about the offence committed?',
    ])
  })

  describe('possible risk change link', () => {
    const question = "At installation what are the possible risks from the device wearer's behaviour?"
    const order = getMockOrder({
      dataDictionaryVersion: 'DDV6',
      detailsOfInstallation: { riskCategory: ['RISK_TO_GENDER'], genderRiskDetails: 'Women', riskDetails: '' },
    })
    const changeHref = () => {
      const row = createViewModel(order, getContent('en', 'DDV6'), true).riskInformation.find(
        answer => answer.key.text === question,
      )
      return row?.actions?.items[0]?.href
    }

    it('links to the risk behaviour page', () => {
      expect(changeHref()).toBe(paths.INSTALLATION_AND_RISK.RISK_BEHAVIOUR.replace(':orderId', order.id))
    })
  })

  describe('risk at address change link', () => {
    const questions = [
      'At installation what are the possible risks at the address?',
      'What are the possible risks at the installation address? (optional)',
    ]
    const order = getMockOrder({
      dataDictionaryVersion: 'DDV6',
      detailsOfInstallation: { riskCategory: ['DANGEROUS_ANIMALS'], riskDetails: '' },
    })
    const changeHref = () => {
      const row = createViewModel(order, getContent('en', 'DDV6'), true).riskInformation.find(answer =>
        questions.includes(answer.key.text),
      )
      return row?.actions?.items[0]?.href
    }

    it('links to the risk at address page', () => {
      expect(changeHref()).toBe(paths.INSTALLATION_AND_RISK.RISK_AT_ADDRESS.replace(':orderId', order.id))
    })
  })

  describe('risk at address label', () => {
    const order = getMockOrder({
      dataDictionaryVersion: 'DDV6',
      detailsOfInstallation: { riskCategory: ['DANGEROUS_ANIMALS'], riskDetails: '' },
    })
    const keys = () => createViewModel(order, getContent('en', 'DDV6'), true).riskInformation.map(a => a.key.text)

    it('uses the mandatory question text when the flow is enabled', () => {
      expect(keys()).toContain('At installation what are the possible risks at the address?')
      expect(keys()).not.toContain('What are the possible risks at the installation address? (optional)')
    })
  })

  describe('other risks row', () => {
    const optionalQuestion = 'Any other risks to be aware of? (optional)'
    const question = 'Are there other risks to be aware of?'
    const buildOrder = (riskDetails: string) =>
      getMockOrder({
        dataDictionaryVersion: 'DDV6',
        detailsOfInstallation: { riskCategory: ['DANGEROUS_ANIMALS'], riskDetails },
      })
    const rows = (order: ReturnType<typeof buildOrder>) =>
      createViewModel(order, getContent('en', 'DDV6'), true).riskInformation

    describe('when the risk information flow is enabled', () => {
      it('shows the entered risk details with a link to the other risks page', () => {
        const order = buildOrder('some risk details')
        const row = rows(order).find(answer => answer.key.text === question)

        expect(row?.value.text).toBe('some risk details')
        expect(row?.actions?.items[0]?.href).toBe(paths.INSTALLATION_AND_RISK.OTHER_RISKS.replace(':orderId', order.id))
        expect(rows(order).map(answer => answer.key.text)).not.toContain(optionalQuestion)
      })

      it('shows No when there are no risk details', () => {
        const row = rows(buildOrder('')).find(answer => answer.key.text === question)

        expect(row?.value.text).toBe('No')
      })
    })
  })

  describe('gender risk details change link', () => {
    const question = 'What sex or gender are they a risk to?'
    const order = getMockOrder({
      dataDictionaryVersion: 'DDV6',
      detailsOfInstallation: { riskCategory: ['RISK_TO_GENDER'], genderRiskDetails: 'Women', riskDetails: '' },
    })
    const changeHref = () => {
      const row = createViewModel(order, getContent('en', 'DDV6'), true).riskInformation.find(
        answer => answer.key.text === question,
      )
      return row?.actions?.items[0]?.href
    }

    it('links to the risk behaviour page', () => {
      expect(changeHref()).toBe(paths.INSTALLATION_AND_RISK.RISK_BEHAVIOUR.replace(':orderId', order.id))
    })
  })
})
