import { Address, AddressTypeEnum } from '../models/Address'
import { ValidationError } from '../models/Validation'
import {
  calculateAge,
  camelCaseToSentenceCase,
  checkType,
  convertBooleanToEnum,
  convertToTitleCase,
  createAddressPreview,
  deserialiseDateTime,
  deserialiseTime,
  getError,
  initialiseName,
  isEmpty,
  isNotNullOrUndefined,
  isNullOrUndefined,
  lookup,
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

describe('deserialiseDateTime', () => {
  it.each([
    ['Empty date', '', { hours: '', minutes: '', day: '', month: '', year: '' }],
    ['Null', null, { hours: '', minutes: '', day: '', month: '', year: '' }],
    ['Undefined', undefined, { hours: '', minutes: '', day: '', month: '', year: '' }],
    ['Valid date', '2000-02-01T00:00:00.000Z', { hours: '00', minutes: '00', day: '01', month: '02', year: '2000' }],
  ])(
    '%s deserialiseDateTime(%s, %s)',
    (
      _: string,
      input: string | null | undefined,
      expected: { hours: string; minutes: string; day: string; month: string; year: string },
    ) => {
      expect(deserialiseDateTime(input)).toEqual(expected)
    },
  )
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

describe('lookup', () => {
  it.each([
    ['empty map should return default value', {}, 'foo', '', ''],
    ['missing key should return default value', { foo: 'bar' }, 'baz', '', ''],
    ['existing key should return map value', { foo: 'bar' }, 'foo', '', 'bar'],
  ])(
    '%s - lookup(%s, "%s", "%s") === "%s"',
    (_: string, map: Record<string, string>, lookupValue: string, defaultValue: string, expectedValue: string) => {
      expect(lookup(map, lookupValue, defaultValue)).toBe(expectedValue)
    },
  )
})

describe('createAddressPreview', () => {
  it.each([
    ['undefined address', undefined, ''],
    ['null address', null, ''],
    [
      'Complete address',
      {
        addressType: AddressTypeEnum.enum.PRIMARY,
        addressLine1: 'Line 1',
        addressLine2: 'Line 2',
        addressLine3: 'Line 3',
        addressLine4: 'Line 4',
        postcode: 'Postcode',
      },
      'Line 1, Line 2, Postcode',
    ],
  ])(
    '%s - createAddressPreview(%s) === "%s"',
    (_: string, address: Address | null | undefined, expectedValue: string) => {
      expect(createAddressPreview(address)).toBe(expectedValue)
    },
  )
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
