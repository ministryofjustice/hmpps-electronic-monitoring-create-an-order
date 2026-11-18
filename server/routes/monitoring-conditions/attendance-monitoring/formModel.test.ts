import { AttendanceMonitoringAddToListFormDataValidator } from './formModel'

const date = { day: '01', month: '01', year: '2030', hours: '00', minutes: '00' }
const valid = {
  id: null,
  startDate: date,
  endDate: { ...date, month: '02' },
  purpose: 'Meeting',
  appointmentDay: 'Monday',
  addressLine1: '1 Street',
  addressLine2: '',
  addressLine3: 'Town',
  addressLine4: '',
  postcode: 'AB1 2CD',
  startTimeHours: '09',
  startTimeMinutes: '30',
  endTimeHours: '17',
  endTimeMinutes: '00',
}

describe('AttendanceMonitoringAddToListFormDataValidator times', () => {
  it('accepts valid and empty times', () => {
    expect(AttendanceMonitoringAddToListFormDataValidator.safeParse(valid).success).toBe(true)
    expect(
      AttendanceMonitoringAddToListFormDataValidator.safeParse({
        ...valid,
        startTimeHours: '',
        startTimeMinutes: '',
        endTimeHours: '',
        endTimeMinutes: '',
      }).success,
    ).toBe(true)
  })

  it.each([
    ['startTime', { startTimeHours: '25' }],
    ['startTime', { startTimeMinutes: '70' }],
    ['endTime', { endTimeHours: '24' }],
    ['endTime', { endTimeMinutes: 'ab' }],
    ['startTime', { startTimeMinutes: '' }],
  ])('rejects an invalid %s', (field, override) => {
    const result = AttendanceMonitoringAddToListFormDataValidator.safeParse({ ...valid, ...override })

    expect(result.success).toBe(false)
    expect(result.error?.issues[0].path).toEqual([field])
  })
})
