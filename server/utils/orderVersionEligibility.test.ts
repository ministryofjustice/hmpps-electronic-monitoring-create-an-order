import { randomUUID } from 'crypto'
import { getMockOrder } from '../../test/mocks/mockOrder'
import { Order } from '../models/Order'
import {
  canCreateOrderVersion,
  canUseServiceRequestTypeFlow,
  getOrderChangeBlockedMessage,
  getServiceRequestTypeFlowBlockedMessage,
  isAcceptedOrderForChange,
  ORDER_CHANGE_STATUS_CHANGED_MESSAGE,
  shouldShowServiceRequestTypeQuestions,
} from './orderVersionEligibility'

const createStatusUpdate = (versionId: string, status: 'ACCEPTED' | 'REJECTED', datetimeOfStatusChange: string) => ({
  id: randomUUID(),
  versionId,
  status,
  datetimeOfStatusChange,
  statusUpdateReasons: [],
})

describe('order version eligibility', () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('2026-10-20T12:00:00Z'))
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('allows an amendable submitted order with a current accepted observation as a variation', () => {
    const order = getMockOrder({ status: 'SUBMITTED', canAmend: true })
    order.monitoringConditions.startDate = '2026-10-19T12:00:00Z'
    order.statusUpdates = [createStatusUpdate(order.versionId, 'ACCEPTED', '2025-01-01T12:00:00Z')]

    expect(canCreateOrderVersion(order)).toBe(true)
    expect(canUseServiceRequestTypeFlow(order)).toBe(true)
    expect(isAcceptedOrderForChange(order)).toBe(true)
  })

  it.each<[string | null, boolean]>([
    ['2026-10-20T11:59:59Z', true],
    ['2026-10-20T12:00:00Z', true],
    ['2026-10-20T12:00:01Z', false],
    [null, false],
    ['invalid', false],
  ])('shows the questions for an accepted order starting at %s: %s', (startDate, expected) => {
    const order = getMockOrder({ status: 'SUBMITTED', canAmend: true })
    order.monitoringConditions.startDate = startDate
    order.statusUpdates = [createStatusUpdate(order.versionId, 'ACCEPTED', '2026-10-19T12:00:00Z')]

    expect(isAcceptedOrderForChange(order)).toBe(true)
    expect(canCreateOrderVersion(order)).toBe(true)
    expect(shouldShowServiceRequestTypeQuestions(order)).toBe(expected)
    expect(canUseServiceRequestTypeFlow(order)).toBe(expected)
  })

  it('does not use a rejected observation to enter the accepted-order service-request flow', () => {
    const order = getMockOrder({ status: 'SUBMITTED', canAmend: true })
    order.monitoringConditions.startDate = '2026-10-19T12:00:00Z'
    order.statusUpdates = [createStatusUpdate(order.versionId, 'REJECTED', '2025-01-01T12:00:00Z')]

    expect(canCreateOrderVersion(order)).toBe(true)
    expect(canUseServiceRequestTypeFlow(order)).toBe(false)
    expect(isAcceptedOrderForChange(order)).toBe(false)
    expect(getServiceRequestTypeFlowBlockedMessage(order)).toBe(ORDER_CHANGE_STATUS_CHANGED_MESSAGE)
  })

  it('allows an amendable rejected order to create a version', () => {
    const order = getMockOrder({ status: 'REJECTED', canAmend: true })

    expect(canCreateOrderVersion(order)).toBe(true)
    expect(canUseServiceRequestTypeFlow(order)).toBe(false)
    expect(getServiceRequestTypeFlowBlockedMessage(order)).toBe(ORDER_CHANGE_STATUS_CHANGED_MESSAGE)
  })

  it.each<[Order['status'], Order['type'], boolean, string, boolean, Order['amendmentSourceType']]>([
    ['REJECTED', 'VARIATION', true, '2026-10-19T12:00:00Z', true, undefined],
    ['SUBMITTED', 'VARIATION', true, '2026-10-19T12:00:00Z', true, undefined],
    ['REJECTED', 'REINSTALL_DEVICE', true, '2026-10-19T12:00:00Z', true, undefined],
    ['REJECTED', 'VARIATION', true, '2026-10-21T12:00:00Z', false, undefined],
    ['REJECTED', 'VARIATION', false, '2026-10-19T12:00:00Z', false, undefined],
    ['REJECTED', 'REQUEST', true, '2026-10-19T12:00:00Z', false, undefined],
    ['REJECTED', 'AMEND_ORIGINAL_REQUEST', true, '2026-10-19T12:00:00Z', false, undefined],
    ['REJECTED', 'REJECTED', true, '2026-10-19T12:00:00Z', true, 'VARIATION'],
    ['SUBMITTED', 'REJECTED', true, '2026-10-19T12:00:00Z', true, 'REINSTALL_DEVICE'],
    ['REJECTED', 'REJECTED', true, '2026-10-21T12:00:00Z', false, 'VARIATION'],
    ['REJECTED', 'REJECTED', false, '2026-10-19T12:00:00Z', false, 'VARIATION'],
    ['REJECTED', 'REJECTED', true, '2026-10-19T12:00:00Z', false, 'REQUEST'],
    ['REJECTED', 'REJECTED', true, '2026-10-19T12:00:00Z', false, 'AMEND_ORIGINAL_REQUEST'],
    ['REJECTED', 'REJECTED', true, '2026-10-19T12:00:00Z', false, undefined],
  ])(
    'checks SR question eligibility for %s %s with canAmend %s and start date %s: %s (source %s)',
    (status, type, canAmend, startDate, expected, amendmentSourceType) => {
      const order = getMockOrder({ status, type, canAmend, amendmentSourceType })
      order.monitoringConditions.startDate = startDate
      order.statusUpdates = [createStatusUpdate(order.versionId, 'REJECTED', '2026-10-19T12:00:00Z')]

      expect(shouldShowServiceRequestTypeQuestions(order)).toBe(expected)
      expect(canUseServiceRequestTypeFlow(order)).toBe(expected)
    },
  )

  it('does not allow amendment when the API marks the order as not amendable', () => {
    const order = getMockOrder({ status: 'SUBMITTED', canAmend: false })
    order.monitoringConditions.startDate = '2026-10-19T12:00:00Z'
    order.statusUpdates = [createStatusUpdate(order.versionId, 'ACCEPTED', '2025-01-01T12:00:00Z')]

    expect(canCreateOrderVersion(order)).toBe(false)
    expect(shouldShowServiceRequestTypeQuestions(order)).toBe(false)
    expect(canUseServiceRequestTypeFlow(order)).toBe(false)
    expect(getServiceRequestTypeFlowBlockedMessage(order)).toBe(getOrderChangeBlockedMessage())
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
    expect(getOrderChangeBlockedMessage()).toBe(
      "You can't make changes to this form because it is being processed by EMS. Try again later.",
    )
  })
})
