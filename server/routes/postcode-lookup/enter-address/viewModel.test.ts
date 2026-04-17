import { ValidationResult } from '../../../models/Validation'
import { validationErrors } from '../../../constants/validationErrors'
import ViewModel from './viewModel'
import { AddressFormData } from '../../../models/form-data/address'
import { Address } from '../../../models/Address'

describe('view model', () => {
  describe('errors', () => {
    const mockErrors: ValidationResult = [
      { error: validationErrors.address.addressLine1Required, field: 'addressLine1' },
      { error: validationErrors.address.addressLine3Required, field: 'addressLine3' },
      { error: validationErrors.postcodeLookup.postcodeRequired, field: 'postcode' },
    ]
    const mockFormData = {} as AddressFormData
    const addresses = [] as Array<Address>

    const model = ViewModel.construct('PRIMARY', addresses, mockFormData, mockErrors)

    it('sets error text if address line 1 error', () => {
      expect(model.addressLine1.error?.text).toBe(validationErrors.address.addressLine1Required)
    })

    it('sets error text if address line 3 error', () => {
      expect(model.addressLine3.error?.text).toBe(validationErrors.address.addressLine3Required)
    })

    it('sets error text if postcode error', () => {
      expect(model.postcode.error?.text).toBe(validationErrors.postcodeLookup.postcodeRequired)
    })
  })
})
