import CacheService from './cacheService'

export default class InMemorCacheService<T> implements CacheService<T> {
  map = new Map<string, { item: string; expiry: Date }>()

  public async storeItemToCache(key: string, value: T, durationSeconds: number): Promise<void> {
    this.map.set(key, { item: JSON.stringify(value), expiry: new Date(Date.now() + durationSeconds * 1000) })
  }

  public async getItemFromCache(key: string): Promise<T | null> {
    const result = this.map.get(`${key}`)
    if (result) {
      if (result.expiry.getTime() > Date.now()) {
        return Promise.resolve(JSON.parse(result.item))
      }
    }
    return Promise.resolve(null)
  }
}
