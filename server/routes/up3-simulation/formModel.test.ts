import { randomUUID } from 'crypto'
import readSimulationConfig from './config'
import { creationSchema, reasonsSchema, stateSchema } from './formModel'

describe('UP3 simulation configuration and forms', () => {
  it('defaults off', () => {
    expect(readSimulationConfig({})).toEqual({ enabled: false })
  })

  it.each(['', 'PROD', 'PRE-PRODUCTION', 'dev'])('rejects enabled UI in environment %s', ENVIRONMENT_NAME => {
    expect(() => readSimulationConfig({ ENVIRONMENT_NAME, UP3_SIMULATION_UI_ENABLED: 'true' })).toThrow(
      'ENVIRONMENT_NAME=LOCAL or DEV',
    )
  })

  it.each(['LOCAL', 'DEV'])('allows explicitly enabled %s even with NODE_ENV=production', ENVIRONMENT_NAME => {
    expect(
      readSimulationConfig({
        ENVIRONMENT_NAME,
        NODE_ENV: 'production',
        UP3_SIMULATION_UI_ENABLED: 'true',
      }).enabled,
    ).toBe(true)
  })

  it('requires both expected version identities for state changes', () => {
    expect(stateSchema.safeParse({ state: 'ACCEPTED', expectedCurrentOrderVersionId: randomUUID() }).success).toBe(
      false,
    )
  })

  it('requires details for other and caps reason counts', () => {
    expect(reasonsSchema.safeParse([{ section: 'other', details: '' }]).success).toBe(false)
    expect(
      reasonsSchema.safeParse(Array.from({ length: 51 }, () => ({ section: 'other', details: 'Missing' }))).success,
    ).toBe(false)
  })

  it('validates JSON syntax, basic shape and the UTF-8 byte limit', () => {
    const base = { creationRequestId: randomUUID(), state: 'DRAFT' }
    expect(creationSchema.safeParse({ ...base, orderJson: '{' }).success).toBe(false)
    expect(creationSchema.safeParse({ ...base, orderJson: '[]' }).success).toBe(false)
    expect(
      creationSchema.safeParse({ ...base, orderJson: JSON.stringify({ deviceWearer: {}, extra: 'x'.repeat(65536) }) })
        .success,
    ).toBe(false)
    expect(creationSchema.safeParse({ ...base, orderJson: '{"deviceWearer":{}}' }).success).toBe(true)
  })

  it('requires reasons only for returned creation', () => {
    const base = { creationRequestId: randomUUID(), orderJson: '{"deviceWearer":{}}' }
    expect(creationSchema.safeParse({ ...base, state: 'RETURNED' }).success).toBe(false)
    expect(
      creationSchema.safeParse({ ...base, state: 'RETURNED', reasons: [{ section: 'other', details: 'Missing' }] })
        .success,
    ).toBe(true)
  })
})
