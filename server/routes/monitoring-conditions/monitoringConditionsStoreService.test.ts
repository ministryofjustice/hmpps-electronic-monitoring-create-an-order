import { v4 as uuidv4 } from 'uuid'
import MonitoringConditionsStoreService from './monitoringConditionsStoreService'
import { MonitoringConditions } from './model'
import InMemoryStore from './store/inMemoryStore'
import { getMockOrder } from '../../../test/mocks/mockOrder'
import { Order } from '../../models/Order'

describe('store service', () => {
  let store: InMemoryStore
  let service: MonitoringConditionsStoreService
  const mockOrderId = uuidv4()
  let mockOrder: Order

  const emptyMonitoringCondition = {
    alcohol: null,
    conditionType: null,
    curfew: null,
    endDate: null,
    exclusionZone: null,
    hdc: null,
    issp: null,
    mandatoryAttendance: null,
    offenceType: null,
    orderType: null,
    pilot: null,
    dapolMissedInError: null,
    prarr: null,
    sentenceType: null,
    startDate: null,
    trail: null,
  }
  beforeEach(() => {
    store = new InMemoryStore()
    service = new MonitoringConditionsStoreService(store)
    mockOrder = getMockOrder({ id: mockOrderId })
  })
  describe('getMonitoringConditions', () => {
    it('will load monitoring codition from Order object, if not in cache', async () => {
      mockOrder.monitoringConditions = {
        startDate: '2025-01-01T00:00:00Z',
        endDate: '2025-02-01T00:00:00Z',
        orderType: 'CIVIL',
        curfew: true,
        exclusionZone: true,
        trail: true,
        mandatoryAttendance: true,
        alcohol: true,
        conditionType: 'BAIL_ORDER',
        orderTypeDescription: null,
        sentenceType: 'IPP',
        issp: 'YES',
        hdc: 'NO',
        prarr: 'NO',
        pilot: 'DOMESTIC_ABUSE_PERPETRATOR_ON_LICENCE_PROJECT',
        dapolMissedInError: 'YES',
        offenceType: '',
        isValid: true,
      }
      const result = await service.getMonitoringConditions(mockOrder)

      expect(result).toEqual({
        startDate: '2025-01-01T00:00:00Z',
        endDate: '2025-02-01T00:00:00Z',
        orderType: 'CIVIL',
        curfew: true,
        exclusionZone: true,
        trail: true,
        mandatoryAttendance: true,
        alcohol: true,
        conditionType: 'BAIL_ORDER',
        sentenceType: 'IPP',
        issp: 'YES',
        hdc: 'NO',
        prarr: 'NO',
        pilot: 'DOMESTIC_ABUSE_PERPETRATOR_ON_LICENCE_PROJECT',
        dapolMissedInError: 'YES',
        offenceType: '',
      })
    })

    it('will create new instance if not in cache and order monitoring condition is null', async () => {
      const result = await service.getMonitoringConditions(mockOrder)

      expect(result).toEqual(emptyMonitoringCondition)
    })
  })

  it('can update a single top level field', async () => {
    await service.updateField(mockOrder, 'orderType', 'IMMIGRATION')

    const result = await service.getMonitoringConditions(mockOrder)

    const expected: MonitoringConditions = expect.objectContaining({ orderType: 'IMMIGRATION' })
    expect(result).toEqual(expected)
  })

  describe('when updating orderType', () => {
    it('correctly updates the order type value in the store', async () => {
      const initial = await service.getMonitoringConditions(mockOrder)

      expect(initial).toEqual(emptyMonitoringCondition)

      await service.updateOrderType(mockOrder, { orderType: 'COMMUNITY' })

      const result = await service.getMonitoringConditions(mockOrder)

      const expected: MonitoringConditions = expect.objectContaining({ orderType: 'COMMUNITY' })

      expect(result).toEqual(expected)
    })

    it.each<{
      orderType: MonitoringConditions['orderType']
      orderTypeConditions: MonitoringConditions['conditionType']
    }>([
      {
        orderType: 'POST_RELEASE',
        orderTypeConditions: 'LICENSE_CONDITION_OF_A_CUSTODIAL_ORDER',
      },
      {
        orderType: 'COMMUNITY',
        orderTypeConditions: 'REQUIREMENT_OF_A_COMMUNITY_ORDER',
      },
      {
        orderType: 'CIVIL',
        orderTypeConditions: 'BAIL_ORDER',
      },
      {
        orderType: 'IMMIGRATION',
        orderTypeConditions: 'BAIL_ORDER',
      },
      {
        orderType: 'BAIL',
        orderTypeConditions: 'BAIL_ORDER',
      },
    ])(
      'orderTypeCondition is set to $orderTypeConditions when orderType is $orderType',
      async ({ orderType, orderTypeConditions }) => {
        await service.updateOrderType(mockOrder, { orderType })

        const result = await service.getMonitoringConditions(mockOrder)

        expect(result.orderType).toEqual(orderType)
        expect(result.conditionType).toEqual(orderTypeConditions)
      },
    )

    it('should clear dependant answers and update new answers when changing journey', async () => {
      await service.updateMonitoringConditions(mockOrder, {
        orderType: 'POST_RELEASE',
        sentenceType: 'STANDARD_DETERMINATE_SENTENCE',
        hdc: 'NO',
      })

      await service.updateOrderType(mockOrder, { orderType: 'CIVIL' })
      const result = await service.getMonitoringConditions(mockOrder)

      expect(result.sentenceType).toBeUndefined()
      expect(result.hdc).toBeUndefined()
      expect(result.orderType).toBe('CIVIL')
      expect(result.conditionType).toBe('BAIL_ORDER')
    })
  })

  describe('when updating sentenceType', () => {
    it('correctly updates the sentenceType value in the store', async () => {
      await service.updateSentenceType(mockOrder, { sentenceType: 'STANDARD_DETERMINATE_SENTENCE' })
      const result = await service.getMonitoringConditions(mockOrder)
      expect(result.sentenceType).toBe('STANDARD_DETERMINATE_SENTENCE')
    })

    it('should set hdc to YES when sentenceType isSECTION_91" for a Post Release order', async () => {
      await service.updateOrderType(mockOrder, { orderType: 'POST_RELEASE' })

      await service.updateSentenceType(mockOrder, { sentenceType: 'SECTION_91' })
      const result = await service.getMonitoringConditions(mockOrder)
      expect(result.sentenceType).toBe('SECTION_91')
      expect(result.hdc).toBe('YES')
    })

    it('should NOT update hdc if the journey is not POST_RELEASE', async () => {
      await service.updateOrderType(mockOrder, { orderType: 'COMMUNITY' })

      await service.updateSentenceType(mockOrder, { sentenceType: 'COMMUNITY_YRO' })
      const result = await service.getMonitoringConditions(mockOrder)

      expect(result.sentenceType).toBe('COMMUNITY_YRO')
      expect(result.hdc).toBeUndefined()
    })
  })

  describe('clearing down data', () => {
    let oldData: MonitoringConditions
    beforeEach(async () => {
      // setup store with values from flow
      await service.updateOrderType(mockOrder, { orderType: 'COMMUNITY' })
      await service.updateField(mockOrder, 'sentenceType', 'STANDARD_DETERMINATE_SENTENCE')
      await service.updateField(mockOrder, 'hdc', 'YES')
      await service.updateField(mockOrder, 'pilot', 'GPS_ACQUISITIVE_CRIME_HOME_DETENTION_CURFEW')
      await service.updateField(mockOrder, 'dapolMissedInError', 'YES')
      await service.updateField(mockOrder, 'offenceType', 'Burglary in a Dwelling - Indictable only')
      await service.updateField(mockOrder, 'issp', 'YES')
      await service.updateField(mockOrder, 'prarr', 'YES')
      await service.updateMonitoringDates(mockOrder, {
        startDate: new Date(2025, 10, 10).toISOString(),
        endDate: new Date(2025, 10, 11).toISOString(),
      })
      await service.updateMonitoringType(mockOrder, {
        curfew: true,
        exclusionZone: true,
        trail: true,
        mandatoryAttendance: true,
        alcohol: true,
      })

      oldData = await service.getMonitoringConditions(mockOrder)
    })

    it('order type', async () => {
      // change order type
      await service.updateOrderType(mockOrder, { orderType: 'IMMIGRATION' })

      const newData = await service.getMonitoringConditions(mockOrder)

      const expectedData: MonitoringConditions = {
        orderType: 'IMMIGRATION',
        conditionType: 'BAIL_ORDER',
        curfew: true,
        exclusionZone: true,
        trail: true,
        mandatoryAttendance: true,
        alcohol: true,
        startDate: oldData.startDate,
        endDate: oldData.endDate,
      }

      expect(newData).toEqual(expectedData)
    })

    it('sentenceType', async () => {
      await service.updateSentenceType(mockOrder, { sentenceType: 'COMMUNITY' })
      const newData = await service.getMonitoringConditions(mockOrder)

      const expectedData: MonitoringConditions = {
        orderType: 'COMMUNITY',
        conditionType: 'REQUIREMENT_OF_A_COMMUNITY_ORDER',
        sentenceType: 'COMMUNITY',
        curfew: true,
        exclusionZone: true,
        trail: true,
        mandatoryAttendance: true,
        alcohol: true,
        startDate: oldData.startDate,
        endDate: oldData.endDate,
      }

      expect(newData).toEqual(expectedData)
    })

    it('does not clear sentence type if same value', async () => {
      await service.updateSentenceType(mockOrder, { sentenceType: 'STANDARD_DETERMINATE_SENTENCE' })
      const newData = await service.getMonitoringConditions(mockOrder)

      expect(newData).toEqual(oldData)
    })

    it('pilot', async () => {
      await service.updateField(mockOrder, 'pilot', 'GPS_ACQUISITIVE_CRIME_PAROLE')

      const newData = await service.getMonitoringConditions(mockOrder)

      const expectedData: MonitoringConditions = {
        ...oldData,
        pilot: 'GPS_ACQUISITIVE_CRIME_PAROLE',
        dapolMissedInError: undefined,
        offenceType: undefined,
        issp: undefined,
        prarr: undefined,
      }

      expect(newData).toEqual(expectedData)
    })

    it('offenceType', async () => {
      await service.updateField(mockOrder, 'offenceType', 'some new offence type')
      const newData = await service.getMonitoringConditions(mockOrder)

      const expectedData: MonitoringConditions = {
        ...oldData,
        offenceType: 'some new offence type',
        issp: undefined,
        prarr: undefined,
      }

      expect(newData).toEqual(expectedData)
    })
  })
})
