import { Order } from '../../../models/Order'
import { ValidationResult } from '../../../models/Validation'
import { DapoInput } from './formModel'
import DapoModel from './viewModel'

describe('contructFromOrder', () => {
  const mockDapoId = 'dapo-123'
  const mockFormData = {} as unknown as DapoInput

  it('should return default values when the no match', () => {
    const mockOrder = {
      dapoClauses: [{ id: 'other-id', clause: 'other clause', date: '2022-01-01' }],
    } as unknown as Order

    const result = DapoModel.contruct(mockOrder, mockFormData, [], 'non-existent-id')

    expect(result.clause.value).toBe('')
    expect(result.date.value).toEqual({ day: '', hours: '', minutes: '', month: '', year: '' })
  })

  it('should map data correctly when the dapoClause exists in the order', () => {
    const mockOrder = {
      dapoClauses: [
        { id: 'other-id', clause: 'other clause', date: '2022-01-01' },
        { id: mockDapoId, clause: 'test clause value', date: '2023-01-01' },
      ],
    } as unknown as Order

    const result = DapoModel.contruct(mockOrder, mockFormData, [], mockDapoId)

    expect(result.clause.value).toBe('test clause value')
    expect(result.date.value).toEqual({ day: '01', hours: '00', minutes: '00', month: '01', year: '2023' })
  })

  it('should return default values when match has no values', () => {
    const mockOrder = {
      dapoClauses: [{ id: mockDapoId, clause: null, date: null }],
    } as unknown as Order

    const result = DapoModel.contruct(mockOrder, mockFormData, [], mockDapoId)

    expect(result.clause.value).toBe('')
    expect(result.date.value).toEqual({ day: '', hours: '', minutes: '', month: '', year: '' })
  })

  it('should use form data if it exists', () => {
    const mockOrder = {
      dapoClauses: [
        { id: 'other-id', clause: 'other clause', date: '2022-01-01' },
        { id: mockDapoId, clause: 'test clause value', date: '2023-01-01' },
      ],
    } as unknown as Order

    const formData = {
      clause: 'form clause',
      date: { day: '03', hours: '00', minutes: '00', month: '02', year: '2025' },
    } as unknown as DapoInput

    const result = DapoModel.contruct(mockOrder, formData, [], mockDapoId)

    expect(result.clause.value).toBe('form clause')
    expect(result.date.value).toEqual({ day: '03', hours: '00', minutes: '00', month: '02', year: '2025' })
  })

  it('should return errors correctly', () => {
    const mockErrors: ValidationResult = [
      { error: 'clause error', field: 'clause' },
      { error: 'date error', field: 'date' },
    ]

    const result = DapoModel.contruct({} as unknown as Order, mockFormData, mockErrors, mockDapoId)

    expect(result.clause.error?.text).toBe('clause error')
    expect(result.date.error?.text).toBe('date error')
    expect(result.errorSummary).toEqual({
      errorList: [
        { href: '#clause', text: 'clause error' },
        { href: '#date', text: 'date error' },
      ],
      titleText: 'There is a problem',
    })
  })
})
