import exclusiveOptions from './exclusiveOptions'

describe('exclusiveOptions', () => {
  it('marks only the listed values as exclusive, each preceded by an "or" divider', () => {
    const items = [
      { value: 'A', text: 'A' },
      { value: 'B', text: 'B' },
      { value: 'C', text: 'C' },
    ]

    expect(exclusiveOptions(items, ['B', 'C'])).toEqual([
      { value: 'A', text: 'A' },
      { value: '', divider: 'or' },
      { value: 'B', text: 'B', behaviour: 'exclusive' },
      { value: '', divider: 'or' },
      { value: 'C', text: 'C', behaviour: 'exclusive' },
    ])
  })

  it('does not mutate the original items', () => {
    const items = [{ value: 'A', text: 'A' }]

    exclusiveOptions(items, ['A'])

    expect(items).toEqual([{ value: 'A', text: 'A' }])
  })
})
