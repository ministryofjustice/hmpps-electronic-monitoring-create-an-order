const properCase = (word: string): string =>
  word.length >= 1 ? word[0].toUpperCase() + word.toLowerCase().slice(1) : word

export const isBlank = (str: string): boolean => !str || /^\s*$/.test(str)

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

export const camelCaseToSentenceCase = (input: string): string => {
  if (typeof input !== 'string') return input

  const lowerCaseKey = input.replace(/([A-Z])/g, ' $1').toLowerCase()

  const sentenceCaseKey = lowerCaseKey.charAt(0).toUpperCase() + lowerCaseKey.slice(1)

  return sentenceCaseKey.trim()
}

export const toTitleCase = (input: string): string => {
  if (typeof input !== 'string') return input

  return input.replace(/\w\S*/g, text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase())
}
