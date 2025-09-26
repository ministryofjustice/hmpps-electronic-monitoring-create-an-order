import { MonitoringConditions } from '../model'

export default interface MonitoringConditionsStore {
  setMonitoringConditions(key: string, token: MonitoringConditions, durationSeconds: number): Promise<void>
  getMonitoringConditions(key: string): Promise<string | null>
}
