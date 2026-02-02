import { Order } from '../../../models/Order'
import DetailsOfInstallationModel from './viewModel'

describe('details of installation view model', () => {
  it('returns empty when no values in order', () => {
    const order = {} as Order

    const result = DetailsOfInstallationModel.construct(order)

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

    const result = DetailsOfInstallationModel.construct(order)

    expect(result.possibleRisk.values).toEqual(['HOMOPHOBIC_VIEWS'])
    expect(result.riskCategory.values).toEqual(['HISTORY_OF_SUBSTANCE_ABUSE'])
    expect(result.riskDetails.value).toBe('some details')
  })
})
