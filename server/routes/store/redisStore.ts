import logger from '../../../logger'
import { RedisClient } from '../../data/redisClient'
import Store from './store'

export default class RedisStore implements Store {
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

  public async set(key: string, token: string, durationSeconds: number): Promise<void> {
    await this.ensureConnected()
    await this.client.set(`${this.prefix}${key}`, token, { EX: durationSeconds })
  }

  public async get(key: string): Promise<string | null> {
    await this.ensureConnected()
    const result = await this.client.get(`${this.prefix}${key}`)

    return result
  }
}
