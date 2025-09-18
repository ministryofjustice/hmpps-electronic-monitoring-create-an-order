import { MonitoringConditionsModel } from './model'

export default interface MonitoringConditionsStore {
  setMonitoringConditions(key: string, token: MonitoringConditionsModel, durationSeconds: number): Promise<void>
  getMonitoringConditions(key: string): Promise<MonitoringConditionsModel | null>
}
