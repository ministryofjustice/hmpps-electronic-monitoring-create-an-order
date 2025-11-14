import Store from './store'

export default class InMemoryStore implements Store {
  map = new Map<string, { token: string; expiry: Date }>()

  async set(key: string, token: string, durationSeconds: number): Promise<void> {
    this.map.set(key, { token, expiry: new Date(Date.now() + durationSeconds * 1000) })
  }

  async get(key: string): Promise<string | null> {
    const result = this.map.get(key)
    if (result && result.token) {
      if (new Date() < result.expiry) {
        return result.token
      }
    }
    return null
  }
}
