import InMemoryStore from './inMemoryStore'

describe('in memory order type description store', () => {
  let store: InMemoryStore
  beforeEach(() => {
    store = new InMemoryStore()
  })

  it('should store the order type description model', async () => {
    await store.set('some key', 'some token', 1000)

    const result = await store.get('some key')

    expect(result).toEqual('some token')
  })

  it('should return null if expiry time is in the past', async () => {
    await store.set('some key', 'test token', -1)

    const result = await store.get('some key')

    expect(result).toEqual(null)
  })
})
