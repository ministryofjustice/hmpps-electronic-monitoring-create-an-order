import RiskAtAddressFormModel, { RiskAtAddressFormValidator } from './formModel'

describe('risk at address form model', () => {
  it('wraps a single selection in an array', () => {
    expect(RiskAtAddressFormModel.parse({ action: 'continue', riskCategory: 'IOM' }).riskCategory).toEqual(['IOM'])
  })

  it('keeps multiple selections', () => {
    const result = RiskAtAddressFormModel.parse({ action: 'continue', riskCategory: ['IOM', 'DANGEROUS_ANIMALS'] })

    expect(result.riskCategory).toEqual(['IOM', 'DANGEROUS_ANIMALS'])
  })

  it('has no selection when nothing is submitted', () => {
    expect(RiskAtAddressFormModel.parse({ action: 'continue' }).riskCategory).toEqual([])
  })
})

describe('risk at address form validator', () => {
  it('requires at least one selection', () => {
    const result = RiskAtAddressFormValidator.safeParse({ riskCategory: [] })

    expect(result.success).toBe(false)
    expect(result.error?.issues[0]).toEqual(
      expect.objectContaining({
        path: ['riskCategory'],
        message: 'Select all the possible risks at the installation address',
      }),
    )
  })

  it('accepts a selection', () => {
    expect(RiskAtAddressFormValidator.safeParse({ riskCategory: ['IOM'] }).success).toBe(true)
  })
})
