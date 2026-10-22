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
  value: boolean | null | undefined,
  nullValue: T,
  truthyValue: T,
  falsyValue: T,
) => {
  if (value === null || value === undefined) {
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

export const isNotNullOrEmptyString = (value: string | null | undefined) => isNotNullOrUndefined(value) && value !== ''

export const filterNullValues = (obj: object) => Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== null))
