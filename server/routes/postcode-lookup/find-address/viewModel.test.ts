import { v4 as uuidv4 } from 'uuid'
import paths from '../../../constants/paths'
import getContent from '../../../i18n'
import { Order } from '../../../models/Order'
import ViewModel from './viewModel'
import { ValidationResult } from '../../../models/Validation'
import { validationErrors } from '../../../constants/validationErrors'
import { FindAddressForm } from './formModel'

describe('view model', () => {
  describe('errors', () => {
    const content = getContent('en', 'DDV6')
    const mockOrder = { id: uuidv4() } as Order
    const mockErrors: ValidationResult = [
      { error: validationErrors.postcodeLookup.postcodeRequired, field: 'postcode' },
    ]
    const mockFormData = {} as FindAddressForm

    const model = ViewModel.construct(mockOrder, content, mockErrors, 'PRIMARY', mockFormData)

    it('sets error text if postcode error', () => {
      expect(model.postcode.error?.text).toBe(validationErrors.postcodeLookup.postcodeRequired)
    })

    it('error summary exists', () => {
      expect(model.errorSummary).not.toBeNull()
    })

    it('id has a value when one is given', () => {
      const formData = { buildingId: 'some id' } as FindAddressForm

      const modelWithFormData = ViewModel.construct(mockOrder, content, mockErrors, 'PRIMARY', formData)

      expect(modelWithFormData.buildingId?.value).toBe('some id')
    })
  })

  describe('address type is device wearer', () => {
    const content = getContent('en', 'DDV6')
    const mockOrder = { id: uuidv4() } as Order
    const mockErrors: ValidationResult = []
    const mockFormData = {} as FindAddressForm

    const model = ViewModel.construct(mockOrder, content, mockErrors, 'PRIMARY', mockFormData)
    it('content has correct headings', () => {
      expect(model.content).toEqual(content.pages.deviceWearerAddress)
    })

    it('manual address link is correct', () => {
      expect(model.manualAddressLink).toBe(
        paths.POSTCODE_LOOKUP.ENTER_ADDRESS.replace(':orderId', mockOrder.id).replace(':addressType', 'PRIMARY'),
      )
    })
  })

  describe('address type is tag-at-source', () => {
    const content = getContent('en', 'DDV6')
    const mockOrder = { id: uuidv4() } as Order
    const mockErrors: ValidationResult = []
    const mockFormData = {} as FindAddressForm

    const model = ViewModel.construct(mockOrder, content, mockErrors, 'INSTALLATION', mockFormData)
    it('content has correct headings', () => {
      expect(model.content).toEqual(content.pages.tagAtSourceAddress)
    })

    it('manual address link is correct', () => {
      expect(model.manualAddressLink).toBe(
        paths.POSTCODE_LOOKUP.ENTER_ADDRESS.replace(':orderId', mockOrder.id).replace(':addressType', 'INSTALLATION'),
      )
    })
  })

  describe('address type is curfew', () => {
    const content = getContent('en', 'DDV6')
    const mockOrder = { id: uuidv4() } as Order
    const mockErrors: ValidationResult = []
    const mockFormData = {} as FindAddressForm

    const model = ViewModel.construct(mockOrder, content, mockErrors, 'SECONDARY', mockFormData)
    it('content has correct headings', () => {
      expect(model.content).toEqual(content.pages.curfewAddress)
    })

    it('manual address link is correct', () => {
      expect(model.manualAddressLink).toBe(
        paths.POSTCODE_LOOKUP.ENTER_ADDRESS.replace(':orderId', mockOrder.id).replace(':addressType', 'SECONDARY'),
      )
    })
  })

  // TODO: re-add test once we can handle attendance monitoring address
  // describe.skip('address type is appointment', () => {
  // const content = getContent('en', 'DDV6')
  // const mockOrder = { id: uuidv4() } as Order
  // const mockErrors: ValidationResult = []
  // const mockFormData = {} as FindAddressForm
  //
  // const model = ViewModel.construct(mockOrder, content, mockErrors, '', mockFormData)
  // it('content has correct headings', () => {
  //   expect(model.content).toEqual(content.pages.appointmentAddress)
  // })
  //
  // it('manual address link is correct', () => {
  //   expect(model.manualAddressLink).toBe(
  //     paths.POSTCODE_LOOKUP.ENTER_ADDRESS.replace(':orderId', mockOrder.id).replace(':addressType', 'appointment'),
  //   )
  // })
  // })
})
