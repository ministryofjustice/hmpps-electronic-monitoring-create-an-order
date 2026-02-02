import { Order } from '../../../models/Order'
import { ValidationResult } from '../../../models/Validation'
import { DetailsOfInstallationInput } from './formModel'
import DetailsOfInstallationModel from './viewModel'

describe('details of installation view model', () => {
  it('returns empty when no values in order', () => {
    const order = {} as Order

    const result = DetailsOfInstallationModel.construct(order, {} as DetailsOfInstallationInput, [])

    expect(result.possibleRisk.values).toEqual([])
    expect(result.riskCategory.values).toEqual([])
    expect(result.riskDetails.value).toBe('')
  })

  it('returns values from the order', () => {
    const order = {
      detailsOfInstallation: {
        riskCategory: ['HOMOPHOBIC_VIEWS', 'HISTORY_OF_SUBSTANCE_ABUSE'],
        riskDetails: 'some details',
      },
    } as Order

    const result = DetailsOfInstallationModel.construct(order, {} as DetailsOfInstallationInput, [])

    expect(result.possibleRisk.values).toEqual(['HOMOPHOBIC_VIEWS'])
    expect(result.riskCategory.values).toEqual(['HISTORY_OF_SUBSTANCE_ABUSE'])
    expect(result.riskDetails.value).toBe('some details')
  })

  it('returns errors with form data', () => {
    const order = {} as Order
    const formData = {
      possibleRisk: [],
      riskCategory: ['HISTORY_OF_SUBSTANCE_ABUSE'],
      riskDetails: 'some details',
      action: '',
    } as DetailsOfInstallationInput
    const errors = [{ error: 'some error', field: 'possibleRisk' }] as ValidationResult

    const result = DetailsOfInstallationModel.construct(order, formData, errors)

    expect(result.possibleRisk.values).toEqual([])
    expect(result.possibleRisk.error?.text).toEqual('some error')
    expect(result.riskCategory.values).toEqual(['HISTORY_OF_SUBSTANCE_ABUSE'])
    expect(result.riskDetails.value).toBe('some details')
    expect(result.errorSummary).toEqual({
      errorList: [{ href: '#possibleRisk', text: 'some error' }],
      titleText: 'There is a problem',
    })
  })
})
