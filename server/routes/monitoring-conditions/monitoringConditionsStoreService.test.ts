import { v4 as uuidv4 } from 'uuid'
import MonitoringConditionsStoreService from './monitoringConditionsStoreService'
import InMemoryMonitoringConditionsStore from './store/inMemoryStore'
import { MonitoringConditions } from './model'

describe('store service', () => {
  let store: InMemoryMonitoringConditionsStore
  let service: MonitoringConditionsStoreService
  const mockOrderId = uuidv4()
  beforeEach(() => {
    store = new InMemoryMonitoringConditionsStore()
    service = new MonitoringConditionsStoreService(store)
  })
  describe('when updating orderType', () => {
    it('correctly updates the order type value in the store', async () => {
      const initial = await service.getMonitoringConditions(mockOrderId)

      expect(initial).toEqual({})

      await service.updateOrderType(mockOrderId, { orderType: 'COMMUNITY' })

      const result = await service.getMonitoringConditions(mockOrderId)

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
        await service.updateOrderType(mockOrderId, { orderType })

        const result = await service.getMonitoringConditions(mockOrderId)

        const expected: MonitoringConditions = { orderType, conditionType: orderTypeConditions }

        expect(result).toEqual(expected)
      },
    )

    it('should clear dependant answers and update new answers when changing journey', async () => {
      await service.updateMonitoringConditions(mockOrderId, {
        orderType: 'POST_RELEASE',
        sentenceType: 'STANDARD_DETERMINATE_SENTENCE',
        hdc: 'NO',
      })

      await service.updateOrderType(mockOrderId, { orderType: 'CIVIL' })
      const result = await service.getMonitoringConditions(mockOrderId)

      expect(result.sentenceType).toBeUndefined()
      expect(result.hdc).toBeUndefined()
      expect(result.orderType).toBe('CIVIL')
      expect(result.conditionType).toBe('BAIL_ORDER')
    })
  })

  describe('when updating sentenceType', () => {
    it('correctly updates the sentenceType value in the store', async () => {
      await service.updateSentenceType(mockOrderId, { sentenceType: 'STANDARD_DETERMINATE_SENTENCE' })
      const result = await service.getMonitoringConditions(mockOrderId)
      expect(result.sentenceType).toBe('STANDARD_DETERMINATE_SENTENCE')
    })

    it('correctly updates both sentenceType and hdc when provided', async () => {
      await service.updateSentenceType(mockOrderId, { sentenceType: 'SECTION_91', hdc: 'YES' })
      const result = await service.getMonitoringConditions(mockOrderId)
      expect(result.sentenceType).toBe('SECTION_91')
      expect(result.hdc).toBe('YES')
    })

    it('does not update hdc if it is not provided', async () => {
      await service.updateHdc(mockOrderId, { hdc: 'YES' })
      await service.updateSentenceType(mockOrderId, { sentenceType: 'DTO' })
      const result = await service.getMonitoringConditions(mockOrderId)
      expect(result.sentenceType).toBe('DTO')
      expect(result.hdc).toBe('YES')
    })
  })
})
