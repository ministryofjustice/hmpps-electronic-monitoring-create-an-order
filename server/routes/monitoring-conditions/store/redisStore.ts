import logger from '../../../../logger'
import { RedisClient } from '../../../data/redisClient'
import { MonitoringConditions } from '../model'
import MonitoringConditionsStore from './store'

export default class RedisMonitoringConditionsStore implements MonitoringConditionsStore {
  private readonly prefix = 'monitoringConditions:'

  constructor(private readonly client: RedisClient) {
    logger.info(`${this.prefix}Create RedisStore`)
    client.on('error', error => {
      logger.error(error, `${this.prefix}Redis error`)
    })
  }

  private async ensureConnected() {
    if (!this.client.isOpen) {
      await this.client.connect()
    }
  }

  public async setMonitoringConditions(
    key: string,
    token: MonitoringConditions,
    durationSeconds: number,
  ): Promise<void> {
    await this.ensureConnected()
    await this.client.set(`${this.prefix}${key}`, JSON.stringify(token), { EX: durationSeconds })
  }

  public async getMonitoringConditions(key: string): Promise<string | null> {
    await this.ensureConnected()
    const result = await this.client.get(`${this.prefix}${key}`)

    return result
  }
}
