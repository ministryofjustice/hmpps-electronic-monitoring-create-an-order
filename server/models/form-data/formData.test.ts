import { BooleanInputModel, DateInputModel, DateTimeInputModel, MultipleChoiceInputModel } from './formData'

describe('DateInputModel', () => {
  it.each([
    ['24', '10', '2024', '2024-10-24T00:00:00.000Z'],
    ['1', '1', '1965', '1965-01-01T00:00:00.000Z'],
    ['01', '01', '1965', '1965-01-01T00:00:00.000Z'],
    ['31', '7', '2030', '2030-07-31T00:00:00.000Z'],
  ])(
    'Should parse a valid date: day = %s, month = %s, year = %s',
    (day: string, month: string, year: string, expected: string) => {
      const validationResult = DateInputModel.safeParse({
        day,
        month,
        year,
      })

      expect(validationResult.success).toBe(true)
      expect(validationResult.data).toBe(expected)
    },
  )

  it('Should allow empty inputs for all date fields', () => {
    const validationResult = DateInputModel.safeParse({
      day: '',
      month: '',
      year: '',
      hours: '',
      minutes: '',
    })

    expect(validationResult.success).toBe(true)
    expect(validationResult.data).toBe(null)
  })

  it.each([
    ['32', '10', '2024'],
    ['1', '13', '1965'],
    ['01', '7', '1000'],
    ['q', 'q', 'q'],
    ['1', '', ''],
    ['q', '', ''],
  ])(
    'Should not parse an invalid date: day = %s, month = %s, year = %s',
    (day: string, month: string, year: string) => {
      const validationResult = DateInputModel.safeParse({
        day,
        month,
        year,
      })

      expect(validationResult.success).toBe(false)
      expect(validationResult.error!.issues).toEqual([
        {
          code: 'custom',
          message:
            'Date is in the incorrect format. Enter the date in the format DD/MM/YYYY (Day/Month/Year). For example, 24/10/2024.',
          path: ['date'],
        },
      ])
    },
  )
})

describe('DateTimeInputModel', () => {
  it.each([
    ['24', '10', '2024', '11', '11', '2024-10-24T11:11:00.000Z'],
    ['1', '1', '1965', '5', '5', '1965-01-01T05:05:00.000Z'],
    ['01', '01', '1965', '03', '03', '1965-01-01T03:03:00.000Z'],
  ])(
    'Should parse a valid datetime: day = %s, month = %s, year = %s, hours = %s, minutes = %s',
    (day: string, month: string, year: string, hours: string, minutes: string, expected: string) => {
      const validationResult = DateTimeInputModel.safeParse({
        day,
        month,
        year,
        hours,
        minutes,
      })

      expect(validationResult.success).toBe(true)
      expect(validationResult.data).toBe(expected)
    },
  )

  it('Should allow empty inputs for all datetime fields', () => {
    const validationResult = DateTimeInputModel.safeParse({
      day: '',
      month: '',
      year: '',
      hours: '',
      minutes: '',
    })

    expect(validationResult.success).toBe(true)
    expect(validationResult.data).toBe(null)
  })

  it.each([
    ['32', '10', '2024', '0', '0'],
    ['1', '13', '1965', '0', '0'],
    ['01', '7', '1000', '0', '0'],
    ['q', 'q', 'q', '0', '0'],
    ['1', '', '', '0', '0'],
    ['q', '', '', '0', '0'],
  ])(
    'Should not parse an invalid date: day = %s, month = %s, year = %s, hours = %s, minutes = %s',
    (day: string, month: string, year: string, hours: string, minutes: string) => {
      const validationResult = DateInputModel.safeParse({
        day,
        month,
        year,
        hours,
        minutes,
      })

      expect(validationResult.success).toBe(false)
      expect(validationResult.error!.issues).toEqual([
        {
          code: 'custom',
          message:
            'Date is in the incorrect format. Enter the date in the format DD/MM/YYYY (Day/Month/Year). For example, 24/10/2024.',
          path: ['date'],
        },
      ])
    },
  )

  it.each([
    ['24', '10', '2024', '24', '00'],
    ['1', '1', '1965', '12', '60'],
    ['1', '1', '2024', '1', ''],
    ['1', '1', '2024', '', '0'],
    ['1', '1', '2024', '', ''],
  ])(
    'Should not parse an invalid time: day = %s, month = %s, year = %s, hours = %s, minutes = %s',
    (day: string, month: string, year: string, hours: string, minutes: string) => {
      const validationResult = DateTimeInputModel.safeParse({
        day,
        month,
        year,
        hours,
        minutes,
      })

      expect(validationResult.success).toBe(false)
      expect(validationResult.error!.issues).toEqual([
        {
          code: 'custom',
          message:
            'Time is in the incorrect format. Enter the time in the format hh:mm (Hour:Minute). For example, 11:59.',
          path: ['time'],
        },
      ])
    },
  )

  it.each([['q', '1', '1965', '12', '60']])(
    'Should not parse an invalid datetime: day = %s, month = %s, year = %s, hours = %s, minutes = %s',
    (day: string, month: string, year: string, hours: string, minutes: string) => {
      const validationResult = DateTimeInputModel.safeParse({
        day,
        month,
        year,
        hours,
        minutes,
      })

      expect(validationResult.success).toBe(false)
      expect(validationResult.error!.issues).toEqual([
        {
          code: 'custom',
          message:
            'Date is in the incorrect format. Enter the date in the format DD/MM/YYYY (Day/Month/Year). For example, 24/10/2024.',
          path: ['date'],
        },
        {
          code: 'custom',
          message:
            'Time is in the incorrect format. Enter the time in the format hh:mm (Hour:Minute). For example, 11:59.',
          path: ['time'],
        },
      ])
    },
  )
})

describe('BooleanInputModel', () => {
  it.each([
    ['', null],
    ['true', true],
    ['false', false],
  ])('Should parse boolean radio inputs to booleans: value = %s', (value: string, expected: boolean | null) => {
    const validationResult = BooleanInputModel.safeParse(value)

    expect(validationResult.success).toBe(true)
    expect(validationResult.data).toBe(expected)
  })
})

describe('MultipleChoiceInputModel', () => {
  it.each([
    ['', ['']],
    ['foo', ['foo']],
    [
      ['foo', 'bar'],
      ['foo', 'bar'],
    ],
  ])('Should parse valid checkbox inputs: value = %s', (value: string | string[], expected: string[]) => {
    const validationResult = MultipleChoiceInputModel.safeParse(value)

    expect(validationResult.success).toBe(true)
    expect(validationResult.data).toEqual(expected)
  })
})
