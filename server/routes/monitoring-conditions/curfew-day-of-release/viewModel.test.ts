import { getMockOrder } from '../../../../test/mocks/mockOrder'
import constructModel from './viewModel'

describe('curfew day of release view model', () => {
  it('leaves the standard curfew times answer unselected when no release-day times are saved', () => {
    const model = constructModel(getMockOrder(), [])

    expect(model).toEqual({
      standardCurfewTimes: { value: '' },
      errorSummary: null,
    })
  })
})
