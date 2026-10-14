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
  it('allows changes to an accepted submitted order in AWAITING_VALIDATION state', () => {
    const order = getMockOrder({ status: 'SUBMITTED', caseState: 'AWAITING_VALIDATION' })

    expect(canCreateOrderVersion(order)).toBe(true)
    expect(canUseServiceRequestTypeFlow(order)).toBe(true)
    expect(isAcceptedOrderForChange(order)).toBe(true)
    expect(canAmendReturnedOrder(order)).toBe(false)
  })

  it.each(['CANCELLED', 'CLOSED', 'RESOLVED'] as const)(
    'allows a submitted order in %s state through the returned-order route',
    caseState => {
      const order = getMockOrder({ status: 'SUBMITTED', caseState })

      expect(canCreateOrderVersion(order)).toBe(true)
      expect(canAmendReturnedOrder(order)).toBe(true)
      expect(canUseServiceRequestTypeFlow(order)).toBe(false)
      expect(isAcceptedOrderForChange(order)).toBe(false)
    },
  )

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

  it.each(['CANCELLED', 'CLOSED', 'RESOLVED'] as const)(
    'allows a rejected order with %s case state through the returned-order route',
    caseState => {
      const order = getMockOrder({ status: 'REJECTED', caseState })

      expect(canCreateOrderVersion(order)).toBe(true)
      expect(canAmendReturnedOrder(order)).toBe(true)
      expect(canUseServiceRequestTypeFlow(order)).toBe(false)
      expect(isAcceptedOrderForChange(order)).toBe(false)
    },
  )

  it.each(['UNKNOWN', 'OPEN', 'NEW', 'AWAITING_INFO', 'AWAITING_APPROVAL', 'AWAITING_VALIDATION'] as const)(
    'blocks a rejected order with %s case state',
    caseState => {
      const order = getMockOrder({ status: 'REJECTED', caseState, fmsResultId: randomUUID() })

      expect(canCreateOrderVersion(order)).toBe(false)
      expect(canAmendReturnedOrder(order)).toBe(false)
      expect(canUseServiceRequestTypeFlow(order)).toBe(false)
      expect(isAcceptedOrderForChange(order)).toBe(false)
    },
  )

  it('describes an open submitted case as still processing', () => {
    const order = getMockOrder({ status: 'SUBMITTED', caseState: 'OPEN' })

    expect(getOrderChangeBlockedMessage(order)).toBe(
      'This form is still being processed. You can make changes once it has been accepted or returned.',
    )
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

  it.each(['NEW', 'OPEN', 'AWAITING_INFO', 'AWAITING_APPROVAL'] as const)(
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
