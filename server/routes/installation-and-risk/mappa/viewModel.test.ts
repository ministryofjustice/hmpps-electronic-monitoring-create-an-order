import { Order } from '../../../models/Order'
import { ValidationResult } from '../../../models/Validation'
import { MappaInput } from './formModel'
import ViewModel from './viewModel'

describe('view model', () => {
  it('should return empty values if order is empty', () => {
    const order = {} as Order

    const result = ViewModel.construct(order, {} as MappaInput, [])

    expect(result.level?.value).toBe('')
    expect(result.category?.value).toBe('')
  })

  it('should return values from order if there', () => {
    const order = { mappa: { level: 'MAPPA_ONE', category: 'CATEGORY_ONE' } } as Order

    const result = ViewModel.construct(order, {} as MappaInput, [])

    expect(result.level?.value).toBe(order.mappa?.level)
    expect(result.category?.value).toBe(order.mappa?.category)
  })

  it('should return values from the formModel', () => {
    const order = { mappa: { level: 'MAPPA_ONE', category: 'CATEGORY_ONE' } } as Order
    const formData = { level: 'MAPPA_TWO', category: 'CATEGORY_TWO' } as MappaInput

    const result = ViewModel.construct(order, formData, [])

    expect(result.level?.value).toBe(formData.level)
    expect(result.category?.value).toBe(formData.category)
  })

  it('should have correct errors', () => {
    const order = {} as Order
    const formData = {} as MappaInput
    const errors: ValidationResult = [
      { field: 'level', error: 'level error' },
      { field: 'category', error: 'category error' },
    ]

    const result = ViewModel.construct(order, formData, errors)

    expect(result.level?.error?.text).toBe('level error')
    expect(result.category?.error?.text).toBe('category error')
  })
})
