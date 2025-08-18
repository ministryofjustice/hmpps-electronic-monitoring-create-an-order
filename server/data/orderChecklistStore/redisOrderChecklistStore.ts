import OrderChecklistStore from './OrderChecklistStore'
import type { RedisClient } from '../redisClient'
import logger from '../../../logger'
import { OrderChecklist } from '../../models/OrderChecklist'

export default class RedisOrderChecklistStore implements OrderChecklistStore {
  private readonly prefix = 'orderCheckList:'

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

  public async setSectionCheckStatus(key: string, token: OrderChecklist, durationSeconds: number): Promise<void> {
    await this.ensureConnected()
    await this.client.set(`${this.prefix}${key}`, JSON.stringify(token), { EX: durationSeconds })
  }

  public async getSectionCheckStatus(key: string): Promise<OrderChecklist | null> {
    await this.ensureConnected()
    const result = await this.client.get(`${this.prefix}${key}`)
    if (result != null) {
      return JSON.parse(result) as OrderChecklist
    }

    return null
  }
}
