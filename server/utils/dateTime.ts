import { isBlank } from './strings'

const YEAR_IN_MS = 365.25 * 24 * 60 * 60 * 1000

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

export const formatDateTime = (dateToFormat: string): string => {
  const date = new Date(dateToFormat)
  const month = date.toLocaleString('default', { month: 'long' })
  return `${date.getDate()} ${month} ${date.getFullYear()}`
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

export const trimSeconds = (timeString?: string | null): string => {
  if (!timeString || isBlank(timeString)) {
    return ''
  }
  return timeString.split(':').slice(0, 2).join(':')
}
