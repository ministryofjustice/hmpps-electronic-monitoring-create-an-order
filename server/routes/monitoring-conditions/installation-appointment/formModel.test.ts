import { validationErrors } from '../../../constants/validationErrors'
import { InstallationAppointmentFormDataValidator } from './formModel'

const buildData = (placeName: string) => ({
  placeName,
  appointmentDate: { day: '1', month: '2', year: '2030', hours: '10', minutes: '30' },
  appointmentTimeDetails: '',
})

describe('InstallationAppointmentFormDataValidator', () => {
  describe('when installation location is a prison', () => {
    it('accepts a prison key from the reference data', () => {
      const result = InstallationAppointmentFormDataValidator(false, true).safeParse(buildData('WYMOTT_PRISON'))

      expect(result.success).toBe(true)
    })

    it.each(['Wymott Prison', 'NOT_A_PRISON'])('rejects %s', placeName => {
      const result = InstallationAppointmentFormDataValidator(false, true).safeParse(buildData(placeName))

      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toBe(validationErrors.installationAppointment.placeNameInvalidPrison)
    })

    it('requires a place name', () => {
      const result = InstallationAppointmentFormDataValidator(false, true).safeParse(buildData(''))

      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toBe(validationErrors.installationAppointment.placeNameRequired)
    })
  })

  describe('when installation location is not a prison', () => {
    it('accepts any non-empty place name', () => {
      const result = InstallationAppointmentFormDataValidator(false, false).safeParse(buildData('Any Place'))

      expect(result.success).toBe(true)
    })
  })
})
