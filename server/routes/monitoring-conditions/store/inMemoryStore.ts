import { MonitoringConditions } from '../model'
import MonitoringConditionsStore from './store'

export default class InMemoryMonitoringConditionsStore implements MonitoringConditionsStore {
  map = new Map<string, { token: string; expiry: Date }>()

  async setMonitoringConditions(key: string, token: MonitoringConditions, durationSeconds: number): Promise<void> {
    this.map.set(key, { token: JSON.stringify(token), expiry: new Date(Date.now() + durationSeconds * 1000) })
  }

  async getMonitoringConditions(key: string): Promise<string | null> {
    const result = this.map.get(key)
    if (result && result.token) {
      if (new Date() < result.expiry) {
        return result.token
      }
    }
    return null
  }
}
