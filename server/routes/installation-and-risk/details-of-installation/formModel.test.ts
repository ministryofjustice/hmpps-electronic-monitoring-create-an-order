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
})
