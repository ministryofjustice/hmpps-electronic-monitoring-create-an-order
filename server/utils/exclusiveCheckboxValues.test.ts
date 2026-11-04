import exclusiveCheckboxValues from './exclusiveCheckboxValues'

describe('exclusiveCheckboxValues', () => {
  const schema = exclusiveCheckboxValues(['NONE', 'UNKNOWN'])

  it('returns an empty array when undefined', () => {
    expect(schema.parse(undefined)).toEqual([])
  })

  it('wraps a single value in an array', () => {
    expect(schema.parse('A')).toEqual(['A'])
  })

  it('keeps all values when none are exclusive', () => {
    expect(schema.parse(['A', 'B'])).toEqual(['A', 'B'])
  })

  it.each(['NONE', 'UNKNOWN'])('keeps only %s when it is selected with others', exclusive => {
    expect(schema.parse(['A', exclusive, 'B'])).toEqual([exclusive])
  })
})
