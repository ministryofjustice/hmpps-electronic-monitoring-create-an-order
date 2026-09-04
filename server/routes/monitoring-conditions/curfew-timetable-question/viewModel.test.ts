import { getMockOrder } from '../../../../test/mocks/mockOrder'
import constructModel from './viewModel'

describe('curfew timetable question view model', () => {
  it('leaves the standard curfew times answer unselected when no curfew timetable is saved', () => {
    const model = constructModel(getMockOrder(), [])

    expect(model).toEqual({
      standardCurfewTimes: { value: '' },
      errorSummary: null,
    })
  })
})
