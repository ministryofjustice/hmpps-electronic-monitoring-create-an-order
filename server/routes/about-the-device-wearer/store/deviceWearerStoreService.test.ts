import { getMockOrder } from '../../../../test/mocks/mockOrder'
import InMemoryStore from '../../store/inMemoryStore'
import DeviceWearerStoreService from './deviceWearerStoreService'

describe('DeviceWearerStoreService', () => {
  const order = getMockOrder()
  let store: InMemoryStore
  let service: DeviceWearerStoreService

  beforeEach(() => {
    store = new InMemoryStore()
    service = new DeviceWearerStoreService(store)
  })

  it('falls back to the order device wearer when nothing is cached', async () => {
    const result = await service.getDeviceWearer(order)

    expect(result.firstName).toEqual(order.deviceWearer.firstName)
    expect(result.disabilities).toEqual(order.deviceWearer.disabilities)
  })

  it('prefers cached data over the order', async () => {
    await store.set(
      `${order.id}+${order.versionId}+deviceWearer`,
      JSON.stringify({ firstName: 'Cached', disabilities: ['VISION'] }),
      60,
    )

    const result = await service.getDeviceWearer(order)

    expect(result.firstName).toEqual('Cached')
    expect(result.disabilities).toEqual(['VISION'])
  })

  it('updates the cached answers, keeping the answers that are not changed', async () => {
    await service.updateDeviceWearer(order, { interpreterRequired: true, language: 'Arabic' })

    const result = await service.getDeviceWearer(order)
    expect(result.interpreterRequired).toBe(true)
    expect(result.language).toEqual('Arabic')
    expect(result.firstName).toEqual(order.deviceWearer.firstName)
  })

  it('keeps answers for each order version separately', async () => {
    const variation = { ...order, versionId: 'another-version' }

    await service.updateDeviceWearer(variation, { language: 'Arabic' })

    expect((await service.getDeviceWearer(variation)).language).toEqual('Arabic')
    expect((await service.getDeviceWearer(order)).language).toEqual(order.deviceWearer.language)
  })

  it('clears cached data so the order is used again', async () => {
    await store.set(`${order.id}+${order.versionId}+deviceWearer`, JSON.stringify({ firstName: 'Cached' }), 60)

    await service.clearDeviceWearer(order)

    const result = await service.getDeviceWearer(order)
    expect(result.firstName).toEqual(order.deviceWearer.firstName)
  })
})
