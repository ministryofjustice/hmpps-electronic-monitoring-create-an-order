import constructModel, { hasIncompleteMonitoringTypes } from './viewModel'
import { getMockOrder } from '../../../../test/mocks/mockOrder'

const INCOMPLETE = 'Incomplete'

describe('types of monitoring needed viewModel', () => {
  const completeAlcohol = {
    monitoringType: 'ALCOHOL_LEVEL' as const,
    startDate: '2030-01-01T00:00:00.000Z',
    endDate: '2030-02-01T00:00:00.000Z',
  }

  describe('trail monitoring', () => {
    it('is not tagged when complete', () => {
      const order = getMockOrder({
        interestedParties: { notifyingOrganisation: 'PRISON' } as never,
        monitoringConditionsTrail: { startDate: '2030-01-01T00:00:00.000Z', endDate: '2030-02-01T00:00:00.000Z' },
      })
      const model = constructModel(order, [])

      expect(model.items[0].value.text).not.toContain(INCOMPLETE)
      expect(model.items[0].value.html).toBeUndefined()
      expect(model.hasIncompleteItems).toBe(false)
      expect(model.continueDisabled).toBe(false)
      expect(model.draftDisabled).toBe(false)
    })

    it('is tagged and disables both buttons when the end date is missing', () => {
      const order = getMockOrder({
        interestedParties: { notifyingOrganisation: 'PRISON' } as never,
        monitoringConditionsTrail: { startDate: '2030-01-01T00:00:00.000Z', endDate: null },
      })
      const model = constructModel(order, [])

      expect(model.items[0].value.html).toContain('govuk-tag--blue')
      expect(model.items[0].value.html).toContain(INCOMPLETE)
      expect(model.hasIncompleteItems).toBe(true)
      expect(model.continueDisabled).toBe(true)
      expect(model.draftDisabled).toBe(true)
    })

    it('uses the notifying organisation rules (Home Office needs a device type, not an end date)', () => {
      const trail = { startDate: '2030-01-01T00:00:00.000Z', endDate: null }
      const homeOffice = { notifyingOrganisation: 'HOME_OFFICE' } as never

      expect(
        hasIncompleteMonitoringTypes(getMockOrder({ interestedParties: homeOffice, monitoringConditionsTrail: trail })),
      ).toBe(true)
      expect(
        hasIncompleteMonitoringTypes(
          getMockOrder({
            interestedParties: homeOffice,
            monitoringConditionsTrail: { ...trail, deviceType: 'FITTED' } as never,
          }),
        ),
      ).toBe(false)
    })
  })

  it('only tags the incomplete alcohol item', () => {
    const order = getMockOrder({
      monitoringConditionsAlcohol: { ...completeAlcohol, monitoringType: null },
      monitoringConditionsTrail: { startDate: '2030-01-01T00:00:00.000Z', endDate: '2030-02-01T00:00:00.000Z' },
    })
    const model = constructModel(order, [])
    const alcohol = model.items.find(item => item.key.text === 'Alcohol monitoring')
    const trail = model.items.find(item => item.key.text === 'Trail monitoring')

    expect(alcohol?.value.html).toContain(INCOMPLETE)
    expect(trail?.value.html ?? trail?.value.text).not.toContain(INCOMPLETE)
  })

  it('tags an incomplete mandatory attendance item and keeps its html', () => {
    const order = getMockOrder({
      mandatoryAttendanceConditions: [
        {
          id: 'a1',
          startDate: '2030-01-01T00:00:00.000Z',
          endDate: '2030-02-01T00:00:00.000Z',
          purpose: 'Meeting',
          appointmentDay: null,
          startTime: null,
          endTime: null,
          addressLine1: null,
          addressLine2: null,
          addressLine3: null,
          addressLine4: null,
          postcode: null,
        },
      ],
    })
    const model = constructModel(order, [])

    expect(model.items[0].value.html).toContain('Meeting<br>From')
    expect(model.items[0].value.html).toContain(INCOMPLETE)
  })

  it.each([
    ['hour 25', '25:00:00'],
    ['minute 70', '10:70:00'],
  ])('tags a mandatory attendance item with an out of bounds time (%s)', (_, startTime) => {
    const order = getMockOrder({
      mandatoryAttendanceConditions: [
        {
          id: 'a1',
          startDate: '2030-01-01T00:00:00.000Z',
          endDate: '2030-02-01T00:00:00.000Z',
          purpose: 'Meeting',
          appointmentDay: 'Monday',
          startTime,
          endTime: '17:00:00',
          addressLine1: '1 Street',
          addressLine2: null,
          addressLine3: 'Town',
          addressLine4: null,
          postcode: 'AB1 2CD',
        },
      ],
    })

    expect(constructModel(order, []).items[0].value.html).toContain(INCOMPLETE)
  })

  it('tags an incomplete exclusion zone', () => {
    const order = getMockOrder({
      interestedParties: { notifyingOrganisation: 'PRISON' } as never,
      enforcementZoneConditions: [
        {
          id: 'z1',
          zoneType: 'EXCLUSION',
          startDate: '2030-01-01T00:00:00.000Z',
          endDate: '2030-02-01T00:00:00.000Z',
          name: 'Zone',
          description: null,
          duration: null,
          fileName: null,
          fileId: null,
          zoneId: 1,
        },
      ] as never,
    })

    expect(constructModel(order, []).items[0].value.html).toContain(INCOMPLETE)
  })

  it('has no incomplete items for an order without monitoring types', () => {
    expect(hasIncompleteMonitoringTypes(getMockOrder())).toBe(false)
  })
})
