import { ValidationResult } from '../../../models/Validation'
import constructModel, { MonitoringTypeModel } from './viewModel'
import { createAddress, getMockOrder } from '../../../../test/mocks/mockOrder'

describe('model', () => {
  const mockOrder = getMockOrder()
  mockOrder.addresses.push(createAddress())
  mockOrder.deviceWearer.adultAtTimeOfInstallation = true

  it('empty form data', () => {
    const model = constructModel(mockOrder, [])

    const expected: MonitoringTypeModel = {
      curfew: { disabled: false },
      exclusionZone: { disabled: false },
      trail: { disabled: false },
      mandatoryAttendance: { disabled: false },
      alcohol: { disabled: false },
      errorSummary: null,
      allconditionsDisabled:false
    }

    expect(model).toEqual(expected)
  })

  it('with errors', () => {
    const errors: ValidationResult = [{ error: 'some error', field: 'monitoringType' }]
    const model = constructModel(mockOrder, errors)

    const expected: MonitoringTypeModel = {
      curfew: { disabled: false },
      exclusionZone: { disabled: false },
      trail: { disabled: false },
      mandatoryAttendance: { disabled: false },
      alcohol: { disabled: false },
      error: { text: 'some error' },
      errorSummary: { errorList: [{ href: '#monitoringType', text: 'some error' }], titleText: 'There is a problem' },
      allconditionsDisabled: false
    }

    expect(model).toEqual(expected)
  })
})
