import { ValidationError } from '../models/Validation'
import {
  calculateAge,
  camelCaseToSentenceCase,
  checkType,
  convertToTitleCase,
  deserialiseDate,
  deserialiseTime,
  getError,
  initialiseName,
  isEmpty,
  serialiseDate,
  serialiseTime,
} from './utils'

describe('convert to title case', () => {
  it.each([
    ['empty string', '', ''],
    ['Lower case', 'robert', 'Robert'],
    ['Upper case', 'ROBERT', 'Robert'],
    ['Mixed case', 'RoBErT', 'Robert'],
    ['Multiple words', 'RobeRT SMiTH', 'Robert Smith'],
    ['Leading spaces', '  RobeRT', '  Robert'],
    ['Trailing spaces', 'RobeRT  ', 'Robert  '],
    ['Hyphenated', 'Robert-John SmiTH-jONes-WILSON', 'Robert-John Smith-Jones-Wilson'],
  ])('%s convertToTitleCase(%s, %s)', (_: string, a: string, expected: string) => {
    expect(convertToTitleCase(a)).toEqual(expected)
  })
})

describe('initialise name', () => {
  it.each([
    [undefined, undefined, undefined],
    ['Empty string', '', undefined],
    ['One word', 'robert', 'r. robert'],
    ['Two words', 'Robert James', 'R. James'],
    ['Three words', 'Robert James Smith', 'R. Smith'],
    ['Double barrelled', 'Robert-John Smith-Jones-Wilson', 'R. Smith-Jones-Wilson'],
  ])('%s initialiseName(%s, %s)', (_: string | undefined, a: string | undefined, expected: string | undefined) => {
    expect(initialiseName(a)).toEqual(expected)
  })
})

describe('serialiseDate', () => {
  it.each([
    ['Empty year', ['', '01', '01'], null],
    ['Empty month', ['1970', '', '01'], null],
    ['Empty day', ['1970', '01', ''], null],
    ['Valid past date', ['2000', '02', '01'], '2000-02-01T00:00:00.000Z'],
    ['Valid future date', ['2050', '02', '01'], '2050-02-01T00:00:00.000Z'],
    ['Valid short year format', ['22', '02', '01'], '1922-02-01T00:00:00.000Z'],
    ['Valid BST date', ['2024', '06', '01'], '2024-06-01T00:00:00.000Z'],
  ])('%s serialiseDate(%s, %s)', (_: string, [year, month, day]: Array<string>, expected: string | null) => {
    expect(serialiseDate(year, month, day)).toEqual(expected)
  })
})

describe('deserialiseDate', () => {
  it.each([
    ['Empty date', '', ['', '', '']],
    ['Undefined', undefined, ['', '', '']],
    ['Valid date', '2000-02-01T00:00:00.000Z', ['2000', '2', '1']],
  ])('%s deserialiseDate(%s, %s)', (_: string, input: string | undefined, expected: Array<string>) => {
    expect(deserialiseDate(input)).toEqual(expected)
  })
})

describe('serialiseTime', () => {
  it.each([
    ['Empty hours', ['', '11'], null],
    ['Empty minutes', ['11', ''], null],
    ['Valid time', ['11', '22'], '11:22:00'],
  ])('%s serialiseTime(%s, %s)', (_: string, [hours, minutes]: Array<string>, expected: string | null) => {
    expect(serialiseTime(hours, minutes)).toEqual(expected)
  })
})

describe('deserialiseTime', () => {
  it.each([
    ['Empty time', '', ['', '']],
    ['Undefined', undefined, ['', '']],
    ['Null', null, ['', '']],
    ['Valid date', '10:22:35', ['10', '22']],
  ])('%s deserialiseTime(%s, %s)', (_: string, input: string | undefined | null, expected: Array<string>) => {
    expect(deserialiseTime(input)).toEqual(expected)
  })
})

describe('calculateAge', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2020-01-01'))
  })

  it.each([
    ['Empty date', '', NaN],
    ['Valid date', '1980-01-01T00:00:00.000Z', 40],
  ])('%s calculateAge(%s, %s)', (_: string, input: string, expected: number) => {
    expect(calculateAge(input)).toEqual(expected)
  })
})

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

describe('receipt utils', () => {
  const exampleObject = {
    data: 'example',
  }

  const exampleArray: string[] = ['example', 'array']

  describe('convert camel case to sentence case', () => {
    it.each([
      ['empty string', '', ''],
      ['Single word', 'start', 'Start'],
      ['Multiple words', 'startDate', 'Start date'],
    ])('%s camelCaseToSentenceCase(%s, %s)', (_: string, a: string, expected: string) => {
      expect(camelCaseToSentenceCase(a)).toEqual(expected)
    })
  })

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
