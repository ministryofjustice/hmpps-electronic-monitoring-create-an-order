import { v4 as uuidv4 } from 'uuid'
import MonitoringConditionsStoreService from './monitoringConditionsStoreService'
import { MonitoringConditions, SentenceTypeEnum } from './model'
import InMemoryStore from './store/inMemoryStore'

describe('store service', () => {
  let store: InMemoryStore
  let service: MonitoringConditionsStoreService
  const mockOrderId = uuidv4()
  beforeEach(() => {
    store = new InMemoryStore()
    service = new MonitoringConditionsStoreService(store)
  })

  it('can update a single top level field', async () => {
    await service.updateField(mockOrderId, 'orderType', 'IMMIGRATION')

    const result = await service.getMonitoringConditions(mockOrderId)

    const expected: MonitoringConditions = expect.objectContaining({ orderType: 'IMMIGRATION' })
    expect(result).toEqual(expected)
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
  })

  describe('when updating sentenceType', () => {
    it.each(SentenceTypeEnum.options.map(o => ({ sentenceType: o })))(
      'correctly updates the sentence type value to $sentenceType in the store',
      async ({ sentenceType }) => {
        await service.updateSentenceType(mockOrderId, { sentenceType })
        const result = await service.getMonitoringConditions(mockOrderId)
        const expected: MonitoringConditions = expect.objectContaining({ sentenceType })
        expect(result).toEqual(expected)
      },
    )

    it('should set hdc to YES when sentenceType is "Section 250 / Section 91"', async () => {
      await service.updateOrderType(mockOrderId, { orderType: 'POST_RELEASE' })

      const sentenceType = 'Section 250 / Section 91'
      await service.updateSentenceType(mockOrderId, { sentenceType })
      const result = await service.getMonitoringConditions(mockOrderId)

      expect(result.hdc).toBe('YES')
    })

    it('should set hdc to NO when a different POST_RELEASE sentenceType is selected', async () => {
      await service.updateOrderType(mockOrderId, { orderType: 'POST_RELEASE' })
      await service.updateSentenceType(mockOrderId, { sentenceType: 'Section 250 / Section 91' })

      const newSentenceType = 'Standard Determinate Sentence'
      await service.updateSentenceType(mockOrderId, { sentenceType: newSentenceType })
      const result = await service.getMonitoringConditions(mockOrderId)

      expect(result.hdc).toBe('NO')
    })

    it("should save the 'COMMUNITY' sentence type when 'not in list' is selected", async () => {
      await service.updateOrderType(mockOrderId, { orderType: 'COMMUNITY' })

      await service.updateSentenceType(mockOrderId, { sentenceType: 'COMMUNITY' })
      const result = await service.getMonitoringConditions(mockOrderId)

      expect(result.sentenceType).toBe('COMMUNITY')
    })

    it("should transform the bail 'not in list' option to 'BAIL' when saving", async () => {
      await service.updateOrderType(mockOrderId, { orderType: 'BAIL' })

      await service.updateSentenceType(mockOrderId, { sentenceType: 'BAIL' })
      const result = await service.getMonitoringConditions(mockOrderId)

      expect(result.sentenceType).toBe('BAIL')
    })
  })
})
