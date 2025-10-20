import { v4 as uuidv4 } from 'uuid'
import MonitoringConditionsStoreService from './monitoringConditionsStoreService'
import { MonitoringConditions } from './model'
import InMemoryStore from './store/inMemoryStore'
import { getMockOrder } from '../../../test/mocks/mockOrder'

describe('store service', () => {
  let store: InMemoryStore
  let service: MonitoringConditionsStoreService
  const mockOrderId = uuidv4()
  const mockOrder = getMockOrder({ id: mockOrderId })
  beforeEach(() => {
    store = new InMemoryStore()
    service = new MonitoringConditionsStoreService(store)
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

      expect(initial).toEqual({})

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

        const expected: MonitoringConditions = { orderType, conditionType: orderTypeConditions }

        expect(result).toEqual(expected)
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

    it('should set hdc to YES when sentenceType is "SECTION_91" for a Post Release order', async () => {
      await service.updateOrderType(mockOrder, { orderType: 'POST_RELEASE' })

      await service.updateSentenceType(mockOrder, { sentenceType: 'SECTION_91' })
      const result = await service.getMonitoringConditions(mockOrder)
      expect(result.sentenceType).toBe('SECTION_91')
      expect(result.hdc).toBe('YES')
    })

    it('should set hdc to NO when a different POST_RELEASE sentenceType is selected', async () => {
      await service.updateOrderType(mockOrder, { orderType: 'POST_RELEASE' })
      await service.updateSentenceType(mockOrder, { sentenceType: 'SECTION_91' })

      await service.updateSentenceType(mockOrder, { sentenceType: 'STANDARD_DETERMINATE_SENTENCE' })
      const result = await service.getMonitoringConditions(mockOrder)

      expect(result.hdc).toBe('NO')
    })

    it('should NOT update hdc if the journey is not POST_RELEASE', async () => {
      await service.updateOrderType(mockOrder, { orderType: 'COMMUNITY' })

      await service.updateSentenceType(mockOrder, { sentenceType: 'COMMUNITY_YRO' })
      const result = await service.getMonitoringConditions(mockOrder)

      expect(result.sentenceType).toBe('COMMUNITY_YRO')
      expect(result.hdc).toBeUndefined()
    })
  })
})
