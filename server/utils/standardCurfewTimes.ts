import { CurfewReleaseDate } from '../models/CurfewReleaseDate'
import { CurfewSchedule } from '../models/CurfewTimetable'
import { serialiseTime } from './utils'

const startHours = '19'
const startMinutes = '00'
const endHours = '07'
const endMinutes = '00'

export const STANDARD_CURFEW_TIMES = {
  startHours,
  startMinutes,
  endHours,
  endMinutes,
  startTime: serialiseTime(startHours, startMinutes)!,
  endTime: serialiseTime(endHours, endMinutes)!,
} as const

export const isStandardCurfewTimes = (conditions: CurfewReleaseDate | null | undefined): boolean =>
  conditions?.startTime === STANDARD_CURFEW_TIMES.startTime && conditions?.endTime === STANDARD_CURFEW_TIMES.endTime

const DAYS_OF_WEEK = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']

export const isStandardCurfewSchedule = (
  schedule: CurfewSchedule[] | null | undefined,
  curfewAddress: string | null | undefined,
): boolean => {
  if (!schedule || schedule.length !== DAYS_OF_WEEK.length) {
    return false
  }

  return DAYS_OF_WEEK.every(dayOfWeek => {
    const entry = schedule.find(item => item.dayOfWeek === dayOfWeek)
    return (
      entry !== undefined &&
      entry.startTime === STANDARD_CURFEW_TIMES.startTime &&
      entry.endTime === STANDARD_CURFEW_TIMES.endTime &&
      entry.curfewAddress === curfewAddress
    )
  })
}

export const createStandardCurfewSchedule = (curfewAddress: string | null | undefined): CurfewSchedule[] =>
  DAYS_OF_WEEK.map(dayOfWeek => ({
    dayOfWeek,
    curfewAddress: curfewAddress ?? '',
    startTime: STANDARD_CURFEW_TIMES.startTime,
    endTime: STANDARD_CURFEW_TIMES.endTime,
  }))

export default STANDARD_CURFEW_TIMES
