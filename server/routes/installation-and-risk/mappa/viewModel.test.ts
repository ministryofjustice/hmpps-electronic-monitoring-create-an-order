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
    const order = { mappa: { level: 'MAPPA_ONE', category: 'CATEGORY_ONE' } } as Order

    const result = ViewModel.construct(order)

    expect(result.level?.value).toBe(order.mappa?.level)
    expect(result.category?.value).toBe(order.mappa?.category)
  })
})
