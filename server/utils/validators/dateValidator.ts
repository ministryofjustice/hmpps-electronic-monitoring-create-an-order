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
  static isValidDateFormat(dayStr: string, monthStr: string, yearStr: string, field: string): DateValidationResponse {
    if (this.isEmpty(dayStr) && this.isEmpty(monthStr) && this.isEmpty(yearStr)) {
      return { result: true }
    }

    const day = this.parseNumber(dayStr)
    const month = this.parseNumber(monthStr)
    const year = this.parseNumber(yearStr)

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

  private static isEmpty(value: string): boolean {
    return value.trim().length === 0
  }

  private static parseNumber(value: string): number {
    return value ? parseInt(value, 10) : NaN
  }
}
