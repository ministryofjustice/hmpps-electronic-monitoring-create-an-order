import { CurfewReleaseDate } from '../../../models/CurfewReleaseDate'
import { serialiseTime } from '../../../utils/utils'

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

export default STANDARD_CURFEW_TIMES
