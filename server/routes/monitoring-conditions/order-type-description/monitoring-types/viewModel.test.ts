import { MonitoringConditions } from '../model'
import { ValidationResult } from '../../../../models/Validation'
import constructModel, { MonitoringTypeModel } from './viewModel'
import { createAddress, getMockOrder } from '../../../../../test/mocks/mockOrder'
import config from '../../../../config'

describe('model', () => {
  const mockOrder = getMockOrder()
  mockOrder.addresses.push(createAddress())
  mockOrder.deviceWearer.adultAtTimeOfInstallation = true

  it('empty form data', () => {
    const model = constructModel({}, [], mockOrder)

    const expected: MonitoringTypeModel = {
      curfew: { value: false, disabled: false },
      exclusionZone: { value: false, disabled: false },
      trail: { value: false, disabled: false },
      mandatoryAttendance: { value: false, disabled: false },
      alcohol: { value: false, disabled: false },
      errorSummary: null,
      monitoringConditionTimes: config.monitoringConditionTimes.enabled,
    }

    expect(model).toEqual(expected)
  })

  it('with errors', () => {
    const errors: ValidationResult = [{ error: 'some error', field: 'monitoringTypes' }]
    const model = constructModel({}, errors, mockOrder)

    const expected: MonitoringTypeModel = {
      curfew: { value: false, disabled: false },
      exclusionZone: { value: false, disabled: false },
      trail: { value: false, disabled: false },
      mandatoryAttendance: { value: false, disabled: false },
      alcohol: { value: false, disabled: false },
      error: { text: 'some error' },
      errorSummary: { errorList: [{ href: '#monitoringTypes', text: 'some error' }], titleText: 'There is a problem' },
      monitoringConditionTimes: config.monitoringConditionTimes.enabled,
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

    const model = constructModel(data, [], mockOrder)

    const expected: MonitoringTypeModel = {
      curfew: { value: true, disabled: false },
      exclusionZone: { value: true, disabled: false },
      trail: { value: true, disabled: false },
      mandatoryAttendance: { value: true, disabled: false },
      alcohol: { value: true, disabled: false },
      errorSummary: null,
      monitoringConditionTimes: config.monitoringConditionTimes.enabled,
    }

    expect(model).toEqual(expected)
  })

  it('hdc no, no pilot', () => {
    const data: MonitoringConditions = {
      hdc: 'NO',
      pilot: 'UNKNOWN',
    }

    const model = constructModel(data, [], mockOrder)

    const expected: MonitoringTypeModel = {
      curfew: { value: false, disabled: true },
      exclusionZone: { value: false, disabled: true },
      trail: { value: false, disabled: true },
      mandatoryAttendance: { value: false, disabled: true },
      alcohol: { value: false, disabled: false },
      errorSummary: null,
      message:
        'Some monitoring types can’t be selected because the device wearer is not on a Home Detention Curfew (HDC) or part of any pilots.',
      monitoringConditionTimes: config.monitoringConditionTimes.enabled,
    }

    expect(model).toEqual(expected)
  })

  it('hdc no, pilot is GPS AC', () => {
    const data: MonitoringConditions = {
      hdc: 'NO',
      pilot: 'GPS_ACQUISITIVE_CRIME_PAROLE',
    }

    const model = constructModel(data, [], mockOrder)

    const expected: MonitoringTypeModel = {
      curfew: { value: false, disabled: true },
      exclusionZone: { value: false, disabled: true },
      trail: { value: false, disabled: false },
      mandatoryAttendance: { value: false, disabled: true },
      alcohol: { value: false, disabled: true },
      errorSummary: null,
      message:
        "Some monitoring types can't be selected because the device wearer is not on a Home Detention Curfew (HDC).",
      monitoringConditionTimes: config.monitoringConditionTimes.enabled,
    }

    expect(model).toEqual(expected)
  })
})
