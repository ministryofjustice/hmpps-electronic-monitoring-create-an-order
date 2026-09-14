import { getMockOrder } from '../../../../test/mocks/mockOrder'
import { validationErrors } from '../../../constants/validationErrors'
import constructModel from './viewModel'

describe('curfew day of release view model', () => {
  it('selects yes when the standard release-day curfew times are saved', () => {
    const order = getMockOrder({
      curfewReleaseDateConditions: {
        startTime: '19:00:00',
        endTime: '07:00:00',
        curfewAddress: null,
        releaseDate: null,
      },
    })

    const model = constructModel(order, [])

    expect(model.standardCurfewTimes).toEqual({ value: 'YES' })
  })

  it('selects no when non-standard release-day curfew times are saved', () => {
    const order = getMockOrder({
      curfewReleaseDateConditions: {
        startTime: '20:00:00',
        endTime: '07:00:00',
        curfewAddress: null,
        releaseDate: null,
      },
    })

    const model = constructModel(order, [])

    expect(model.standardCurfewTimes).toEqual({ value: 'NO' })
  })

  it('leaves the standard curfew times answer unselected when no release-day times are saved', () => {
    const model = constructModel(getMockOrder(), [])

    expect(model).toEqual({
      standardCurfewTimes: { value: '' },
      errorSummary: null,
    })
  })

  it('adds the validation error to the question and the error summary', () => {
    const error = validationErrors.curfewDayOfRelease.standardCurfewTimesRequired

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
