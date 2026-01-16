export default interface CacheService<T> {
  storeItemToCache(key: string, value: T, durationSeconds: number): Promise<void>
  getItemFromCache(key: string): Promise<T | null>
}
