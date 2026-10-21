import { serialiseDate, deserialiseDateTime, serialiseTime, deserialiseTime, calculateAge } from './dateTime'

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
