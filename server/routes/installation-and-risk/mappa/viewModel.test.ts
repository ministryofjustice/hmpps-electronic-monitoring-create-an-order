import { Order } from '../../../models/Order'
import ViewModel from './viewModel'

describe('view model', () => {
  it('should return empty values if order is empty', () => {
    const order = {} as Order

    const result = ViewModel.construct(order)

    expect(result.level?.value).toBe('')
    expect(result.category?.value).toBe('')
  })

  it('should return values from order if there', () => {
    const order = { installationAndRisk: { mappaLevel: 'MAPPA 1', mappaCaseType: 'Category 1' } } as Order

    const result = ViewModel.construct(order)

    expect(result.level?.value).toBe(order.installationAndRisk?.mappaLevel)
    expect(result.category?.value).toBe(order.installationAndRisk?.mappaCaseType)
  })
})
