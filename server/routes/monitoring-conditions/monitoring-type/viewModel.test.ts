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
      restrictionZone: { disabled: false },
      errorSummary: null,
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
      restrictionZone: { disabled: false },
      error: { text: 'some error' },
      errorSummary: { errorList: [{ href: '#monitoringType', text: 'some error' }], titleText: 'There is a problem' },
    }

    expect(model).toEqual(expected)
  })
})

describe('sentencing act dual running rules', () => {
  const mockOrder = (isSentencingAct: boolean | undefined) => {
    const order = getMockOrder()
    order.monitoringConditions.hdc = 'NO'
    order.monitoringConditions.pilot = 'UNKNOWN'
    order.addresses.push(createAddress())
    order.deviceWearer.adultAtTimeOfInstallation = true
    order.isSentencingAct = isSentencingAct
    return order
  }

  it('applies the default rules when the flag is not set', () => {
    const model = constructModel(mockOrder(undefined), [])

    expect(model.alcohol?.disabled).toBe(false)
    expect(model.curfew?.disabled).toBe(true)
    expect(model.exclusionZone?.disabled).toBe(true)
    expect(model.trail?.disabled).toBe(true)
    expect(model.mandatoryAttendance?.disabled).toBe(true)
    expect(model.restrictionZone?.disabled).toBe(true)
  })

  it('applies the isr/sentencing act rules when flag is set', () => {
    const model = constructModel(mockOrder(true), [])

    expect(model.alcohol?.disabled).toBe(false)
    expect(model.curfew?.disabled).toBe(false)
    expect(model.exclusionZone?.disabled).toBe(false)
    expect(model.trail?.disabled).toBe(false)
    expect(model.mandatoryAttendance?.disabled).toBe(false)
    expect(model.restrictionZone?.disabled).toBe(false)
  })
})
