import { OffenceOtherInfoFormDataValidator } from './formModel'
import { validationErrors } from '../../../constants/validationErrors'

describe('offence other info form model', () => {
  describe('validator', () => {
    const validator = OffenceOtherInfoFormDataValidator
    it('accepts valid data when No is selected', () => {
      const data = {
        hasOtherInformation: 'no',
        otherInformationDetails: '',
      }

      const result = validator.safeParse(data)

      expect(result.success).toBe(true)
    })

    it('accepts valid data when Yes is selected with details', () => {
      const data = {
        hasOtherInformation: 'yes',
        otherInformationDetails: 'some relevant offence information',
      }

      const result = validator.safeParse(data)

      expect(result.success).toBe(true)
    })

    it('error if Yes is selected but details are empty', () => {
      const data = {
        hasOtherInformation: 'yes',
        otherInformationDetails: '  ',
      }

      const result = validator.safeParse(data)

      expect(result.success).toBe(false)
      const error = result.error?.errors[0]
      expect(error?.message).toBe(validationErrors.offenceOtherInformation.detailsRequired)
      expect(error?.path[0]).toBe('otherInformationDetails')
    })

    it('error if details are too long', () => {
      const data = {
        hasOtherInformation: 'yes',
        otherInformationDetails: 'a'.repeat(501),
      }

      const result = validator.safeParse(data)

      expect(result.success).toBe(false)
      const error = result.error?.errors[0]
      expect(error?.message).toBe(validationErrors.offenceOtherInformation.tooLong)
      expect(error?.path[0]).toBe('otherInformationDetails')
    })
  })
})
