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

    it('error summary exists', () => {
      expect(model.errorSummary).not.toBeNull()
    })
  })

  describe('address population', () => {
    const addresses: Address[] = [
      {
        addressType: 'PRIMARY',
        addressLine1: '90 High Road',
        addressLine2: '',
        addressLine3: 'Bath',
        addressLine4: '',
        postcode: 'AB12 3CD',
      },
    ]

    const model = ViewModel.construct('PRIMARY', addresses, {} as AddressFormData, [])

    it('populates values when present', () => {
      expect(model.addressLine1.value).toBe('90 High Road')
      expect(model.addressLine2.value).toBe('')
      expect(model.addressLine3.value).toBe('Bath')
      expect(model.addressLine4.value).toBe('')
      expect(model.postcode.value).toBe('AB12 3CD')
    })

    it('has null error summary', () => {
      expect(model.errorSummary).toBeNull()
    })
  })

  describe('no matching address', () => {
    const addresses: Address[] = [
      {
        addressType: 'SECONDARY',
        addressLine1: '20 Main Street',
        addressLine2: '',
        addressLine3: 'Hertfordshire',
        addressLine4: '',
        postcode: 'HH12 3CD',
      },
    ]

    const model = ViewModel.construct('PRIMARY', addresses, {} as AddressFormData, [])

    it('returns blank value for fields if no match', () => {
      expect(model.addressLine1.value).toBe('')
      expect(model.addressLine2.value).toBe('')
      expect(model.addressLine3.value).toBe('')
      expect(model.addressLine4.value).toBe('')
      expect(model.postcode.value).toBe('')
    })
  })
})
