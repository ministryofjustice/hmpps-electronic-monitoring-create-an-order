import { OtherRisksFormValidator } from './formModel'

describe('other risks form validator', () => {
  it('requires an answer', () => {
    const result = OtherRisksFormValidator.safeParse({ hasOtherRisks: undefined, riskDetails: '' })

    expect(result.error?.issues).toEqual([
      expect.objectContaining({
        message: 'Select yes if there are any other risks to be aware of',
        path: ['hasOtherRisks'],
      }),
    ])
  })

  it('requires details when the answer is yes', () => {
    const result = OtherRisksFormValidator.safeParse({ hasOtherRisks: 'YES', riskDetails: '' })

    expect(result.error?.issues).toEqual([
      expect.objectContaining({ message: 'Enter what other risks there are', path: ['riskDetails'] }),
    ])
  })

  it('limits the details to 200 characters', () => {
    const result = OtherRisksFormValidator.safeParse({ hasOtherRisks: 'YES', riskDetails: 'a'.repeat(201) })

    expect(result.error?.issues).toEqual([
      expect.objectContaining({
        message: 'Any other risks to be aware of must be 200 characters or less',
        path: ['riskDetails'],
      }),
    ])
  })

  it('accepts no without details', () => {
    expect(OtherRisksFormValidator.safeParse({ hasOtherRisks: 'NO', riskDetails: '' }).success).toBe(true)
  })

  it('accepts yes with details', () => {
    expect(
      OtherRisksFormValidator.safeParse({ hasOtherRisks: 'YES', riskDetails: 'Aggressive neighbour' }).success,
    ).toBe(true)
  })
})
