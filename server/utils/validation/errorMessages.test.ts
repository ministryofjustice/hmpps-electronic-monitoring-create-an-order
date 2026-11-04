import { ValidationError } from '../../models/Validation'
import { getError } from './errorMessages'

describe('getError', () => {
  it.each([
    { errors: [] as ValidationError[], field: 'field1', expected: undefined },
    { errors: [{ field: 'field2', error: 'Field 2 is required' }], field: 'field1', expected: undefined },
    {
      errors: [{ field: 'field1', error: 'Field 1 is required' }],
      field: 'field1',
      expected: { text: 'Field 1 is required' },
    },
  ])('getError($errors, $field)', ({ errors, field, expected }) => {
    expect(getError(errors, field)).toEqual(expected)
  })
})
