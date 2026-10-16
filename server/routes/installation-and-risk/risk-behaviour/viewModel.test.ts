import RiskBehaviourViewModel from './viewModel'
import getContent from '../../../i18n'
import { Locales } from '../../../types/i18n/locale'

describe('risk behaviour view model', () => {
  const { possibleRisks } = getContent(Locales.en, 'DDV6').reference

  it('has no checked values when nothing is cached', () => {
    const result = RiskBehaviourViewModel.construct([], '', possibleRisks, false)

    expect(result.possibleRisk.values).toEqual([])
  })

  it('returns the cached possible risks as checked values', () => {
    const result = RiskBehaviourViewModel.construct(
      ['THREATS_OF_VIOLENCE', 'SEXUAL_OFFENCES'],
      '',
      possibleRisks,
      false,
    )

    expect(result.possibleRisk.values).toEqual(['THREATS_OF_VIOLENCE', 'SEXUAL_OFFENCES'])
  })

  it('lists the possible risks with no risk as an exclusive option after an "or" divider', () => {
    const { items } = RiskBehaviourViewModel.construct([], '', possibleRisks, false).possibleRisk

    expect(items[0]).toEqual({
      value: 'HOMOPHOBIC_VIEWS',
      text: 'Offensive towards someone because of their sexual orientation',
      disabled: false,
    })
    expect(items.slice(-2)).toEqual([
      { value: '', divider: 'or' },
      {
        value: 'NO_RISK',
        text: 'There are no risks that the installer should be aware of',
        disabled: false,
        behaviour: 'exclusive',
      },
    ])
  })

  it('disables the options when the order cannot be edited', () => {
    const { items } = RiskBehaviourViewModel.construct([], '', possibleRisks, true).possibleRisk

    expect(items.filter(item => 'text' in item).every(item => item.disabled)).toBe(true)
  })

  it('returns the cached gender risk details', () => {
    const result = RiskBehaviourViewModel.construct(['RISK_TO_GENDER'], 'Women', possibleRisks, false)

    expect(result.genderRiskDetails.value).toEqual('Women')
  })

  it('shows the gender risk details validation error', () => {
    const result = RiskBehaviourViewModel.construct(['RISK_TO_GENDER'], '', possibleRisks, false, [
      { field: 'genderRiskDetails', error: 'Enter something' },
    ])

    expect(result.genderRiskDetails.error).toEqual({ text: 'Enter something' })
  })

  it('shows the validation error and an error summary', () => {
    const result = RiskBehaviourViewModel.construct([], '', possibleRisks, false, [
      { field: 'possibleRisk', error: 'Select something' },
    ])

    expect(result.possibleRisk.error).toEqual({ text: 'Select something' })
    expect(result.errorSummary?.errorList).toEqual([expect.objectContaining({ text: 'Select something' })])
  })
})
