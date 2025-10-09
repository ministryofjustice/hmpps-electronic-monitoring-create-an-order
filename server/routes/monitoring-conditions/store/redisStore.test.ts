import { RedisClient } from '../../../data/redisClient'
import RedisMonitoringConditionsStore from './redisStore'

jest.mock('../../../data/redisClient')

describe('redis client', () => {
  let storedValue: string | null = null
  const mockRedisClient = {
    on: jest.fn(),
    isOpen: true,
    get: jest.fn(),
    set: (_key: string, data: string) => {
      storedValue = data
    },
    storedValue: null,
  }

  it('returns null if store is empty', async () => {
    mockRedisClient.get.mockResolvedValue(null)

    const store = new RedisMonitoringConditionsStore(mockRedisClient as unknown as RedisClient)

    const result = await store.getMonitoringConditions('some key')

    expect(result).toBe(null)
  })

  it('returns the value if store is not empty', async () => {
    mockRedisClient.get.mockResolvedValue('some value')

    const store = new RedisMonitoringConditionsStore(mockRedisClient as unknown as RedisClient)

    const result = await store.getMonitoringConditions('some key')

    expect(result).toBe('some value')
  })

  it('allows setting a value', async () => {
    const store = new RedisMonitoringConditionsStore(mockRedisClient as unknown as RedisClient)

    await store.setMonitoringConditions('some key', { orderType: 'CIVIL', hdc:null  }, 1000)

    expect(storedValue).not.toBe(null)
    expect(JSON.parse(storedValue!)).toEqual({ orderType: 'CIVIL', hdc: null })
  })
})
