import { ValidationResult } from '../../../models/Validation'
import constructModel, { MonitoringTypeModel } from './viewModel'
import { createAddress, getMockOrder } from '../../../../test/mocks/mockOrder'
import { MonitoringConditions } from '../model'

const monitoringTypeFields = [
  'curfew',
  'exclusionZone',
  'trail',
  'mandatoryAttendance',
  'alcohol',
  'restrictionZone',
] as const

type MonitoringTypeField = (typeof monitoringTypeFields)[number]

const mockOrder = (
  isSentencingAct: boolean | undefined,
  hasFixedAddress = true,
  isAdult = true,
  pilot: MonitoringConditions['pilot'] = 'UNKNOWN',
) => {
  const order = getMockOrder()
  order.monitoringConditions.hdc = 'NO'
  order.monitoringConditions.pilot = pilot
  if (hasFixedAddress) {
    order.addresses.push(createAddress())
  }
  order.deviceWearer.adultAtTimeOfInstallation = isAdult
  order.isSentencingAct = isSentencingAct
  return order
}

const expectEnabledTypes = (model: MonitoringTypeModel, enabledTypes: readonly MonitoringTypeField[]) => {
  monitoringTypeFields.forEach(type => {
    expect(model[type]?.disabled).toBe(!enabledTypes.includes(type))
  })
}

describe('model', () => {
  it('with errors', () => {
    const errors: ValidationResult = [{ error: 'some error', field: 'monitoringType' }]
    const model = constructModel(mockOrder(false), errors)

    expect(model.error).toEqual({ text: 'some error' })
    expect(model.errorSummary).toEqual({
      errorList: [{ href: '#monitoringType', text: 'some error' }],
      titleText: 'There is a problem',
    })
  })
})

describe('fixed-address eligibility', () => {
  it('allows adults to select all monitoring types under the legacy rules regardless of HDC and pilot', () => {
    const model = constructModel(mockOrder(false), [])

    expectEnabledTypes(model, monitoringTypeFields)
    expect(model.showRestrictionZone).toBe(true)
  })

  it('allows adults to select all monitoring types under Sentencing Act rules regardless of HDC and pilot', () => {
    const model = constructModel(mockOrder(true, true, true, 'GPS_ACQUISITIVE_CRIME_PAROLE'), [])

    expectEnabledTypes(model, monitoringTypeFields)
    expect(model.showRestrictionZone).toBe(true)
  })

  it('allows youths to select all monitoring types except alcohol under the legacy rules', () => {
    const model = constructModel(mockOrder(false, true, false), [])

    expectEnabledTypes(model, ['curfew', 'exclusionZone', 'trail', 'mandatoryAttendance', 'restrictionZone'])
    expect(model.alcohol?.disabled).toBe(true)
    expect(model.showRestrictionZone).toBe(true)
  })

  it('allows youths to select all monitoring types except alcohol under Sentencing Act rules', () => {
    const model = constructModel(mockOrder(true, true, false, 'GPS_ACQUISITIVE_CRIME_PAROLE'), [])

    expectEnabledTypes(model, ['curfew', 'exclusionZone', 'trail', 'mandatoryAttendance', 'restrictionZone'])
    expect(model.alcohol?.disabled).toBe(true)
    expect(model.showRestrictionZone).toBe(true)
  })
})

describe('orders without a fixed address', () => {
  it('keeps legacy eligibility restrictions for an adult with no fixed address', () => {
    const model = constructModel(mockOrder(false, false), [])

    expectEnabledTypes(model, ['alcohol'])
    expect(model.showRestrictionZone).toBe(false)
  })

  it('keeps Sentencing Act eligibility restrictions for an adult with no fixed address', () => {
    const model = constructModel(mockOrder(true, false), [])

    expectEnabledTypes(model, ['alcohol'])
    expect(model.showRestrictionZone).toBe(true)
  })
})
