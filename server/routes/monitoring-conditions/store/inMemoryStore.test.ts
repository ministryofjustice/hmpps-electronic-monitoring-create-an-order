import InMemoryMonitoringConditionsStore from './inMemoryStore'
import { MonitoringConditionsModel } from './model'

describe('in memory order type description store', () => {
  let store: InMemoryMonitoringConditionsStore
  beforeEach(() => {
    store = new InMemoryMonitoringConditionsStore()
  })
  const data: MonitoringConditionsModel = {}

  it('should store the order type description model', async () => {
    await store.setMonitoringConditions('some key', data, 1000)

    const result = await store.getMonitoringConditions('some key')

    expect(result).toEqual(JSON.stringify(data))
  })

  it('should return null if expiry time is in the past', async () => {
    await store.setMonitoringConditions('some key', data, -1)

    const result = await store.getMonitoringConditions('some key')

    expect(result).toEqual(null)
  })
})
