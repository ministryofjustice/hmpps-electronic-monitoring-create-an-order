import { v4 as uuidv4 } from 'uuid'
import paths from '../../../constants/paths'
import getContent from '../../../i18n'
import { Order } from '../../../models/Order'
import ViewModel from './viewModel'
import { ValidationResult } from '../../../models/Validation'

describe('view model', () => {
  describe('errors', () => {
    const content = getContent('en', 'DDV6')
    const mockOrder = { id: uuidv4() } as Order
    const mockErrors: ValidationResult = [{ error: 'Enter the postcode', field: 'postcode' }]
    const model = ViewModel.construct(mockOrder, content, mockErrors)
    it('sets error text if postcode error', () => {
      expect(model.postcode.error?.text).toBe('Enter the postcode')
    })
    it('error summary exists', () => {
      expect(model.errorSummary).not.toBeNull()
    })
  })
  describe('address type is device wearer', () => {
    const content = getContent('en', 'DDV6')
    const mockOrder = { id: uuidv4() } as Order
    const mockErrors: ValidationResult = []
    const model = ViewModel.construct(mockOrder, content, mockErrors)
    it('content has correct headings', () => {
      expect(model.content).toEqual({
        section: 'About the device wearer',
        title: "Find the device wearer's address",
        legend: '',
        helpText: '',
        questions: expect.anything(),
      })
    })

    it('content has correct questions', () => {
      expect(model.content.questions).toEqual({
        postcode: {
          text: 'Postcode',
          hint: 'For example, AA3 1AB',
        },
        buildingId: {
          text: 'Building number or name (optional)',
          hint: 'For example, 15 or Prospect Cottage',
        },
      })
    })

    it('manual address link is correct', () => {
      expect(model.manualAddressLink).toBe(
        paths.POSTCODE_LOOKUP.ENTER_ADDRESS.replace(':orderId', mockOrder.id).replace(':addressType', 'device-wearer'),
      )
    })
  })
})
