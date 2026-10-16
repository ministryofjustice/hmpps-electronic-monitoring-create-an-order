import RiskAtAddressViewModel from './viewModel'

describe('risk at address view model', () => {
  it('has no checked values when nothing is cached', () => {
    expect(RiskAtAddressViewModel.construct([]).riskCategory.values).toEqual([])
  })

  it('returns the cached risks as checked values', () => {
    const result = RiskAtAddressViewModel.construct(['DANGEROUS_ANIMALS', 'IOM'])

    expect(result.riskCategory.values).toEqual(['DANGEROUS_ANIMALS', 'IOM'])
  })
})
