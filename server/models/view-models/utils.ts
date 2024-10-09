import { getError } from '../../utils/utils'
import { ValidationResult } from '../Validation'

export type ErrorMessage = {
  text: string
}

export type FormField = {
  error?: ErrorMessage
}

export type TextField = FormField & {
  value: string
}

export const TRUE = 'true'
export const FALSE = 'false'

export type YesNoField = FormField & {
  value: typeof TRUE | typeof FALSE
}

export type DateField = FormField & {
  day: string
  month: string
  year: string
}

export type MultipleChoiceField = FormField & {
  values: Array<string>
}

export type ViewModel<T> = {
  [K in keyof T]: T[K] extends Date
    ? DateField
    : T[K] extends boolean
      ? YesNoField
      : T[K] extends string[]
        ? MultipleChoiceField
        : TextField
}

export const constuctTextField = (field: string, value: string | null, errors: ValidationResult): TextField => {
  const error = getError(errors, field)
  if (value === null) {
    return { value: '', error }
  }
  return { value, error }
}

export const constructYesNoField = (field: string, value: boolean, errors: ValidationResult): YesNoField => {
  return { value: value ? TRUE : FALSE, error: getError(errors, field) }
}
