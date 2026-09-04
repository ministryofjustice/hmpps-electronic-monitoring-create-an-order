import { getMockOrder, createCurfewConditions } from '../../../../test/mocks/mockOrder'
import { validationErrors } from '../../../constants/validationErrors'
import { createStandardCurfewSchedule } from '../../../utils/standardCurfewTimes'
import constructModel from './viewModel'

describe('curfew timetable question view model', () => {
  it('leaves the standard curfew times answer unselected when no curfew timetable is saved', () => {
    const model = constructModel(getMockOrder(), [])

    expect(model).toEqual({
      standardCurfewTimes: { value: '' },
      errorSummary: null,
    })
  })

  it('pre-selects YES when the saved timetable matches the standard curfew times and address', () => {
    const address = '10 Downing Street, London, SW1A 2AA'
    const order = getMockOrder({
      curfewConditions: createCurfewConditions({ curfewAddress: address }),
      curfewTimeTable: createStandardCurfewSchedule(address),
    })

    const model = constructModel(order, [])

    expect(model.standardCurfewTimes).toEqual({ value: 'YES' })
  })

  it('pre-selects NO when the saved timetable is a bespoke schedule', () => {
    const address = 'Some address'
    const bespokeSchedule = createStandardCurfewSchedule(address).map((entry, index) =>
      index === 0 ? { ...entry, startTime: '20:00:00', endTime: '06:00:00' } : entry,
    )
    const order = getMockOrder({
      curfewConditions: createCurfewConditions({ curfewAddress: address }),
      curfewTimeTable: bespokeSchedule,
    })

    const model = constructModel(order, [])

    expect(model.standardCurfewTimes).toEqual({ value: 'NO' })
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
