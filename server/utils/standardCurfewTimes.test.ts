import { CurfewReleaseDate } from '../models/CurfewReleaseDate'
import { CurfewSchedule } from '../models/CurfewTimetable'
import {
  STANDARD_CURFEW_TIMES,
  isStandardCurfewTimes,
  isStandardCurfewSchedule,
  createStandardCurfewSchedule,
} from './standardCurfewTimes'

const createConditions = (overrides: Partial<CurfewReleaseDate> = {}): CurfewReleaseDate => ({
  curfewAddress: null,
  releaseDate: null,
  startTime: STANDARD_CURFEW_TIMES.startTime,
  endTime: STANDARD_CURFEW_TIMES.endTime,
  ...overrides,
})

describe('standard curfew times', () => {
  it('serialises the standard times consistently with the times sent to the api', () => {
    expect(STANDARD_CURFEW_TIMES.startTime).toEqual('19:00:00')
    expect(STANDARD_CURFEW_TIMES.endTime).toEqual('07:00:00')
  })

  describe('isStandardCurfewTimes', () => {
    it('is true when both saved times match the standard times', () => {
      expect(isStandardCurfewTimes(createConditions())).toBe(true)
    })

    it('is false when the start time differs', () => {
      expect(isStandardCurfewTimes(createConditions({ startTime: '20:00:00' }))).toBe(false)
    })

    it('is false when the end time differs', () => {
      expect(isStandardCurfewTimes(createConditions({ endTime: '08:00:00' }))).toBe(false)
    })

    it('is false when no times are saved', () => {
      expect(isStandardCurfewTimes(null)).toBe(false)
      expect(isStandardCurfewTimes(undefined)).toBe(false)
    })
  })

  describe('isStandardCurfewSchedule', () => {
    const address = '10 Downing Street, London, SW1A 2AA'
    const standardSchedule: CurfewSchedule[] = createStandardCurfewSchedule(address)

    it('is true when all 7 days match the standard times and address', () => {
      expect(isStandardCurfewSchedule(standardSchedule, address)).toBe(true)
    })

    it('is false when a day has a different start time', () => {
      const schedule = standardSchedule.map((entry, index) =>
        index === 0 ? { ...entry, startTime: '20:00:00' } : entry,
      )
      expect(isStandardCurfewSchedule(schedule, address)).toBe(false)
    })

    it('is false when a day has a different end time', () => {
      const schedule = standardSchedule.map((entry, index) => (index === 0 ? { ...entry, endTime: '08:00:00' } : entry))
      expect(isStandardCurfewSchedule(schedule, address)).toBe(false)
    })

    it('is false when a day has a different address than the given curfew address', () => {
      const schedule = standardSchedule.map((entry, index) =>
        index === 0 ? { ...entry, curfewAddress: 'Other address' } : entry,
      )
      expect(isStandardCurfewSchedule(schedule, address)).toBe(false)
    })

    it('is false when a day of the week is missing', () => {
      expect(isStandardCurfewSchedule(standardSchedule.slice(1), address)).toBe(false)
    })

    it('is false when there is no schedule', () => {
      expect(isStandardCurfewSchedule(null, address)).toBe(false)
      expect(isStandardCurfewSchedule(undefined, address)).toBe(false)
      expect(isStandardCurfewSchedule([], address)).toBe(false)
    })
  })

  describe('createStandardCurfewSchedule', () => {
    it('builds a 7-day schedule at 19:00-07:00 for the given address', () => {
      const schedule = createStandardCurfewSchedule('10 Downing Street, London, SW1A 2AA')

      expect(schedule).toEqual([
        {
          dayOfWeek: 'MONDAY',
          curfewAddress: '10 Downing Street, London, SW1A 2AA',
          startTime: '19:00:00',
          endTime: '07:00:00',
        },
        {
          dayOfWeek: 'TUESDAY',
          curfewAddress: '10 Downing Street, London, SW1A 2AA',
          startTime: '19:00:00',
          endTime: '07:00:00',
        },
        {
          dayOfWeek: 'WEDNESDAY',
          curfewAddress: '10 Downing Street, London, SW1A 2AA',
          startTime: '19:00:00',
          endTime: '07:00:00',
        },
        {
          dayOfWeek: 'THURSDAY',
          curfewAddress: '10 Downing Street, London, SW1A 2AA',
          startTime: '19:00:00',
          endTime: '07:00:00',
        },
        {
          dayOfWeek: 'FRIDAY',
          curfewAddress: '10 Downing Street, London, SW1A 2AA',
          startTime: '19:00:00',
          endTime: '07:00:00',
        },
        {
          dayOfWeek: 'SATURDAY',
          curfewAddress: '10 Downing Street, London, SW1A 2AA',
          startTime: '19:00:00',
          endTime: '07:00:00',
        },
        {
          dayOfWeek: 'SUNDAY',
          curfewAddress: '10 Downing Street, London, SW1A 2AA',
          startTime: '19:00:00',
          endTime: '07:00:00',
        },
      ])
    })
  })
})
