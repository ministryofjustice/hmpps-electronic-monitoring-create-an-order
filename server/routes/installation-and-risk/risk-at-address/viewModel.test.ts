import RiskAtAddressViewModel from './viewModel'

describe('risk at address view model', () => {
  it('has no checked values when nothing is cached', () => {
    expect(RiskAtAddressViewModel.construct([]).riskCategory.values).toEqual([])
  })

  it('returns the cached risks as checked values', () => {
    const result = RiskAtAddressViewModel.construct(['DANGEROUS_ANIMALS', 'IOM'])

    expect(result.riskCategory.values).toEqual(['DANGEROUS_ANIMALS', 'IOM'])
  })

  it('shows the validation error and an error summary', () => {
    const result = RiskAtAddressViewModel.construct([], [{ field: 'riskCategory', error: 'Select something' }])

    expect(result.riskCategory.error).toEqual({ text: 'Select something' })
    expect(result.errorSummary?.errorList).toEqual([expect.objectContaining({ text: 'Select something' })])
  })
})
