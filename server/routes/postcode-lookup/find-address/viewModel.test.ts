import { v4 as uuidv4 } from 'uuid'
import paths from '../../../constants/paths'
import getContent from '../../../i18n'
import { Order } from '../../../models/Order'
import ViewModel from './viewModel'
import { ValidationResult } from '../../../models/Validation'
import { validationErrors } from '../../../constants/validationErrors'

describe('view model', () => {
  describe('errors', () => {
    const content = getContent('en', 'DDV6')
    const mockOrder = { id: uuidv4() } as Order
    const mockErrors: ValidationResult = [
      { error: validationErrors.postcodeLookup.postcodeRequired, field: 'postcode' },
    ]

    const model = ViewModel.construct(mockOrder, content, mockErrors, 'device-wearer')

    it('sets error text if postcode error', () => {
      expect(model.postcode.error?.text).toBe(validationErrors.postcodeLookup.postcodeRequired)
    })

    it('error summary exists', () => {
      expect(model.errorSummary).not.toBeNull()
    })
  })

  describe('address type is device wearer', () => {
    const content = getContent('en', 'DDV6')
    const mockOrder = { id: uuidv4() } as Order
    const mockErrors: ValidationResult = []

    const model = ViewModel.construct(mockOrder, content, mockErrors, 'device-wearer')
    it('content has correct headings', () => {
      expect(model.content).toEqual(content.pages.deviceWearerAddress)
    })

    it('manual address link is correct', () => {
      expect(model.manualAddressLink).toBe(
        paths.POSTCODE_LOOKUP.ENTER_ADDRESS.replace(':orderId', mockOrder.id).replace(':addressType', 'device-wearer'),
      )
    })
  })

  describe('address type is tag-at-source', () => {
    const content = getContent('en', 'DDV6')
    const mockOrder = { id: uuidv4() } as Order
    const mockErrors: ValidationResult = []
    const model = ViewModel.construct(mockOrder, content, mockErrors, 'tag-at-source')
    it('content has correct headings', () => {
      expect(model.content).toEqual(content.pages.tagAtSourceAddress)
    })

    it('manual address link is correct', () => {
      expect(model.manualAddressLink).toBe(
        paths.POSTCODE_LOOKUP.ENTER_ADDRESS.replace(':orderId', mockOrder.id).replace(':addressType', 'tag-at-source'),
      )
    })
  })

  describe('address type is curfew', () => {
    const content = getContent('en', 'DDV6')
    const mockOrder = { id: uuidv4() } as Order
    const mockErrors: ValidationResult = []
    const model = ViewModel.construct(mockOrder, content, mockErrors, 'curfew')
    it('content has correct headings', () => {
      expect(model.content).toEqual(content.pages.curfewAddress)
    })

    it('manual address link is correct', () => {
      expect(model.manualAddressLink).toBe(
        paths.POSTCODE_LOOKUP.ENTER_ADDRESS.replace(':orderId', mockOrder.id).replace(':addressType', 'curfew'),
      )
    })
  })

  describe('address type is appointment', () => {
    const content = getContent('en', 'DDV6')
    const mockOrder = { id: uuidv4() } as Order
    const mockErrors: ValidationResult = []
    const model = ViewModel.construct(mockOrder, content, mockErrors, 'appointment')
    it('content has correct headings', () => {
      expect(model.content).toEqual(content.pages.appointmentAddress)
    })

    it('manual address link is correct', () => {
      expect(model.manualAddressLink).toBe(
        paths.POSTCODE_LOOKUP.ENTER_ADDRESS.replace(':orderId', mockOrder.id).replace(':addressType', 'appointment'),
      )
    })
  })
})
