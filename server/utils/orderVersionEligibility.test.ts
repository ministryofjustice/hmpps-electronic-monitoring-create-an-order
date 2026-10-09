import { randomUUID } from 'crypto'
import { getMockOrder } from '../../test/mocks/mockOrder'
import {
  canCreateOrderVersion,
  canUseServiceRequestTypeFlow,
  isAcceptedOrderForChange,
} from './orderVersionEligibility'

describe('order version eligibility', () => {
  it.each(['CLOSED', 'RESOLVED'] as const)('allows changes to accepted submitted orders in %s state', caseState => {
    const order = getMockOrder({ status: 'SUBMITTED', caseState })

    expect(canCreateOrderVersion(order)).toBe(true)
    expect(isAcceptedOrderForChange(order)).toBe(true)
  })

  it('allows returned submitted orders to use the rejection route only', () => {
    const order = getMockOrder({ status: 'SUBMITTED', caseState: 'CANCELLED' })

    expect(canCreateOrderVersion(order)).toBe(true)
    expect(isAcceptedOrderForChange(order)).toBe(false)
  })

  it('allows a submitted order with unknown case state when no FMS result ID exists', () => {
    const order = getMockOrder({ status: 'SUBMITTED', caseState: 'UNKNOWN', fmsResultId: null })

    expect(canCreateOrderVersion(order)).toBe(true)
    expect(canUseServiceRequestTypeFlow(order)).toBe(true)
    expect(isAcceptedOrderForChange(order)).toBe(false)
  })

  it('allows a submitted order with unknown case state when an FMS result ID exists without treating it as accepted', () => {
    const order = getMockOrder({ status: 'SUBMITTED', caseState: 'UNKNOWN', fmsResultId: randomUUID() })

    expect(canCreateOrderVersion(order)).toBe(true)
    expect(canUseServiceRequestTypeFlow(order)).toBe(true)
    expect(isAcceptedOrderForChange(order)).toBe(false)
  })

  it('allows a submitted order with unknown case state when the FMS result ID is absent', () => {
    const order = getMockOrder({ status: 'SUBMITTED', caseState: 'UNKNOWN' })

    expect(canCreateOrderVersion(order)).toBe(true)
    expect(canUseServiceRequestTypeFlow(order)).toBe(true)
    expect(isAcceptedOrderForChange(order)).toBe(false)
  })

  it.each([null, randomUUID(), undefined])(
    'allows a rejected order with unknown case state when its FMS result ID is %s',
    fmsResultId => {
      const order = getMockOrder({ status: 'REJECTED', caseState: 'UNKNOWN', fmsResultId })

      expect(canCreateOrderVersion(order)).toBe(true)
      expect(canUseServiceRequestTypeFlow(order)).toBe(true)
      expect(isAcceptedOrderForChange(order)).toBe(false)
    },
  )

  it('allows cancelled rejected orders through the returned-order route and blocks processing rejected orders', () => {
    const returnedOrder = getMockOrder({ status: 'REJECTED', caseState: 'CANCELLED' })
    const processingOrder = getMockOrder({ status: 'REJECTED', caseState: 'OPEN' })

    expect(canCreateOrderVersion(returnedOrder)).toBe(true)
    expect(canUseServiceRequestTypeFlow(returnedOrder)).toBe(false)
    expect(canCreateOrderVersion(processingOrder)).toBe(false)
    expect(canUseServiceRequestTypeFlow(processingOrder)).toBe(false)
  })

  it('does not allow an existing draft to be copied as another version', () => {
    const order = getMockOrder({ status: 'IN_PROGRESS', caseState: 'CLOSED' })

    expect(canCreateOrderVersion(order)).toBe(false)
    expect(canUseServiceRequestTypeFlow(order)).toBe(true)
    expect(isAcceptedOrderForChange(order)).toBe(false)
  })

  it.each(['NEW', 'OPEN', 'AWAITING_INFO', 'AWAITING_VALIDATION', 'AWAITING_APPROVAL'] as const)(
    'blocks submitted orders while case state is %s',
    caseState => {
      const order = getMockOrder({ status: 'SUBMITTED', caseState })

      expect(canCreateOrderVersion(order)).toBe(false)
      expect(canUseServiceRequestTypeFlow(order)).toBe(false)
      expect(isAcceptedOrderForChange(order)).toBe(false)
    },
  )
})
