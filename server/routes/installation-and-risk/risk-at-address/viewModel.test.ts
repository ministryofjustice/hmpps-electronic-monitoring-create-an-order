import RiskAtAddressViewModel from './viewModel'
import getContent from '../../../i18n'
import { Locales } from '../../../types/i18n/locale'

describe('risk at address view model', () => {
  const { riskCategories } = getContent(Locales.en, 'DDV5').reference

  it('has no checked values when nothing is cached', () => {
    expect(RiskAtAddressViewModel.construct([], riskCategories, false).riskCategory.values).toEqual([])
  })

  it('returns the cached risks as checked values', () => {
    const result = RiskAtAddressViewModel.construct(['DANGEROUS_ANIMALS', 'IOM'], riskCategories, false)

    expect(result.riskCategory.values).toEqual(['DANGEROUS_ANIMALS', 'IOM'])
  })

  it('lists the risk categories without diversity concerns', () => {
    const { items } = RiskAtAddressViewModel.construct([], riskCategories, false).riskCategory

    expect(items.map(item => item.value)).not.toContain('DIVERSITY_CONCERNS')
    expect(items[0]).toEqual({
      value: 'HISTORY_OF_SUBSTANCE_ABUSE',
      text: 'History of substance abuse',
      disabled: false,
    })
  })

  it('makes no risk and unknown risk exclusive options, each after an "or" divider', () => {
    const { items } = RiskAtAddressViewModel.construct([], riskCategories, false).riskCategory

    expect(items.slice(-4)).toEqual([
      { value: '', divider: 'or' },
      { value: 'NO_RISK_AT_ADDRESS', text: 'No risk at the address', disabled: false, behaviour: 'exclusive' },
      { value: '', divider: 'or' },
      {
        value: 'RISK_AT_ADDRESS_UNKNOWN',
        text: 'Not able to provide this information',
        disabled: false,
        behaviour: 'exclusive',
      },
    ])
  })

  it('disables the options when the order cannot be edited', () => {
    const { items } = RiskAtAddressViewModel.construct([], riskCategories, true).riskCategory

    expect(items.filter(item => 'text' in item).every(item => item.disabled)).toBe(true)
  })

  it('shows the validation error and an error summary', () => {
    const result = RiskAtAddressViewModel.construct([], riskCategories, false, [
      { field: 'riskCategory', error: 'Select something' },
    ])

    expect(result.riskCategory.error).toEqual({ text: 'Select something' })
    expect(result.errorSummary?.errorList).toEqual([expect.objectContaining({ text: 'Select something' })])
  })
})
