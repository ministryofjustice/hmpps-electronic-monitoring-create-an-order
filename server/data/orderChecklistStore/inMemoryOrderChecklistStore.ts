import OrderChecklistStore from './OrderChecklistStore'
import { OrderChecklist } from '../../models/OrderChecklist'

export default class InMemoryOrderChecklistStore implements OrderChecklistStore {
  map = new Map<string, { token: string; expiry: Date }>()

  public async setSectionCheckStatus(key: string, token: OrderChecklist, durationSeconds: number): Promise<void> {
    this.map.set(key, { token: JSON.stringify(token), expiry: new Date(Date.now() + durationSeconds * 1000) })
  }

  public async getSectionCheckStatus(key: string): Promise<OrderChecklist | null> {
    const result = this.map.get(`${key}`)
    if (result) {
      if (result.expiry.getTime() > Date.now()) {
        return Promise.resolve(JSON.parse(result.token))
      }
    }
    return Promise.resolve(null)
  }
}
