import RiskBehaviourFormModel, { RiskBehaviourFormValidator } from './formModel'

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

  it('keeps only NO_RISK when submitted with other risks', () => {
    const result = RiskBehaviourFormModel.parse({
      action: 'continue',
      possibleRisk: ['SEXUAL_OFFENCES', 'NO_RISK', 'THREATS_OF_VIOLENCE'],
    })

    expect(result.possibleRisk).toEqual(['NO_RISK'])
  })

  it('keeps NO_RISK when submitted on its own', () => {
    expect(RiskBehaviourFormModel.parse({ action: 'continue', possibleRisk: 'NO_RISK' }).possibleRisk).toEqual([
      'NO_RISK',
    ])
  })

  it('has no selection when nothing is submitted', () => {
    expect(RiskBehaviourFormModel.parse({ action: 'continue' }).possibleRisk).toEqual([])
  })

  it('defaults gender risk details to an empty string', () => {
    expect(RiskBehaviourFormModel.parse({ action: 'continue' }).genderRiskDetails).toEqual('')
  })

  it('keeps submitted gender risk details', () => {
    expect(RiskBehaviourFormModel.parse({ action: 'continue', genderRiskDetails: 'Women' }).genderRiskDetails).toEqual(
      'Women',
    )
  })
})

describe('risk behaviour form validator', () => {
  it('requires at least one selection', () => {
    const result = RiskBehaviourFormValidator.safeParse({ possibleRisk: [] })

    expect(result.success).toBe(false)
    expect(result.error?.issues[0]).toEqual(
      expect.objectContaining({
        path: ['possibleRisk'],
        message: "Select all the possible risks from the device wearer's behaviour",
      }),
    )
  })

  it('accepts a selection', () => {
    expect(
      RiskBehaviourFormValidator.safeParse({ possibleRisk: ['SEXUAL_OFFENCES'], genderRiskDetails: '' }).success,
    ).toBe(true)
  })

  it('requires gender risk details when risk to gender is selected', () => {
    const result = RiskBehaviourFormValidator.safeParse({ possibleRisk: ['RISK_TO_GENDER'], genderRiskDetails: '' })

    expect(result.success).toBe(false)
    expect(result.error?.issues[0]).toEqual(
      expect.objectContaining({
        path: ['genderRiskDetails'],
        message: 'Enter what sex or gender they are a risk to',
      }),
    )
  })

  it('rejects gender risk details over 100 characters', () => {
    const result = RiskBehaviourFormValidator.safeParse({
      possibleRisk: ['RISK_TO_GENDER'],
      genderRiskDetails: 'a'.repeat(101),
    })

    expect(result.success).toBe(false)
    expect(result.error?.issues[0].path).toEqual(['genderRiskDetails'])
  })

  it('accepts gender risk details when risk to gender is selected', () => {
    expect(
      RiskBehaviourFormValidator.safeParse({ possibleRisk: ['RISK_TO_GENDER'], genderRiskDetails: 'Women' }).success,
    ).toBe(true)
  })

  it('ignores missing gender risk details when risk to gender is not selected', () => {
    expect(RiskBehaviourFormValidator.safeParse({ possibleRisk: ['NO_RISK'], genderRiskDetails: '' }).success).toBe(
      true,
    )
  })
})
