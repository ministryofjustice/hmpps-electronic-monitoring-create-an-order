import toCheckboxItems from './toCheckboxItems'

describe('toCheckboxItems', () => {
  it('creates an item for each reference value, keyed by code', () => {
    expect(toCheckboxItems({ A: 'Option A', B: 'Option B' }, false)).toEqual([
      { value: 'A', text: 'Option A', disabled: false },
      { value: 'B', text: 'Option B', disabled: false },
    ])
  })

  it('uses the description of rich reference values as a hint', () => {
    expect(toCheckboxItems({ A: { text: 'Option A', description: 'About A' } }, true)).toEqual([
      { value: 'A', text: 'Option A', hint: { text: 'About A' }, disabled: true },
    ])
  })

  it('leaves out excluded codes', () => {
    expect(toCheckboxItems({ A: 'Option A', B: 'Option B' }, false, ['A'])).toEqual([
      { value: 'B', text: 'Option B', disabled: false },
    ])
  })
})
