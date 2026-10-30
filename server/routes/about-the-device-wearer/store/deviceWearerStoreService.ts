import { z } from 'zod'
import { Order } from '../../../models/Order'
import Store from '../../store/store'
import DeviceWearerCacheModel, { DeviceWearerCache } from './model'

// Answers are cached with a snapshot of the order's device wearer they were based on,
// so they are discarded if the order changes elsewhere (e.g. a CPR lookup or another session).
const CacheEntryModel = z.object({
  snapshot: z.string(),
  answers: DeviceWearerCacheModel,
})

export default class DeviceWearerStoreService {
  constructor(private readonly dataStore: Store) {}

  private readonly TTL_SECONDS = 24 * 60 * 60

  private keyFromOrder(order: Order): string {
    return `${order.id}+${order.versionId}+deviceWearer`
  }

  private snapshotFromOrder(order: Order): string {
    return JSON.stringify(order.deviceWearer)
  }

  public async getDeviceWearer(order: Order): Promise<DeviceWearerCache> {
    const cached = await this.dataStore.get(this.keyFromOrder(order))
    const entry = cached ? CacheEntryModel.safeParse(JSON.parse(cached)) : null

    if (entry?.success && entry.data.snapshot === this.snapshotFromOrder(order)) {
      return entry.data.answers
    }

    return DeviceWearerCacheModel.parse(JSON.parse(this.snapshotFromOrder(order)))
  }

  public async updateDeviceWearer(order: Order, answers: DeviceWearerCache): Promise<void> {
    const current = await this.getDeviceWearer(order)
    const entry = { snapshot: this.snapshotFromOrder(order), answers: { ...current, ...answers } }

    await this.dataStore.set(this.keyFromOrder(order), JSON.stringify(entry), this.TTL_SECONDS)
  }

  public async updateDeviceWearer(order: Order, answers: DeviceWearerCache): Promise<void> {
    const current = await this.getDeviceWearer(order)

    await this.dataStore.set(this.keyFromOrder(order), JSON.stringify({ ...current, ...answers }), this.TTL_SECONDS)
  }

  public async clearDeviceWearer(order: Order): Promise<void> {
    await this.dataStore.delete(this.keyFromOrder(order))
  }
}
