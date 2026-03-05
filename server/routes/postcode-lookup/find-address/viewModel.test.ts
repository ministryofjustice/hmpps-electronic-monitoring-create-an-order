import { v4 as uuidv4 } from 'uuid'
import paths from '../../../constants/paths'
import getContent from '../../../i18n'
import { Order } from '../../../models/Order'
import ViewModel from './viewModel'

describe('view model', () => {
  describe('address type is device wearer', () => {
    const content = getContent('en', 'DDV6')
    const mockOrder = { id: uuidv4() } as Order
    const model = ViewModel.construct(mockOrder, content)
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
