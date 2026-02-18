import { TrailMonitoringFormData, TrailMonitoringFormDataValidator } from './trailMonitoring'

describe('trail monitoring model', () => {
  describe('end date validation', () => {
    describe('when home office', () => {
      const validator = TrailMonitoringFormDataValidator('HOME_OFFICE')
      it('should default end date to 2040-01-01 23:59:59 when empty', () => {
        const formData: Omit<TrailMonitoringFormData, 'action'> = {
          startDate: {
            year: '2024',
            month: '1',
            day: '1',
            hours: '0',
            minutes: '0',
          },
          endDate: {
            year: '',
            month: '',
            day: '',
            hours: '0',
            minutes: '0',
          },
          deviceType: 'FITTED',
        }

        const result = validator.safeParse(formData)

        expect(result.success).toBe(true)
        expect(result.data?.endDate).toBe('2040-01-01T23:59:59.000Z')
      })

      it('should validate endDate when provided', () => {
        const formData: Omit<TrailMonitoringFormData, 'action'> = {
          startDate: {
            year: '2024',
            month: '1',
            day: '1',
            hours: '0',
            minutes: '0',
          },
          endDate: {
            year: '2027',
            month: '2',
            day: '8',
            hours: '0',
            minutes: '0',
          },
          deviceType: 'FITTED',
        }

        const result = validator.safeParse(formData)

        expect(result.success).toBe(true)
        expect(result.data?.endDate).toBe('2027-02-08T00:00:00.000Z')
      })
    })

    describe('when not home office', () => {
      it('should require endDate', () => {
        const validator = TrailMonitoringFormDataValidator('PROBATION')
        const formData: Omit<TrailMonitoringFormData, 'action'> = {
          startDate: {
            year: '2024',
            month: '1',
            day: '1',
            hours: '0',
            minutes: '0',
          },
          endDate: {
            year: '',
            month: '',
            day: '',
            hours: '0',
            minutes: '0',
          },
          deviceType: 'FITTED',
        }

        const result = validator.safeParse(formData)

        expect(result.success).toBe(false)
        expect(result.error?.issues[0].message).toBe('Enter end date for trail monitoring')
      })
    })
  })
})
