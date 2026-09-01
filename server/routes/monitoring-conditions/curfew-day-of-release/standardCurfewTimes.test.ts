import { CurfewReleaseDate } from '../../../models/CurfewReleaseDate'
import { STANDARD_CURFEW_TIMES, isStandardCurfewTimes } from './standardCurfewTimes'

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
})
