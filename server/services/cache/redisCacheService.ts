import logger from '../../../logger'
import { RedisClient } from '../../data/redisClient'
import CacheService from './cacheService'

export default class RedisOrderChecklistStore<T> implements CacheService<T> {
  constructor(
    private readonly client: RedisClient,
    private prefix: string,
  ) {
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

  public async storeItemToCache(key: string, value: T, durationSeconds: number): Promise<void> {
    await this.ensureConnected()
    await this.client.set(`${this.prefix}${key}`, JSON.stringify(value), { EX: durationSeconds })
  }

  public async getItemFromCache(key: string): Promise<T | null> {
    await this.ensureConnected()
    const result = await this.client.get(`${this.prefix}${key}`)
    if (result != null) {
      return JSON.parse(result) as T
    }
    return null
  }
}
