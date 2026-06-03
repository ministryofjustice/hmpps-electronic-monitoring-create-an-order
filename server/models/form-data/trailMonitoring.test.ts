import { TrailMonitoringFormData, TrailMonitoringFormDataValidator } from './trailMonitoring'

describe('trail monitoring model', () => {
  describe('end date validation', () => {
    describe('when home office', () => {
      const validator = TrailMonitoringFormDataValidator('HOME_OFFICE')

      it('should allow empty end date', () => {
        const formData: Omit<TrailMonitoringFormData, 'action'> = {
          startDate: {
            year: '2024',
            month: '1',
            day: '1',
            hours: '0',
            minutes: '0',
          },
          deviceType: 'FITTED',
        }

        const result = validator.safeParse(formData)

        expect(result.success).toBe(true)
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
