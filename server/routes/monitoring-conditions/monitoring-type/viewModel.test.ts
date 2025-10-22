import { MonitoringConditions } from '../model'
import { ValidationResult } from '../../../models/Validation'
import constructModel, { MonitoringTypeModel } from './viewModel'

describe('model', () => {
  it('empty form data', () => {
    const model = constructModel({}, [])

    const expected: MonitoringTypeModel = {
      curfew: { value: false },
      exclusionZone: { value: false },
      trail: { value: false },
      mandatoryAttendance: { value: false },
      alcohol: { value: false },
      errorSummary: null,
    }

    expect(model).toEqual(expected)
  })

  it('with errors', () => {
    const errors: ValidationResult = [{ error: 'some error', field: 'monitoringTypes' }]
    const model = constructModel({}, errors)

    const expected: MonitoringTypeModel = {
      curfew: { value: false },
      exclusionZone: { value: false },
      trail: { value: false },
      mandatoryAttendance: { value: false },
      alcohol: { value: false },
      error: { text: 'some error' },
      errorSummary: { errorList: [{ href: '#monitoringTypes', text: 'some error' }], titleText: 'There is a problem' },
    }

    expect(model).toEqual(expected)
  })

  it('with data', () => {
    const data: MonitoringConditions = {
      curfew: true,
      exclusionZone: true,
      trail: true,
      mandatoryAttendance: true,
      alcohol: true,
    }

    const model = constructModel(data, [])

    const expected: MonitoringTypeModel = {
      curfew: { value: true },
      exclusionZone: { value: true },
      trail: { value: true },
      mandatoryAttendance: { value: true },
      alcohol: { value: true },
      errorSummary: null,
    }

    expect(model).toEqual(expected)
  })
})
