import { getMockOrder } from '../../../../test/mocks/mockOrder'
import { Order } from '../../../models/Order'
import { findMonitoringTypeById } from './monitoringTypes'

describe('monitoring type utils', () => {
  describe('findMonitoringTypeFromId', () => {
    let order: Order
    beforeEach(() => {
      order = getMockOrder()
    })

    it('returns undefined if there is no match', () => {
      const match = findMonitoringTypeById(order, 'some id')
      expect(match).toBeUndefined()
    })
  })
})
