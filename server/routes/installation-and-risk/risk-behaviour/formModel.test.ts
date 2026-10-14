import RiskBehaviourFormModel from './formModel'

describe('risk behaviour form model', () => {
  it('wraps a single selection in an array', () => {
    expect(RiskBehaviourFormModel.parse({ action: 'continue', possibleRisk: 'SEXUAL_OFFENCES' }).possibleRisk).toEqual([
      'SEXUAL_OFFENCES',
    ])
  })

  it('keeps multiple selections', () => {
    const result = RiskBehaviourFormModel.parse({
      action: 'continue',
      possibleRisk: ['SEXUAL_OFFENCES', 'THREATS_OF_VIOLENCE'],
    })

    expect(result.possibleRisk).toEqual(['SEXUAL_OFFENCES', 'THREATS_OF_VIOLENCE'])
  })

  it('does not assume a selection when nothing is submitted', () => {
    expect(RiskBehaviourFormModel.safeParse({ action: 'continue' }).success).toBe(false)
  })
})
