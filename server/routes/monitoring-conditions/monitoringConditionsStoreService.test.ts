import { v4 as uuidv4 } from 'uuid'
import MonitoringConditionsStoreService from './monitoringConditionsStoreService'
import InMemoryMonitoringConditionsStore from './store/inMemoryStore'
import { MonitoringConditions, SentenceTypeEnum } from './model'

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
  })
  describe('when updating sentenceType', () => {
    it.each(SentenceTypeEnum.options)(
      'correctly updates the sentence type value to %s in the store',
      async sentenceType => {
        await service.updateSentenceType(mockOrderId, { sentenceType })
        const result = await service.getMonitoringConditions(mockOrderId)
        const expected: MonitoringConditions = expect.objectContaining({ sentenceType })
        expect(result).toEqual(expected)
      },
    )

    it('should set hdc to YES when sentenceType is "Section 250 / Section 91"', async () => {
      const sentenceType = 'Section 250 / Section 91'
      await service.updateSentenceType(mockOrderId, { sentenceType })
      const result = await service.getMonitoringConditions(mockOrderId)
      const expected: MonitoringConditions = expect.objectContaining({
        sentenceType,
        hdc: 'YES',
      })
      expect(result).toEqual(expected)
    })

    // it('should set hdc to NO when sentenceType is not "Section 250 / Section 91"', async () => {

    //   await service.updateSentenceType(mockOrderId, { sentenceType: 'Section 250 / Section 91' })

    //   const newSentenceType = 'Standard Determinate Sentence'
    //   await service.updateSentenceType(mockOrderId, { sentenceType: newSentenceType })
    //   const result = await service.getMonitoringConditions(mockOrderId)
    //   const expected: MonitoringConditions = expect.objectContaining({
    //     sentenceType: newSentenceType,
    //     hdc: 'NO',
    //   })
    //   expect(result).toEqual(expected)
    // })
  })
})
