import { validationErrors } from '../../constants/validationErrors'
import { BooleanInputModel, DateInputModel, DateTimeInputModel, MultipleChoiceInputModel } from './formData'

describe('DateInputModel', () => {
  it.each([
    ['24', '10', '2024', '2024-10-24T00:00:00.000Z'],
    ['1', '1', '1965', '1965-01-01T00:00:00.000Z'],
    ['01', '01', '1965', '1965-01-01T00:00:00.000Z'],
  ])(
    'Should parse a valid date: day = %s, month = %s, year = %s',
    (day: string, month: string, year: string, expected: string) => {
      const validationResult = DateInputModel(validationErrors.monitoringConditions.startDateTime.date).safeParse({
        day,
        month,
        year,
      })

      expect(validationResult.success).toBe(true)
      expect(validationResult.data).toBe(expected)
    },
  )

  it.each([['24', '10', '2030', '2030-10-24T00:00:00.000Z']])(
    'Should parse a valid future date when permitted: day = %s, month = %s, year = %s',
    (day: string, month: string, year: string, expected: string) => {
      const validationResult = DateInputModel(validationErrors.monitoringConditions.endDateTime.date).safeParse({
        day,
        month,
        year,
      })

      expect(validationResult.success).toBe(true)
      expect(validationResult.data).toBe(expected)
    },
  )

  it('Should not allow empty inputs for all date fields', () => {
    const validationResult = DateInputModel(validationErrors.monitoringConditions.startDateTime.date).safeParse({
      day: '',
      month: '',
      year: '',
    })

    expect(validationResult.success).toBe(false)
    expect(validationResult.data).toBe(undefined)
  })

  it('Should not allow non-alphanumeric inputs for all date fields', () => {
    const validationResult = DateInputModel(validationErrors.monitoringConditions.startDateTime.date).safeParse({
      day: 'q',
      month: 'q',
      year: 'q',
    })

    expect(validationResult.success).toBe(false)
    expect(validationResult.data).toBe(undefined)
  })

  it.each([
    ['32', '10', '2024'],
    ['1', '13', '1965'],
    ['01', '7', '1000'],
    ['q', 'q', '2000'],
  ])(
    'Should not parse an invalid date: day = %s, month = %s, year = %s',
    (day: string, month: string, year: string) => {
      const validationResult = DateInputModel(validationErrors.monitoringConditions.startDateTime.date).safeParse({
        day,
        month,
        year,
      })

      expect(validationResult.success).toBe(false)
      expect(validationResult.error!.issues).toEqual([
        {
          code: 'custom',
          fatal: true,
          message: 'Start date for monitoring must be a real date',
          path: [],
        },
      ])
    },
  )

  it.each([
    ['', '1', ''],
    ['', '', '2024'],
    ['', '1', '2024'],
  ])('Should not allow a date without a day', (day: string, month: string, year: string) => {
    const validationResult = DateInputModel(validationErrors.monitoringConditions.startDateTime.date).safeParse({
      day,
      month,
      year,
    })

    expect(validationResult.success).toBe(false)
    expect(validationResult.error!.issues).toEqual([
      {
        code: 'custom',
        fatal: true,
        message: 'Start date for monitoring must include a day',
        path: [],
      },
    ])
  })

  it.each([
    ['1', '', ''],
    ['1', '', '2024'],
  ])('Should not allow a date without a month', (day: string, month: string, year: string) => {
    const validationResult = DateInputModel(validationErrors.monitoringConditions.startDateTime.date).safeParse({
      day,
      month,
      year,
    })

    expect(validationResult.success).toBe(false)
    expect(validationResult.error!.issues).toEqual([
      {
        code: 'custom',
        fatal: true,
        message: 'Start date for monitoring must include a month',
        path: [],
      },
    ])
  })

  it.each([['1', '1', '']])('Should not allow a date without a year', (day: string, month: string, year: string) => {
    const validationResult = DateInputModel(validationErrors.monitoringConditions.startDateTime.date).safeParse({
      day,
      month,
      year,
    })

    expect(validationResult.success).toBe(false)
    expect(validationResult.error!.issues).toEqual([
      {
        code: 'custom',
        fatal: true,
        message: 'Start date for monitoring must include a year',
        path: [],
      },
    ])
  })
})

describe('DateTimeInputModel', () => {
  it.each([
    ['24', '10', '2024', '11', '11', '2024-10-24T10:11:00.000Z'], // Date is in BST so UTC is one hour less
    ['1', '1', '1965', '5', '5', '1965-01-01T05:05:00.000Z'],
    ['01', '01', '1965', '03', '03', '1965-01-01T03:03:00.000Z'],
  ])(
    'Should parse a valid datetime: day = %s, month = %s, year = %s, hours = %s, minutes = %s',
    (day: string, month: string, year: string, hours: string, minutes: string, expected: string) => {
      const validationResult = DateTimeInputModel(validationErrors.monitoringConditions.startDateTime).safeParse({
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

  it('Should not allow empty inputs for all datetime fields', () => {
    const validationResult = DateTimeInputModel(validationErrors.monitoringConditions.startDateTime).safeParse({
      day: '',
      month: '',
      year: '',
      hours: '',
      minutes: '',
    })

    expect(validationResult.success).toBe(false)
    expect(validationResult.data).toBe(undefined)
  })

  it.each([
    ['32', '10', '2024', '0', '0'],
    ['1', '13', '1965', '0', '0'],
    ['01', '7', '1000', '0', '0'],
  ])(
    'Should not parse an invalid date: day = %s, month = %s, year = %s, hours = %s, minutes = %s',
    (day: string, month: string, year: string, hours: string, minutes: string) => {
      const validationResult = DateTimeInputModel(validationErrors.monitoringConditions.startDateTime).safeParse({
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
          fatal: true,
          message: 'Start date for monitoring must be a real date',
          path: [],
        },
      ])
    },
  )

  it.each([
    ['', '1', '', '0', '0'],
    ['', '', '2024', '0', '0'],
    ['', '1', '', '0', '0'],
  ])(
    'Should not allow a date with no day',
    (day: string, month: string, year: string, hours: string, minutes: string) => {
      const validationResult = DateTimeInputModel(validationErrors.monitoringConditions.startDateTime).safeParse({
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
          fatal: true,
          message: 'Start date for monitoring must include a day',
          path: [],
        },
      ])
    },
  )

  it.each([
    ['1', '', '', '0', '0'],
    ['1', '', '2024', '0', '0'],
  ])(
    'Should not allow a date with no month',
    (day: string, month: string, year: string, hours: string, minutes: string) => {
      const validationResult = DateTimeInputModel(validationErrors.monitoringConditions.startDateTime).safeParse({
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
          fatal: true,
          message: 'Start date for monitoring must include a month',
          path: [],
        },
      ])
    },
  )

  it.each([['1', '1', '', '0', '0']])(
    'Should not allow a date with no year',
    (day: string, month: string, year: string, hours: string, minutes: string) => {
      const validationResult = DateTimeInputModel(validationErrors.monitoringConditions.startDateTime).safeParse({
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
          fatal: true,
          message: 'Start date for monitoring must include a year',
          path: [],
        },
      ])
    },
  )

  it.each([
    ['24', '10', '2024', '24', '00'],
    ['1', '1', '1965', '12', '60'],
  ])(
    'Start time for monitoring must be a real time',
    (day: string, month: string, year: string, hours: string, minutes: string) => {
      const validationResult = DateTimeInputModel(validationErrors.monitoringConditions.startDateTime).safeParse({
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
          fatal: true,
          message: 'Start time for monitoring must be a real time',
          path: [],
        },
      ])
    },
  )

  it.each([['q', '1', '1965', '12', '60']])(
    'Should not parse an invalid datetime: day = %s, month = %s, year = %s, hours = %s, minutes = %s',
    (day: string, month: string, year: string, hours: string, minutes: string) => {
      const validationResult = DateTimeInputModel(validationErrors.monitoringConditions.startDateTime).safeParse({
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
          fatal: true,
          message: 'Start date for monitoring must be a real date',
          path: [],
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
