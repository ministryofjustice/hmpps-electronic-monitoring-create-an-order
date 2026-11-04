import { deserialiseDateTime, deserialiseTime, serialiseTime } from './dateTime'

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
