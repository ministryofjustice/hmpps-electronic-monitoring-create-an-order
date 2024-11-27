import { z } from 'zod'

const FormDataModel = z.object({
  action: z.string().default('continue'),
})

const DateInputModel = z
  .object({
    day: z.string(),
    month: z.string(),
    year: z.string(),
  })
  .refine(
    value => {
      // Empty inputs are valid
      if (value.day === '' && value.month === '' && value.year === '') {
        return true
      }

      // Non empty inputs should be valid integers
      return z
        .object({
          day: z.coerce.number().int().min(1).max(31),
          month: z.coerce.number().int().min(1).max(12),
          year: z.coerce.number().int().min(1900).max(2200),
        })
        .safeParse(value).success
    },
    {
      message:
        'Date is in the incorrect format. Enter the date in the format DD/MM/YYYY (Day/Month/Year). For example, 24/10/2024.',
      path: ['date'],
    },
  )
  .transform(value => {
    if (value.day === '' && value.month === '' && value.year === '') {
      return null
    }

    const day = parseInt(value.day, 10)
    const month = parseInt(value.month, 10) - 1
    const year = parseInt(value.year, 10)

    return new Date(Date.UTC(year, month, day)).toISOString()
  })
  .pipe(z.string().datetime().nullable())

// Dates are collected as 3 text inputs
// Some dates are optional, so empty inputs should create a null date
// The API requires dates to be in an ISO8601 date and time string
const DateTimeInputModel = z
  .object({
    day: z.string(),
    month: z.string(),
    year: z.string(),
    hours: z.string(),
    minutes: z.string(),
  })
  .refine(
    value => {
      // Empty inputs are valid
      if (value.day === '' && value.month === '' && value.year === '' && value.hours === '' && value.minutes === '') {
        return true
      }

      // Non empty inputs should be valid integers
      return z
        .object({
          day: z.coerce.number().int().min(1).max(31),
          month: z.coerce.number().int().min(1).max(12),
          year: z.coerce.number().int().min(1900).max(2200),
        })
        .safeParse(value).success
    },
    {
      message:
        'Date is in the incorrect format. Enter the date in the format DD/MM/YYYY (Day/Month/Year). For example, 24/10/2024.',
      path: ['date'],
    },
  )
  .refine(
    value => {
      // Empty inputs are valid
      if (value.day === '' && value.month === '' && value.year === '' && value.hours === '' && value.minutes === '') {
        return true
      }

      // Inputs should be valid integers
      return z
        .object({
          hours: z
            .string()
            .transform(val => (val === '' ? Number.isNaN : val))
            .pipe(z.coerce.number().int().min(0).max(23)),
          minutes: z
            .string()
            .transform(val => (val === '' ? Number.isNaN : val))
            .pipe(z.coerce.number().int().min(0).max(23)),
        })
        .safeParse(value).success
    },
    {
      message: 'Time is in the incorrect format. Enter the time in the format hh:mm (Hour:Minute). For example, 11:59.',
      path: ['time'],
    },
  )
  .transform(value => {
    if (value.day === '' && value.month === '' && value.year === '' && value.hours === '' && value.minutes === '') {
      return null
    }

    const day = parseInt(value.day, 10)
    const month = parseInt(value.month, 10) - 1
    const year = parseInt(value.year, 10)
    const hours = parseInt(value.hours, 10)
    const minutes = parseInt(value.minutes, 10)

    return new Date(Date.UTC(year, month, day, hours, minutes)).toISOString()
  })
  .pipe(z.string().datetime().nullable())

const BooleanInputModel = z
  .string()
  .default('')
  .transform(val => {
    if (val === '') {
      return null
    }

    if (val === 'true') {
      return true
    }

    return false
  })

// Checkboxes return either a string or string[]
// But its easier if its always a string[]
const MultipleChoiceInputModel = z
  .union([z.string(), z.array(z.string()).default([])])
  .transform(value => (Array.isArray(value) ? value : [value]))

export { BooleanInputModel, DateInputModel, DateTimeInputModel, FormDataModel, MultipleChoiceInputModel }
