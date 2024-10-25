import z from 'zod'
import { ValidationError, ValidationErrorModel } from '../../models/Validation'

const dateModel = z.object({
  day: z.number().int().min(1).max(31),
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(1900).max(2200),
})

const DateValidationResonseModel = z.object({
  result: z.boolean(),
  error: ValidationErrorModel.optional(),
})

type DateValidationResponse = z.infer<typeof DateValidationResonseModel>

export default class DateValidator {
  static isValidDate(dayStr: string, monthStr: string, yearStr: string, field: string): DateValidationResponse {
    const day = dayStr ? parseInt(dayStr, 10) : NaN
    const month = monthStr ? parseInt(monthStr, 10) : NaN
    const year = yearStr ? parseInt(yearStr, 10) : NaN
    const validationError: ValidationError = {
      field,
      error:
        'Date is in the incorrect format. Enter the date in the format DD/MM/YYYY (Day/Month/Year). For example, 24/10/2024.',
    }

    try {
      dateModel.parse({ day, month, year })
      return { result: true }
    } catch (error) {
      return { result: false, error: validationError }
    }
  }
}
