import { getMockOrder } from '../../../../test/mocks/mockOrder'
import { validationErrors } from '../../../constants/validationErrors'
import constructModel from './viewModel'

describe('curfew timetable question view model', () => {
  it('leaves the standard curfew times answer unselected when no curfew timetable is saved', () => {
    const model = constructModel(getMockOrder(), [])

    expect(model).toEqual({
      standardCurfewTimes: { value: '' },
      errorSummary: null,
    })
  })

  it('adds the validation error to the question and the error summary', () => {
    const error = validationErrors.curfewTimetableQuestion.standardCurfewTimesRequired

    const model = constructModel(getMockOrder(), [
      { error, field: 'standardCurfewTimes', focusTarget: 'standardCurfewTimes' },
    ])

    expect(model.standardCurfewTimes).toEqual({ value: '', error: { text: error } })
    expect(model.errorSummary).toEqual({
      titleText: 'There is a problem',
      errorList: [{ text: error, href: '#standardCurfewTimes' }],
    })
  })
})
