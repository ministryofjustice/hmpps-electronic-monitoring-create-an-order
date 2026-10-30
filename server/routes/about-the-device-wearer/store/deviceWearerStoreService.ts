import { Order } from '../../../models/Order'
import Store from '../../store/store'
import DeviceWearerCacheModel, { DeviceWearerCache } from './model'

export default class DeviceWearerStoreService {
  constructor(private readonly dataStore: Store) {}

  private readonly TTL_SECONDS = 24 * 60 * 60

  private keyFromOrder(order: Order): string {
    return `${order.id}+${order.versionId}+deviceWearer`
  }

  public async getDeviceWearer(order: Order): Promise<DeviceWearerCache> {
    const key = this.keyFromOrder(order)
    const result = (await this.dataStore.get(key)) ?? JSON.stringify(order.deviceWearer)

    await this.dataStore.set(key, result, this.TTL_SECONDS)

    return DeviceWearerCacheModel.parse(JSON.parse(result))
  }

  public async updateDeviceWearer(order: Order, answers: DeviceWearerCache): Promise<void> {
    const current = await this.getDeviceWearer(order)

    await this.dataStore.set(this.keyFromOrder(order), JSON.stringify({ ...current, ...answers }), this.TTL_SECONDS)
  }

  public async clearDeviceWearer(order: Order): Promise<void> {
    await this.dataStore.delete(this.keyFromOrder(order))
  }
}
