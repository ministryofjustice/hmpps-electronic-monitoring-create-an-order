import OtherRisksViewModel from './viewModel'

describe('other risks view model', () => {
  it('has no answer when nothing is cached', () => {
    const result = OtherRisksViewModel.construct(null, '', false)

    expect(result.hasOtherRisks.value).toBe('')
  })

  it('returns the cached answer and details', () => {
    const result = OtherRisksViewModel.construct('YES', 'Aggressive neighbour', false)

    expect(result.hasOtherRisks.value).toBe('YES')
    expect(result.riskDetails.value).toBe('Aggressive neighbour')
  })

  it('offers yes and no, disabled when the order is not editable', () => {
    const { items } = OtherRisksViewModel.construct(null, '', true).hasOtherRisks

    expect(items).toEqual([
      expect.objectContaining({ value: 'YES', text: 'Yes', disabled: true }),
      expect.objectContaining({ value: 'NO', text: 'No', disabled: true }),
    ])
  })

  it('maps errors to their fields and the summary', () => {
    const result = OtherRisksViewModel.construct(null, '', false, [
      { error: 'Select yes if there are any other risks to be aware of', field: 'hasOtherRisks' },
      { error: 'Enter what other risks there are', field: 'riskDetails' },
    ])

    expect(result.hasOtherRisks.error?.text).toBe('Select yes if there are any other risks to be aware of')
    expect(result.riskDetails.error?.text).toBe('Enter what other risks there are')
    expect(result.errorSummary?.errorList).toHaveLength(2)
  })
})
