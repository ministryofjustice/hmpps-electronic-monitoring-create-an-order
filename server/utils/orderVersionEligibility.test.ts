import { randomUUID } from 'crypto'
import { getMockOrder } from '../../test/mocks/mockOrder'
import {
  canCreateOrderVersion,
  canUseServiceRequestTypeFlow,
  getOrderChangeBlockedMessage,
  isAcceptedOrderForChange,
} from './orderVersionEligibility'

const createStatusUpdate = (versionId: string, status: 'ACCEPTED' | 'REJECTED', datetimeOfStatusChange: string) => ({
  id: randomUUID(),
  versionId,
  status,
  datetimeOfStatusChange,
  statusUpdateReasons: [],
})

describe('order version eligibility', () => {
  it('allows an amendable submitted order with a current accepted observation as a variation', () => {
    const order = getMockOrder({ status: 'SUBMITTED', canAmend: true })
    order.statusUpdates = [createStatusUpdate(order.versionId, 'ACCEPTED', '2025-01-01T12:00:00Z')]

    expect(canCreateOrderVersion(order)).toBe(true)
    expect(canUseServiceRequestTypeFlow(order)).toBe(true)
    expect(isAcceptedOrderForChange(order)).toBe(true)
  })

  it('does not use a rejected observation to enter the accepted-order service-request flow', () => {
    const order = getMockOrder({ status: 'SUBMITTED', canAmend: true })
    order.statusUpdates = [createStatusUpdate(order.versionId, 'REJECTED', '2025-01-01T12:00:00Z')]

    expect(canCreateOrderVersion(order)).toBe(true)
    expect(canUseServiceRequestTypeFlow(order)).toBe(false)
    expect(isAcceptedOrderForChange(order)).toBe(false)
  })

  it('allows an amendable rejected order to create a version', () => {
    const order = getMockOrder({ status: 'REJECTED', canAmend: true })

    expect(canCreateOrderVersion(order)).toBe(true)
  })

  it('does not allow amendment when the API marks the order as not amendable', () => {
    const order = getMockOrder({ status: 'SUBMITTED', canAmend: false })
    order.statusUpdates = [createStatusUpdate(order.versionId, 'ACCEPTED', '2025-01-01T12:00:00Z')]

    expect(canCreateOrderVersion(order)).toBe(false)
  })

  it('ignores status observations from earlier versions', () => {
    const order = getMockOrder({ status: 'SUBMITTED', canAmend: true })
    order.statusUpdates = [createStatusUpdate(randomUUID(), 'ACCEPTED', '2025-01-01T12:00:00Z')]

    expect(canCreateOrderVersion(order)).toBe(true)
  })

  it('uses the newest status observation for the current version', () => {
    const order = getMockOrder({ status: 'SUBMITTED', canAmend: true })
    order.statusUpdates = [
      createStatusUpdate(order.versionId, 'ACCEPTED', '2025-01-01T12:00:00Z'),
      createStatusUpdate(order.versionId, 'REJECTED', '2025-01-02T12:00:00Z'),
    ]

    expect(isAcceptedOrderForChange(order)).toBe(false)
  })

  it('allows drafts through the service-request flow without allowing another version', () => {
    const order = getMockOrder({ status: 'IN_PROGRESS' })

    expect(canUseServiceRequestTypeFlow(order)).toBe(true)
    expect(canCreateOrderVersion(order)).toBe(false)
  })

  it('blocks submitted orders without API amendment eligibility', () => {
    expect(getOrderChangeBlockedMessage()).toBe("We can't check the status of this form right now. Try again later.")
  })
})
