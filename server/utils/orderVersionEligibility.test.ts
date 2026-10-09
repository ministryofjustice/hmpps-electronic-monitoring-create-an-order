import { randomUUID } from 'crypto'
import { getMockOrder } from '../../test/mocks/mockOrder'
import {
  canAmendReturnedOrder,
  canCreateOrderVersion,
  canUseServiceRequestTypeFlow,
  getOrderChangeBlockedMessage,
  isAcceptedOrderForChange,
} from './orderVersionEligibility'

describe('order version eligibility', () => {
  it.each(['OPEN', 'CLOSED', 'RESOLVED'] as const)(
    'allows changes to accepted submitted orders in %s state',
    caseState => {
      const order = getMockOrder({ status: 'SUBMITTED', caseState })

      expect(canCreateOrderVersion(order)).toBe(true)
      expect(canUseServiceRequestTypeFlow(order)).toBe(true)
      expect(isAcceptedOrderForChange(order)).toBe(true)
    },
  )

  it('allows returned submitted orders to use the rejection route only', () => {
    const order = getMockOrder({ status: 'SUBMITTED', caseState: 'CANCELLED' })

    expect(canCreateOrderVersion(order)).toBe(true)
    expect(canAmendReturnedOrder(order)).toBe(true)
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
      expect(canAmendReturnedOrder(order)).toBe(false)
      expect(canUseServiceRequestTypeFlow(order)).toBe(true)
      expect(isAcceptedOrderForChange(order)).toBe(false)
    },
  )

  it.each([
    'OPEN',
    'NEW',
    'CLOSED',
    'RESOLVED',
    'CANCELLED',
    'AWAITING_INFO',
    'AWAITING_VALIDATION',
    'AWAITING_APPROVAL',
  ] as const)('allows a rejected order with %s case state through the returned-order route', caseState => {
    const order = getMockOrder({ status: 'REJECTED', caseState })

    expect(canCreateOrderVersion(order)).toBe(true)
    expect(canAmendReturnedOrder(order)).toBe(true)
    expect(canUseServiceRequestTypeFlow(order)).toBe(false)
    expect(isAcceptedOrderForChange(order)).toBe(false)
  })

  it('does not describe an open case as still processing', () => {
    const order = getMockOrder({ status: 'REJECTED', caseState: 'OPEN' })

    expect(getOrderChangeBlockedMessage(order)).toBe('You cannot make changes to this form at this time.')
  })

  it.each(['OPEN', 'CLOSED'] as const)(
    'does not allow an existing draft in %s state to be copied as another version',
    caseState => {
      const order = getMockOrder({ status: 'IN_PROGRESS', caseState })

      expect(canCreateOrderVersion(order)).toBe(false)
      expect(canAmendReturnedOrder(order)).toBe(false)
      expect(canUseServiceRequestTypeFlow(order)).toBe(true)
      expect(isAcceptedOrderForChange(order)).toBe(false)
    },
  )

  it.each(['NEW', 'AWAITING_INFO', 'AWAITING_VALIDATION', 'AWAITING_APPROVAL'] as const)(
    'blocks submitted orders while case state is %s',
    caseState => {
      const order = getMockOrder({ status: 'SUBMITTED', caseState })

      expect(canCreateOrderVersion(order)).toBe(false)
      expect(canAmendReturnedOrder(order)).toBe(false)
      expect(canUseServiceRequestTypeFlow(order)).toBe(false)
      expect(isAcceptedOrderForChange(order)).toBe(false)
      expect(getOrderChangeBlockedMessage(order)).toBe(
        'This form is still being processed. You can make changes once it has been accepted or returned.',
      )
    },
  )
})
