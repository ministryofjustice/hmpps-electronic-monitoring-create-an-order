import { z } from 'zod'
import { DateErrorMessages, DateTimeErrorMessages } from '../../constants/validationErrors'

const FormDataModel = z.object({
  action: z.string().default('continue'),
})

const DateInputModel = (messages: DateErrorMessages) => {
  return z
    .object({
      day: z.string(),
      month: z.string(),
      year: z.string(),
    })
    .superRefine((val, ctx) => {
      if (messages.required && val.day === '' && val.month === '' && val.year === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: messages.required,
          fatal: true,
        })

        return z.NEVER
      }

      if ((val.year !== '' && val.year.length !== 4) || Number.isNaN(Number(val.year))) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: messages.yearMustIncludeFourNumbers,
          fatal: true,
        })

        return z.NEVER
      }

      if (val.day === '' && (val.month !== '' || val.year !== '')) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: messages.mustIncludeDay,
          fatal: true,
        })

        return z.NEVER
      }

      if (val.month === '' && (val.day !== '' || val.year !== '')) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: messages.mustIncludeMonth,
          fatal: true,
        })

        return z.NEVER
      }

      if (val.year === '' && (val.month !== '' || val.day !== '')) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: messages.mustIncludeYear,
          fatal: true,
        })

        return z.NEVER
      }

      if (
        z
          .object({
            day: z.coerce.number().int().min(1).max(31),
            month: z.coerce.number().int().min(1).max(12),
            year: z.coerce.number().int().min(1900).max(2200),
          })
          .safeParse(val).error
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: messages.mustBeReal,
          fatal: true,
        })

        return z.NEVER
      }

      const inputDate = new Date(Number(val.year), Number(val.month), Number(val.day))
      if (messages.mustBeInPast && inputDate > new Date()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: messages.mustBeInPast,
          fatal: true,
        })

        return z.NEVER
      }

      return false
    })
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
}

// Dates are collected as 3 text inputs
// Some dates are optional, so empty inputs should create a null date
// The API requires dates to be in an ISO8601 date and time string
const DateTimeInputModel = (messages: DateTimeErrorMessages) => {
  return z
    .object({
      day: z.string(),
      month: z.string(),
      year: z.string(),
      hours: z.string(),
      minutes: z.string(),
    })
    .superRefine((val, ctx) => {
      if (messages.date.required && val.day === '' && val.month === '' && val.year === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: messages.date.required,
          fatal: true,
        })

        return z.NEVER
      }

      if (val.day || val.month || val.year) {
        if ((val.year !== '' && val.year.length !== 4) || Number.isNaN(Number(val.year))) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: messages.date.yearMustIncludeFourNumbers,
            fatal: true,
          })

          return z.NEVER
        }

        if (val.day === '' && (val.month !== '' || val.year !== '')) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: messages.date.mustIncludeDay,
            fatal: true,
          })

          return z.NEVER
        }

        if (val.month === '' && (val.day !== '' || val.year !== '')) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: messages.date.mustIncludeMonth,
            fatal: true,
          })

          return z.NEVER
        }

        if (val.year === '' && (val.month !== '' || val.day !== '')) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: messages.date.mustIncludeYear,
            fatal: true,
          })

          return z.NEVER
        }

        const inputDate = new Date(Number(val.year), Number(val.month), Number(val.day))
        if (messages.date.mustBeInPast && inputDate > new Date()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: messages.date.mustBeInPast,
            fatal: true,
          })

          return z.NEVER
        }

        if (
          z
            .object({
              day: z.coerce.number().int().min(1).max(31),
              month: z.coerce.number().int().min(1).max(12),
              year: z.coerce.number().int().min(1900).max(2200),
            })
            .safeParse(val).error
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: messages.date.mustBeReal,
            fatal: true,
          })

          return z.NEVER
        }
      }

      if (val.hours) {
        if (val.hours === '' && val.minutes !== '') {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: messages.time.mustIncludeHour,
            fatal: true,
          })

          return z.NEVER
        }

        if (val.hours !== '' && val.minutes === '') {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: messages.time.mustIncludeMinute,
            fatal: true,
          })

          return z.NEVER
        }
        if (
          z
            .object({
              hours: z
                .string()
                .transform(hour => (hour === '' ? Number.isNaN : hour))
                .pipe(z.coerce.number().int().min(0).max(23)),
              minutes: z
                .string()
                .transform(min => (min === '' ? Number.isNaN : min))
                .pipe(z.coerce.number().int().min(0).max(59)),
            })
            .safeParse(val).error
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: messages.time.mustBeReal,
            fatal: true,
          })

          return z.NEVER
        }
      }
      if (messages.time.required && val.hours === '' && val.minutes === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: messages.time.required,
          fatal: true,
        })

        return z.NEVER
      }

      return false
    })
    .transform(value => {
      if (value.day === '' && value.month === '' && value.year === '' && value.hours === '' && value.minutes === '') {
        return null
      }

      const day = parseInt(value.day, 10)
      const month = parseInt(value.month, 10) - 1
      const year = parseInt(value.year, 10)
      let hours = 0
      let minutes = 0
      if (value.hours !== '' && value.minutes !== '') {
        hours = parseInt(value.hours, 10)
        minutes = parseInt(value.minutes, 10)
      }

      return new Date(year, month, day, hours, minutes).toISOString()
    })
    .pipe(z.string().datetime().nullable())
}

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
