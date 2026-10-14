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

  it('returns the cached gender risk details', () => {
    const result = RiskBehaviourViewModel.construct(['RISK_TO_GENDER'], 'Women')

    expect(result.genderRiskDetails.value).toEqual('Women')
  })

  it('shows the gender risk details validation error', () => {
    const result = RiskBehaviourViewModel.construct(['RISK_TO_GENDER'], '', [
      { field: 'genderRiskDetails', error: 'Enter something' },
    ])

    expect(result.genderRiskDetails.error).toEqual({ text: 'Enter something' })
  })

  it('shows the validation error and an error summary', () => {
    const result = RiskBehaviourViewModel.construct([], '', [{ field: 'possibleRisk', error: 'Select something' }])

    expect(result.possibleRisk.error).toEqual({ text: 'Select something' })
    expect(result.errorSummary?.errorList).toEqual([expect.objectContaining({ text: 'Select something' })])
  })
})
