import { DetailsOfInstallationValidator } from './formModel'

describe('form model', () => {
  const validator = DetailsOfInstallationValidator
  it('valid input', () => {
    const result = validator.safeParse({
      possibleRisk: ['THREATS_OF_VIOLENCE'],
      riskCategory: ['SAFEGUARDING_CHILD'],
      riskDetails: 'some details',
    })

    expect(result.success).toBe(true)
  })

  it('no possible risks', () => {
    const result = validator.safeParse({
      possibleRisk: [],
      riskCategory: ['SAFEGUARDING_CHILD'],
      riskDetails: 'some details',
    })

    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toBe("Select all the possible risks from the device wearer's behaviour")
  })

  it('requires gender risk details when risk to gender is ticked', async () => {
    const result = validator.safeParse({
      possibleRisk: ['RISK_TO_GENDER'],
      riskCategory: ['DANGEROUS_ANIMALS'],
      riskDetails: 'some details',
    })

    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toBe('Enter what sex or gender they are a risk to')
  })

  it('accepts gender risk details when passed', async () => {
    const result = validator.safeParse({
      possibleRisk: ['RISK_TO_GENDER'],
      riskCategory: ['DANGEROUS_ANIMALS'],
      riskDetails: 'some details',
      genderRiskDetails: 'Women',
    })

    expect(result.success).toBe(true)
  })

  it('does not accept gender risk details which are too long', async () => {
    const result = validator.safeParse({
      possibleRisk: ['RISK_TO_GENDER'],
      riskCategory: ['DANGEROUS_ANIMALS'],
      riskDetails: 'some details',
      genderRiskDetails:
        'The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog. The quick br',
    })

    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toBe('Gender risk details to be aware of must be 100 characters or less')
  })

  it('does not require gender risk details when risk to gender unticked', async () => {
    const result = validator.safeParse({
      possibleRisk: ['NO_RISK'],
      riskCategory: ['DANGEROUS_ANIMALS'],
      riskDetails: 'some details',
    })

    expect(result.success).toBe(true)
  })
})
