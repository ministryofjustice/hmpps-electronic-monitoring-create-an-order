import { ErrorMessage } from '../models/view-models/utils'
import { ValidationResult } from '../models/Validation'

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

  return new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10)).toISOString()
}

export const deserialiseDate = (dateString: string): [year: string, month: string, day: string] => {
  if (isBlank(dateString)) {
    return ['', '', '']
  }

  const date = new Date(dateString)

  return [date.getFullYear().toString(), (date.getMonth() + 1).toString(), date.getDate().toString()]
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
