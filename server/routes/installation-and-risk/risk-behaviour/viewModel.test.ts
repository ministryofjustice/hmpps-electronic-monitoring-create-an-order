import RiskBehaviourViewModel from './viewModel'

describe('risk behaviour view model', () => {
  it('has no checked values when nothing is cached', () => {
    const result = RiskBehaviourViewModel.construct([])

    expect(result.possibleRisk.values).toEqual([])
  })

  it('returns the cached possible risks as checked values', () => {
    const result = RiskBehaviourViewModel.construct(['THREATS_OF_VIOLENCE', 'SEXUAL_OFFENCES'])

    expect(result.possibleRisk.values).toEqual(['THREATS_OF_VIOLENCE', 'SEXUAL_OFFENCES'])
  })
})
