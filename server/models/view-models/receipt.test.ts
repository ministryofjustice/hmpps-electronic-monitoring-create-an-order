import { OrderStatus, OrderType } from '../Order'
import getEnglishContent from '../../i18n/en'
import { getMockOrder } from '../../../test/mocks/mockOrder'
import createViewModel from './receipt'

describe('receipt view model', () => {
  const content = getEnglishContent('DDV6')

  describe('type of change', () => {
    it.each([
      ['VARIATION', 'Other change'],
      ['REINSTALL_AT_DIFFERENT_ADDRESS', 'Added second or third curfew address'],
      ['REINSTALL_DEVICE', 'Changed primary address'],
      ['REVOCATION', 'Ended (Recall)'],
      ['END_MONITORING', 'Ended'],
    ])('returns the expected label for %s', (type, expectedLabel) => {
      const viewModel = createViewModel(getMockOrder({ type: type as OrderType }), content)

      expect(viewModel.statusDetails[2].value.text).toBe(expectedLabel)
    })
  })

  describe('order type', () => {
    it.each([
      ['REQUEST', 'IN_PROGRESS', 'Draft order'],
      ['REQUEST', 'SUBMITTED', 'Order Submitted'],
      ['AMEND_ORIGINAL_REQUEST', 'IN_PROGRESS', 'Draft order'],
      ['AMEND_ORIGINAL_REQUEST', 'SUBMITTED', 'Order Submitted'],
      ['REJECTED', 'SUBMITTED', 'Form returned'],
      ['VARIATION', 'IN_PROGRESS', 'Changes to an order'],
      ['VARIATION', 'SUBMITTED', 'Changes submitted'],
      ['REINSTALL_AT_DIFFERENT_ADDRESS', 'IN_PROGRESS', 'Changes to an order'],
      ['REINSTALL_AT_DIFFERENT_ADDRESS', 'SUBMITTED', 'Changes submitted'],
      ['REINSTALL_DEVICE', 'IN_PROGRESS', 'Changes to an order'],
      ['REINSTALL_DEVICE', 'SUBMITTED', 'Changes submitted'],
      ['REVOCATION', 'IN_PROGRESS', 'Changes to an order'],
      ['REVOCATION', 'SUBMITTED', 'Monitoring ended'],
      ['END_MONITORING', 'IN_PROGRESS', 'Changes to an order'],
      ['END_MONITORING', 'SUBMITTED', 'Monitoring ended'],
    ])('returns the expected label for %s with status %s', (type, status, expectedLabel) => {
      const viewModel = createViewModel(
        getMockOrder({ type: type as OrderType, status: status as OrderStatus }),
        content,
      )

      expect(viewModel.statusDetails[1].value.text).toBe(expectedLabel)
    })
  })
})
