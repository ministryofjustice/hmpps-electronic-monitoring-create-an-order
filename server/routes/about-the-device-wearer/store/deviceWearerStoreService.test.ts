import { createDeviceWearer, getMockOrder } from '../../../../test/mocks/mockOrder'
import InMemoryStore from '../../store/inMemoryStore'
import DeviceWearerStoreService from './deviceWearerStoreService'

describe('DeviceWearerStoreService', () => {
  const order = getMockOrder({
    deviceWearer: createDeviceWearer({ firstName: 'Saved', lastName: 'Person', disabilities: ['VISION'] }),
  })
  let store: InMemoryStore
  let service: DeviceWearerStoreService

  beforeEach(() => {
    store = new InMemoryStore()
    service = new DeviceWearerStoreService(store)
  })

  it('falls back to the order device wearer when nothing is cached', async () => {
    const result = await service.getDeviceWearer(order)

    expect(result.firstName).toEqual('Saved')
    expect(result.disabilities).toEqual(['VISION'])
  })

  it('does not write to the cache when reading', async () => {
    await service.getDeviceWearer(order)

    expect(store.map.size).toEqual(0)
  })

  it('merges updated answers into the cached data', async () => {
    await service.updateDeviceWearer(order, { firstName: 'Updated', sex: 'FEMALE' })

    const result = await service.getDeviceWearer(order)
    expect(result.firstName).toEqual('Updated')
    expect(result.sex).toEqual('FEMALE')
    expect(result.lastName).toEqual('Person')
  })

  it('keeps answers from earlier saves', async () => {
    await service.updateDeviceWearer(order, { firstName: 'Updated' })
    await service.updateDeviceWearer(order, { disabilities: ['HEARING'] })

    const result = await service.getDeviceWearer(order)
    expect(result.firstName).toEqual('Updated')
    expect(result.disabilities).toEqual(['HEARING'])
  })

  it('keeps answers separate for each version of the order', async () => {
    await service.updateDeviceWearer({ ...order, versionId: 'another-version' }, { firstName: 'Other version' })

    expect((await service.getDeviceWearer(order)).firstName).toEqual('Saved')
  })

  it('discards cached answers when the order device wearer has changed since they were saved', async () => {
    await service.updateDeviceWearer(order, { firstName: 'Cached' })
    const changedOrder = { ...order, deviceWearer: { ...order.deviceWearer, firstName: 'From CPR', gender: null } }

    const result = await service.getDeviceWearer(changedOrder)

    expect(result.firstName).toEqual('From CPR')
  })

  it('saves new answers against the changed order device wearer', async () => {
    await service.updateDeviceWearer(order, { firstName: 'Cached', alias: 'Stale' })
    const changedOrder = { ...order, deviceWearer: { ...order.deviceWearer, firstName: 'From CPR' } }

    await service.updateDeviceWearer(changedOrder, { gender: 'MALE' })

    const result = await service.getDeviceWearer(changedOrder)
    expect(result.firstName).toEqual('From CPR')
    expect(result.alias).toBeNull()
    expect(result.gender).toEqual('MALE')
  })

  it('ignores cache entries it cannot read', async () => {
    await store.set(`${order.id}+${order.versionId}+deviceWearer`, JSON.stringify({ firstName: 'Old format' }), 60)

    expect((await service.getDeviceWearer(order)).firstName).toEqual('Saved')
  })

  it('clears cached data so the order is used again', async () => {
    await service.updateDeviceWearer(order, { firstName: 'Cached' })

    await service.clearDeviceWearer(order)

    expect((await service.getDeviceWearer(order)).firstName).toEqual('Saved')
  })
})
