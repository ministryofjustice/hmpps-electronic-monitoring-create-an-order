import { AddressWithoutType } from '../models/Address'
import { ValidationResult } from '../models/Validation'
import { ErrorMessage, ErrorsViewModel } from '../models/view-models/utils'
import ReferenceData from '../types/i18n/reference/reference'

const YEAR_IN_MS = 365.25 * 24 * 60 * 60 * 1000

const properCase = (word: string): string =>
  word.length >= 1 ? word[0].toUpperCase() + word.toLowerCase().slice(1) : word

const isBlank = (str: string): boolean => !str || /^\s*$/.test(str)

/**
 * Converts a name (first name, last name, middle name, etc.) to proper case equivalent, handling double-barreled names
 * correctly (i.e. each part in a double-barreled is converted to proper case).
 * @param name name to be converted.
 * @returns name converted to proper case.
 */
const properCaseName = (name: string): string => (isBlank(name) ? '' : name.split('-').map(properCase).join('-'))

export const convertToTitleCase = (sentence: string): string =>
  isBlank(sentence) ? '' : sentence.split(' ').map(properCaseName).join(' ')

export const initialiseName = (fullName?: string): string | undefined => {
  // this check is for the authError page
  if (!fullName) return undefined

  const array = fullName.split(' ')
  return `${array[0][0]}. ${array.reverse()[0]}`
}

export const calculateAge = (birthDate: string) =>
  Math.floor((new Date().getTime() - new Date(birthDate).getTime()) / YEAR_IN_MS)

export const serialiseDate = (year: string, month: string, day: string) => {
  if (isBlank(year) || isBlank(month) || isBlank(day)) {
    return null
  }

  return new Date(Date.UTC(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10))).toISOString()
}

export const deserialiseDateTime = (dateString: string | null | undefined) => {
  if (dateString === null || dateString === undefined || dateString === '') {
    return {
      hours: '',
      minutes: '',
      day: '',
      month: '',
      year: '',
    }
  }

  const date = new Date(dateString)

  return {
    minutes: date.getMinutes().toString().padStart(2, '0'),
    hours: date.getHours().toString().padStart(2, '0'),
    day: date.getDate().toString().padStart(2, '0'),
    month: (date.getMonth() + 1).toString().padStart(2, '0'),
    year: date.getFullYear().toString(),
  }
}

export const serialiseTime = (hour: string, minute: string): string | null => {
  const hourValid = /\d{1,2}/.test(hour)
  const minuteValid = /\d{1,2}/.test(minute)

  if (!hourValid || !minuteValid) {
    return null
  }
  return `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}:00`
}

export const deserialiseTime = (timeString?: string | null): [hours: string, minutes: string] => {
  if (!timeString || isBlank(timeString)) {
    return ['', '']
  }
  const timeMatch = timeString.match(/(\d{2}):(\d{2}):\d{2}/)
  if (!timeMatch) {
    return ['', '']
  }
  return [timeMatch[1], timeMatch[2]]
}

export const getError = (validationErrors: ValidationResult, field: string): ErrorMessage | undefined => {
  const matchedError = validationErrors.find(e => e.field === field)

  if (matchedError) {
    return {
      text: matchedError.error,
    }
  }

  return undefined
}

export const getErrors = (validationErrors: ValidationResult, fields: string[]): ErrorMessage | undefined => {
  const matchedErrors = validationErrors.filter(e => fields.includes(e.field))

  if (matchedErrors.length > 0) {
    return {
      text: matchedErrors.map(e => e.error).join(', '),
    }
  }

  return undefined
}

export const getErrorsViewModel = (validationErrors: ValidationResult): ErrorsViewModel => {
  const viewModel: ErrorsViewModel = {}
  validationErrors.forEach(error => {
    viewModel[error.field] = { text: error.error }
  })
  return viewModel
}

export const camelCaseToSentenceCase = (input: string): string => {
  if (typeof input !== 'string') return input

  const lowerCaseKey = input.replace(/([A-Z])/g, ' $1').toLowerCase()

  const sentenceCaseKey = lowerCaseKey.charAt(0).toUpperCase() + lowerCaseKey.slice(1)

  return sentenceCaseKey.trim()
}

export const checkType = (input: unknown): string => {
  if (Array.isArray(input)) {
    return 'array'
  }
  if (typeof input === 'object') {
    return 'object'
  }
  if (typeof input === 'string') {
    return 'string'
  }
  return 'other'
}

export const isEmpty = (input: unknown): boolean => {
  if (
    input === null ||
    input === undefined ||
    input === '' ||
    (Array.isArray(input) && input.length === 0) ||
    (typeof input === 'object' && Object.keys(input).length === 0)
  ) {
    return true
  }
  return false
}

export const convertBooleanToEnum = <T extends string>(
  value: boolean | null,
  nullValue: T,
  truthyValue: T,
  falsyValue: T,
) => {
  if (value === null) {
    return nullValue
  }

  if (value) {
    return truthyValue
  }

  return falsyValue
}

export const isNullOrUndefined = <T>(value: T | null | undefined): value is null | undefined => {
  return value === null || value === undefined
}

export const isNotNullOrUndefined = <T>(value: T | null | undefined): value is T => !isNullOrUndefined(value)

export const lookup = (map: ReferenceData, value: string | null | undefined, defaultValue: string = ''): string => {
  if (isNullOrUndefined(value)) {
    return defaultValue
  }

  if (Object.keys(map).includes(value)) {
    if (typeof map[value] === 'object') {
      return map[value].text
    }
    return map[value]
  }

  return defaultValue
}

export const createAddressPreview = (address: AddressWithoutType | null | undefined): string =>
  isNullOrUndefined(address) ? '' : `${address.addressLine1}, ${address.addressLine2}, ${address.postcode}`
