import { checkType, convertBooleanToEnum, isEmpty, isNotNullOrUndefined, isNullOrUndefined } from './values'

describe('convertBooleanToEnum', () => {
  it.each([
    [null, 'null', 'true', 'false', 'null'],
    [true, 'null', 'true', 'false', 'true'],
    [false, 'null', 'true', 'false', 'false'],
  ])('convertBooleanToEnum(%s, %s, %s, %s', (value, nullValue, truthyValue, falsyValue, expectedValue) => {
    expect(convertBooleanToEnum(value, nullValue, truthyValue, falsyValue)).toEqual(expectedValue)
  })
})

describe('isNullOrUndefined', () => {
  it.each([
    ['object', {}, false],
    ['number', 0, false],
    ['string', '', false],
    ['undefined', undefined, true],
    ['null', null, true],
  ])('%s isNullOrUndefined(%s)', (_: string, value: unknown, expected: boolean) => {
    expect(isNullOrUndefined(value)).toBe(expected)
  })
})

describe('isNotNullOrUndefined', () => {
  it.each([
    ['object', {}, true],
    ['number', 0, true],
    ['string', '', true],
    ['undefined', undefined, false],
    ['null', null, false],
  ])('%s isNotNullOrUndefined(%s)', (_: string, value: unknown, expected: boolean) => {
    expect(isNotNullOrUndefined(value)).toBe(expected)
  })
})

describe('receipt utils', () => {
  const exampleObject = {
    data: 'example',
  }

  const exampleArray: string[] = ['example', 'array']

  describe('check type', () => {
    it.each([
      ['empty string', '', 'string'],
      ['string', 'word', 'string'],
      ['object', {}, 'object'],
      ['array', exampleArray, 'array'],
    ])('%s checkType(%s, %s)', (_: string, a: unknown, expected: string) => {
      expect(checkType(a)).toEqual(expected)
    })
  })

  describe('is empty', () => {
    it.each([
      ['empty string', '', true],
      ['string', 'word', false],
      ['empty object', {}, true],
      ['object', exampleObject, false],
      ['empty array', [], true],
      ['array', exampleArray, false],
    ])('%s isEmpty(%s, %s)', (_: string, a: unknown, expected: boolean) => {
      expect(isEmpty(a)).toEqual(expected)
    })
  })
})
